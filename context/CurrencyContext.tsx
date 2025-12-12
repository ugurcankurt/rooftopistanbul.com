"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Currency = 'EUR' | 'USD' | 'GBP'

interface CurrencyContextType {
    currency: Currency
    setCurrency: (c: Currency) => void
    convertPrice: (amountInEur: number) => { value: number; symbol: string; formatted: string }
    rates: Record<string, number>
    isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('EUR')
    const [rates, setRates] = useState<Record<string, number>>({ EUR: 1, USD: 1.05, GBP: 0.85 })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Fetch rates on mount
        const fetchRates = async () => {
            try {
                const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=USD,GBP')
                const data = await res.json()
                if (data.rates) {
                    setRates({ EUR: 1, ...data.rates })
                }
            } catch (error) {
                console.error('Failed to fetch rates:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchRates()
    }, [])

    const convertPrice = (amountInEur: number) => {
        const rate = rates[currency] || 1
        const value = amountInEur * rate

        let symbol = '€'
        if (currency === 'USD') symbol = '$'
        if (currency === 'GBP') symbol = '£'

        // Format: e.g. 150 -> 150, 150.5 -> 151 (round up/down? usually rounded for clean display)
        // Let's keep 0 decimals for clean aesthetics unless small amount? 
        // For packages (e.g. 150), usually integer is preferred.

        const roundedValue = Math.round(value)
        const formatted = currency === 'EUR'
            ? `${roundedValue}€`
            : `${symbol}${roundedValue}`

        return { value: roundedValue, symbol, formatted }
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, rates, isLoading }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider')
    }
    return context
}
