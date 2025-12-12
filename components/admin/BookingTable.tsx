"use client"

import { useState } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// Table components removed as we use standard HTML table for simplicity
/* import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table" */
import { updateBookingStatus } from "@/app/actions/booking-actions"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Loader2, CheckCircle, XCircle, Eye, Calendar, User, Phone, Mail, Package } from "lucide-react"

interface Booking {
    id: string
    full_name: string
    email: string
    whatsapp: string
    photoshoot_date: string
    package_name: string
    people_count: number
    total_amount: number | null
    status: string
    notes: string | null
    vip_transfer: boolean
    basic_makeup: boolean
    extra_offer_request: string | null
    created_at: string
    payment_details?: any
}

interface BookingTableProps {
    initialBookings: Booking[]
}

export default function BookingTable({ initialBookings }: BookingTableProps) {
    const [bookings, setBookings] = useState<Booking[]>(initialBookings)
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [viewBooking, setViewBooking] = useState<Booking | null>(null)

    const updateStatus = async (id: string, newStatus: string) => {
        setLoadingId(id)

        try {
            const result = await updateBookingStatus(id, newStatus)

            if (result.success) {
                setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
            } else {
                console.error("Failed to update status")
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingId(null)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-600 hover:bg-green-700">Onaylandı</Badge>
            case 'cancelled':
                return <Badge variant="destructive">İptal</Badge>
            default:
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Beklemede</Badge>
        }
    }

    return (
        <div className="space-y-4">
            {/* Using a standard HTML table structure with Tailwind if UI components fail, but trying UI components first */}
            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3">Tarih</th>
                                <th className="px-6 py-3">Müşteri</th>
                                <th className="px-6 py-3">Paket</th>
                                <th className="px-6 py-3">Tutar</th>
                                <th className="px-6 py-3">Durum</th>
                                <th className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Henüz rezervasyon bulunmuyor.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 font-semibold">
                                                    {format(new Date(booking.photoshoot_date), "d MMMM yyyy", { locale: tr })}
                                                </span>
                                                <span className="text-gray-500">
                                                    {format(new Date(booking.photoshoot_date), "HH:mm")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{booking.full_name}</span>
                                                <span className="text-gray-500 text-xs">{booking.whatsapp}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <Badge variant="outline" className="w-fit mb-1">{booking.package_name}</Badge>
                                                <span className="text-xs text-gray-500">{booking.people_count} Kişi</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-emerald-600">
                                            {booking.total_amount ? `€${booking.total_amount}` : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(booking.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => setViewBooking(booking)}>
                                                            <Eye size={18} className="text-gray-500 hover:text-blue-600" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-xl">
                                                        <DialogHeader>
                                                            <DialogTitle>Rezervasyon Detayı</DialogTitle>
                                                        </DialogHeader>
                                                        {viewBooking && (
                                                            <div className="grid grid-cols-2 gap-6 py-4">
                                                                <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                                    <User className="text-amber-600" />
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-500">Müşteri</p>
                                                                        <p className="font-semibold text-lg">{viewBooking.full_name}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                                        <Calendar size={16} /> <span className="text-xs font-medium uppercase">Tarih & Saat</span>
                                                                    </div>
                                                                    <p className="font-medium"> {format(new Date(viewBooking.photoshoot_date), "d MMMM yyyy", { locale: tr })}</p>
                                                                    <p className="text-sm text-gray-600">Saat: {format(new Date(viewBooking.photoshoot_date), "HH:mm")}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                                        <Package size={16} /> <span className="text-xs font-medium uppercase">Paket</span>
                                                                    </div>
                                                                    <p className="font-medium">{viewBooking.package_name}</p>
                                                                    <p className="text-sm text-gray-600">{viewBooking.people_count} Kişi</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                                        <Phone size={16} /> <span className="text-xs font-medium uppercase">İletişim</span>
                                                                    </div>
                                                                    <p className="font-medium text-blue-600">{viewBooking.whatsapp}</p>
                                                                    <p className="text-sm text-gray-600 break-all">{viewBooking.email}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                                        <span className="text-emerald-600 font-bold">€</span> <span className="text-xs font-medium uppercase">Tutar</span>
                                                                    </div>
                                                                    <p className="font-bold text-xl text-emerald-600">€{viewBooking.total_amount}</p>
                                                                </div>

                                                                {/* Detailed Payment Breakdown */}
                                                                {viewBooking.payment_details && viewBooking.payment_details.base_price && (
                                                                    <div className="col-span-2 border-t pt-4 mt-2">
                                                                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Ödeme Detayı</p>
                                                                        <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-2">
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-600">Taban Fiyat ({viewBooking.people_count}x)</span>
                                                                                <span className="font-medium">€{viewBooking.payment_details.base_price}</span>
                                                                            </div>

                                                                            {viewBooking.payment_details.discount_amount > 0 && (
                                                                                <div className="flex justify-between text-green-600">
                                                                                    <span>İndirim (%{viewBooking.payment_details.discount_rate * 100})</span>
                                                                                    <span className="font-medium">-€{viewBooking.payment_details.discount_amount}</span>
                                                                                </div>
                                                                            )}

                                                                            {viewBooking.payment_details.extras && viewBooking.payment_details.extras.length > 0 && (
                                                                                <div className="pt-2 mt-2 border-t border-dashed border-gray-200">
                                                                                    {viewBooking.payment_details.extras.map((extra: any, index: number) => (
                                                                                        <div key={index} className="flex justify-between text-gray-600 text-xs py-0.5">
                                                                                            <span>{extra.name}</span>
                                                                                            <span>+€{extra.price}</span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}

                                                                            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2 font-bold text-gray-900">
                                                                                <span>Genel Toplam</span>
                                                                                <span>€{viewBooking.payment_details.final_total}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Extras (Legacy / Visual Tags) */}
                                                                {(viewBooking.vip_transfer || viewBooking.basic_makeup || viewBooking.extra_offer_request) && (
                                                                    <div className="col-span-2 border-t pt-4 mt-2">
                                                                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Seçilen Ekstralar</p>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {viewBooking.vip_transfer && <Badge variant="outline">VIP Transfer</Badge>}
                                                                            {viewBooking.basic_makeup && <Badge variant="outline">Makyaj</Badge>}
                                                                            {viewBooking.extra_offer_request && (
                                                                                <p className="text-sm text-gray-700 w-full bg-yellow-50 p-2 rounded border border-yellow-100 mt-1">
                                                                                    {viewBooking.extra_offer_request}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Notes */}
                                                                {viewBooking.notes && (
                                                                    <div className="col-span-2 border-t pt-4">
                                                                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Müşteri Notu</p>
                                                                        <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded">{viewBooking.notes}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        <DialogFooter className="gap-2 sm:gap-0">
                                                            {viewBooking?.status === 'pending' && (
                                                                <>
                                                                    <Button
                                                                        variant="destructive"
                                                                        className="w-full sm:w-auto"
                                                                        onClick={() => {
                                                                            if (viewBooking) updateStatus(viewBooking.id, 'cancelled')
                                                                        }}
                                                                    >
                                                                        İptal Et
                                                                    </Button>
                                                                    <Button
                                                                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                                                                        onClick={() => {
                                                                            if (viewBooking) updateStatus(viewBooking.id, 'confirmed')
                                                                        }}
                                                                    >
                                                                        Onayla
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                {booking.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            disabled={loadingId === booking.id}
                                                            onClick={() => updateStatus(booking.id, 'confirmed')}
                                                        >
                                                            {loadingId === booking.id ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            disabled={loadingId === booking.id}
                                                            onClick={() => updateStatus(booking.id, 'cancelled')}
                                                        >
                                                            {loadingId === booking.id ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
