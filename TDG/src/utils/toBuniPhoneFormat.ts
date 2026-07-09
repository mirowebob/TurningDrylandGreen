// utils/phone.ts
/**
 * Normalizes Kenyan phone numbers into the 2547XXXXXXXX / 2541XXXXXXXX
 * format Buni's STK push API requires. Accepts 07..., 01..., +254..., 254...
 */
export function toBuniPhoneFormat(raw: string): string | null {
    const digits = raw.replace(/\D/g, ""); // strip spaces, +, dashes etc.

    let normalized: string | null = null;
    if (/^0[17]\d{8}$/.test(digits)) {
        normalized = "254" + digits.slice(1);       // 0712345678 -> 254712345678
    } else if (/^254[17]\d{8}$/.test(digits)) {
        normalized = digits;                         // already correct
    } else if (/^[17]\d{8}$/.test(digits)) {
        normalized = "254" + digits;                 // 712345678 -> 254712345678
    }

    return normalized;
}