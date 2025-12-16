import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { createBooking } from "@/app/actions/booking-actions"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Loader2, CheckCircle2, AlertCircle, User, Users, Sparkles } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { getLocalized } from "@/lib/i18n-utils"
import { enUS, tr, ru, ar, es } from "date-fns/locale"
import { useCurrency } from "@/context/CurrencyContext"
import { sendGAEvent } from "@/lib/analytics"

interface Package {
    id: string
    name: any
    price: number
    category: 'outdoor' | 'studio'
}

interface ReservationModalProps {
    isOpen: boolean
    onClose: () => void
    packageName: string
    packageId: string
    packagePrice: number
    packageCategory: 'outdoor' | 'studio'
    allPackages: Package[]
    locale: string
}

const VIP_PRICE = 150 // Flat fee
const MAKEUP_PRICE = 50 // Per person
const CHILD_DRESS_PRICE = 30 // Per dress

// Generate time slots (08:00 to 21:00)
const timeSlots = Array.from({ length: 30 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8
    const minute = i % 2 === 0 ? "00" : "30"
    return `${hour.toString().padStart(2, '0')}:${minute}`
}).filter(t => t <= "21:00")

const locales: { [key: string]: any } = {
    en: enUS,
    tr: tr,
    ru: ru,
    ar: ar,
    es: es
}

