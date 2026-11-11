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
