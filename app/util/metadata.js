// Compiled data contract ABI.
export const SAFESEND_CONTRACT = {
    abi: [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_serviceType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_deliverables",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_deadline",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_paymentToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_depositAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "message",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "ClientRequested",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "DepositPaid",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "FundsWithdrawn",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "OfferAccepted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "OfferCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "title",
                "type": "string"
            }
        ],
        "name": "OfferCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "OfferDeactivated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "funder",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "OfferFunded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "OfferRequestRejected",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "RemainingBalancePaid",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "client",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "clientOfferRequests",
        "outputs": [
            {
                "internalType": "address",
                "name": "clientAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "message",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "requestedAt",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isRejected",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "completeOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "deactivateOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "emergencyWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllOfferRequests",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "clientAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "message",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "requestedAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isRejected",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SafeSendContract.ClientOfferRequest[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_clientAddress",
                "type": "address"
            }
        ],
        "name": "getClientOfferRequest",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "clientAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "message",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "requestedAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isRejected",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SafeSendContract.ClientOfferRequest",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_clientAddress",
                "type": "address"
            }
        ],
        "name": "getClientOfferRequests",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "clientAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "message",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "requestedAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isRejected",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SafeSendContract.ClientOfferRequest",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDepositAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOfferDetails",
        "outputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "serviceType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "deliverables",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "requiresDeposit",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "depositAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOfferMetadata",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "serviceType",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "deliverables",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "depositAmount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SafeSendContract.OfferMetadata",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOfferStatus",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "client",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "isAccepted",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isFunded",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isCompleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isDepositPaid",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "paidAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "remainingAmount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SafeSendContract.OfferStatus",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRemainingBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRequestCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRequesterAddresses",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRequiresDeposit",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isAccepted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isCompleted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isDepositPaid",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isFunded",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "offerMetadata",
        "outputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "serviceType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "deliverables",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "depositAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paidAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "payRemainingBalance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paymentToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pendingClient",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_clientAddress",
                "type": "address"
            }
        ],
        "name": "rejectOfferRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_message",
                "type": "string"
            }
        ],
        "name": "requestAndFundOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "requesterAddresses",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawAfterRejection",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
],
    bytecode: "0x60806040523461076857612ee6803803806100198161076c565b928339810190610100818303126107685780516001600160401b0381116107685782610046918301610791565b60208201516001600160401b0381116107685783610065918401610791565b60408301519092906001600160401b0381116107685784610087918301610791565b606082015190946001600160401b038211610768576100a7918301610791565b608082015160a083015160c084015191956001600160a01b0383169490928590036107685760e0015160015f81905580546001600160a01b03199081163317909155600c805490911690951790945583610706575b6040519261012084016001600160401b0381118582101761045f57604052858452602084019283526040840197885260608401908152608084019787895260a0850192835260c08501936001855261010060e087019642885201968752875160018060401b03811161045f57600354600181811c911680156106fc575b602082101461044157601f8111610699575b50806020601f8211600114610633575f91610628575b508160011b915f199060031b1c1916176003555b518051906001600160401b03821161045f5760045490600182811c9216801561061e575b60208310146104415781601f8493116105b0575b50602090601f831160011461054a575f9261053f575b50508160011b915f199060031b1c1916176004555b518051906001600160401b03821161045f5760055490600182811c92168015610535575b60208310146104415781601f8493116104e4575b50602090601f831160011461047e575f92610473575b50508160011b915f199060031b1c1916176005555b5180519097906001600160401b03811161045f57600654600181811c91168015610455575b602082101461044157601f81116103de575b506020601f821160011461036b5781905f516020612ec65f395f51905f52999a5f92610360575b50508160011b915f199060031b1c1916176006555b516007555160085551151560ff80196009541691161760095551600a5551600b55606060018060a01b036001541693602060405193849283526040828401528051918291826040860152018484015e5f828201840152601f01601f19168101030190a26040516126e390816107e38239f35b015190505f806102d9565b601f1982169960065f52815f209a5f5b8181106103c65750915f516020612ec65f395f51905f529a9b918460019594106103ae575b505050811b016006556102ee565b01515f1960f88460031b161c191690555f80806103a0565b838301518d556001909c019b6020938401930161037b565b60065f527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f601f830160051c81019160208410610437575b601f0160051c01905b81811061042c57506102b2565b5f815560010161041f565b9091508190610416565b634e487b7160e01b5f52602260045260245ffd5b90607f16906102a0565b634e487b7160e01b5f52604160045260245ffd5b015190505f80610266565b60055f9081528281209350601f198516905b8181106104cc57509084600195949392106104b4575b505050811b0160055561027b565b01515f1960f88460031b161c191690555f80806104a6565b92936020600181928786015181550195019301610490565b90915060055f5260205f20601f840160051c8101916020851061052b575b90601f859493920160051c01905b81811061051d5750610250565b5f8155849350600101610510565b9091508190610502565b91607f169161023c565b015190505f80610203565b60045f9081528281209350601f198516905b8181106105985750908460019594939210610580575b505050811b01600455610218565b01515f1960f88460031b161c191690555f8080610572565b9293602060018192878601518155019501930161055c565b60045f529091507f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b601f840160051c81019160208510610614575b90601f859493920160051c01905b81811061060657506101ed565b5f81558493506001016105f9565b90915081906105eb565b91607f16916101d9565b90508901515f6101a1565b60035f9081528181209250601f198416905b8c8282106106815750509083600194939210610669575b5050811b016003556101b5565b8b01515f1960f88460031b161c191690555f8061065c565b60018495602093958493015181550194019201610645565b60035f527fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b601f830160051c810191602084106106f2575b601f0160051c01905b8181106106e7575061018b565b5f81556001016106da565b90915081906106d1565b90607f1690610179565b8584106100fc5760405162461bcd60e51b815260206004820152602d60248201527f4465706f73697420616d6f756e74206d757374206265206c657373207468616e60448201526c081d1bdd185b08185b5bdd5b9d609a1b6064820152608490fd5b5f80fd5b6040519190601f01601f191682016001600160401b0381118382101761045f57604052565b81601f82011215610768578051906001600160401b03821161045f576107c0601f8301601f191660200161076c565b928284526020838301011161076857815f9260208093018386015e830101529056fe60806040526004361015610011575f80fd5b5f3560e01c80630ab0210c14611ec05780630eae7a9e14611df8578063109e94cf14611dd057806312fa769f14611db357806324600fc314611bcd57806326db7ab114611b7e5780632fba2c8514611bab5780633013ce2914611b8357806333c1ab6b14611b7e5780633fad183414611b615780635051a5ec14611b3c578063562dd6391461188e5780635ba714ea1461186f57806366f0c1341461155f5780636f9fb98a146114d85780637c654303146114b35780637d96f693146114965780638da5cb5b1461146e578063945f898614611250578063990812bc146110f25780639abab09d14610fa5578063a20dc71314610ef1578063b2cdac9d14610dab578063c1ed9a5114610d83578063ca56605d146107a8578063d4a4de3314610723578063da83ee13146106fe578063db2e21bc14610459578063ea84bf5f1461028f578063eafccb32146101e4578063fa391c64146101bf5763fcd419c314610179575f80fd5b346101bb5760203660031901126101bb57600435600f548110156101bb576101a260209161240f565b905460405160039290921b1c6001600160a01b03168152f35b5f80fd5b346101bb575f3660031901126101bb57602060ff600c5460a81c166040519015158152f35b346101bb575f3660031901126101bb576001546001600160a01b031661020b33821461243b565b60095460ff81161561024a5760ff19166009557f5dcc4aaad4dfbb5c0a005933f8aa39bca994c5b16be96327c72737f97d3fcfe66020604051428152a2005b60405162461bcd60e51b815260206004820152601c60248201527f4f6666657220697320616c7265616479206465616374697661746564000000006044820152606490fd5b346101bb5760203660031901126101bb576004356001600160a01b038116908190036101bb576102ca60018060a01b0360015416331461243b565b5f818152600e60205260409020546102ec906001600160a01b03161515612556565b805f52600e60205260ff600360405f200154166104145760ff600c5460a81c166103cf576010546001600160a01b0316810361037f57805f52600e602052600360405f2001600160ff198254161790556bffffffffffffffffffffffff60a01b601054166010557fd7564e4caf97e156ab5aab6683b90b2467acacf0831ba50f8261752dc90827206020604051428152a2005b60405162461bcd60e51b815260206004820152602260248201527f43616e206f6e6c792072656a656374207468652070656e64696e6720636c69656044820152611b9d60f21b6064820152608490fd5b60405162461bcd60e51b815260206004820152601e60248201527f43616e6e6f742072656a65637420616674657220636f6d706c6574696f6e00006044820152606490fd5b60405162461bcd60e51b815260206004820152601860248201527f5265717565737420616c72656164792072656a656374656400000000000000006044820152606490fd5b346101bb575f3660031901126101bb57610471612659565b600d54156106c757600c5461048c60ff8260a81c16156125e1565b60085442111561068b576002546001600160a01b0316903382900361063b576040516370a0823160e01b8152306004820152916001600160a01b039190911690602083602481855afa9283156105f9575f93610604575b508261052e926020926104f7831515612497565b60405163a9059cbb60e01b81526001600160a01b0390911660048201526024810192909252909283919082905f9082906044820190565b03925af19081156105f9575f916105ca575b5015610585576002546040519182526001600160a01b0316907feaff4b37086828766ad3268786972c0cd24259d4c87a80f9d3963a3c3d999b0d90602090a260015f55005b60405162461bcd60e51b815260206004820152601b60248201527f456d657267656e6379207769746864726177616c206661696c656400000000006044820152606490fd5b6105ec915060203d6020116105f2575b6105e481836120d9565b8101906124da565b82610540565b503d6105da565b6040513d5f823e3d90fd5b909192506020813d602011610633575b81610621602093836120d9565b810103126101bb5751919060206104e3565b3d9150610614565b60405162461bcd60e51b815260206004820152602260248201527f4f6e6c7920636c69656e742063616e20656d657267656e637920776974686472604482015261617760f01b6064820152608490fd5b60405162461bcd60e51b8152602060048201526014602482015273111958591b1a5b99481b9bdd081c995858da195960621b6044820152606490fd5b60405162461bcd60e51b815260206004820152600f60248201526e4e6f207061796d656e74206d61646560881b6044820152606490fd5b346101bb575f3660031901126101bb57602060ff600c5460b81c166040519015158152f35b346101bb5760203660031901126101bb576004356001600160a01b038116908190036101bb575f908152600e6020526040902080546001600160a01b031661076d60018301612371565b9160ff60036002830154920154166107976040519485948552608060208601526080850190611f51565b916040840152151560608301520390f35b346101bb5760203660031901126101bb5760043567ffffffffffffffff81116101bb57366023820112156101bb57806004013567ffffffffffffffff8111610bb75760405191610802601f8301601f1916602001846120d9565b81835236602483830101116101bb57815f92602460209301838601378301015261082a612659565b60ff6009541615610d4857600c5460ff8160a01c16610d0a5760ff6108539160a81c16156125e1565b6001546001600160a01b03163314610cb957335f908152600e60205260409020546001600160a01b0316610c80576040519061088e826120a0565b3382526020820191818352604081019042825260608101915f8352335f52600e60205260405f209160018060a01b039051166bffffffffffffffffffffffff60a01b83541617825560018201945194855167ffffffffffffffff8111610bb7576108f8825461204b565b601f8111610c3b575b506020601f8211600114610bd657819060039697985f92610bcb575b50508160011b915f1990871b1c19161790555b516002820155019051151560ff80198354169116179055600f5468010000000000000000811015610bb75780600161096b9201600f5561240f565b81546001600160a01b0360039290921b91821b1916339182901b17909155601080546001600160a01b0319169091179055600b5480159081610bad578091610b5a576007541115610b06575b600c546040516323b872dd60e01b81523360048201523060248201526044810183905290602090829060649082905f906001600160a01b03165af180156105f957610a09915f91610ae7575b50612595565b600d819055600b5415610aa157600c805460ff60b81b1916600160b81b17905560405190815233907ff1953715a33b9e021c0f2cf12911e8ac25fdb177bf6fc92d1331ae05201fe9f690602090a25b7f6873da866771cd3de75446bd168a8ed23f58103edc9fad518cf0a4575df0e2af610a8e60405192604084526040840190611f51565b914260208201528033930390a260015f55005b600c805460ff60b01b1916600160b01b17905560405190815233907fbae0ebb78f3a013a78ff0056662924b1eb7b73abafc1ddd5553c8b667abdaf5f90602090a2610a58565b610b00915060203d6020116105f2576105e481836120d9565b84610a03565b60405162461bcd60e51b815260206004820152602660248201527f4465706f736974206d757374206265206c657373207468616e20746f74616c20604482015265185b5bdd5b9d60d21b6064820152608490fd5b60405162461bcd60e51b815260206004820152602560248201527f4465706f73697420616d6f756e74206d75737420626520677265617465722074604482015264068616e20360dc1b6064820152608490fd5b50506007546109b7565b634e487b7160e01b5f52604160045260245ffd5b01519050888061091d565b601f19821697835f52815f20985f5b818110610c23575091600397989991846001959410610c0c575b505050811b019055610930565b01515f1983891b60f8161c19169055888080610bff565b838301518b556001909a019960209384019301610be5565b825f5260205f20601f830160051c81019160208410610c76575b601f0160051c01905b818110610c6b5750610901565b5f8155600101610c5e565b9091508190610c55565b60405162461bcd60e51b8152602060048201526011602482015270105b1c9958591e481c995c5d595cdd1959607a1b6044820152606490fd5b60405162461bcd60e51b8152602060048201526024808201527f4f776e65722063616e6e6f742072657175657374207468656972206f776e206f604482015263333332b960e11b6064820152608490fd5b60405162461bcd60e51b815260206004820152601660248201527513d999995c88185b1c9958591e481858d8d95c1d195960521b6044820152606490fd5b60405162461bcd60e51b81526020600482015260136024820152724f66666572206973206e6f742061637469766560681b6044820152606490fd5b346101bb575f3660031901126101bb576010546040516001600160a01b039091168152602090f35b346101bb575f3660031901126101bb575f60e0604051610dca816120bc565b8281528260208201528260408201528260608201528260808201528260a08201528260c082015201525f600b54151580610ee4575b610eca575b600154600254600c54600d54604051610100956001600160a01b0395861695909492939216610e32826120bc565b858252602082019081526040820160ff8460a01c1615158152606083019160ff8560b01c161515835260e0608085019460ff8760a81c161515865260ff60a082019760b81c161515875260c081019788520196875260405197885260018060a01b03905116602088015251151560408701525115156060860152511515608085015251151560a08401525160c08301525160e0820152f35b50610100610edd600754600d5490612516565b9050610e04565b50600d5460075411610dff565b346101bb575f3660031901126101bb57610f096120fb565b610120610f146121b2565b610f1c612247565b90610f256122dc565b9160075492600854610f8460ff6009541692610f76600a5495610f68600b5498610f5a6040519d8d8f9e8f9081520190611f51565b8c810360208e015290611f51565b908a820360408c0152611f51565b9088820360608a0152611f51565b94608087015260a0860152151560c085015260e08401526101008301520390f35b346101bb575f3660031901126101bb57600f54610fc18161262d565b90610fcf60405192836120d9565b808252601f19610fde8261262d565b015f5b8181106110db5750505f5b81811061105a57826040518091602082016020835281518091526040830190602060408260051b8601019301915f905b82821061102b57505050500390f35b9193600191939550602061104a8192603f198a82030186528851611f75565b960192019201859493919261101c565b8061106660019261240f565b838060a01b0391549060031b1c165f52600e60205260405f2060ff600360405192611090846120a0565b858060a01b0381541684526110a6868201612371565b602085015260028101546040850152015416151560608201526110c98286612645565b526110d48185612645565b5001610fec565b6020906110e66124f2565b82828701015201610fe1565b346101bb575f3660031901126101bb575f61010060405161111281612083565b6060815260606020820152606060408201526060808201528260808201528260a08201528260c08201528260e0820152015261014060405161115381612083565b61115b6120fb565b81526111656121b2565b60208201908152611174612247565b90604083019182526111846122dc565b9160608401928352600754926080850193845260085460a0860190815261122960ff600954169260c088019315158452611216600a549560e08a01968752611203600b54986101008c01998a526111f0604051809e819e60208352519161012060208201520190611f51565b90518c8203601f190160408e0152611f51565b90518a8203601f190160608c0152611f51565b9051888203601f190160808a0152611f51565b945160a08701525160c086015251151560e085015251610100840152516101208301520390f35b346101bb575f3660031901126101bb576001546001600160a01b031661127733821461243b565b6010546001600160a01b0316801561142957600d54156113ee57600c546112a460ff8260a81c16156125e1565b60ff8160a01c1615611399575b5050600b54156113475760ff600c5460b81c161561130b575b600c805460ff60a81b1916600160a81b1790556040514281527f7df0c56e9db90664751b13964ef00ad6ee36a8f3aad8b7a3a51910fbf6f4a27a90602090a2005b60405162461bcd60e51b815260206004820152601460248201527311195c1bdcda5d081b5d5cdd081899481c185a5960621b6044820152606490fd5b60ff600c5460b01c166112ca5760405162461bcd60e51b815260206004820152601760248201527f436f6e7472616374206d7573742062652066756e6465640000000000000000006044820152606490fd5b600280546001600160a01b0319168317905560ff60a01b1916600160a01b17600c556040514281527f18f9d2c9031a53ca9e501ddaadc6e66758b39bbf424cf4e22c62b6003fbd240c90602090a281806112b1565b60405162461bcd60e51b8152602060048201526013602482015272139bc81c185e5b595b9d081c9958d95a5d9959606a1b6044820152606490fd5b60405162461bcd60e51b815260206004820152601960248201527f4e6f2070656e64696e6720636c69656e742072657175657374000000000000006044820152606490fd5b346101bb575f3660031901126101bb576001546040516001600160a01b039091168152602090f35b346101bb575f3660031901126101bb576020600b54604051908152f35b346101bb575f3660031901126101bb57602060ff600c5460b01c166040519015158152f35b346101bb575f3660031901126101bb57600c546040516370a0823160e01b815230600482015290602090829060249082906001600160a01b03165afa80156105f9575f9061152c575b602090604051908152f35b506020813d602011611557575b81611546602093836120d9565b810103126101bb5760209051611521565b3d9150611539565b346101bb575f3660031901126101bb57611577612659565b6002546001600160a01b0316330361181457600b54156117c357600c5460ff8160b81c16156117875760ff8160b01c1661174b5760ff8160a01c161561170d576115c6600754600d5490612516565b9081156116d1576040516323b872dd60e01b81523360048201523060248201526044810183905290602090829060649082905f906001600160a01b03165af180156105f95761161b915f916116b25750612595565b600d5481810180911161169e57600d55600c805460ff60b01b1916600160b01b17905560405181815233907f3339cec93486f388c90a0a3694abca93ee9807450e17090eb5d4e7052ddb9c4690602090a26040519081527fbae0ebb78f3a013a78ff0056662924b1eb7b73abafc1ddd5553c8b667abdaf5f60203392a260015f55005b634e487b7160e01b5f52601160045260245ffd5b6116cb915060203d6020116105f2576105e481836120d9565b83610a03565b60405162461bcd60e51b81526020600482015260146024820152734e6f2072656d61696e696e672062616c616e636560601b6044820152606490fd5b60405162461bcd60e51b815260206004820152601660248201527513d999995c881b5d5cdd081899481858d8d95c1d195960521b6044820152606490fd5b60405162461bcd60e51b8152602060048201526014602482015273105b1c9958591e48199d5b1b1e48199d5b99195960621b6044820152606490fd5b60405162461bcd60e51b815260206004820152601460248201527311195c1bdcda5d081b9bdd081c185a59081e595d60621b6044820152606490fd5b60405162461bcd60e51b8152602060048201526024808201527f54686973206f6666657220646f65736e277420726571756972652061206465706044820152631bdcda5d60e21b6064820152608490fd5b60405162461bcd60e51b815260206004820152602d60248201527f4f6e6c792064657369676e6174656420636c69656e742063616e2063616c6c2060448201526c3a3434b990333ab731ba34b7b760991b6064820152608490fd5b346101bb575f3660031901126101bb576020600b541515604051908152f35b346101bb575f3660031901126101bb576118a6612659565b335f908152600e60205260409020546118c9906001600160a01b03161515612556565b335f52600e60205260ff600360405f2001541615611b0057600c546040516370a0823160e01b8152306004820152906001600160a01b03811690602083602481855afa9283156105f9575f93611acc575b50611926831515612497565b5f92600d5480151580611aad575b611aa5575b508315611a69578311611a24575f600d81905561ffff60b01b1991909116600c5560405163a9059cbb60e01b81523360048201526024810184905291602091839160449183915af19081156105f9575f91611a05575b50156119c7576040519081527feaff4b37086828766ad3268786972c0cd24259d4c87a80f9d3963a3c3d999b0d60203392a260015f55005b60405162461bcd60e51b81526020600482015260166024820152751499599d5b99081d1c985b9cd9995c8819985a5b195960521b6044820152606490fd5b611a1e915060203d6020116105f2576105e481836120d9565b8261198f565b60405162461bcd60e51b815260206004820152601d60248201527f496e73756666696369656e7420636f6e74726163742062616c616e63650000006044820152606490fd5b60405162461bcd60e51b8152602060048201526014602482015273139bc81c185e5b595b9d081d1bc81c99599d5b9960621b6044820152606490fd5b935084611939565b50335f818152600e60205260409020546001600160a01b031614611934565b9092506020813d602011611af8575b81611ae8602093836120d9565b810103126101bb5751918361191a565b3d9150611adb565b60405162461bcd60e51b815260206004820152601460248201527314995c5d595cdd081b9bdd081c995a9958dd195960621b6044820152606490fd5b346101bb575f3660031901126101bb57602060ff600c5460a01c166040519015158152f35b346101bb575f3660031901126101bb576020600f54604051908152f35b611fb3565b346101bb575f3660031901126101bb57600c546040516001600160a01b039091168152602090f35b346101bb575f3660031901126101bb576020611bc5612523565b604051908152f35b346101bb575f3660031901126101bb57611bf260018060a01b0360015416331461243b565b611bfa612659565b600c5460ff8160a81c1615611d6e576040516370a0823160e01b8152306004820152906001600160a01b0316602082602481845afa9182156105f9575f92611d39575b50602082611c8a92611c50821515612497565b60015460405163a9059cbb60e01b81526001600160a01b0390911660048201526024810192909252909283919082905f9082906044820190565b03925af19081156105f9575f91611d1a575b5015611ce1576001546040519182526001600160a01b0316907feaff4b37086828766ad3268786972c0cd24259d4c87a80f9d3963a3c3d999b0d90602090a260015f55005b60405162461bcd60e51b815260206004820152601160248201527015da5d1a191c985dd85b0819985a5b1959607a1b6044820152606490fd5b611d33915060203d6020116105f2576105e481836120d9565b82611c9c565b9091506020813d602011611d66575b81611d55602093836120d9565b810103126101bb5751906020611c3d565b3d9150611d48565b60405162461bcd60e51b815260206004820152601760248201527f4f66666572206d75737420626520636f6d706c657465640000000000000000006044820152606490fd5b346101bb575f3660031901126101bb576020600d54604051908152f35b346101bb575f3660031901126101bb576002546040516001600160a01b039091168152602090f35b346101bb575f3660031901126101bb57604051806020600f5492838152018092600f5f527f8d1108e10bcb7c27dddfc02ed9d693a074039d026cf4ea4240b40f7d581ac802905f5b818110611ea15750505081611e569103826120d9565b604051918291602083019060208452518091526040830191905f5b818110611e7f575050500390f35b82516001600160a01b0316845285945060209384019390920191600101611e71565b82546001600160a01b0316845260209093019260019283019201611e40565b346101bb575f3660031901126101bb576007546101406008549160ff60095416600a54600b5491611eef6120fb565b95611f27611efb6121b2565b610f76611f06612247565b610f68611f116122dc565b93610f5a6040519d8d8f9e8f9081520190611f51565b94608087015260a0860152151560c085015260e08401528015156101008401526101208301520390f35b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b9060018060a01b038251168152606080611f9e6020850151608060208601526080850190611f51565b93604081015160408501520151151591015290565b346101bb5760203660031901126101bb576004356001600160a01b038116908190036101bb57611fe16124f2565b505f52600e60205261204760405f2060ff600360405192612001846120a0565b80546001600160a01b0316845261201a60018201612371565b60208501526002810154604085015201541615156060820152604051918291602083526020830190611f75565b0390f35b90600182811c92168015612079575b602083101461206557565b634e487b7160e01b5f52602260045260245ffd5b91607f169161205a565b610120810190811067ffffffffffffffff821117610bb757604052565b6080810190811067ffffffffffffffff821117610bb757604052565b610100810190811067ffffffffffffffff821117610bb757604052565b90601f8019910116810190811067ffffffffffffffff821117610bb757604052565b604051905f826003549161210e8361204b565b80835292600181169081156121935750600114612134575b612132925003836120d9565b565b5060035f90815290917fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b5b81831061217757505090602061213292820101612126565b602091935080600191548385890101520191019091849261215f565b6020925061213294915060ff191682840152151560051b820101612126565b604051905f82600454916121c58361204b565b808352926001811690811561219357506001146121e857612132925003836120d9565b5060045f90815290917f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b5b81831061222b57505090602061213292820101612126565b6020919350806001915483858901015201910190918492612213565b604051905f826005549161225a8361204b565b8083529260018116908115612193575060011461227d57612132925003836120d9565b5060055f90815290917f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db05b8183106122c057505090602061213292820101612126565b60209193508060019154838589010152019101909184926122a8565b604051905f82600654916122ef8361204b565b8083529260018116908115612193575060011461231257612132925003836120d9565b5060065f90815290917ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f5b81831061235557505090602061213292820101612126565b602091935080600191548385890101520191019091849261233d565b9060405191825f8254926123848461204b565b80845293600181169081156123ed57506001146123a9575b50612132925003836120d9565b90505f9291925260205f20905f915b8183106123d1575050906020612132928201015f61239c565b60209193508060019154838589010152019101909184926123b8565b90506020925061213294915060ff191682840152151560051b8201015f61239c565b600f5481101561242757600f5f5260205f2001905f90565b634e487b7160e01b5f52603260045260245ffd5b1561244257565b60405162461bcd60e51b815260206004820152602760248201527f4f6e6c79206f66666572206f776e65722063616e2063616c6c207468697320666044820152663ab731ba34b7b760c91b6064820152608490fd5b1561249e57565b60405162461bcd60e51b81526020600482015260146024820152734e6f2066756e647320746f20776974686472617760601b6044820152606490fd5b908160209103126101bb575180151581036101bb5790565b604051906124ff826120a0565b5f6060838281528160208201528260408201520152565b9190820391821161169e57565b600b54158015612548575b61254457612541600754600d5490612516565b90565b5f90565b50600d54600754111561252e565b1561255d57565b60405162461bcd60e51b815260206004820152601060248201526f139bc81c995c5d595cdd08199bdd5b9960821b6044820152606490fd5b1561259c57565b60405162461bcd60e51b815260206004820152601760248201527f5061796d656e74207472616e73666572206661696c65640000000000000000006044820152606490fd5b156125e857565b60405162461bcd60e51b815260206004820152601760248201527f4f6666657220616c726561647920636f6d706c657465640000000000000000006044820152606490fd5b67ffffffffffffffff8111610bb75760051b60200190565b80518210156124275760209160051b010190565b60025f54146126685760025f55565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fdfea26469706673582212204aa81b9e21473c481af462125dab256767272a23ec28f6e9f30b7abdf8a9380864736f6c634300081c00333eea958396a6891e3cb24c953fbfb9b82843162fbb89db057597e6c7ed5ba836"
};
