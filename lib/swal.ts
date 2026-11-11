import Swal, { type SweetAlertOptions } from 'sweetalert2'
import {
  FORM_RECIPIENT_EMAIL,
  submitContactForm,
  validatePhMobile,
  type ContactSubmitResult,
} from '@/lib/formsubmit'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const PRESSON_SWAL_BASE: SweetAlertOptions = {
  background: '#141414',
  color: '#EDE9DD',
  confirmButtonColor: '#C9A96A',
  customClass: {
    popup: 'presson-swal-popup',
    title: 'presson-swal-title',
    htmlContainer: 'presson-swal-text',
    confirmButton: 'presson-swal-confirm',
  },
}

interface FormCopy {
  loadingTitle: string
  successTitle: string
  successDetail: string
}

const FORM_ALERT_COPY: Record<string, FormCopy> = {
  membership: {
    loadingTitle: 'Sending Membership Inquiry...',
    successTitle: 'Membership Inquiry Sent!',
    successDetail: 'Coach will reach out via SMS or Phone Call shortly. Sent directly to',
  },
  booking: {
    loadingTitle: 'Sending Session Request...',
    successTitle: 'Session Request Sent!',
    successDetail: 'Coach will contact you soon to confirm your training schedule. Sent directly to',
  },
  contact: {
    loadingTitle: 'Sending Your Message...',
    successTitle: 'Message Sent!',
    successDetail: 'Thank you for reaching out. Your inquiry was delivered directly to',
  },
  'contact-page': {
    loadingTitle: 'Sending Your Inquiry...',
    successTitle: 'Inquiry Sent!',
    successDetail: 'Thank you for reaching out. Your inquiry was delivered directly to',
  },
}

function validateClientFormData(formData: FormData, formKey: string): string | null {
  const read = (key: string) => String(formData.get(key) || '').trim()

  if (!read('name')) {
    return 'Please enter your full name before submitting.'
  }

  if (formKey === 'membership') {
    const phoneError = validatePhMobile(read('phone'))
    if (phoneError) return phoneError
    if (!read('membership')) return 'Please choose an interested membership plan.'
  }

  if (formKey === 'booking') {
    const phoneError = validatePhMobile(read('phone'))
    if (phoneError) return phoneError
    if (!read('service')) return 'Please select the coaching service you need.'
    if (!read('date')) return 'Please choose a preferred date from the calendar.'
    if (!read('time')) return 'Please choose a preferred time slot.'
  }

  if (formKey === 'contact' || formKey === 'contact-page') {
    const email = read('email')
    if (!email || !EMAIL_PATTERN.test(email)) {
      return 'Please enter a valid email address so we can reply to you.'
    }
    if (!read('message')) return 'Please enter your message or question.'
  }

  return null
}

/**
 * Validates and submits a form to /api/contact while displaying Presson-themed SweetAlert2 popups.
 */
export async function submitFormWithSweetAlert(
  form: HTMLFormElement,
  formKey: string,
): Promise<ContactSubmitResult> {
  const formData = new FormData(form)
  const validationError = validateClientFormData(formData, formKey)

  if (validationError) {
    await Swal.fire({
      ...PRESSON_SWAL_BASE,
      icon: 'warning',
      iconColor: '#C9A96A',
      title: 'Please Check the Form',
      text: validationError,
      confirmButtonText: 'Okay',
    })
    return { ok: false, message: validationError }
  }

  const copy = FORM_ALERT_COPY[formKey] || FORM_ALERT_COPY.contact

  void Swal.fire({
    ...PRESSON_SWAL_BASE,
    title: copy.loadingTitle,
    text: `Delivering your details to ${FORM_RECIPIENT_EMAIL}...`,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })

  const result = await submitContactForm(form)

  if (result.ok) {
    await Swal.fire({
      ...PRESSON_SWAL_BASE,
      icon: 'success',
      iconColor: '#C9A96A',
      title: copy.successTitle,
      html: `<p style="margin:0;line-height:1.6;color:#EDE9DD;">${escapeHtml(copy.successDetail)} <strong style="color:#C9A96A;">${escapeHtml(FORM_RECIPIENT_EMAIL)}</strong>.</p>`,
      confirmButtonText: 'Done',
    })
    return result
  }

  const errorMessage =
    result.message || 'Unable to submit right now. Please try again or call 0927 066 0386.'

  await Swal.fire({
    ...PRESSON_SWAL_BASE,
    icon: 'error',
    iconColor: '#ef4444',
    title: 'Unable to Send',
    text: errorMessage,
    confirmButtonText: 'Close',
  })

  return { ok: false, message: errorMessage }
}

