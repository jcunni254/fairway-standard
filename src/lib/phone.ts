/**
 * Phone number normalization for The Fairway Standard.
 *
 * - E.164 format (+16151231234): Used by Clerk for sign-in identifiers.
 * - Display format (+1 (615) 123-1234): Stored in Supabase and shown in UI.
 *
 * All user inputs (6151231234, 615-123-1234, (615) 123-1234, etc.) are normalized
 * to a consistent format to avoid sign-in failures and data inconsistency.
 */

/** Check if a string looks like a US phone number (not an email). */
export function isPhoneNumber(identifier: string): boolean {
  const trimmed = identifier.trim();
  if (!trimmed) return false;
  if (trimmed.includes("@")) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

/** Extract digits only from a phone string. */
function getDigits(phone: string): string {
  return (phone || "").replace(/\D/g, "");
}

/**
 * Normalize to E.164 for Clerk (e.g. +16151231234).
 * Clerk requires E.164 for sign-in identifiers.
 */
export function normalizePhoneToE164(phone: string): string | null {
  const digits = getDigits(phone);
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits.length >= 10 ? `+${digits}` : null;
}

/**
 * Normalize to display format for storage and UI: +1 (615) 123-1234.
 * All phone numbers in Supabase and displayed to users use this format.
 */
export function normalizePhoneToDisplay(phone: string): string | null {
  const e164 = normalizePhoneToE164(phone);
  if (!e164) return null;
  const digits = e164.slice(1);
  if (digits.length === 11 && digits.startsWith("1")) {
    const area = digits.slice(1, 4);
    const mid = digits.slice(4, 7);
    const last = digits.slice(7);
    return `+1 (${area}) ${mid}-${last}`;
  }
  if (digits.length === 10) {
    const area = digits.slice(0, 3);
    const mid = digits.slice(3, 6);
    const last = digits.slice(6);
    return `+1 (${area}) ${mid}-${last}`;
  }
  return e164;
}