export default function ReservationModal({
    isOpen,
    onClose,
    packageName,
    packageId,
    packagePrice,
    packageCategory,
    allPackages,
    locale
}: ReservationModalProps) {
    const t = useTranslations('Reservation')
    const { convertPrice, currency } = useCurrency()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [date, setDate] = useState<Date>()
    const [time, setTime] = useState<string>("")
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    // Helper to auto-advance focus
    const focusNext = (id: string) => {
        setTimeout(() => {
            const el = document.getElementById(id)
            if (el) {
                el.focus()
                el.click()
            }
        }, 100)
    }

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        whatsapp: '',
        notes: '',
        vip_transfer: false,
        basic_makeup: false,
        people_count: 1,
        child_count: 0,
        child_dress_count: 0,
    })

    const [selectedExtras, setSelectedExtras] = useState<string[]>([])
    const [totalPriceEur, setTotalPriceEur] = useState(packagePrice)
    const [discountAmountEur, setDiscountAmountEur] = useState(0)

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                full_name: '',
                email: '',
                whatsapp: '',
                notes: '',
                vip_transfer: false,
                basic_makeup: false,
                people_count: 1,
                child_count: 0,
                child_dress_count: 0,
            })
            setDate(undefined)
            setTime("")
            setSelectedExtras([])
            setDiscountAmountEur(0)
            setSuccess(false)
            setError(null)
        }
    }, [isOpen])

    // Reset child dress count if package is outdoor
    useEffect(() => {
        if (packageCategory === 'outdoor') {
            setFormData(prev => ({ ...prev, child_dress_count: 0 }))
        }
    }, [packageCategory])

    // Calculate total price whenever dependencies change (IN EUR)
    useEffect(() => {
        let packageTotal = (packagePrice * formData.people_count) // Per person pricing

        let extrasTotal = 0
        selectedExtras.forEach(extraId => {
            const extraPkg = allPackages.find(p => p.id === extraId)
            if (extraPkg) {
                extrasTotal += (extraPkg.price * formData.people_count)
            }
        })

        let calculatedDiscount = 0

        // Discount Logic: Applies if Primary Package is Outdoor OR if any Extra is Outdoor
        const isOutdoorMain = packageCategory === 'outdoor'
        const hasOutdoorExtra = selectedExtras.some(id => allPackages.find(p => p.id === id)?.category === 'outdoor')

        if (isOutdoorMain || hasOutdoorExtra) {
            const discountableAmount = isOutdoorMain ? packageTotal : 0

            // If main is not outdoor but we have outdoor extra, we might only discount the extra?
            // User request: "kullanıcı studio paketi seçip ekstra olarak outdoor paketi eklerse yine mevcut indirimleri eklemelisin"
            // Interpretation: The GROUP discount (20/30%) applies to the *outdoor components*.
            // Since the logic is specific, let's calculate discount on Outdoor parts.

            let amountSubjectToDiscount = 0

            if (isOutdoorMain) amountSubjectToDiscount += packageTotal

            selectedExtras.forEach(extraId => {
                const extraPkg = allPackages.find(p => p.id === extraId)
                if (extraPkg && extraPkg.category === 'outdoor') {
                    amountSubjectToDiscount += (extraPkg.price * formData.people_count)
                }
            })

            if (formData.people_count === 2) {
                calculatedDiscount = amountSubjectToDiscount * 0.20
            } else if (formData.people_count >= 3) {
                calculatedDiscount = amountSubjectToDiscount * 0.30
            }
        }

        let total = packageTotal + extrasTotal - calculatedDiscount

        if (formData.vip_transfer) total += VIP_PRICE // Flat fee
        if (formData.basic_makeup) total += (MAKEUP_PRICE * formData.people_count) // Per person

        // Children are free, but dress rental costs
        if (formData.child_dress_count > 0) {
            total += (formData.child_dress_count * CHILD_DRESS_PRICE)
        }

        setDiscountAmountEur(calculatedDiscount)
        setTotalPriceEur(total)
    }, [formData, selectedExtras, packagePrice, allPackages, packageCategory])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (!date || !time) {
            setError(t('errors.selectDate'))
            return
        }

        try {
            // Construct ISO Date
            const isoDateTime = new Date(`${format(date, 'yyyy-MM-dd')}T${time}:00`).toISOString()

            // Construct extra offer request summary
            const extraPackageNames = selectedExtras
                .map(id => {
                    const p = allPackages.find(pkg => pkg.id === id)
                    return p ? `${getLocalized(p.name, locale)} (${p.price}€ x ${formData.people_count})` : ''
                })
                .filter(Boolean)
                .join(', ')

            // --- DETAILED BILLING CALCULATION ---
            const packageBaseTotal = packagePrice * formData.people_count
            const extrasList = []

            if (formData.vip_transfer) extrasList.push({ name: 'VIP Transfer', price: VIP_PRICE })
            if (formData.basic_makeup) extrasList.push({ name: 'Basic Makeup', price: MAKEUP_PRICE * formData.people_count })
            if (formData.child_dress_count > 0) extrasList.push({ name: 'Child Dress Rental', price: formData.child_dress_count * CHILD_DRESS_PRICE })

            selectedExtras.forEach(extraId => {
                const extraPkg = allPackages.find(p => p.id === extraId)
                if (extraPkg) {
                    extrasList.push({ name: getLocalized(extraPkg.name, 'en'), price: extraPkg.price * formData.people_count })
                }
            })

            const paymentDetails = {
                base_price: packageBaseTotal,
                unit_price: packagePrice,
                people_count: formData.people_count,
                discount_amount: discountAmountEur,
                discount_rate: discountAmountEur > 0 ? (formData.people_count === 2 ? 0.20 : 0.30) : 0,
                final_package_price: packageBaseTotal - discountAmountEur,
                extras: extrasList,
                extras_total: totalPriceEur - (packageBaseTotal - discountAmountEur),
                final_total: totalPriceEur,
                currency: 'EUR'
            }

            // Server Action for Secure Insert (Bypassing RLS)
            const result = await createBooking({
                full_name: formData.full_name,
                email: formData.email,
                whatsapp: formData.whatsapp,
                photoshoot_date: isoDateTime,
                package_id: packageId,
                package_name: packageName,
                vip_transfer: formData.vip_transfer,
                basic_makeup: formData.basic_makeup,
                notes: formData.notes,
                extra_offer_request: extraPackageNames,
                people_count: formData.people_count,
                child_count: formData.child_count,
                child_dress_count: formData.child_dress_count,
                total_amount: totalPriceEur, // Submitting EUR amount
                payment_details: paymentDetails
            })

            if (!result.success) {
                throw new Error(result.error || 'Submission failed')
            }

            const data = result.data

            setSuccess(true)

            // Track Purchase Event
            sendGAEvent('purchase', {
                transaction_id: data.id,
                value: totalPriceEur,
                currency: 'EUR',
                items: [
                    {
                        item_id: packageId,
                        item_name: packageName,
                        price: packagePrice,
                        quantity: formData.people_count
                    },
                    ...selectedExtras.map(id => ({
                        item_id: id,
                        item_name: 'Extra Package', // ideally detailed name but ID is tracked
                        price: 0 // complex pricing structure 
                    }))
                ]
            })

            setTimeout(() => {
                onClose()
                if (data && data.id) {
                    window.location.href = `/${locale}/reservation-success/${data.id}`
                }
            }, 1000)

            // Clear form
            setFormData({
                full_name: '',
                email: '',
                whatsapp: '',
                notes: '',
                vip_transfer: false,
                basic_makeup: false,
                people_count: 1,
                child_count: 0,
                child_dress_count: 0,
            })
            setDate(undefined)
            setTime("")
            setSelectedExtras([])
            setDiscountAmountEur(0)
        } catch (err) {
            console.error('Error submitting reservation:', err)
            setError(t('error'))
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Helper for Select inputs
    const handleSelectChange = (name: string, value: string) => {
        const numValue = parseInt(value) || 0
        setFormData(prev => {
            const updates: any = { [name]: numValue }

            // Validation: child_dress_count cannot exceed child_count
            if (name === 'child_count' && prev.child_dress_count > numValue) {
                updates.child_dress_count = numValue
            }
            if (name === 'child_dress_count' && numValue > prev.child_count) {
                updates.child_dress_count = prev.child_count
            }
            // People count minimum 1
            if (name === 'people_count' && numValue < 1) {
                updates.people_count = 1
            }

            return { ...prev, ...updates }
        })
    }

    const handleCheckboxChange = (name: string) => (checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }))
    }

    const handleExtraChange = (pkgId: string) => (checked: boolean) => {
        setSelectedExtras(prev =>
            checked ? [...prev, pkgId] : prev.filter(id => id !== pkgId)
        )
    }

    // Filter logic: Show "Other Packages" from the opposite category.
    const targetCategory = packageCategory === 'outdoor' ? 'studio' : 'outdoor';

    const extraOptions = allPackages.filter(p =>
        p.id !== packageId &&
        (p.category === targetCategory)
    )

    // Converted Price Constants
    const vipPriceDisplay = convertPrice(VIP_PRICE).formatted
    const makeupPriceDisplay = convertPrice(MAKEUP_PRICE).formatted
    const childDressPriceDisplay = convertPrice(CHILD_DRESS_PRICE).formatted
    const packagePriceDisplay = convertPrice(packagePrice).formatted

    // Total & Discount Display
    const totalDisplay = convertPrice(totalPriceEur).formatted
    const discountDisplay = convertPrice(discountAmountEur).formatted


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0 gap-0">
                <DialogHeader className="p-6 pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl">{t('title')}</DialogTitle>
                            <DialogDescription className="mt-1 flex items-center gap-2">
                                <span className="font-semibold text-foreground">{packageName}</span>
                                <Badge variant="secondary">{packagePriceDisplay} {t('perPerson')}</Badge>
                                {packageCategory && <Badge variant="outline" className="capitalize">{packageCategory}</Badge>}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-green-700">{t('success')}</h3>
                        <p className="text-muted-foreground text-sm max-w-sm">
                            {t('success')}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Extras */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">1</span>
                                    <h3 className="font-semibold text-lg">{t('personalInfo')}</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name">{t('name')}</Label>
                                        <Input
                                            id="full_name"
                                            name="full_name"
                                            required
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">{t('email')}</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="whatsapp">{t('whatsapp')}</Label>
                                            <Input
                                                id="whatsapp"
                                                name="whatsapp"
                                                type="tel"
                                                required
                                                value={formData.whatsapp}
                                                onChange={handleChange}
                                                placeholder="+90 555 123 4567"
                                                className="h-11"
                                            />
                                        </div>
                                    </div>

                                    {/* Date and Time Selection */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 flex flex-col">
                                            <Label className="">{t('dateLabel')}</Label>
                                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal h-11",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {date ? format(date, "PPP", { locale: locales[locale] || enUS }) : <span>{t('pickDate')}</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={(d) => {
                                                            setDate(d)
                                                            setIsCalendarOpen(false)
                                                            if (d) focusNext('time-trigger')
                                                        }}
                                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                        initialFocus
                                                        locale={locales[locale] || enUS}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="time">{t('timeLabel')}</Label>
                                            <Select
                                                value={time}
                                                onValueChange={(v) => {
                                                    setTime(v)
                                                    focusNext('people_count')
                                                }}
                                            >
                                                <SelectTrigger id="time-trigger" className="h-11">
                                                    <SelectValue placeholder={t('selectTime')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {timeSlots.map((timeSlot) => (
                                                        <SelectItem key={timeSlot} value={timeSlot}>
                                                            {timeSlot}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Participants */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-primary/80 uppercase tracking-wider">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">2</span>
                                        {t('participants')}
                                    </h4>
                                    {packageCategory === 'outdoor' && formData.people_count >= 2 && (
                                        <Badge variant="default" className="bg-green-600 hover:bg-green-700 animate-in fade-in zoom-in">
                                            {formData.people_count === 2 ? '20%' : '30%'} {t('discount')}
                                        </Badge>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <Label htmlFor="people_count" className="text-xs uppercase text-muted-foreground font-bold h-8 flex items-end pb-1">{t('adults')}</Label>
                                        <Select
                                            value={formData.people_count.toString()}
                                            onValueChange={(val) => {
                                                handleSelectChange('people_count', val)
                                                // Optional: Only jump if val is set? Always jump?
                                                // Let's jump to child count
                                                focusNext('child_count')
                                            }}
                                        >
                                            <SelectTrigger id="people_count" className="h-11">
                                                <SelectValue placeholder={t('selectPlaceholder')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[...Array(10)].map((_, i) => (
                                                    <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1} {t('adults')}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="child_count" className="text-xs uppercase text-muted-foreground font-bold h-8 flex items-end pb-1">{t('children')}</Label>
                                        <Select
                                            value={formData.child_count.toString()}
                                            onValueChange={(val) => handleSelectChange('child_count', val)}
                                        >
                                            <SelectTrigger id="child_count" className="h-11">
                                                <SelectValue placeholder={t('selectPlaceholder')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[...Array(6)].map((_, i) => (
                                                    <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="child_dress_count" className={cn("text-xs uppercase text-muted-foreground font-bold h-8 flex items-end pb-1", (formData.child_count === 0 || packageCategory === 'outdoor') && "opacity-50")}>
                                            {t('childDress').replace('30€', childDressPriceDisplay)}
                                        </Label>
                                        <Select
                                            value={formData.child_dress_count.toString()}
                                            onValueChange={(val) => handleSelectChange('child_dress_count', val)}
                                            disabled={formData.child_count === 0 || packageCategory === 'outdoor'}
                                        >
                                            <SelectTrigger id="child_dress_count" className="h-11">
                                                <SelectValue placeholder={t('selectPlaceholder')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[...Array(formData.child_count + 1)].map((_, i) => (
                                                    <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Extras */}
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-primary/80 uppercase tracking-wider">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">3</span>
                                    {t('extra')}
                                </h4>
                                <Card className="border-muted bg-muted/20">
                                    <CardContent className="p-4 space-y-4">
                                        {/* VIP Transfer */}
                                        <div className={cn(
                                            "flex items-start space-x-3 p-3 rounded-lg transition-colors",
                                            formData.vip_transfer ? "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800" : "bg-transparent border border-transparent"
                                        )}>
                                            <Checkbox
                                                id="vip_transfer"
                                                checked={formData.vip_transfer}
                                                onCheckedChange={handleCheckboxChange('vip_transfer')}
                                                className="mt-1 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                                            />
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between items-center cursor-pointer" onClick={() => handleCheckboxChange('vip_transfer')(!formData.vip_transfer)}>
                                                    <Label htmlFor="vip_transfer" className="font-semibold cursor-pointer">{t('vip')}</Label>
                                                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">+{vipPriceDisplay}</Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground w-[90%]">{t('vipDescription')}</p>
                                            </div>
                                        </div>

                                        <Separator className="opacity-50" />

                                        {/* Makeup */}
                                        <div className={cn(
                                            "flex items-start space-x-3 p-3 rounded-lg transition-colors",
                                            formData.basic_makeup ? "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800" : "bg-transparent border border-transparent"
                                        )}>
                                            <Checkbox
                                                id="basic_makeup"
                                                checked={formData.basic_makeup}
                                                onCheckedChange={handleCheckboxChange('basic_makeup')}
                                                className="mt-1 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                                            />
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between items-center cursor-pointer" onClick={() => handleCheckboxChange('basic_makeup')(!formData.basic_makeup)}>
                                                    <Label htmlFor="basic_makeup" className="font-semibold cursor-pointer">{t('makeup')}</Label>
                                                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">+{makeupPriceDisplay} {t('perPerson')}</Badge>
                                                </div>

                                                <p className="text-xs text-muted-foreground w-[90%]">{t('makeupDescription', { count: formData.people_count })}</p>
                                            </div>
                                        </div>

                                        {extraOptions.length > 0 && (
                                            <div className="space-y-3 pt-2">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3">{t('addOns')}</Label>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {extraOptions.map(pkg => {
                                                        const pkgPriceDisplay = convertPrice(pkg.price).formatted
                                                        return (
                                                            <div key={pkg.id} className={cn(
                                                                "flex items-start space-x-3 p-3 rounded-lg transition-colors",
                                                                selectedExtras.includes(pkg.id) ? "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800" : "bg-transparent border border-transparent"
                                                            )}>
                                                                <Checkbox
                                                                    id={`extra-${pkg.id}`}
                                                                    checked={selectedExtras.includes(pkg.id)}
                                                                    onCheckedChange={handleExtraChange(pkg.id)}
                                                                    className="mt-1 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                                                                />
                                                                <div className="flex-1 cursor-pointer" onClick={() => handleExtraChange(pkg.id)(!selectedExtras.includes(pkg.id))}>
                                                                    <div className="flex justify-between items-center">
                                                                        <Label htmlFor={`extra-${pkg.id}`} className="font-medium cursor-pointer text-sm">
                                                                            {getLocalized(pkg.name, locale)}
                                                                        </Label>
                                                                        <span className="text-xs font-medium text-amber-600 whitespace-nowrap ml-2">+{pkgPriceDisplay} {t('perPerson')}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Notes */}
                            <div className="space-y-4">
                                <Label htmlFor="notes" className="text-sm font-semibold">{t('notes')}</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    placeholder={t('notesPlaceholder')}
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="resize-none min-h-[100px]"
                                />
                            </div>
                        </div>

                        {/* Sticky User Summary Footer */}
                        <div className="p-4 sm:p-6 bg-background/80 backdrop-blur-md border-t sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                            {error && (
                                <div className="mb-4 flex items-center gap-2 text-destructive text-sm font-medium bg-destructive/10 p-3 rounded-md animate-in slide-in-from-bottom-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-4">
                                <div className="space-y-1">
                                    {discountAmountEur > 0 && (
                                        <div className="flex justify-between items-center text-green-600 text-sm">
                                            <span>{t('discountApplied')} ({formData.people_count === 2 ? '20%' : '30%'})</span>
                                            <span>-{discountDisplay}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span className="text-muted-foreground text-sm font-medium">{t('totalPrice')}</span>
                                        <span>{totalDisplay}</span>
                                    </div>
                                </div>

                                <Button type="submit" size="lg" className="w-full text-lg font-bold h-14 bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-900/20 active:scale-[0.98] transition-all" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            {t('submitting')}
                                        </>
                                    ) : (
                                        t('submit')
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
