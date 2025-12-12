"use server"

import { createClient } from "@supabase/supabase-js"

const getSupabaseAdmin = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
        return null
    }

    return createClient(supabaseUrl, serviceRoleKey)
}

export async function getAdminBookings() {
    try {
        const supabase = getSupabaseAdmin()

        if (!supabase) {
            console.error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL')
            return {
                success: false,
                error: 'Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY. Please add it to your .env file.'
            }
        }

        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching bookings:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Internal Server Error' }
    }
}

export async function updateBookingStatus(id: string, status: string) {
    try {
        const supabase = getSupabaseAdmin()

        if (!supabase) {
            return {
                success: false,
                error: 'Missing config'
            }
        }

        const { error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', id)

        if (error) {
            console.error('Error updating booking:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Internal Server Error' }
    }
}

export async function getPublicBookingDetails(id: string) {
    try {
        const supabase = getSupabaseAdmin()

        if (!supabase) {
            return {
                success: false,
                error: 'Missing config'
            }
        }

        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error('Error fetching booking details:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data }
        return { success: true, data }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Internal Server Error' }
    }
}

export async function createBooking(bookingData: any) {
    try {
        const supabase = getSupabaseAdmin()

        if (!supabase) {
            return {
                success: false,
                error: 'Server configuration error'
            }
        }

        const { data, error } = await supabase
            .from('bookings')
            .insert(bookingData)
            .select()
            .single()

        if (error) {
            console.error('Error creating booking:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Internal Server Error' }
    }
}
