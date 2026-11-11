'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Clock,
  Coffee,
  Droplets,
  Mail,
  MapPin,
  Phone,
  Wallet,
  Zap,
} from 'lucide-react'
import {
  DatePickerField,
  PhoneInputField,
  SelectField,
  TimePickerField,
  type SelectOption,
} from '@/components/form-controls'
import {
  CONTACT_API_ENDPOINT,
  FORM_RECIPIENT_EMAIL,
} from '@/lib/formsubmit'
import { submitFormWithSweetAlert } from '@/lib/swal'

const membershipPlanOptions: SelectOption[] = [
  {
    value: 'Daily Session (Regular: ₱65 / Student & Senior: ₱60)',
    label: 'Daily Session (Regular: ₱65 / Student & Senior: ₱60)',
  },
  {
    value: 'Monthly Session (Regular: ₱750 / Student & Senior: ₱700)',
    label: 'Monthly Session (Regular: ₱750 / Student & Senior: ₱700)',
  },
  {
    value: 'Quarterly 3-Months (Regular: ₱2,100 / Student: ₱1,900)',
    label: 'Quarterly 3-Months (Regular: ₱2,100 / Student: ₱1,900)',
  },
  {
    value: 'Annually 12-Months (Regular: ₱7,950 / Student & Senior: ₱7,100)',
    label: 'Annually 12-Months (Regular: ₱7,950 / Student & Senior: ₱7,100)',
  },
  {
    value: '1-on-1 Personal Training Package',
    label: '1-on-1 Personal Training Package',
  },
  {
    value: 'General Inquiry / Other',
    label: 'General Inquiry / Other',
  },
]

const bookingServiceOptions: SelectOption[] = [
  { value: '1-on-1 Personal Training', label: '1-on-1 Personal Training Assessment' },
  { value: 'Group Strength', label: 'Group Strength Session' },
  { value: 'Open Gym Trial', label: 'Open Gym Day Trial' },
]

const galleryItems = [
  {
    className: 'tile-one',
    tag: '01 • Facility',
    label: 'TRAIN',
    img: '/gallery/828554454_1096056716270076_7678644003964894617_n.png',
    title: 'Facility & Training Floor',
    desc: 'Heavy-duty dumbbell racks, multiple workout benches, dual cable pulley station, and signature hexagonal LED ceiling lights.',
  },
  {
    className: 'tile-two',
    tag: '02 • Coaching',
    label: 'STRENGTH',
    img: '/gallery/839167560_1104821698726911_999525515312939096_n.png',
    title: 'Strength & Form Coaching',
    desc: 'Hands-on spotting, form adjustments, and progressive dumbbell bench training with experienced coaches.',
  },
  {
    className: 'tile-three',
    tag: '03 • Community',
    label: 'COMMUNITY',
    img: '/gallery/839766751_1104821828726898_7443232933410309067_n.png',
    title: 'Gym Community & Equipment',
    desc: 'Leg curl and extension stations, pull-up/dip towers, cardio bikes, and the iconic Presson wall mural.',
  },
  {
    className: 'tile-four',
    tag: '04 • Equipment',
    label: 'EQUIPMENT',
    img: '/gallery/828554454_1096056716270076_7678644003964894617_n.png',
    title: 'Heavy Free Weights & Benches',
    desc: 'Full tiered dumbbell racks and incline/decline benches positioned for optimal training ergonomics.',
  },
  {
    className: 'tile-five',
    tag: '05 • Guidance',
    label: 'COACHING',
    img: '/gallery/839167560_1104821698726911_999525515312939096_n.png',
    title: 'Personal Training Sessions',
    desc: 'Every session is supervised to ensure safe execution, proper muscle recruitment, and progressive overload.',
  },
  {
    className: 'tile-six',
    tag: '06 • Culture',
    label: 'PRESS ON',
    img: '/gallery/839766751_1104821828726898_7443232933410309067_n.png',
    title: 'Presson Signature Space',
    desc: 'Designed for serious lifters and beginners alike — clean air, rubberized flooring, and positive training culture.',
  },
]

