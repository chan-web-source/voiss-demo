import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
    title: "The Flex - Flexible Accommodation & Property Management",
    description:
        "The future of flexible accommodation. Fully furnished, hotel-grade homes with flexible leases for tenants, guaranteed rent for landlords, and scalable housing solutions for businesses.",
    keywords:
        "flexible accommodation, furnished apartments, property management, short-term rentals, corporate housing, flexible leases, London apartments",
    authors: [{ name: "The Flex" }],
    creator: "The Flex",
    publisher: "The Flex",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: "The Flex - Flexible Accommodation & Property Management",
        description:
            "The future of flexible accommodation. Fully furnished, hotel-grade homes with flexible leases.",
        url: "https://theflex.global",
        siteName: "The Flex",
        images: [
            {
                url: "/modern-apartment-bedroom-with-natural-light.jpg",
                width: 1200,
                height: 630,
                alt: "The Flex - Modern furnished apartment",
            },
        ],
        locale: "en_GB",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "The Flex - Flexible Accommodation & Property Management",
        description:
            "The future of flexible accommodation. Fully furnished, hotel-grade homes with flexible leases.",
        images: ["/modern-apartment-bedroom-with-natural-light.jpg"],
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
