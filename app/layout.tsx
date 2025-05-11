"use client";

import "./globals.css";

import { Inter } from "next/font/google";
import { Provider } from "urql";
import { createUrqlClient } from "@/gql/urqlClient";
import { Toaster } from "@/components/ui/toaster";
import { CSPostHogProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider value={createUrqlClient()}>
      <html lang="en" className="h-full notranslate" translate="no">
        <CSPostHogProvider>
          <head>
            {/* {process.env.NEXT_PUBLIC_ENV !== "development" && (
              <script
                defer
                data-domain="revenowl.com"
                src="https://plausible.io/js/script.js"
              ></script>
            )} */}
          </head>
          <body
            className={`${inter.className} antialiased min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
          >
            {children}
            <Toaster />
          </body>
        </CSPostHogProvider>
      </html>
    </Provider>
  );
}
