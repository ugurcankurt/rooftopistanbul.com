import "@/app/globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Admin Panel - Rooftop Istanbul",
    description: "Reservation Management System",
}

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
            </body>
        </html>
    )
}
