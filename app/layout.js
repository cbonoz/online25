import UiLayoutWrapper from './lib/UiLayoutWrapper';
import DynamicWrapper from './lib/DynamicWrapper';
import ErrorBoundary from './lib/ErrorBoundary';

import './globals.css';
import { siteConfig } from './constants';

export default function RootLayout({ children }) {
    return (
        <html>
            {/* <Script async src="https://saturn.tech/widget.js" /> */}
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <title>
                    {siteConfig.title}
                </title>
                <meta
                    name="description"
                    content={siteConfig.description}
                />
            </head>
            <body>
                <ErrorBoundary>
                    <DynamicWrapper>
                        <UiLayoutWrapper>{children}</UiLayoutWrapper>
                    </DynamicWrapper>
                </ErrorBoundary>
            </body>
        </html>
    );
}
