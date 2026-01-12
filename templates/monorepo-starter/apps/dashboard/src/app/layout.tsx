import "@workspace/ui/globals.css";
import "./globals.css";
import ProviderWrapper from "@workspace/ui/provider-wrapper";
import { Inter } from "next/font/google";
import { Toaster } from "@workspace/ui/components/sonner";

const primaryFont = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
});

const RootLayout = ({ children }: AppLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${primaryFont.variable} font-sans antialiased`}>
        <ProviderWrapper>
          {children}
          <Toaster />
        </ProviderWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
