import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
    title: "Voiss AI Demo",
    description:
        "Voiss AI Demo",
    keywords:
        "Voiss AI Demo",
    authors: [{ name: "Voiss" }],
    creator: "Voiss",
    publisher: "Voiss",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: "Voiss AI Demo",
        description:
            "",
        url: "https://voiss-demo.onrender.com/voice",
        siteName: "Voiss",
        images: [
            {
                url: "/",
                width: 1200,
                height: 630,
                alt: "Voiss",
            },
        ],
        locale: "en_GB",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Voiss AI Demo",
        description:
            "",
        images: ["/"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
            >
                {children}
                <Toaster />
                <Analytics />
            </body>
        </html>
    );
}
