"use client"

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <Select value={locale} onValueChange={handleChange}>
            <SelectTrigger className="w-auto min-w-[70px] h-9 gap-2 px-3 rounded-full border-gray-200 dark:border-gray-700 bg-white/50 backdrop-blur-sm dark:bg-black/50 font-medium [&>svg]:hidden focus:ring-offset-0 focus:ring-0">
                <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent align="end">
                <SelectItem value="en">🇬🇧 EN</SelectItem>
                <SelectItem value="tr">🇹🇷 TR</SelectItem>
                <SelectItem value="ru">🇷🇺 RU</SelectItem>
                <SelectItem value="ar">🇸🇦 AR</SelectItem>
                <SelectItem value="es">🇪🇸 ES</SelectItem>
            </SelectContent>
        </Select>
    )
}
