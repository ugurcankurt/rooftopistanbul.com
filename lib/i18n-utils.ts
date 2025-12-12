export type LocalizedData<T = string> = T | { [key: string]: T };

export function getLocalized<T = string>(data: any, locale: string): T {
    if (data === null || data === undefined) return '' as any;

    // If it's already the expected primitive (string/number/boolean) or an array (for features)
    // AND it doesn't look like a translation object (keys like 'en', 'tr')
    // optimization: just check if it has the requested locale key?
    // But data might be "Just String".

    if (typeof data !== 'object') return data as T;
    // Check if it's an array and we expect an array? 
    // If data is array ["a", "b"], return it.
    if (Array.isArray(data)) return data as any;

    // It is an object. Check if it's a translation map.
    // Double-nested check:
    let value = data[locale];

    if (value === undefined) {
        // Fallback to en
        value = data['en'];
    }

    if (value === undefined) {
        // Fallback to first key
        const keys = Object.keys(data);
        if (keys.length > 0) value = data[keys[0]];
    }

    // If we found a value, and that value is ALSO an object (and not an array), usually implies double nesting
    // UNLESS T is supposed to be an object.
    // Heuristic: If we found `value`, let's return it. 
    // But if we have double wrapping ({"en": {"en": "..."}}), `value` is `{"en": "..."}`.
    // We should recurse if `value` looks like a translation object?
    // Safe bet: if `value` is object and has 'en' or 'tr' keys, unwrap again?
    if (value && typeof value === 'object' && !Array.isArray(value) && (value['en'] || value['tr'])) {
        return getLocalized(value, locale);
    }

    return (value !== undefined ? value : '') as T;
}

export function getLocalizedList(list: any[] | null | undefined, locale: string): string[] {
    if (!list) return [];
    if (!Array.isArray(list)) return [];

    return list.map(item => getLocalized(item, locale));
}
