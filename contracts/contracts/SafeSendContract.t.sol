// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {SafeSendContract} from "./SafeSendContract.sol";
import {MockERC20} from "./MockERC20.sol";
import {Test} from "forge-std/Test.sol";

contract SafeSendContractTest is Test {
    SafeSendContract public safeSend;
    MockERC20 public pyusdToken;
    
    address public owner = address(0x1);
    address public fraudOracle = address(0x2);
    address public buyer = address(0x3);
    address public seller = address(0x4);
    address public otherUser = address(0x5);
    
    uint256 public constant INITIAL_BALANCE = 1000000 * 10**6; // 1M PYUSD with 6 decimals
    uint256 public constant ESCROW_AMOUNT = 1000 * 10**6; // 1K PYUSD
    
    event Deposited(
        uint256 indexed escrowId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        string description
    );
    
    event Released(
        uint256 indexed escrowId,
        address indexed buyer,
        address indexed seller,
        uint256 amount
    );
    
    event Refunded(
        uint256 indexed escrowId,
        address indexed buyer,
        uint256 amount
    );
    
    event FraudFlagged(
        uint256 indexed escrowId,
        address indexed flaggedBy
    );
    
    event OracleUpdated(
        address indexed oldOracle,
        address indexed newOracle
    );

    function setUp() public {
        // Deploy mock PYUSD token with 6 decimals (like real PYUSD)
        pyusdToken = new MockERC20("PayPal USD", "PYUSD", 6);
        
        // Deploy SafeSendContract
        vm.prank(owner);
        safeSend = new SafeSendContract(address(pyusdToken), fraudOracle);
        
        // Mint tokens to test accounts
        pyusdToken.mint(buyer, INITIAL_BALANCE);
        pyusdToken.mint(seller, INITIAL_BALANCE);
        pyusdToken.mint(otherUser, INITIAL_BALANCE);
        
        // Approve the contract to spend buyer's tokens
        vm.prank(buyer);
        pyusdToken.approve(address(safeSend), INITIAL_BALANCE);
    }

    function test_Constructor() public view {
        assertEq(address(safeSend.pyusdToken()), address(pyusdToken));
        assertEq(safeSend.fraudOracle(), fraudOracle);
        assertEq(safeSend.owner(), owner);
        assertEq(safeSend.escrowCounter(), 0);
    }
    
    function test_ConstructorRevertsWithZeroAddresses() public {
        // Test zero PYUSD address
        vm.expectRevert("Invalid PYUSD token address");
        new SafeSendContract(address(0), fraudOracle);
    }
    
    function test_ConstructorAllowsZeroOracle() public {
        // Zero fraud oracle address is now allowed (disables oracle functionality)
        SafeSendContract testContract = new SafeSendContract(address(pyusdToken), address(0));
        assertEq(testContract.fraudOracle(), address(0));
        assertEq(address(testContract.pyusdToken()), address(pyusdToken));
    }

    function test_Deposit() public {
        string memory description = "Test escrow payment";
        
        vm.expectEmit(true, true, true, true);
        emit Deposited(1, buyer, seller, ESCROW_AMOUNT, description);
        
        vm.prank(buyer);
        uint256 escrowId = safeSend.deposit(seller, ESCROW_AMOUNT, description);
        
        assertEq(escrowId, 1);
        assertEq(safeSend.escrowCounter(), 1);
        
        SafeSendContract.Escrow memory escrow = safeSend.getEscrow(escrowId);
        assertEq(escrow.id, escrowId);
        assertEq(escrow.buyer, buyer);
        assertEq(escrow.seller, seller);
        assertEq(escrow.amount, ESCROW_AMOUNT);
        assertEq(escrow.description, description);
        assertEq(uint(escrow.status), uint(SafeSendContract.EscrowStatus.Active));
        assertEq(escrow.fraudFlagged, false);
        
        // Check token transfer
        assertEq(pyusdToken.balanceOf(buyer), INITIAL_BALANCE - ESCROW_AMOUNT);
        assertEq(pyusdToken.balanceOf(address(safeSend)), ESCROW_AMOUNT);
        
        // Check mappings
        uint256[] memory buyerEscrows = safeSend.getBuyerEscrows(buyer);
        uint256[] memory sellerEscrows = safeSend.getSellerEscrows(seller);
        assertEq(buyerEscrows.length, 1);
        assertEq(sellerEscrows.length, 1);
        assertEq(buyerEscrows[0], escrowId);
        assertEq(sellerEscrows[0], escrowId);
    }
    
    function test_DepositRevertsInvalidInputs() public {
        // Zero seller address
        vm.prank(buyer);
        vm.expectRevert("Invalid seller address");
        safeSend.deposit(address(0), ESCROW_AMOUNT, "test");
        
        // Buyer same as seller
        vm.prank(buyer);
        vm.expectRevert("Buyer cannot be seller");
        safeSend.deposit(buyer, ESCROW_AMOUNT, "test");
        
        // Zero amount
        vm.prank(buyer);
        vm.expectRevert("Amount must be greater than 0");
        safeSend.deposit(seller, 0, "test");
        
        // Empty description
        vm.prank(buyer);
        vm.expectRevert("Description cannot be empty");
        safeSend.deposit(seller, ESCROW_AMOUNT, "");
    }
    
    function test_DepositRevertsInsufficientAllowance() public {
        vm.prank(otherUser); // otherUser has no allowance
        vm.expectRevert(); // Expect any revert (ERC20 will revert with its own error)
        safeSend.deposit(seller, ESCROW_AMOUNT, "test");
    }
    
    function test_Release() public {
        // Create escrow first
        vm.prank(buyer);
        uint256 escrowId = safeSend.deposit(seller, ESCROW_AMOUNT, "Test payment");
        
        vm.expectEmit(true, true, true, true);
        emit Released(escrowId, buyer, seller, ESCROW_AMOUNT);
        
        // Release funds
        vm.prank(buyer);
        safeSend.release(escrowId);
        
        // Check escrow status
        SafeSendContract.Escrow memory escrow = safeSend.getEscrow(escrowId);
        assertEq(uint(escrow.status), uint(SafeSendContract.EscrowStatus.Released));
        
        // Check token balances
        assertEq(pyusdToken.balanceOf(seller), INITIAL_BALANCE + ESCROW_AMOUNT);
        assertEq(pyusdToken.balanceOf(address(safeSend)), 0);
    }
    
    function test_ReleaseRevertsNonBuyer() public {
        vm.prank(buyer);
        uint256 escrowId = safeSend.deposit(seller, ESCROW_AMOUNT, "Test payment");
        
        vm.prank(seller); // seller tries to release
        vm.expectRevert("Only buyer can call this");
        safeSend.release(escrowId);
    }
    
    function test_ReleaseRevertsNonActiveEscrow() public {
        vm.prank(buyer);
        uint256 escrowId = safeSend.deposit(seller, ESCROW_AMOUNT, "Test payment");
        
        // Release once
        vm.prank(buyer);
        safeSend.release(escrowId);
        
        // Try to release again
        vm.prank(buyer);
        vm.expectRevert("Escrow is not active");
        safeSend.release(escrowId);
    }

    function test_RefundByBuyer() public {
        vm.prank(buyer);
        uint256 escrowId = safeSend.deposit(seller, ESCROW_AMOUNT, "Test payment");
        
        vm.expectEmit(true, true, true, true);
        emit Refunded(escrowId, buyer, ESCROW_AMOUNT);
        
        // Buyer requests refund
        vm.prank(buyer);
        safeSend.refund(escrowId);
        
        // Check escrow status
        SafeSendContract.Escrow memory escrow = safeSend.getEscrow(escrowId);
        assertEq(uint(escrow.status), uint(SafeSendContract.EscrowStatus.Refunded));
        
        // Check token balances
        assertEq(pyusdToken.balanceOf(buyer), INITIAL_BALANCE); // Full refund
        assertEq(pyusdToken.balanceOf(address(safeSend)), 0);
    }
    
    function test_RefundByFraudOracle() public {
        vm.prank(buyer);
        uint256 escrowId = safeSend.deposit(seller, ESCROW_AMOUNT, "Test payment");
        
        // Fraud oracle initiates refund
        vm.prank(fraudOracle);
        safeSend.refund(escrowId);
        
        // Check escrow status
        SafeSendContract.Escrow memory escrow = safeSend.getEscrow(escrowId);
        assertEq(uint(escrow.status), uint(SafeSendContract.EscrowStatus.Refunded));
        
        // Check token balances
        assertEq(pyusdToken.balanceOf(buyer), INITIAL_BALANCE);
        assertEq(pyusdToken.balanceOf(address(safeSend)), 0);
    }
    
    function test_RefundRevertsUnauthorized() public {
        vm.prank(buyer);
        uint256 escrowId = safeSend.deposit(seller, ESCROW_AMOUNT, "Test payment");
        
        vm.prank(seller); // seller tries to refund
        vm.expectRevert("Only buyer or fraud oracle can refund");
        safeSend.refund(escrowId);
        
        vm.prank(otherUser); // other user tries to refund
        vm.expectRevert("Only buyer or fraud oracle can refund");
        safeSend.refund(escrowId);
    }

    function test_MarkFraud() public {
        vm.prank(buyer);
        uint256 escrowId = safeSend.deposit(seller, ESCROW_AMOUNT, "Test payment");
        
        vm.expectEmit(true, true, true, true);
        emit FraudFlagged(escrowId, fraudOracle);
        vm.expectEmit(true, true, true, true);
        emit Refunded(escrowId, buyer, ESCROW_AMOUNT);
        
        // Fraud oracle flags the escrow
        vm.prank(fraudOracle);
        safeSend.markFraud(escrowId);
        
        // Check escrow status
        SafeSendContract.Escrow memory escrow = safeSend.getEscrow(escrowId);
        assertEq(uint(escrow.status), uint(SafeSendContract.EscrowStatus.Refunded));
        assertEq(escrow.fraudFlagged, true);
        
        // Check automatic refund
        assertEq(pyusdToken.balanceOf(buyer), INITIAL_BALANCE);
        assertEq(pyusdToken.balanceOf(address(safeSend)), 0);
    }
    
    function test_MarkFraudRevertsNonOracle() public {
        vm.prank(buyer);
        uint256 escrowId = safeSend.deposit(seller, ESCROW_AMOUNT, "Test payment");
        
        vm.prank(buyer);
        vm.expectRevert("Only fraud oracle can call this");
        safeSend.markFraud(escrowId);
    }
    
    function test_MarkFraudRevertsWhenOracleDisabled() public {
        // Deploy contract with zero oracle address
        SafeSendContract noOracleContract = new SafeSendContract(address(pyusdToken), address(0));
        
        // Mint and approve tokens for this test
        pyusdToken.mint(buyer, ESCROW_AMOUNT);
        vm.prank(buyer);
        pyusdToken.approve(address(noOracleContract), ESCROW_AMOUNT);
        
        // Create escrow
        vm.prank(buyer);
        uint256 escrowId = noOracleContract.deposit(seller, ESCROW_AMOUNT, "Test payment");
        
        // Try to mark fraud - should revert because no oracle is configured
        vm.prank(fraudOracle); // Even the fraud oracle address can't call it
        vm.expectRevert("No fraud oracle configured");
        noOracleContract.markFraud(escrowId);
    }
    
    function test_MarkFraudRevertsNonActiveEscrow() public {
        vm.prank(buyer);
        uint256 escrowId = safeSend.deposit(seller, ESCROW_AMOUNT, "Test payment");
        
        // Release first
        vm.prank(buyer);
        safeSend.release(escrowId);
        
        // Try to mark fraud after release
        vm.prank(fraudOracle);
        vm.expectRevert("Escrow is not active");
        safeSend.markFraud(escrowId);
    }

    function test_UpdateFraudOracle() public {
        address newOracle = address(0x99);
        
        vm.expectEmit(true, true, false, false);
        emit OracleUpdated(fraudOracle, newOracle);
        
        vm.prank(owner);
        safeSend.updateFraudOracle(newOracle);
        
        assertEq(safeSend.fraudOracle(), newOracle);
    }
    
    function test_UpdateFraudOracleRevertsNonOwner() public {
        address newOracle = address(0x99);
        
        vm.prank(buyer);
        vm.expectRevert();
        safeSend.updateFraudOracle(newOracle);
    }
    
    function test_UpdateFraudOracleRevertsZeroAddress() public {
        vm.prank(owner);
        vm.expectRevert("Invalid oracle address");
        safeSend.updateFraudOracle(address(0));
    }

    function test_GetEscrowRevertsNonExistent() public {
        vm.expectRevert("Escrow does not exist");
        safeSend.getEscrow(999);
    }

    function test_MultipleEscrows() public {
        // Create multiple escrows
        vm.prank(buyer);
        uint256 escrow1 = safeSend.deposit(seller, ESCROW_AMOUNT, "Payment 1");
        
        vm.prank(buyer);
        uint256 escrow2 = safeSend.deposit(otherUser, ESCROW_AMOUNT / 2, "Payment 2");
        
        assertEq(escrow1, 1);
        assertEq(escrow2, 2);
        assertEq(safeSend.escrowCounter(), 2);
        
        // Check buyer escrows
        uint256[] memory buyerEscrows = safeSend.getBuyerEscrows(buyer);
        assertEq(buyerEscrows.length, 2);
        assertEq(buyerEscrows[0], escrow1);
        assertEq(buyerEscrows[1], escrow2);
        
        // Check seller escrows
        uint256[] memory sellerEscrows = safeSend.getSellerEscrows(seller);
        assertEq(sellerEscrows.length, 1);
        assertEq(sellerEscrows[0], escrow1);
        
        uint256[] memory otherEscrows = safeSend.getSellerEscrows(otherUser);
        assertEq(otherEscrows.length, 1);
        assertEq(otherEscrows[0], escrow2);
    }
}
