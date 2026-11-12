import nodemailer from 'nodemailer'
import {
  buildContactEmail,
  type ContactEmailPayload,
  type ContactFormType,
} from '@/lib/email-template'
import {
  FORM_RECIPIENT_EMAIL,
  validatePhMobile,
} from '@/lib/formsubmit'

const VALID_FORM_TYPES = new Set<ContactFormType>(['membership', 'booking', 'contact', 'contact-page'])
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readString(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim() : ''
}

function normalizeFormType(raw: string): ContactFormType {
  if (VALID_FORM_TYPES.has(raw as ContactFormType)) {
    return raw as ContactFormType
  }
  return 'contact'
}

async function parseSubmissionBody(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const json = (await request.json().catch(() => ({}))) as Record<string, unknown>
    return Object.fromEntries(Object.entries(json).map(([k, v]) => [k, readString(v)]))
  }

  const formData = await request.formData()
  const parsed: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      parsed[key] = value.trim()
    }
  }
  return parsed
}

function validatePayload(payload: ContactEmailPayload): string | null {
  if (!payload.name) {
    return 'Please enter your full name before submitting.'
  }

  if (payload.formType === 'membership') {
    const phoneError = validatePhMobile(payload.phone || '')
    if (phoneError) return phoneError
    if (!payload.membership) return 'Please choose a membership plan.'
  }

  if (payload.formType === 'booking') {
    const phoneError = validatePhMobile(payload.phone || '')
    if (phoneError) return phoneError
    if (!payload.service) return 'Please select the coaching service you need.'
    if (!payload.date || !payload.time) return 'Please choose a preferred date and time.'
  }

  if (payload.formType === 'contact' || payload.formType === 'contact-page') {
    if (!payload.email || !EMAIL_PATTERN.test(payload.email)) {
      return 'Please enter a valid email address so we can reply to you.'
    }
    if (!payload.message) {
      return 'Please enter your message or question.'
    }
  }

  return null
}

interface EmailSendParams {
  senderEmail: string
  recipientEmail: string
  replyToEmail?: string
  replyToName?: string
  subject: string
  html: string
  text: string
}

async function sendViaBrevo(apiKey: string, params: EmailSendParams): Promise<void> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 12000)

  try {
    const body: Record<string, unknown> = {
      sender: {
        name: 'Presson Fitness Gym',
        email: params.senderEmail,
      },
      to: [
        {
          email: params.recipientEmail,
          name: 'Presson Fitness Gym',
        },
      ],
      subject: params.subject,
      htmlContent: params.html,
      textContent: params.text,
    }

    if (params.replyToEmail) {
      body.replyTo = {
        email: params.replyToEmail,
        name: params.replyToName || params.replyToEmail,
      }
    }

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!res.ok) {
      const errJson = (await res.json().catch(() => null)) as { code?: string; message?: string } | null
      const detail = errJson?.message || `HTTP ${res.status}`
      const err = new Error(`Brevo API error (${res.status}): ${detail}`) as Error & {
        status?: number
        brevoCode?: string
      }
      err.status = res.status
      err.brevoCode = errJson?.code
      throw err
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

async function sendViaGmailSmtp(
  gmailUser: string,
  gmailAppPassword: string,
  params: EmailSendParams,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  })

  await transporter.sendMail({
    from: `"Presson Fitness Gym" <${gmailUser}>`,
    to: params.recipientEmail,
    replyTo: params.replyToEmail,
    subject: params.subject,
    html: params.html,
    text: params.text,
  })
}

/**
 * Sends a branded Presson Fitness Gym email via Brevo API (preferred) or Gmail SMTP fallback.
 */
