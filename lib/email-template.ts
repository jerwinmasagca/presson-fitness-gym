export type ContactFormType = 'membership' | 'booking' | 'contact' | 'contact-page'

export interface ContactEmailPayload {
  formType: ContactFormType
  name: string
  phone?: string
  email?: string
  membership?: string
  startDate?: string
  service?: string
  date?: string
  time?: string
  message?: string
  sourceOrigin?: string
}

export interface BuiltContactEmail {
  subject: string
  html: string
  text: string
}

interface FormCopyConfig {
  badge: string
  title: string
  submissionLabel: string
  intro: string
  subjectPrefix: string
}

const FORM_COPY_MAP: Record<ContactFormType, FormCopyConfig> = {
  membership: {
    badge: 'MEMBERSHIP INQUIRY',
    title: 'New Membership Application',
    submissionLabel: 'Membership Registration',
    intro:
      'A prospective member has submitted a membership inquiry through the Presson Fitness Gym website. Please review their selected plan below and follow up within 2 business hours.',
    subjectPrefix: '[Presson Fitness Gym] Membership Inquiry',
  },
  booking: {
    badge: 'SESSION RESERVATION',
    title: 'New Coaching Session Request',
    submissionLabel: 'Coaching & Training Booking',
    intro:
      'A client has requested a training session at Presson Fitness Gym. Please check coach availability for their preferred schedule and confirm via call or SMS.',
    subjectPrefix: '[Presson Fitness Gym] Session Booking Request',
  },
  contact: {
    badge: 'DIRECT INQUIRY',
    title: 'New Message from Website Visitor',
    submissionLabel: 'Direct Contact Inquiry',
    intro:
      'You have received a new inquiry from the Presson Fitness Gym website. Review the message details below and reply directly to assist the sender.',
    subjectPrefix: '[Presson Fitness Gym] Direct Inquiry',
  },
  'contact-page': {
    badge: 'CONTACT PAGE INQUIRY',
    title: 'New Contact Page Message',
    submissionLabel: 'Contact Page Submission',
    intro:
      'A visitor has sent an inquiry through the Presson Fitness Gym Contact page. You can reply directly to this email to continue the conversation.',
    subjectPrefix: '[Presson Fitness Gym] Contact Inquiry',
  },
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatReadableDate(rawDate?: string): string {
  const cleaned = rawDate?.trim()
  if (!cleaned) return 'Flexible / Not specified'

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cleaned)
  if (!match) return cleaned

  const parsed = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  if (Number.isNaN(parsed.getTime())) return cleaned

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

function formatReadableTime(rawTime?: string): string {
  const cleaned = rawTime?.trim()
  if (!cleaned) return 'Not specified'

  const match = /^(\d{1,2}):(\d{2})$/.exec(cleaned)
  if (!match) return cleaned

  const hours = Number(match[1])
  const minutes = match[2]
  if (hours > 23 || Number(minutes) > 59) return cleaned

  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hour12}:${minutes} ${period}`
}

function formatSubmittedTimestamp(now: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Manila',
  }).format(now) + ' (PHT)'
}

interface DetailRow {
  label: string
  valueHtml: string
  valueText: string
}

function buildDetailRows(payload: ContactEmailPayload, copy: FormCopyConfig): DetailRow[] {
  const rows: DetailRow[] = [
    {
      label: 'Inquiry Category',
      valueHtml: `<span style="color:#0B0B0B;font-weight:600;">${escapeHtml(copy.submissionLabel)}</span>`,
      valueText: copy.submissionLabel,
    },
    {
      label: 'Full Name',
      valueHtml: `<span style="color:#0B0B0B;font-weight:700;">${escapeHtml(payload.name)}</span>`,
      valueText: payload.name,
    },
  ]

  if (payload.phone?.trim()) {
    const cleanPhone = payload.phone.trim()
    const telHref = `tel:${cleanPhone.replace(/[^+\d]/g, '')}`
    rows.push({
      label: 'Mobile / Phone',
      valueHtml: `<a href="${escapeHtml(telHref)}" style="color:#0B0B0B;font-weight:600;text-decoration:underline;text-decoration-color:#C9A96A;">${escapeHtml(cleanPhone)}</a>`,
      valueText: cleanPhone,
    })
  }

  if (payload.email?.trim()) {
    const cleanEmail = payload.email.trim()
    rows.push({
      label: 'Email Address',
      valueHtml: `<a href="mailto:${escapeHtml(cleanEmail)}" style="color:#0B0B0B;font-weight:600;text-decoration:underline;text-decoration-color:#C9A96A;">${escapeHtml(cleanEmail)}</a>`,
      valueText: cleanEmail,
    })
  }

  if (payload.formType === 'membership') {
    const plan = payload.membership?.trim() || 'Not specified'
    const startDate = formatReadableDate(payload.startDate)
    rows.push(
      {
        label: 'Selected Plan',
        valueHtml: `<span style="display:inline-block;background-color:#0B0B0B;color:#C9A96A;font-size:12px;font-weight:700;letter-spacing:0.4px;padding:6px 12px;border-radius:3px;">${escapeHtml(plan)}</span>`,
        valueText: plan,
      },
      {
        label: 'Preferred Start Date',
        valueHtml: `<span style="color:#0B0B0B;">${escapeHtml(startDate)}</span>`,
        valueText: startDate,
      },
    )
  }

  if (payload.formType === 'booking') {
    const service = payload.service?.trim() || 'Not specified'
    const prefDate = formatReadableDate(payload.date)
    const prefTime = formatReadableTime(payload.time)
    rows.push(
      {
        label: 'Requested Service',
        valueHtml: `<span style="display:inline-block;background-color:#0B0B0B;color:#C9A96A;font-size:12px;font-weight:700;letter-spacing:0.4px;padding:6px 12px;border-radius:3px;">${escapeHtml(service)}</span>`,
        valueText: service,
      },
      {
        label: 'Preferred Date',
        valueHtml: `<span style="color:#0B0B0B;font-weight:600;">${escapeHtml(prefDate)}</span>`,
        valueText: prefDate,
      },
      {
        label: 'Preferred Time',
        valueHtml: `<span style="color:#0B0B0B;font-weight:600;">${escapeHtml(prefTime)}</span>`,
        valueText: prefTime,
      },
    )
  }

  return rows
}

/**
 * Builds the Presson Fitness Gym branded HTML and plain-text email for form submissions.
 */
export function buildContactEmail(
  payload: ContactEmailPayload,
  options?: { submittedAt?: Date },
): BuiltContactEmail {
  const copy = FORM_COPY_MAP[payload.formType] || FORM_COPY_MAP.contact
  const submittedAt = options?.submittedAt ?? new Date()
  const timestamp = formatSubmittedTimestamp(submittedAt)

  const safeName = payload.name.replace(/[\r\n]+/g, ' ').trim()
  const subject = `${copy.subjectPrefix} — ${safeName}`
  const rows = buildDetailRows(payload, copy)

  const preheaderSummary =
    payload.formType === 'membership'
      ? `${payload.name} selected ${payload.membership || 'a membership plan'}.`
      : payload.formType === 'booking'
        ? `${payload.name} requested ${payload.service || 'a coaching session'}.`
        : `${payload.name} sent a new inquiry to Presson Fitness Gym.`

  const detailRowsHtml = rows
    .map(
      (row, index) => `
      <tr>
        <td style="width:36%;padding:13px 16px;background-color:${index % 2 === 0 ? '#F7F4EC' : '#FFFFFF'};border-bottom:1px solid #E2DCCE;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;color:#6E5A32;vertical-align:top;">
          ${escapeHtml(row.label)}
        </td>
        <td style="width:64%;padding:13px 16px;background-color:${index % 2 === 0 ? '#FAF8F3' : '#FFFFFF'};border-bottom:1px solid #E2DCCE;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#0B0B0B;vertical-align:top;">
          ${row.valueHtml}
        </td>
      </tr>`,
    )
    .join('')

  const messageBlockHtml = payload.message?.trim()
    ? `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:22px;border-collapse:collapse;">
        <tr>
          <td style="background-color:#F7F4EC;border-left:4px solid #C9A96A;border-top:1px solid #E2DCCE;border-right:1px solid #E2DCCE;border-bottom:1px solid #E2DCCE;padding:18px 20px;border-radius:0 4px 4px 0;">
            <p style="margin:0 0 8px 0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#6E5A32;">
              Visitor Message
            </p>
            <p style="margin:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.65;color:#0B0B0B;white-space:pre-line;">${escapeHtml(payload.message.trim())}</p>
          </td>
        </tr>
      </table>`
    : ''

  const ctaButtonHtml = payload.phone?.trim()
    ? `<a href="tel:${escapeHtml(payload.phone.trim().replace(/[^+\d]/g, ''))}" style="display:inline-block;background-color:#C9A96A;color:#0B0B0B;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;text-decoration:none;padding:12px 22px;border-radius:3px;">Call ${escapeHtml(payload.phone.trim())}</a>`
    : payload.email?.trim()
      ? `<a href="mailto:${escapeHtml(payload.email.trim())}?subject=${encodeURIComponent(`Re: ${subject}`)}" style="display:inline-block;background-color:#C9A96A;color:#0B0B0B;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;text-decoration:none;padding:12px 22px;border-radius:3px;">Reply to ${escapeHtml(payload.name.trim())}</a>`
      : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#EDE9DD;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${escapeHtml(preheaderSummary)}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#EDE9DD;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background-color:#FFFFFF;border:1px solid #D9D2C2;border-radius:6px;overflow:hidden;">
          <!-- Dark Obsidian Header -->
          <tr>
            <td style="background-color:#0B0B0B;padding:24px 28px;border-bottom:3px solid #C9A96A;">
              <p style="margin:0 0 4px 0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#C9A96A;">
                Quezon City &middot; Official Website Notification
              </p>
              <h1 style="margin:0;font-family:'Trebuchet MS','Arial Narrow',Arial,sans-serif;font-size:24px;line-height:1.15;letter-spacing:1.4px;text-transform:uppercase;color:#EDE9DD;">
                PRESSON FITNESS GYM
              </h1>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding:30px 28px 26px 28px;background-color:#FFFFFF;">
              <span style="display:inline-block;background-color:#EDE9DD;border:1px solid #C9A96A;color:#0B0B0B;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;padding:5px 11px;border-radius:2px;">
                ${escapeHtml(copy.badge)}
              </span>

              <h2 style="margin:14px 0 10px 0;font-family:'Trebuchet MS','Arial Narrow',Arial,sans-serif;font-size:26px;line-height:1.15;letter-spacing:0.6px;color:#0B0B0B;">
                ${escapeHtml(copy.title)}
              </h2>

              <p style="margin:0 0 22px 0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.65;color:#4A4A4A;">
                ${escapeHtml(copy.intro)}
              </p>

              <!-- Structured Submission Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;border:1px solid #D9D2C2;border-radius:4px;overflow:hidden;">
                <tr>
                  <th colspan="2" align="left" style="padding:11px 16px;background-color:#141414;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#C9A96A;border-bottom:2px solid #C9A96A;">
                    Submission Details
                  </th>
                </tr>
                ${detailRowsHtml}
              </table>

              ${messageBlockHtml}

              ${
                ctaButtonHtml
                  ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;">
                      <tr>
                        <td>${ctaButtonHtml}</td>
                      </tr>
                    </table>`
                  : ''
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#141414;padding:20px 28px;border-top:1px solid #2B2925;">
              <p style="margin:0 0 6px 0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#EDE9DD;">
                Received on <strong style="color:#C9A96A;">${escapeHtml(timestamp)}</strong>${
                  payload.sourceOrigin ? ` via ${escapeHtml(payload.sourceOrigin)}` : ''
                }
              </p>
              <p style="margin:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.6;color:#9C968B;">
                123 Fitness Avenue, Quezon City (Beside the Sports Court) &middot; Open Daily 8:00 AM &ndash; 10:00 PM
                <br />
                Presson Fitness Gym &mdash; Train Harder. Live Stronger.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const textLines = [
    'PRESSON FITNESS GYM — OFFICIAL WEBSITE NOTIFICATION',
    copy.title.toUpperCase(),
    '',
    copy.intro,
    '',
    ...rows.map((row) => `${row.label}: ${row.valueText}`),
  ]

  if (payload.message?.trim()) {
    textLines.push('', 'Visitor Message:', payload.message.trim())
  }

  textLines.push('', `Received on: ${timestamp}`)

  return {
    subject,
    html,
    text: textLines.join('\n'),
  }
}
