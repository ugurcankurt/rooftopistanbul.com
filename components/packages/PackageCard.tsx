
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"

interface PackageCardProps {
    name: string
    price: number
    currency: string
    features: string[]
    isFeatured?: boolean
    onSelect?: () => void
}

export default function PackageCard({ name, price, currency, features, isFeatured, onSelect }: PackageCardProps) {
    const t = useTranslations('Packages'); // Assuming common strings like "Book Now" or "Popular" if needed.
    // For now, "Select Package" is hardcoded or I should add it to messages.
    // Let's add "selectPackage" to EN/TR json later if really needed, or just use "Book Now" from Navbar messages?
    // Using simple "Book Now" for consistency.

    return (
        <Card className={`relative flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isFeatured ? 'border-amber-500 shadow-amber-100 dark:shadow-amber-900/20 border-2 scale-105' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}`}>
            {isFeatured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1 text-sm uppercase tracking-wider font-bold shadow-lg">
                        {t('mostPopular')}
                    </Badge>
                </div>
            )}
            <CardHeader className="text-center pb-2 pt-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        {currency}{price}
                    </span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('perPerson')}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <ul className="space-y-3 mt-4">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <div className="mt-1 h-4 w-4 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
                                <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                            </div>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="pt-4 pb-8">
                <Button
                    className={`w-full rounded-full font-bold h-12 text-md transition-all duration-300 active:scale-[0.98] ${isFeatured ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-200 dark:shadow-amber-900/20' : 'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'}`}
                    onClick={onSelect}
                >
                    {/* If onSelect is provided, we don't wrap in Link, or we handle navigation differently. 
                        But here we want to open modal. */}
                    {t('selectButton')}
                </Button>
            </CardFooter>
        </Card>
    )
}
