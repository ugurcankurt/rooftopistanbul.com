"use client"

import { Link } from "@/i18n/navigation"
import { Menu, Instagram, Facebook } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import LanguageSwitcher from "@/components/ui/language-switcher"
import CurrencySwitcher from "@/components/ui/currency-switcher"
import { useTranslations } from "next-intl"
import Image from "next/image"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const t = useTranslations('Navbar')

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-black/80 dark:border-gray-800 transition-all supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-105">
                        <Image
                            src="/logo.png"
                            alt="Nova Photo Logo"
                            fill
                            sizes="48px"
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-bold leading-none text-gray-900 dark:text-white tracking-tight">NOVA PHOTO</span>
                        <span className="text-[0.6rem] md:text-[0.65rem] font-medium leading-none text-amber-500 uppercase tracking-[0.2em]">istanbul rooftop studio</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/themes" className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">
                        {t('themes')}
                    </Link>
                    <Link href="/portfolio" className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">
                        {t('portfolio')}
                    </Link>
                    <Link href="/our-packages" className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">
                        {t('packages')}
                    </Link>

                    <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors">
                        {t('contact')}
                    </Link>
                    <div className="flex items-center gap-2">
                        <CurrencySwitcher />
                        <LanguageSwitcher />
                    </div>
                    <Button asChild className="rounded-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold px-6">
                        <Link href="/our-packages">
                            {t('bookNow')}
                        </Link>
                    </Button>
                </div>

                {/* Mobile Menu (Sheet) */}
                <div className="md:hidden flex items-center gap-4">
                    <CurrencySwitcher />
                    <LanguageSwitcher />
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="-mr-2">
                                <Menu className="w-6 h-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col pt-12">
                            <SheetTitle className="sr-only">{t('menu')}</SheetTitle>
                            <div className="flex flex-col gap-6 items-center mt-4">
                                <Link
                                    href="/themes"
                                    className="text-xl font-medium hover:text-amber-500 transition-colors py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t('themes')}
                                </Link>
                                <Link
                                    href="/portfolio"
                                    className="text-xl font-medium hover:text-amber-500 transition-colors py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t('portfolio')}
                                </Link>
                                <Link
                                    href="/our-packages"
                                    className="text-xl font-medium hover:text-amber-500 transition-colors py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t('packages')}
                                </Link>

                                <Link
                                    href="/contact"
                                    className="text-xl font-medium hover:text-amber-500 transition-colors py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t('contact')}
                                </Link>
                                <Button asChild className="w-full max-w-[200px] rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold mt-4">
                                    <Link href="/our-packages" onClick={() => setIsOpen(false)}>
                                        {t('bookNow')}
                                    </Link>
                                </Button>

                                <div className="flex gap-4 mt-4">
                                    <a href="https://instagram.com/novaphotoistanbul" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-600 transition-colors text-amber-900 hover:text-white">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a href="https://facebook.com/novaphotoistanbul" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 hover:bg-blue-600 transition-colors text-amber-900 hover:text-white">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}

