"use client"

import { format, isToday, isTomorrow, parseISO } from "date-fns"
import { tr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Package, Clock, Phone, ArrowUpRight } from "lucide-react"

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
}

interface UpcomingBookingsProps {
    bookings: Booking[]
}

export default function UpcomingBookings({ bookings }: UpcomingBookingsProps) {
    const todayBookings = bookings.filter(booking => isToday(parseISO(booking.photoshoot_date)))
    const tomorrowBookings = bookings.filter(booking => isTomorrow(parseISO(booking.photoshoot_date)))



    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Bugün */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-1 bg-amber-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900">Bugün ({todayBookings.length})</h3>
                    {todayBookings.length > 0 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 animate-pulse">
                            Aktif Çekimler
                        </span>
                    )}
                </div>

                {todayBookings.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center text-gray-400">
                        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p>Bugün için planlanmış çekim yok</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {todayBookings.map(booking => (
                            <BookingCard key={booking.id} booking={booking} isToday={true} />
                        ))}
                    </div>
                )}
            </div>

            {/* Yarın */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900">Yarın ({tomorrowBookings.length})</h3>
                </div>

                {tomorrowBookings.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center text-gray-400">
                        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p>Yarın için planlanmış çekim yok</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tomorrowBookings.map(booking => (
                            <BookingCard key={booking.id} booking={booking} isToday={false} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function BookingCard({ booking, isToday }: { booking: Booking, isToday: boolean }) {
    const time = format(parseISO(booking.photoshoot_date), "HH:mm")

    return (
        <div className={`
            relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-md
            ${isToday
                ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                : 'bg-white border-gray-200 hover:border-blue-200'}
        `}>
            {/* Status Indicator Stripe */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${booking.status === 'confirmed' ? 'bg-green-500' :
                booking.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-400'
                }`} />

            <div className="flex justify-between items-start pl-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`
                            font-mono text-sm px-2 py-0.5
                            ${isToday ? 'bg-white text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-700'}
                        `}>
                            <Clock className="w-3 h-3 mr-1" />
                            {time}
                        </Badge>
                        <span className={`text-sm font-medium ${isToday ? 'text-amber-900' : 'text-gray-900'}`}>
                            {booking.full_name}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2 pl-1">
                        <div className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            <span>{booking.package_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{booking.people_count} Kişi</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-sm">
                        €{booking.total_amount || 0}
                    </div>

                    <a
                        href={`https://wa.me/${booking.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-green-600 transition-colors p-1"
                        title="WhatsApp'tan Yaz"
                    >
                        <Phone className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Extras Badges */}
            {(booking.vip_transfer || booking.basic_makeup) && (
                <div className="flex gap-1 mt-3 pl-3 pt-2 border-t border-dashed border-gray-200">
                    {booking.vip_transfer && (
                        <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                            VIP Transfer
                        </span>
                    )}
                    {booking.basic_makeup && (
                        <span className="text-[10px] uppercase font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">
                            Makyaj
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
