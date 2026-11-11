/**
 * Recipient email for website form notifications during testing.
 * Switch to 'carlvine0926@gmail.com' (or set FORM_RECIPIENT_EMAIL /
 * NEXT_PUBLIC_FORM_RECIPIENT_EMAIL) before handing off to the client.
 */
export const FORM_RECIPIENT_EMAIL =
  process.env.NEXT_PUBLIC_FORM_RECIPIENT_EMAIL?.trim() || 'jerwinmasagca@gmail.com'

/** Public gym email shown in direct coach contact links. */
export const GYM_CONTACT_EMAIL = 'carlvine0926@gmail.com'

export const CONTACT_API_ENDPOINT = '/api/contact'

/** Strictly 11-digit Philippine mobile number starting with 09 (e.g., 09270660386). */
export const PH_MOBILE_PATTERN = /^09\d{9}$/

/**
 * Normalizes a typed or pasted phone value into digits-only (max 11 digits),
 * converting pasted +639XXXXXXXXX / 639XXXXXXXXX into local 09XXXXXXXXX format.
 */
export function sanitizePhMobileInput(raw: string): string {
  const trimmed = raw.trim()
  const digits = trimmed.replace(/\D/g, '')
  if (/^\+?63\s*9/.test(trimmed) || (digits.length === 12 && digits.startsWith('639'))) {
    return `0${digits.slice(2)}`.slice(0, 11)
  }
  return digits.slice(0, 11)
}

/**
 * Validates that a phone number is an 11-digit Philippine mobile number starting with 09.
 */
export function validatePhMobile(phone: string): string | null {
  const cleaned = phone.trim()
  if (!cleaned) {
    return 'Please provide your 11-digit mobile number.'
  }
  if (!PH_MOBILE_PATTERN.test(cleaned)) {
    return 'Please enter a valid 11-digit Philippine mobile number starting with 09 (e.g., 09270660386).'
  }
  return null
}

export interface ContactSubmitResult {
  ok: boolean
  message: string
}

/**
 * Submits a website form to our Next.js /api/contact route handler (Gmail SMTP).
 */
export async function submitContactForm(form: HTMLFormElement): Promise<ContactSubmitResult> {
  const formData = new FormData(form)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  try {
    const res = await fetch(CONTACT_API_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    })

    const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string } | null

    if (res.ok && data?.ok) {
      return { ok: true, message: data.message || '' }
    }

    if (data?.message) {
      return { ok: false, message: data.message }
    }

    return {
      ok: false,
      message: `Unable to send right now (status ${res.status}). Please try again or email ${FORM_RECIPIENT_EMAIL} directly.`,
    }
  } catch (err) {
    console.error('Contact form submission error:', err)
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        ok: false,
        message: `Request timed out after 15 seconds. Refresh the page and verify the dev server is running, or email ${FORM_RECIPIENT_EMAIL} directly.`,
      }
    }
    return {
      ok: false,
      message: `Network request failed. Please check that the site is running or email ${FORM_RECIPIENT_EMAIL} directly.`,
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
