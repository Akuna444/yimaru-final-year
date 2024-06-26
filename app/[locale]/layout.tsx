import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { NextIntlClientProvider, useMessages } from "next-intl";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yimaru LMS",
  description: "Your AI supported LMS",
  manifest: "/manifest.json",
};

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: any;
}) {
  const messages = useMessages();

  return (
    <ClerkProvider>
      <html lang={locale}>
        <Providers>
          <body className={inter.className}>
            <ConfettiProvider />
            <ToastProvider />
            <NextIntlClientProvider locale={locale} messages={messages}>
              {children}
            </NextIntlClientProvider>
          </body>
        </Providers>
      </html>
    </ClerkProvider>
  );
}
