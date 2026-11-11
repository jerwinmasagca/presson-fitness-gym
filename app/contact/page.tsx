'use client'

import React, { useState } from 'react'
import { PageShell } from '@/components/page-shell'
import {
  CONTACT_API_ENDPOINT,
  FORM_RECIPIENT_EMAIL,
  GYM_CONTACT_EMAIL,
  submitContactForm,
} from '@/lib/formsubmit'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setMessage('')
    const form = e.currentTarget
    const result = await submitContactForm(form)

    if (result.ok) {
      setStatus('success')
      form.reset()
      return
    }

    setStatus('error')
    setMessage(result.message)
  }

  return (
    <PageShell
      eyebrow="04 — Contact us"
      title="Let’s get to work."
      copy="Questions, group bookings, or just want to say hey? Drop us a note and we will get back to you."
    >
      <section className="container contact-page-grid">
        <div className="contact-detail large-contact">
          <strong>123 Fitness Avenue</strong>
          <br />
          Quezon City, Philippines
          <br />
          <small style={{ color: '#c9a96a' }}>(Right beside the Sports Court · Court parking available)</small>
          <br />
          <br />
          <strong>Contact:</strong>
          <br />
          {GYM_CONTACT_EMAIL}
          <br />
          0927 066 0386
          <br />
          <br />
          <strong>Operating Hours:</strong>
          <br />
          Mon — Sun · 8:00 AM — 10:00 PM
          <br />
          <br />
          <strong>Payments Accepted:</strong>
          <br />
          Cash &amp; Online (GCash, Maya, Bank Transfer)
          <br />
          <small style={{ color: '#aaa' }}>*Cards not accepted</small>
        </div>

        <form className="styled-form" action={CONTACT_API_ENDPOINT} method="POST" onSubmit={handleSubmit}>
          <input type="hidden" name="form_type" value="contact-page" />
          <Field label="Full name" name="name" />
          <Field label="Email address" name="email" type="email" />
          <label className="field">
            <span>Message</span>
            <textarea name="message" rows={6} required />
          </label>
          <button className="button button-gold" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending Inquiry... ⏳' : <>Send inquiry <span>→</span></>}
          </button>

          {status === 'success' && (
            <div className="form-feedback success">
              <span>
                <strong>✓ Inquiry sent!</strong> Your message has been delivered directly to{' '}
                <strong>{FORM_RECIPIENT_EMAIL}</strong>.
              </span>
            </div>
          )}

          {status === 'error' && (
            <div className="form-feedback error">
              <span>
                <strong>Notice:</strong>{' '}
                {message || 'Unable to submit right now. Please try again or reach out at 0927 066 0386.'}
              </span>
            </div>
          )}
        </form>
      </section>
    </PageShell>
  )
}

function Field({ label, name, type = 'text' }: { label: string; name: string; type?: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} type={type} required />
    </label>
  )
}
