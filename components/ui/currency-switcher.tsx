"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCurrency } from "@/context/CurrencyContext"

export default function CurrencySwitcher() {
    const { currency, setCurrency } = useCurrency()

    return (
        <Select value={currency} onValueChange={(val: any) => setCurrency(val)}>
            <SelectTrigger className="w-auto min-w-[70px] h-9 gap-2 px-3 rounded-full border-gray-200 dark:border-gray-700 bg-white/50 backdrop-blur-sm dark:bg-black/50 font-medium [&>svg]:hidden focus:ring-offset-0 focus:ring-0 text-xs">
                <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent align="end">
                <SelectItem value="EUR">€ EUR</SelectItem>
                <SelectItem value="USD">$ USD</SelectItem>
                <SelectItem value="GBP">£ GBP</SelectItem>
            </SelectContent>
        </Select>
    )
}