const quickSearchItems = [
  { title: 'Daily Session Pass', detail: 'Regular ₱65 · Student/Senior ₱60 (Unlimited 8am–10pm)', href: '#rates' },
  { title: 'Monthly Membership', detail: 'Regular ₱750 · Student/Senior ₱700 (+ Wi-Fi & Treadmill)', href: '#rates' },
  { title: 'Quarterly & Annual Plans', detail: '3 Months from ₱1,900 · 12 Months from ₱7,100', href: '#rates' },
  { title: 'Fuel & Refreshments', detail: 'Energy Drinks, Hydration, Fresh Coffee', href: '#products' },
  { title: 'Parking Location', detail: 'Right beside the Sports Court · Court parking for cars & motorcycles', href: '#contact' },
  { title: 'Accepted Payment Methods', detail: 'Cash, GCash, Maya, Bank Transfer (Credit/Debit cards not accepted)', href: '#faq' },
  { title: 'Personal Training & Coaching', detail: '1-on-1 Coaching, Group Strength, Coach Jerwin 0927 066 0386', href: '#services' },
  { title: 'Gym Equipment & Floor', detail: 'Free Weights, Power Racks, Cables, Treadmills, Wi-Fi', href: '#facility' },
  { title: 'Facility Photo Gallery', detail: 'View inside the Quezon City gym floor', href: '#gallery' },
]

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

function SectionHeading({ eyebrow, title, copy }: { eyebrow?: string; title: string; copy: string }) {
  return (
    <div className="section-heading">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  )
}

const navItems = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About Us', href: '#about' },
  { id: 'rates', label: 'Rates', href: '#rates' },
  { id: 'gallery', label: 'Gallery', href: '#gallery' },
  { id: 'contact', label: 'Contact Us', href: '#contact' },
] as const

type NavSectionId = (typeof navItems)[number]['id']

