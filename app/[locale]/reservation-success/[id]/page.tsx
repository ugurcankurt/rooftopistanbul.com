import { getPublicBookingDetails } from "@/app/actions/booking-actions"
import { getTranslations } from "next-intl/server"
import { redirect } from "next/navigation"
import { CheckCircle2, Calendar, Package, ArrowRight, Phone, User, Mail, Users, Star, ClipboardList, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { enUS, tr, ru, ar, es } from "date-fns/locale"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const locales: { [key: string]: any } = {
    en: enUS,
    tr: tr,
    ru: ru,
    ar: ar,
    es: es
}

export default async function ReservationSuccessPage({
    params
}: {
    params: Promise<{ locale: string; id: string }>
}) {
    const { locale, id } = await params
    const t = await getTranslations({ locale, namespace: 'ReservationSuccess' })

    // Fetch booking details securely
    const result = await getPublicBookingDetails(id)

    if (!result.success || !result.data) {
        // If booking not found or error, redirect home
        redirect(`/${locale}`)
    }

    const booking = result.data

    // Parse extra packages if they are stored as a comma-separated string
    const extraPackages = booking.extra_offer_request
        ? booking.extra_offer_request.split(',').filter(Boolean)
        : []

    const hasExtras = booking.vip_transfer || booking.basic_makeup || booking.child_dress_count > 0 || extraPackages.length > 0

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-8">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border">
                {/* Header */}
                <div className="bg-green-600 p-8 text-center text-white">
                    <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <CheckCircle2 size={40} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{t('title')}</h1>
                    <p className="text-green-50 opacity-90">{t('description')}</p>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                    {/* Primary Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Reservation Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Calendar size={16} />
                                {t('dateLabel')}
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="font-semibold text-lg text-gray-900">
                                    {format(new Date(booking.photoshoot_date), "d MMMM yyyy", { locale: locales[locale] || enUS })}
                                </p>
                                <p className="text-gray-600">
                                    {format(new Date(booking.photoshoot_date), "HH:mm", { locale: locales[locale] || enUS })}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Package size={16} />
                                {t('packageLabel')}
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="font-semibold text-lg text-gray-900">{booking.package_name}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Detailed Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Personal Info */}
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 font-semibold uppercase mb-2 flex items-center gap-2">
                                <User size={14} /> {t('fullNameLabel')}
                            </p>
                            <p className="font-medium">{booking.full_name}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 font-semibold uppercase mb-2 flex items-center gap-2">
                                <Mail size={14} /> {t('emailLabel')}
                            </p>
                            <p className="font-medium">{booking.email}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 font-semibold uppercase mb-2 flex items-center gap-2">
                                <Phone size={14} /> {t('contactLabel')}
                            </p>
                            <p className="font-medium">{booking.whatsapp}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 font-semibold uppercase mb-2 flex items-center gap-2">
                                <Users size={14} /> {t('participantsLabel')}
                            </p>
                            <div className="flex gap-2">
                                <Badge variant="outline">{booking.people_count} {t('adults')}</Badge>
                                {booking.child_count > 0 && (
                                    <Badge variant="outline">{booking.child_count} {t('children')}</Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Extras & Notes Section */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Star size={16} />
                                {t('extrasLabel')}
                            </h3>
                            {hasExtras ? (
                                <div className="flex flex-wrap gap-2">
                                    {booking.vip_transfer && (
                                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">{t('vipTransfer')}</Badge>
                                    )}
                                    {booking.basic_makeup && (
                                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">{t('basicMakeup')}</Badge>
                                    )}
                                    {booking.child_dress_count > 0 && (
                                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">{booking.child_dress_count} x {t('childDress')}</Badge>
                                    )}
                                    {extraPackages.map((pkg: string, i: number) => (
                                        <Badge key={i} className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">{pkg}</Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">{t('none')}</p>
                            )}
                        </div>

                        {booking.notes && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <ClipboardList size={16} />
                                    {t('notesLabel')}
                                </h3>
                                <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-900 border border-yellow-100">
                                    {booking.notes}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Breakdown Invoice */}
                    {booking.payment_details && booking.payment_details.base_price && (
                        <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gray-100/50 px-6 py-3 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                    <ClipboardList size={16} />
                                    {t('invoiceTitle')}
                                </h3>
                            </div>
                            <div className="p-6 space-y-3 text-sm">
                                {/* Base Price */}
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>{t('basePrice')} ({booking.people_count}x)</span>
                                    <span>{booking.payment_details.base_price}€</span>
                                </div>

                                {/* Discount */}
                                {booking.payment_details.discount_amount > 0 && (
                                    <div className="flex justify-between items-center text-green-600 font-medium">
                                        <span>{t('discountRate')} (%{booking.payment_details.discount_rate * 100})</span>
                                        <span>-{booking.payment_details.discount_amount}€</span>
                                    </div>
                                )}

                                <Separator className="my-2" />

                                {/* Package Subtotal */}
                                <div className="flex justify-between items-center font-medium text-gray-900">
                                    <span>{t('subtotal')}</span>
                                    <span>{booking.payment_details.final_package_price}€</span>
                                </div>

                                {/* Extras Breakdown */}
                                {booking.payment_details.extras && booking.payment_details.extras.length > 0 && (
                                    <div className="pt-2 space-y-2 mt-2 border-t border-dashed border-gray-200">
                                        <p className="text-xs font-semibold text-gray-500 uppercase">{t('extraTotal')}</p>
                                        {booking.payment_details.extras.map((extra: any, index: number) => (
                                            <div key={index} className="flex justify-between items-center text-gray-600 pl-2 border-l-2 border-amber-200">
                                                <span>{extra.name}</span>
                                                <span>+{extra.price}€</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Final Total Footer */}
                            <div className="bg-gray-900 text-white p-4 flex justify-between items-center font-bold text-lg">
                                <span>{t('finalTotal')}</span>
                                <span>{booking.payment_details.final_total}€</span>
                            </div>
                        </div>
                    )}

                    {/* Total Amount Footer (Legacy fallback or prominent display) */}
                    {!booking.payment_details?.base_price && (
                        <div className="bg-gray-900 text-white p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
                            <div className="text-center sm:text-left">
                                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1 flex items-center justify-center sm:justify-start gap-2">
                                    <Wallet size={16} /> {t('totalLabel')}
                                </p>
                                <p className="text-3xl font-bold tracking-tight">{booking.total_amount}€</p>
                            </div>

                            <div className="text-center space-y-2">
                                <p className="text-xs text-gray-400 font-mono bg-gray-800 px-3 py-1 rounded">
                                    {t('referenceCode')} <span className="font-bold text-white">{booking.id.slice(0, 8).toUpperCase()}</span>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="pt-2">
                        <Link href={`/${locale}`} className="block">
                            <Button className="w-full h-12 text-lg bg-gray-100 hover:bg-gray-200 text-gray-900 gap-2 font-semibold">
                                {t('backHome')} <ArrowRight size={18} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
