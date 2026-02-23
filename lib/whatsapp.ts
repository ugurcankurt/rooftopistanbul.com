import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { getIstanbulDate } from "@/lib/date-utils"

interface Booking {
    full_name: string
    whatsapp: string
    photoshoot_date: string
    package_name: string
    people_count: number
    total_amount: number | null
    notes: string | null
    vip_transfer: boolean
    basic_makeup: boolean
    extra_offer_request: string | null
    payment_details?: any
}

export const getWhatsAppLink = (booking: Booking) => {
    const phone = booking.whatsapp.replace(/[^0-9]/g, '')

    // Format date and time
    const date = format(getIstanbulDate(booking.photoshoot_date), "MMMM d, yyyy", { locale: enUS })
    const time = format(getIstanbulDate(booking.photoshoot_date), "HH:mm")

    // Emojis
    const WAVE = "👋"
    const CHECK = "✅"
    const CALENDAR = "📅"
    const CLOCK = "⏰"
    const PACKAGE = "📦"
    const PEOPLE = "👥"
    const MONEY = "💰"
    const SPARKLES = "✨"
    const NOTE = "📝"
    const PIN = "📍"
    const CAMERA = "📸"

    let message = `Hello ${booking.full_name}, ${WAVE}\n\n`
    message += `Your booking has been successfully confirmed! ${CHECK}\n\n`
    message += `${CALENDAR} Date: *${date}*\n`
    message += `${CLOCK} Time: *${time}*\n`
    message += `${PACKAGE} Package: *${booking.package_name}*\n`
    message += `${PEOPLE} People: *${booking.people_count}*\n`

    if (booking.total_amount) {
        message += `${MONEY} Total Amount: *€${booking.total_amount}*\n`
    }

    // Extras
    const extras: string[] = []
    if (booking.vip_transfer) extras.push("VIP Transfer")
    if (booking.basic_makeup) extras.push("Makeup")
    if (booking.extra_offer_request) extras.push(booking.extra_offer_request)

    if (booking.payment_details?.extras) {
        booking.payment_details.extras.forEach((e: any) => {
            if (!extras.includes(e.name)) extras.push(e.name)
        })
    }

    if (extras.length > 0) {
        message += `${SPARKLES} Extras: ${extras.join(", ")}\n`
    }

    if (booking.notes) {
        message += `${NOTE} Note: ${booking.notes}\n`
    }

    message += `\n${PIN} Location: https://maps.app.goo.gl/ruaBwRguuqqCYqie7\n`
    message += `We can't wait to host you! Feel free to ask any questions here. ${CAMERA}`

    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
}

export const getWhatsAppReviewLink = (booking: Booking) => {
    const phone = booking.whatsapp.replace(/[^0-9]/g, '')

    const STAR = "⭐"
    const HEART = "❤️"

    let message = `Hello ${booking.full_name}, ${HEART}\n\n`
    message += `Thank you for choosing us for your photoshoot! We hope you had a great time.\n\n`
    message += `Would you mind taking a minute to share your experience with us on Google? It means the world to us! ${STAR}\n\n`
    message += `https://maps.app.goo.gl/z5ducnNLi1EjDmiP7\n\n`
    message += `Best regards,\nNova PHoto Istanbul Team`

    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
}
