
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAdminBookings } from "@/app/actions/booking-actions"
import BookingTable from "@/components/admin/BookingTable"
import UpcomingBookings from "@/components/admin/UpcomingBookings"
import { LogOut, LayoutDashboard, RefreshCcw, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [bookings, setBookings] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    const checkAuth = () => {
        const isAuth = sessionStorage.getItem("admin_auth")
        if (isAuth !== "true") {
            router.push("/admin")
        } else {
            fetchBookings()
        }
    }

    const fetchBookings = async () => {
        setLoading(true)
        setError(null)
        const result = await getAdminBookings()

        if (!result.success) {
            console.error('Error fetching bookings:', result.error)
            setError(result.error || "Beklenmeyen bir hata oluştu.")
        } else {
            setBookings(result.data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        checkAuth()
    }, [router])

    const handleLogout = () => {
        sessionStorage.removeItem("admin_auth")
        router.push("/admin")
    }

    if (loading && bookings.length === 0 && !error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
                            <LayoutDashboard size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 hidden md:block">Rezervasyon Yönetimi</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/admin/portfolio">
                            <Button variant="secondary" size="sm" className="gap-2">
                                <ImageIcon className="w-4 h-4" /> <span className="hidden sm:inline">Portfolyo</span>
                            </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={fetchBookings} className="gap-2">
                            <RefreshCcw size={16} /> <span className="hidden sm:inline">Yenile</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2">
                            <LogOut size={16} /> <span className="hidden sm:inline">Çıkış Yap</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {error && (
                    <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 text-red-900">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Hata</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Tüm Rezervasyonlar</h2>
                        <p className="text-gray-500">Toplam {bookings.length} rezervasyon listeleniyor</p>
                    </div>
                </div>

                <UpcomingBookings bookings={bookings} />

                <BookingTable initialBookings={bookings} />
            </main>
        </div>
    )
}