export async function POST(request: Request) {
  let rawFields: Record<string, string>
  try {
    rawFields = await parseSubmissionBody(request)
  } catch {
    return Response.json(
      { ok: false, message: 'Invalid form submission format. Please refresh and try again.' },
      { status: 400 },
    )
  }

  const originHeader = request.headers.get('origin') || ''
  const payload: ContactEmailPayload = {
    formType: normalizeFormType(readString(rawFields.form_type)),
    name: readString(rawFields.name),
    phone: readString(rawFields.phone)
      .replace(/[\s()-]+/g, '')
      .replace(/^\+?63(?=9\d{9}$)/, '0'),
    email: readString(rawFields.email),
    membership: readString(rawFields.membership),
    startDate: readString(rawFields.start_date),
    service: readString(rawFields.service),
    date: readString(rawFields.date),
    time: readString(rawFields.time),
    message: readString(rawFields.message),
    sourceOrigin: originHeader,
  }

  const validationError = validatePayload(payload)
  if (validationError) {
    return Response.json({ ok: false, message: validationError }, { status: 400 })
  }

  const recipientEmail = process.env.FORM_RECIPIENT_EMAIL?.trim() || FORM_RECIPIENT_EMAIL
  const brevoApiKey = process.env.BREVO_API_KEY?.trim() || ''
  const gmailUser = process.env.GMAIL_USER?.trim() || recipientEmail
  const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL?.trim() || gmailUser
  const gmailAppPassword = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '')

  if (!brevoApiKey && !gmailAppPassword) {
    return Response.json(
      {
        ok: false,
        code: 'EMAIL_NOT_CONFIGURED',
        message:
          process.env.VERCEL || process.env.NODE_ENV === 'production'
            ? `Email delivery is not configured yet. Please contact ${recipientEmail} directly.`
            : 'Email delivery needs BREVO_API_KEY (recommended) or GMAIL_APP_PASSWORD in .env.local.',
      },
      { status: 503 },
    )
  }

  const { subject, html, text } = buildContactEmail(payload)
  const emailParams: EmailSendParams = {
    senderEmail: brevoSenderEmail,
    recipientEmail,
    replyToEmail: payload.email && EMAIL_PATTERN.test(payload.email) ? payload.email : undefined,
    replyToName: payload.name.replace(/[\r\n]+/g, ' ').trim(),
    subject,
    html,
    text,
  }

  if (brevoApiKey) {
    try {
      await sendViaBrevo(brevoApiKey, emailParams)
      return Response.json({ ok: true, message: 'Email sent successfully.' })
    } catch (err) {
      console.error('Brevo email send failed:', err)
      const status = typeof err === 'object' && err !== null && 'status' in err ? Number((err as { status?: unknown }).status) : 0
      const msg = err instanceof Error ? err.message : ''

      if (status === 401 || status === 403) {
        return Response.json(
          {
            ok: false,
            message: `Email service authentication failed (check BREVO_API_KEY). Please try again or reach out directly at ${recipientEmail}.`,
          },
          { status: 502 },
        )
      }

      if (status === 400 && /sender|valid/i.test(msg)) {
        return Response.json(
          {
            ok: false,
            message: `Sender email (${brevoSenderEmail}) must be verified in Brevo Senders before sending.`,
          },
          { status: 502 },
        )
      }

      return Response.json(
        {
          ok: false,
          message: `Unable to deliver email right now. Please try again or reach out directly at ${recipientEmail}.`,
        },
        { status: 502 },
      )
    }
  }

  try {
    await sendViaGmailSmtp(gmailUser, gmailAppPassword, emailParams)
    return Response.json({ ok: true, message: 'Email sent successfully.' })
  } catch (err) {
    console.error('Gmail SMTP send failed:', err)
    const errorCode =
      typeof err === 'object' && err !== null && 'code' in err ? String((err as { code?: unknown }).code) : ''

    if (errorCode === 'EAUTH') {
      return Response.json(
        {
          ok: false,
          message: `Gmail blocked SMTP sign-in (EAUTH). Switch to BREVO_API_KEY in Vercel/env, or verify the Gmail account security lock.`,
        },
        { status: 502 },
      )
    }

    return Response.json(
      {
        ok: false,
        message: `Unable to deliver email right now. Please try again or reach out directly at ${recipientEmail}.`,
      },
      { status: 502 },
    )
  }
}

