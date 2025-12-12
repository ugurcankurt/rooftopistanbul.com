import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Admin Panel - Rooftop Istanbul",
    description: "Admin Management System",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="tr">
            <body className={inter.className}>
                <main className="min-h-screen bg-gray-50 text-gray-900">
                    {children}
                </main>
                <Toaster />
            </body>
        </html>
    )
}
