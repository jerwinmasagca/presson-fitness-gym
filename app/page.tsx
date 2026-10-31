'use client'

import React, { useState } from 'react'

const formAction = 'https://formsubmit.co/carlvine0926@gmail.com'

function Field({
  label,
  name,
  type = 'text',
  required = true,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} />
    </label>
  )
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  )
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [formStatuses, setFormStatuses] = useState<{ [key: string]: 'idle' | 'submitting' | 'success' | 'error' }>({
    membership: 'idle',
    booking: 'idle',
    contact: 'idle',
  })

  const closeMenu = () => setMobileMenuOpen(false)

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan)
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>, formKey: string) => {
    e.preventDefault()
    setFormStatuses(prev => ({ ...prev, [formKey]: 'submitting' }))
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch(formAction, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (res.ok) {
        setFormStatuses(prev => ({ ...prev, [formKey]: 'success' }))
        form.reset()
      } else {
        form.submit()
      }
    } catch (err) {
      console.error('Submission error:', err)
      form.submit()
    }
  }

  return (
    <main>
      {/* Sticky Header Navigation */}
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Presson Fitness Gym home">
          <img className="logo-image" src="/images/presson-logo.png" alt="Presson Fitness Gym logo" />
          <span>PRESSON<span>FITNESS GYM</span></span>
        </a>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Menu */}
        <nav aria-label="Primary navigation" className={mobileMenuOpen ? 'nav-active' : ''}>
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#about" onClick={closeMenu}>About Us</a>
          <a href="#facility" onClick={closeMenu}>Facility</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#faq" onClick={closeMenu}>FAQs</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          <a className="nav-cta" href="#join" onClick={closeMenu}>Join / Inquire</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">Presson Fitness Gym &middot; Quezon City</p>
          <h1>Train harder.<br /><em>Live stronger.</em></h1>
          <p className="hero-intro">
            A dedicated training floor built with heavy iron, certified coaching, cold hydration, and an authentic community.
          </p>
          <div className="hero-actions">
            <a className="button button-gold" href="#join">
              Join now <span>→</span>
            </a>
            <a className="button button-outline" href="#services">
              Book a Session <span>↓</span>
            </a>
          </div>
          <div className="hero-coach-chip">
            <span className="chip-dot"></span>
            <span>
              Coaches On Duty &middot;{' '}
              <a href="tel:+639270660386">
                Call Coach: 0927 066 0386 &rarr;
              </a>
            </span>
          </div>
        </div>
        <div className="hero-art" aria-label="Athlete training at Presson Fitness Gym">
          <div className="sun-disc" />
          <div className="hero-word">PRESS<br /><span>ON</span></div>
          <div className="art-caption">01 / TRAIN WITH PURPOSE</div>
          <div className="art-line" />
        </div>
      </section>

      {/* Gym Values Ticker */}
      <section className="ticker" aria-label="Gym values">
        <span>DISCIPLINE</span><b>+</b><span>POWER</span><b>+</b><span>PROGRESS</span><b>+</b><span>COMMUNITY</span>
      </section>

      {/* 01 — About Us Section */}
      <section className="intro-section container" id="about">
        <div>
          <SectionHeading
            eyebrow="01 — About Us"
            title="Built for the work."
            copy="Presson Fitness Gym is built for people who want to be stronger, healthier, and more disciplined. We provide a clean and motivating space with the right equipment, refreshing drinks, and a supportive community."
          />
          <div className="about-cta-wrap">
            <a className="button button-dark" href="#rates">
              View Rates & Memberships <span>→</span>
            </a>
          </div>
        </div>
        <div className="principles">
          <article>
            <span>01</span>
            <h3>Show up</h3>
            <p>Consistency beats intensity. We help you make training part of your daily routine and life.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Push further</h3>
            <p>Progress starts where comfort ends. Find your breakthrough and your next level with us.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Stay ready</h3>
            <p>Train, fuel, recover, repeat. Everything you need under one roof to perform at your peak.</p>
          </article>
        </div>
      </section>

      {/* 02 — Products / What We Offer */}
      <section className="dark-band" id="products">
        <div className="container split-section">
          <SectionHeading
            eyebrow="02 — What We Offer"
            title="Fuel your session."
            copy="Stay sharp between sets with our hand-picked on-site range of pre-workout energy, electrolytes, and cold brew."
          />
          <div className="product-grid">
            <div className="product-card">
              <span className="product-icon">⚡</span>
              <h3>Energy Drinks</h3>
              <p>Pre-workouts and clean caffeine to ignite your heavy lifts.</p>
            </div>
            <div className="product-card">
              <span className="product-icon">💧</span>
              <h3>Hydration</h3>
              <p>Ice-cold electrolyte water & hydration blends to keep cramps away.</p>
            </div>
            <div className="product-card">
              <span className="product-icon">☕</span>
              <h3>Fresh Coffee</h3>
              <p>Locally sourced robust roast to fuel your morning training grind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Start Your Membership / Inquiries (Form A + Direct Coach CTA) */}
      <section className="container form-section" id="join">
        <div className="form-intro">
          <SectionHeading
            eyebrow="03 — Membership & Inquiries"
            title="Start Your Membership."
            copy="Fill out the quick form below. Inquire about daily walk-ins, monthly memberships, student discounts, or personal training packages. Submissions go straight to carlvine0926@gmail.com and our coaches will confirm your slot."
          />

          <div className="direct-coach-card">
            <h4>Prefer to talk to the coach first?</h4>
            <p>Have questions about injuries, workout programs, or rates? Talk directly with our head coach or gym owner:</p>
            <div className="coach-contact-actions">
              <a href="tel:+639270660386" className="coach-btn call-btn">
                📞 Call (0927 066 0386)
              </a>
              <a href="mailto:carlvine0926@gmail.com" className="coach-btn email-btn">
                ✉️ Email Coach
              </a>
            </div>
          </div>
        </div>

        {/* Form A */}
        <form className="styled-form" onSubmit={(e) => handleFormSubmit(e, 'membership')}>
          <input type="hidden" name="_subject" value="🏋️ New Membership Registration - Presson Fitness Gym" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="form_name" value="Start Your Membership (Form A)" />
          <Field label="Full Name *" name="name" placeholder="Juan dela Cruz" />
          <Field label="Phone / Mobile Number *" name="phone" type="tel" placeholder="0927 066 0386" />
          <label className="field">
            <span>Interested Membership Plan *</span>
            <select
              name="membership"
              required
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option value="" disabled>Choose a membership option</option>
              <option value="Daily Session / Day Pass">Daily Session / Day Pass</option>
              <option value="Monthly Membership (Regular)">Monthly Membership (Regular)</option>
              <option value="Student / Senior Monthly Membership">Student / Senior Monthly Membership</option>
              <option value="Quarterly Membership (3 Months)">Quarterly Membership (3 Months)</option>
              <option value="Annual Membership (12 Months)">Annual Membership (12 Months)</option>
              <option value="1-on-1 Personal Training Package">1-on-1 Personal Training Package</option>
              <option value="General Inquiry / Current Promos">General Inquiry / Current Promos</option>
            </select>
          </label>
          <label className="field">
            <span>Target Start Date</span>
            <input type="date" name="start_date" />
          </label>
          <button
            className="button button-dark"
            type="submit"
            disabled={formStatuses.membership === 'submitting'}
          >
            {formStatuses.membership === 'submitting' ? 'Sending Details... ⏳' : 'Inquire Now & Submit ↗'}
          </button>

          {formStatuses.membership === 'success' && (
            <div className="form-feedback success">
              <strong>✓ Form sent successfully!</strong> Your details have been delivered directly to <strong>carlvine0926@gmail.com</strong>. Coach will reach out via SMS or Phone Call shortly.
            </div>
          )}

          <p className="form-disclaimer">
            All details sent directly to <strong>carlvine0926@gmail.com</strong>. We confirm via SMS or Phone Call within 2 business hours.
          </p>
        </form>
      </section>

      {/* 04 — Facility & Gear (Information Hub) */}
      <section className="facility-section" id="facility">
        <div className="container">
          <div className="section-center-heading">
            <p className="eyebrow">04 — Facility & Gear</p>
            <h2>The Equipment We Have Built For You</h2>
            <p>Everything you need for strength, hypertrophy, conditioning, and recovery. No queueing for benches.</p>
          </div>

          <div className="facility-grid">
            <div className="facility-card">
              <span className="facility-num">01</span>
              <h3>Heavy Free Weights</h3>
              <p>Commercial dumbbells spanning from 2.5kg all the way up to 50kg, multiple adjustable incline benches, and Olympic EZ bars.</p>
            </div>
            <div className="facility-card">
              <span className="facility-num">02</span>
              <h3>Power Racks & Platforms</h3>
              <p>Heavy-gauge steel power racks, competition Olympic barbells, calibrated bumper plates, chalk stations, and deadlift platforms.</p>
            </div>
            <div className="facility-card">
              <span className="facility-num">03</span>
              <h3>Cables & Isolation</h3>
              <p>Dual adjustable pulley systems, lat pulldowns, seated cable rows, leg press, hack squat, and plate-loaded hammer strength machines.</p>
            </div>
            <div className="facility-card">
              <span className="facility-num">04</span>
              <h3>Conditioning & Recovery</h3>
              <p>Concept2 rowers, SkiErgs, assault air bikes, turf sled track, private hot showers, and secure electronic lockers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — Services & Coaching (Form B + Direct Contact) */}
      <section className="service-section" id="services">
        <div className="container booking-layout">
          <div>
            <SectionHeading
              eyebrow="06 — Services & Coaching"
              title="Book Your Next Session."
              copy="Whether you want hands-on personal coaching to perfect your squat and deadlift, or want to join our high-energy group strength team."
            />
            <div className="service-list">
              <span>01 / 1-on-1 Personal Training (Custom Plan & Nutrition)</span>
              <span>02 / Group Strength & Conditioning</span>
              <span>03 / Open Gym Floor Access</span>
            </div>

            <div className="coach-callout">
              <p><strong>Want to talk to the trainer before booking?</strong></p>
              <p>Drop a quick question to Coach Jerwin directly:</p>
              <a href="tel:+639270660386" className="coach-call-link">
                📞 Call / Text Coach: 0927 066 0386 &rarr;
              </a>
            </div>
          </div>

          {/* Form B */}
          <form className="styled-form dark-form" onSubmit={(e) => handleFormSubmit(e, 'booking')}>
            <input type="hidden" name="_subject" value="⚡ New Coaching Slot Booking - Presson Fitness Gym" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="form_name" value="Book Your Next Session (Form B)" />
            <h3 className="form-title">Reserve a Coaching Slot</h3>
            <Field label="Full Name *" name="name" placeholder="Juan dela Cruz" />
            <Field label="Phone Number *" name="phone" type="tel" placeholder="0927 066 0386" />
            <label className="field">
              <span>Service Required *</span>
              <select name="service" required defaultValue="1-on-1 Personal Training">
                <option value="1-on-1 Personal Training">1-on-1 Personal Training Assessment</option>
                <option value="Group Strength">Group Strength Session</option>
                <option value="Open Gym Trial">Open Gym Day Trial</option>
              </select>
            </label>
            <div className="two-fields">
              <Field label="Preferred Date *" name="date" type="date" />
              <Field label="Preferred Time *" name="time" type="time" />
            </div>
            <button
              className="button button-gold"
              type="submit"
              disabled={formStatuses.booking === 'submitting'}
            >
              {formStatuses.booking === 'submitting' ? 'Sending Slot Request... ⏳' : 'Book Online & Confirm ↗'}
            </button>

            {formStatuses.booking === 'success' && (
              <div className="form-feedback success">
                <strong>✓ Session request sent!</strong> Your details have been emailed directly to <strong>carlvine0926@gmail.com</strong>. Coach will reach out via SMS or Phone Call to confirm your schedule.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* 07 — Gallery / Portfolio (6-tile Grid matching wireframe) */}
      <section className="gallery-section container" id="gallery">
        <div className="gallery-title">
          <SectionHeading
            eyebrow="07 — Gallery / The Space"
            title="Come as you are. Leave stronger."
            copy="Take a look inside our Quezon City facility, the equipment racks, and the athlete community."
          />
          <a className="gallery-cta-link" href="#services">
            Book a Tour / Session <span>→</span>
          </a>
        </div>
        <div className="gallery-grid-6">
          <div className="gallery-tile tile-one"><span>TRAIN</span></div>
          <div className="gallery-tile tile-two"><span>RECOVER</span></div>
          <div className="gallery-tile tile-three"><span>REPEAT</span></div>
          <div className="gallery-tile tile-four"><span>STRENGTH</span></div>
          <div className="gallery-tile tile-five"><span>COACHING</span></div>
          <div className="gallery-tile tile-six"><span>COMMUNITY</span></div>
        </div>
      </section>

      {/* 08 — Frequently Asked Questions */}
      <section className="faq-section" id="faq">
        <div className="container faq-container">
          <div className="section-center-heading">
            <p className="eyebrow">08 — Got Questions?</p>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know before stepping foot inside Presson Fitness Gym.</p>
          </div>

          <div className="faq-list">
            <details className="faq-item" open>
              <summary>Are beginners welcome at Presson Fitness Gym?</summary>
              <div className="faq-answer">
                <p>Yes, absolutely! While our gym has serious equipment for powerlifters and strength athletes, over 50% of our members started as complete beginners. Our on-duty coaches are always on the floor to teach proper form, spot your sets, and keep you safe.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>Do I need to book in advance before working out?</summary>
              <div className="faq-answer">
                <p>For open gym access and general workouts, no reservation is needed — you can walk in anytime during our operating hours (8:00 AM – 10:00 PM). For 1-on-1 personal training assessments, please reserve your preferred time via Form B above or by messaging our coach.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>What should I bring on my first visit?</summary>
              <div className="faq-answer">
                <p>Just bring clean training shoes (flat soles or cross-trainers recommended), comfortable workout clothes, and a valid photo ID. We provide free drinking water, clean showers, and secure lockers.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>Is there parking available on-site?</summary>
              <div className="faq-answer">
                <p>Yes, we offer free parking for cars and motorcycles directly in front of the gym along Fitness Avenue.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>What payment methods do you accept?</summary>
              <div className="faq-answer">
                <p>We accept Cash, GCash, Maya, Bank Transfer (BDO, BPI), and major Credit/Debit cards at our front desk.</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* 09 — Contact Us (Form C) */}
      <section className="contact-section" id="contact">
        <div className="container contact-layout">
          <div>
            <SectionHeading
              eyebrow="09 — Contact Us"
              title="Let’s Get To Work."
              copy="Questions about partnerships, group bookings, or rates? Send us an inquiry or visit us directly."
            />
            <div className="contact-info-block">
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <strong>Location & Address</strong>
                  <p>123 Fitness Avenue, Quezon City, Philippines</p>
                  <small className="info-hint">(Near City Center &middot; Free Parking on Premises)</small>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">✉️</span>
                <div>
                  <strong>Email Address</strong>
                  <p><a href="mailto:carlvine0926@gmail.com">carlvine0926@gmail.com</a></p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <strong>Coach Phone & Mobile</strong>
                  <p><a href="tel:+639270660386">0927 066 0386</a></p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⏰</span>
                <div>
                  <strong>Operating Schedule</strong>
                  <p>Monday — Sunday · 8:00 AM — 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form C */}
          <form className="styled-form" onSubmit={(e) => handleFormSubmit(e, 'contact')}>
            <input type="hidden" name="_subject" value="✉️ New Gym Inquiry - Presson Fitness Gym" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="form_name" value="Contact Us (Form C)" />
            <h3 className="form-title">Send Direct Inquiry</h3>
            <Field label="Full Name *" name="name" placeholder="Juan dela Cruz" />
            <Field label="Email Address *" name="email" type="email" placeholder="juan@example.com" />
            <label className="field">
              <span>Your Message or Question *</span>
              <textarea name="message" rows={4} required placeholder="Ask about training, group discounts, or anything else..." />
            </label>
            <button
              className="button button-gold"
              type="submit"
              disabled={formStatuses.contact === 'submitting'}
            >
              {formStatuses.contact === 'submitting' ? 'Sending Message... ⏳' : 'Send Message ↗'}
            </button>

            {formStatuses.contact === 'success' && (
              <div className="form-feedback success">
                <strong>✓ Message sent!</strong> Your inquiry has been delivered directly to <strong>carlvine0926@gmail.com</strong>. We will reply via email/phone promptly.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Site Footer */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <a className="brand" href="#home">
            <img className="logo-image" src="/images/presson-logo.png" alt="Presson Fitness Gym logo" />
            <span>PRESSON<span>FITNESS GYM</span></span>
          </a>
          <p>© 2026 Presson Fitness Gym. Train harder. Live stronger.</p>
          <a className="back-to-top" href="#home">Back to top ↑</a>
        </div>
      </footer>

      {/* Sticky Mobile Bottom CTA Bar */}
      <div className="mobile-bottom-bar">
        <a href="tel:+639270660386" className="mobile-bar-btn call-btn-mobile">
          📞 Call Coach
        </a>
        <a href="#services" className="mobile-bar-btn book-btn">
          ⚡ Book Session
        </a>
      </div>
    </main>
  )
}
