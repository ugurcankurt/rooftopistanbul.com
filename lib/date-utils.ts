export function getIstanbulDate(dateInput: string | Date): Date {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    // toLocaleString with en-US guarantees a standard format (MM/DD/YYYY, HH:MM:SS AM/PM)
    const trtStr = d.toLocaleString("en-US", { timeZone: "Europe/Istanbul" });
    return new Date(trtStr);
}

export function isIstanbulToday(dateInput: string | Date): boolean {
    const d = getIstanbulDate(dateInput);
    const today = getIstanbulDate(new Date());
    return d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate();
}

export function isIstanbulTomorrow(dateInput: string | Date): boolean {
    const d = getIstanbulDate(dateInput);
    const tomorrow = getIstanbulDate(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);
    return d.getFullYear() === tomorrow.getFullYear() &&
        d.getMonth() === tomorrow.getMonth() &&
        d.getDate() === tomorrow.getDate();
}

export function isBookingCompleted(dateInput: string | Date): boolean {
    const d = getIstanbulDate(dateInput);
    const now = getIstanbulDate(new Date());
    return d < now;
}
