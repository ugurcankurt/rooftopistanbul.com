import { createClient } from "@/lib/supabase"
import PortfolioManager from "@/components/admin/PortfolioManager"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminPortfolioPage() {
    const supabase = await createClient()

    // Protected route check would happen in middleware or layout, 
    // but assuming simple admin setup as per existing code.

    const { data: images } = await supabase
        .from('portfolio_images')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/bookings">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Portfolyo Yönetimi</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <PortfolioManager initialImages={images || []} />
            </main>
        </div>
    )
}