function mapHrefToNavSection(href: string): NavSectionId {
  switch (href) {
    case '#about':
    case '#products':
      return 'about'
    case '#rates':
    case '#join':
    case '#facility':
    case '#services':
      return 'rates'
    case '#gallery':
    case '#faq':
      return 'gallery'
    case '#contact':
      return 'contact'
    default:
      return 'home'
  }
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<NavSectionId>('home')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [membershipPhone, setMembershipPhone] = useState('')
  const [membershipStartDate, setMembershipStartDate] = useState('')
  const [bookingService, setBookingService] = useState('1-on-1 Personal Training')
  const [bookingPhone, setBookingPhone] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const scrollLockUntilRef = useRef<number>(0)
  const [formStatuses, setFormStatuses] = useState<{ [key: string]: 'idle' | 'submitting' | 'success' | 'error' }>({
    membership: 'idle',
    booking: 'idle',
    contact: 'idle',
  })
  const [formMessages, setFormMessages] = useState<{ [key: string]: string }>({
    membership: '',
    booking: '',
    contact: '',
  })
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    const updateActiveFromScroll = () => {
      if (Date.now() < scrollLockUntilRef.current) return

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
        setActiveSection('contact')
        return
      }

      const scrollPos = window.scrollY + 140
      let current: NavSectionId = 'home'
      for (const item of navItems) {
        const el = document.getElementById(item.id)
        if (el && scrollPos >= el.offsetTop) {
          current = item.id
        }
      }
      setActiveSection(current)
    }

    if (window.location.hash) {
      setActiveSection(mapHrefToNavSection(window.location.hash))
    } else {
      updateActiveFromScroll()
    }

    window.addEventListener('scroll', updateActiveFromScroll, { passive: true })
    return () => window.removeEventListener('scroll', updateActiveFromScroll)
  }, [])

  useEffect(() => {
    if (!searchOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [searchOpen])

  const filteredSearchItems = quickSearchItems.filter(item => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return item.title.toLowerCase().includes(q) || item.detail.toLowerCase().includes(q)
  })

  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') {
        setLightboxIndex(prev => (prev === null ? null : (prev - 1 + galleryItems.length) % galleryItems.length))
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex(prev => (prev === null ? null : (prev + 1) % galleryItems.length))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex])

  const closeMenu = () => setMobileMenuOpen(false)

  const handleNavClick = (id: NavSectionId) => {
    scrollLockUntilRef.current = Date.now() + 750
    setActiveSection(id)
    setMobileMenuOpen(false)
  }

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan)
    scrollLockUntilRef.current = Date.now() + 750
    setActiveSection('rates')
    if (typeof document !== 'undefined') {
      const joinEl = document.getElementById('join')
      if (joinEl) {
        joinEl.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>, formKey: string) => {
    e.preventDefault()
    setFormStatuses(prev => ({ ...prev, [formKey]: 'submitting' }))
    setFormMessages(prev => ({ ...prev, [formKey]: '' }))
    const form = e.currentTarget
    const result = await submitFormWithSweetAlert(form, formKey)

    if (result.ok) {
      setFormStatuses(prev => ({ ...prev, [formKey]: 'success' }))
      setFormMessages(prev => ({ ...prev, [formKey]: '' }))
      form.reset()
      if (formKey === 'membership') {
        setSelectedPlan('')
        setMembershipPhone('')
        setMembershipStartDate('')
      }
      if (formKey === 'booking') {
        setBookingService('1-on-1 Personal Training')
        setBookingPhone('')
        setBookingDate('')
        setBookingTime('')
      }
      return
    }

    setFormStatuses(prev => ({ ...prev, [formKey]: 'error' }))
    setFormMessages(prev => ({ ...prev, [formKey]: result.message }))
  }

  return (
    <main>
      {/* Sticky Header Navigation */}
      <header className="site-header">
        <a
          className="brand"
          href="#home"
          aria-label="Presson Fitness Gym home"
          onClick={() => handleNavClick('home')}
        >
          <img className="logo-image" src="/images/logo.png" alt="Presson Fitness Gym logo" />
          <span>PRESSON<span>FITNESS GYM</span></span>
        </a>

        <div className="header-mobile-actions">
          <button
            type="button"
            className="nav-search-btn mobile-search-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label="Search rates, parking, or services"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="20" y1="20" x2="16.2" y2="16.2" />
            </svg>
          </button>

          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav aria-label="Primary navigation" className={mobileMenuOpen ? 'nav-active' : ''}>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={activeSection === item.id ? 'nav-link-active' : ''}
              aria-current={activeSection === item.id ? 'location' : undefined}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </a>
          ))}

          <button
            type="button"
            className="nav-search-btn desktop-search-trigger"
            onClick={() => {
              closeMenu()
              setSearchOpen(true)
            }}
            aria-label="Search rates, parking, or services"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="20" y1="20" x2="16.2" y2="16.2" />
            </svg>
          </button>

          <a className="nav-cta" href="#join" onClick={() => handleNavClick('rates')}>Join Now</a>
        </nav>
      </header>

      {/* Quick Search Modal */}
      {searchOpen && (
        <div
          className="search-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Search Presson Fitness Gym"
          onClick={() => setSearchOpen(false)}
        >
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-head">
              <input
                type="search"
                className="search-modal-input"
                placeholder="Search rates, student discount, parking, GCash, coaching..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className="search-modal-close"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="search-modal-results">
              {filteredSearchItems.length > 0 ? (
                filteredSearchItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    className="search-result-row"
                    onClick={() => {
                      setSearchOpen(false)
                      handleNavClick(mapHrefToNavSection(item.href))
                    }}
                  >
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </a>
                ))
              ) : (
                <p className="search-empty">No matches found. Try searching &ldquo;rates&rdquo;, &ldquo;parking&rdquo;, or &ldquo;coffee&rdquo;.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-banner" id="home" aria-label="Train harder, live stronger at Presson Fitness Gym">
        <img
          src="/images/hero-athlete.jpg"
          alt="Muscular bearded Presson Fitness Gym athlete illustration"
          className="hero-athlete-art"
        />
        <div className="container hero-banner-inner">
          <div className="hero-banner-copy">
            <h1>
              TRAIN HARDER.<br />
              <em>LIVE STRONGER.</em>
            </h1>
            <p className="hero-intro">
              Build your goals with the right energy, refreshing drinks, and a supportive community.
            </p>
            <div className="hero-actions">
              <a className="button button-gold hero-join-btn" href="#join">
                JOIN NOW <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gym Values Ticker */}
      <section className="ticker" aria-label="Gym values">
        <span>DISCIPLINE</span><b>+</b><span>POWER</span><b>+</b><span>PROGRESS</span><b>+</b><span>COMMUNITY</span>
      </section>

      {/* About Us Section */}
      <section className="intro-section container" id="about">
        <div>
          <SectionHeading
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

      {/* Fuel & Refreshments (Original Dark Band) */}
      <section className="dark-band" id="products">
        <div className="container split-section">
          <SectionHeading
            title="Fuel your session."
            copy="Stay sharp between sets with our hand-picked on-site range of pre-workout energy, electrolytes, and cold brew."
          />
          <div className="product-grid">
            <div className="product-card">
              <span className="product-icon">
                <Zap size={34} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3>Energy Drinks</h3>
              <p>Pre-workouts and clean caffeine to ignite your heavy lifts.</p>
            </div>
            <div className="product-card">
              <span className="product-icon">
                <Droplets size={34} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3>Hydration</h3>
              <p>Ice-cold electrolyte water & hydration blends to keep cramps away.</p>
            </div>
            <div className="product-card">
              <span className="product-icon">
                <Coffee size={34} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3>Fresh Coffee</h3>
              <p>Locally sourced robust roast to fuel your morning training grind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rates & Membership Pricing Section */}
      <section className="rates-section container" id="rates">
        <SectionHeading
          title="Simple, Transparent Pricing."
          copy="No hidden maintenance fees. No locked contracts. Pick the plan that fits your training schedule and goals."
        />
        <div className="pricing-grid">
          {/* Card 1: Daily Session */}
          <div className="pricing-card">
            <span className="tier-badge">Day Pass / Walk-In</span>
            <h3>Daily Session</h3>
            <div className="price-tag">
              <span className="currency">₱</span>
              <span className="amount">65</span>
              <span className="period">/ session</span>
            </div>
            <span className="student-price">Student / Senior: ₱60</span>
            <p className="tier-desc">Flexible walk-in session for athletes, travelers, or testing the floor.</p>
            <ul className="tier-features">
              <li>Unlimited session from 8:00 AM – 10:00 PM</li>
              <li>Free filtered cold / hot water</li>
              <li>Full floor access to all free weights & machines</li>
            </ul>
            <button
              type="button"
              className="button button-outline tier-select-btn"
              onClick={() => handleSelectPlan('Daily Session (Regular: ₱65 / Student & Senior: ₱60)')}
            >
              Select Day Pass ↗
            </button>
          </div>

          {/* Card 2: Monthly Session (Featured) */}
          <div className="pricing-card featured-pricing">
            <span className="tier-badge highlight-badge">★ Most Popular / Best Value</span>
            <h3>Monthly Session</h3>
            <div className="price-tag">
              <span className="currency">₱</span>
              <span className="amount">750</span>
              <span className="period">/ month</span>
            </div>
            <span className="student-price">Student / Senior: ₱700</span>
            <p className="tier-desc">Our signature unlimited training membership for consistent lifters.</p>
            <ul className="tier-features">
              <li>Unlimited session from 8:00 AM – 10:00 PM</li>
              <li>Free filtered cold / hot water</li>
              <li>Unlimited Wi-Fi access</li>
              <li>Unlimited treadmill & cardio access</li>
              <li>Coaches on duty for spotting & form safety</li>
            </ul>
            <button
              type="button"
              className="button button-gold tier-select-btn"
              onClick={() => handleSelectPlan('Monthly Session (Regular: ₱750 / Student & Senior: ₱700)')}
            >
              Select Monthly ↗
            </button>
          </div>

          {/* Card 3: Quarterly (3 Months) */}
          <div className="pricing-card">
            <span className="tier-badge">3-Month Commitment</span>
            <h3>Quarterly</h3>
            <div className="price-tag">
              <span className="currency">₱</span>
              <span className="amount">2,100</span>
              <span className="period">/ 3 months</span>
            </div>
            <span className="student-price">Student / Senior: ₱1,900</span>
            <p className="tier-desc">90 days of locked-in progress plus official Press On workout gear.</p>
            <ul className="tier-features">
              <li>Unlimited session from 8:00 AM – 10:00 PM</li>
              <li>Free filtered cold / hot water</li>
              <li>Unlimited Wi-Fi access</li>
              <li>Unlimited treadmill & cardio access</li>
              <li>Official Press On workout tee included</li>
            </ul>
            <button
              type="button"
              className="button button-outline tier-select-btn"
              onClick={() => handleSelectPlan('Quarterly 3-Months (Regular: ₱2,100 / Student: ₱1,900)')}
            >
              Select Quarterly ↗
            </button>
          </div>

          {/* Card 4: Annually (12 Months) */}
          <div className="pricing-card">
            <span className="tier-badge">VIP Dedication</span>
            <h3>Annually</h3>
            <div className="price-tag">
              <span className="currency">₱</span>
              <span className="amount">7,950</span>
              <span className="period">/ year</span>
            </div>
            <span className="student-price">Student / Senior: ₱7,100</span>
            <p className="tier-desc">Full 365 days of dedication with maximum savings and exclusive athlete perks.</p>
            <ul className="tier-features">
              <li>Unlimited session from 8:00 AM – 10:00 PM</li>
              <li>Free filtered cold / hot water</li>
              <li>Unlimited Wi-Fi access</li>
              <li>Unlimited treadmill & cardio access</li>
              <li>2 Official Press On workout tees</li>
              <li>2 Free guest passes for gym buddies</li>
            </ul>
            <button
              type="button"
              className="button button-outline tier-select-btn"
              onClick={() => handleSelectPlan('Annually 12-Months (Regular: ₱7,950 / Student & Senior: ₱7,100)')}
            >
              Select Annual ↗
            </button>
          </div>
        </div>
      </section>

      {/* 04 — Start Your Membership / Inquiries (Form A + Direct Coach CTA) */}
      <section className="container form-section" id="join">
        <div className="form-intro">
          <SectionHeading
            title="Start Your Membership."
            copy={`Fill out the quick form below. Inquire about daily walk-ins, monthly memberships, student discounts, or personal training packages. Submissions go straight to ${FORM_RECIPIENT_EMAIL} and our coaches will confirm your slot.`}
          />

          <div className="direct-coach-card">
            <h4>Prefer to talk to the coach first?</h4>
            <p>Have questions about injuries, workout programs, or rates? Talk directly with our head coach or gym owner:</p>
            <div className="coach-contact-actions">
              <a href="tel:+639270660386" className="coach-btn call-btn">
                <Phone size={15} strokeWidth={2.1} aria-hidden="true" />
                <span>Call (0927 066 0386)</span>
              </a>
              <a href="mailto:carlvine0926@gmail.com" className="coach-btn email-btn">
                <Mail size={15} strokeWidth={2.1} aria-hidden="true" />
                <span>Email Coach</span>
              </a>
            </div>
          </div>
        </div>

        {/* Form A */}
        <form className="styled-form" action={CONTACT_API_ENDPOINT} method="POST" noValidate onSubmit={(e) => handleFormSubmit(e, 'membership')}>
          <input type="hidden" name="form_type" value="membership" />
          <Field label="Full Name *" name="name" placeholder="Juan dela Cruz" />
          <PhoneInputField
            label="Phone / Mobile Number *"
            name="phone"
            value={membershipPhone}
            onChange={setMembershipPhone}
            placeholder="09270660386"
          />
          <SelectField
            label="Interested Membership Plan *"
            name="membership"
            value={selectedPlan}
            onChange={setSelectedPlan}
            options={membershipPlanOptions}
            placeholder="Choose a membership option"
            required
            variant="light"
          />
          <DatePickerField
            label="Target Start Date"
            name="start_date"
            value={membershipStartDate}
            onChange={setMembershipStartDate}
            placeholder="Click to choose date"
            variant="light"
          />
          <button
            className="button button-dark"
            type="submit"
            disabled={formStatuses.membership === 'submitting'}
          >
            {formStatuses.membership === 'submitting' ? 'Sending Details...' : 'Inquire Now & Submit ↗'}
          </button>

          {formStatuses.membership === 'success' && (
            <div className="form-feedback success">
              <span><strong>✓ Form sent successfully!</strong> Your details have been delivered directly to <strong>{FORM_RECIPIENT_EMAIL}</strong>. Coach will reach out via SMS or Phone Call shortly.</span>
            </div>
          )}

          {formStatuses.membership === 'error' && (
            <div className="form-feedback error">
              <span><strong>Notice:</strong> {formMessages.membership || 'Unable to submit right now. Please try again or reach out directly at 0927 066 0386.'}</span>
            </div>
          )}

          <p className="form-disclaimer">
            All details sent directly to <strong>{FORM_RECIPIENT_EMAIL}</strong>. We confirm via SMS or Phone Call within 2 business hours.
            <br />
            <strong>Payments Accepted:</strong> Cash &amp; Online (GCash, Maya, Bank Transfer) &middot; <em>No cards accepted</em>
          </p>
        </form>
      </section>

      {/* 04 — Facility & Gear (Information Hub) */}
      <section className="facility-section" id="facility">
        <div className="container">
          <div className="section-center-heading">
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
                <Phone size={15} strokeWidth={2.1} aria-hidden="true" />
                <span>Call / Text Coach: 0927 066 0386 &rarr;</span>
              </a>
            </div>
          </div>

          {/* Form B */}
          <form className="styled-form dark-form" action={CONTACT_API_ENDPOINT} method="POST" noValidate onSubmit={(e) => handleFormSubmit(e, 'booking')}>
            <input type="hidden" name="form_type" value="booking" />
            <h3 className="form-title">Reserve a Coaching Slot</h3>
            <Field label="Full Name *" name="name" placeholder="Juan dela Cruz" />
            <PhoneInputField
              label="Phone Number *"
              name="phone"
              value={bookingPhone}
              onChange={setBookingPhone}
              placeholder="09270660386"
            />
            <SelectField
              label="Service Required *"
              name="service"
              value={bookingService}
              onChange={setBookingService}
              options={bookingServiceOptions}
              placeholder="Choose a service"
              required
              variant="dark"
            />
            <div className="two-fields">
              <DatePickerField
                label="Preferred Date *"
                name="date"
                value={bookingDate}
                onChange={setBookingDate}
                placeholder="Choose a date"
                required
                variant="dark"
              />
              <TimePickerField
                label="Preferred Time *"
                name="time"
                value={bookingTime}
                onChange={setBookingTime}
                placeholder="Choose time"
                required
                variant="dark"
              />
            </div>
            <button
              className="button button-gold"
              type="submit"
              disabled={formStatuses.booking === 'submitting'}
            >
              {formStatuses.booking === 'submitting' ? 'Sending Slot Request...' : 'Book Online & Confirm ↗'}
            </button>

            {formStatuses.booking === 'success' && (
              <div className="form-feedback success">
                <span><strong>✓ Session request sent!</strong> Your details have been emailed directly to <strong>{FORM_RECIPIENT_EMAIL}</strong>. Coach will reach out via SMS or Phone Call to confirm your schedule.</span>
              </div>
            )}

            {formStatuses.booking === 'error' && (
              <div className="form-feedback error">
                <span><strong>Notice:</strong> {formMessages.booking || 'Unable to submit right now. Please try again or reach out directly at 0927 066 0386.'}</span>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* 07 — Gallery / Portfolio (6-tile Grid matching wireframe) */}
      <section className="gallery-section container" id="gallery">
        <div className="gallery-title">
          <SectionHeading
            title="Come as you are. Leave stronger."
            copy="Take a look inside our Quezon City facility, the equipment racks, and the athlete community."
          />
          <a className="gallery-cta-link" href="#services">
            Book a Tour / Session <span>→</span>
          </a>
        </div>
        <div className="gallery-grid-6">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className={`gallery-tile ${item.className}`}
              tabIndex={0}
              role="button"
              aria-label={`View ${item.title}`}
              onClick={() => setLightboxIndex(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setLightboxIndex(idx)
                }
              }}
            >
              <div className="tile-content">
                <span className="tile-tag">{item.tag}</span>
                <span className="tile-label">{item.label}</span>
                <span className="tile-hint">Click to enlarge ↗</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="gallery-lightbox active"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery Image Preview"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close-btn"
              aria-label="Close preview"
              onClick={() => setLightboxIndex(null)}
            >
              &times;
            </button>
            <button
              className="lightbox-nav-btn lightbox-prev-btn"
              aria-label="Previous image"
              onClick={() =>
                setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length)
              }
            >
              &#8592;
            </button>
            <div className="lightbox-img-wrapper">
              <img
                className="lightbox-img"
                src={galleryItems[lightboxIndex].img}
                alt={galleryItems[lightboxIndex].title}
              />
            </div>
            <button
              className="lightbox-nav-btn lightbox-next-btn"
              aria-label="Next image"
              onClick={() => setLightboxIndex((lightboxIndex + 1) % galleryItems.length)}
            >
              &#8594;
            </button>
            <div className="lightbox-caption-box">
              <h3 className="lightbox-title">{galleryItems[lightboxIndex].title}</h3>
              <p className="lightbox-desc">{galleryItems[lightboxIndex].desc}</p>
              <div className="lightbox-counter">
                {lightboxIndex + 1} / {galleryItems.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 08 — Frequently Asked Questions */}
      <section className="faq-section" id="faq">
        <div className="container faq-container">
          <div className="section-center-heading">
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
                <p>Yes! The gym is located right beside the sports court / parking area, which is where we recommend all members and visitors park. There is convenient space for both motorcycles and cars while you train.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>What payment methods do you accept?</summary>
              <div className="faq-answer">
                <p>We accept <strong>Cash</strong> and <strong>Online Payments</strong> (GCash, Maya, and Bank Transfer / QR Ph) at the front desk. Please note that we <strong>do not accept credit or debit cards</strong> at this time.</p>
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
              title="Let’s Get To Work."
              copy="Questions about partnerships, group bookings, or rates? Send us an inquiry or visit us directly."
            />
            <div className="contact-info-block">
              <div className="info-item">
                <span className="info-icon">
                  <MapPin size={20} strokeWidth={1.85} aria-hidden="true" />
                </span>
                <div>
                  <strong>Location & Address</strong>
                  <p>123 Fitness Avenue, Quezon City, Philippines</p>
                  <small className="info-hint">(Right beside the Sports Court &middot; Court Parking for Cars &amp; Motorcycles)</small>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">
                  <Wallet size={20} strokeWidth={1.85} aria-hidden="true" />
                </span>
                <div>
                  <strong>Accepted Payment Methods</strong>
                  <p>Cash &middot; GCash &middot; Maya &middot; Bank Transfer</p>
                  <small className="info-hint">(Card payments not accepted)</small>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">
                  <Mail size={20} strokeWidth={1.85} aria-hidden="true" />
                </span>
                <div>
                  <strong>Email Address</strong>
                  <p><a href="mailto:carlvine0926@gmail.com">carlvine0926@gmail.com</a></p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">
                  <Phone size={20} strokeWidth={1.85} aria-hidden="true" />
                </span>
                <div>
                  <strong>Coach Phone & Mobile</strong>
                  <p><a href="tel:+639270660386">0927 066 0386</a></p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">
                  <Clock size={20} strokeWidth={1.85} aria-hidden="true" />
                </span>
                <div>
                  <strong>Operating Schedule</strong>
                  <p>Monday — Sunday · 8:00 AM — 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form C */}
          <form className="styled-form" action={CONTACT_API_ENDPOINT} method="POST" noValidate onSubmit={(e) => handleFormSubmit(e, 'contact')}>
            <input type="hidden" name="form_type" value="contact" />
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
              {formStatuses.contact === 'submitting' ? 'Sending Message...' : 'Send Message ↗'}
            </button>

            {formStatuses.contact === 'success' && (
              <div className="form-feedback success">
                <span><strong>✓ Message sent!</strong> Your inquiry has been delivered directly to <strong>{FORM_RECIPIENT_EMAIL}</strong>. We will reply via email/phone promptly.</span>
              </div>
            )}

            {formStatuses.contact === 'error' && (
              <div className="form-feedback error">
                <span><strong>Notice:</strong> {formMessages.contact || 'Unable to submit right now. Please try again or reach out directly at 0927 066 0386.'}</span>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Site Footer */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <a className="brand" href="#home">
            <img className="logo-image" src="/images/logo.png" alt="Presson Fitness Gym logo" />
            <span>PRESSON<span>FITNESS GYM</span></span>
          </a>
          <p>© 2026 Presson Fitness Gym. Train harder. Live stronger.</p>
          <a className="back-to-top" href="#home">Back to top ↑</a>
        </div>
      </footer>

      {/* Sticky Mobile Bottom CTA Bar */}
      <div className="mobile-bottom-bar">
        <a href="tel:+639270660386" className="mobile-bar-btn call-btn-mobile">
          <Phone size={15} strokeWidth={2.1} aria-hidden="true" />
          <span>Call Coach</span>
        </a>
        <a href="#services" className="mobile-bar-btn book-btn">
          <Zap size={15} strokeWidth={2.1} aria-hidden="true" />
          <span>Book Session</span>
        </a>
      </div>
    </main>
  )
}
