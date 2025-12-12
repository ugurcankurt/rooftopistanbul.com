"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Lock, Loader2 } from "lucide-react"

export default function AdminLogin() {
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const isAuth = sessionStorage.getItem("admin_auth")
        if (isAuth === "true") {
            router.push("/admin/bookings")
        }
    }, [router])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Hardcoded simple password as requested for simplicity
        if (password === "nova2025") {
            sessionStorage.setItem("admin_auth", "true")
            router.push("/admin/bookings")
        } else {
            setError(true)
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-2xl">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Admin Girişi</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Rezervasyonları görüntülemek için giriş yapın
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                type="password"
                                placeholder="Şifre"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setError(false)
                                }}
                                className={`pl-10 h-12 ${error ? "border-red-500 ring-red-500" : ""}`}
                            />
                        </div>
                        {error && (
                            <p className="text-sm font-medium text-red-600 animate-pulse">
                                Hatalı şifre, lütfen tekrar deneyin.
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-lg font-semibold shadow-lg transition-all hover:scale-[1.02]"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Giriş Yapılıyor...
                            </>
                        ) : (
                            "Giriş Yap"
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-400">
                    Rooftop Istanbul &copy; {new Date().getFullYear()}
                </div>
            </div>
        </div>
    )
}
