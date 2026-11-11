import nodemailer from 'nodemailer'
import {
  buildContactEmail,
  type ContactEmailPayload,
  type ContactFormType,
} from '@/lib/email-template'
import { FORM_RECIPIENT_EMAIL } from '@/lib/formsubmit'

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
    if (!payload.phone) return 'Please provide your mobile or phone number.'
    if (!payload.membership) return 'Please choose a membership plan.'
  }

  if (payload.formType === 'booking') {
    if (!payload.phone) return 'Please provide your phone number so our coach can confirm.'
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

/**
 * Sends a branded Presson Fitness Gym email via Gmail SMTP when any site form is submitted.
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
    phone: readString(rawFields.phone),
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
  const gmailUser = process.env.GMAIL_USER?.trim() || recipientEmail
  const gmailAppPassword = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '')

  if (!gmailAppPassword) {
    return Response.json(
      {
        ok: false,
        code: 'SMTP_NOT_CONFIGURED',
        message:
          'Branded email delivery needs your Google App Password first: add GMAIL_APP_PASSWORD in .env.local and restart the dev server.',
      },
      { status: 503 },
    )
  }

  const { subject, html, text } = buildContactEmail(payload)

  try {
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
      to: recipientEmail,
      replyTo: payload.email && EMAIL_PATTERN.test(payload.email) ? payload.email : undefined,
      subject,
      html,
      text,
    })

    return Response.json({ ok: true, message: 'Email sent successfully.' })
  } catch (err) {
    console.error('Gmail SMTP send failed:', err)
    const errorCode =
      typeof err === 'object' && err !== null && 'code' in err ? String((err as { code?: unknown }).code) : ''

    if (errorCode === 'EAUTH') {
      return Response.json(
        {
          ok: false,
          message:
            'Gmail rejected the App Password (EAUTH). Double-check GMAIL_USER and the 16-character GMAIL_APP_PASSWORD in .env.local.',
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

