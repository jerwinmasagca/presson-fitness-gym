'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const innerNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About us' },
  { href: '/#rates', label: 'Rates' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact us' },
]

export function PageShell({ eyebrow, title, copy, children }: { eyebrow: string; title: string; copy: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/">
          <img className="logo-image" src="/images/logo.png" alt="Presson Fitness Gym logo" />
          <span>PRESSON<span>FITNESS GYM</span></span>
        </Link>

        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <nav aria-label="Primary navigation" className={mobileMenuOpen ? 'nav-active' : ''}>
          {innerNavLinks.map((link) => {
            const isActive = link.href === pathname
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? 'nav-link-active' : ''}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
          <Link className="nav-cta" href="/#join" onClick={() => setMobileMenuOpen(false)}>
            Join now
          </Link>
        </nav>
      </header>

      <section className="page-hero container">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-intro">{copy}</p>
      </section>

      {children}

      <footer className="site-footer">
        <div className="container footer-inner">
          <Link className="brand" href="/">
            <img className="logo-image" src="/images/logo.png" alt="" />
            <span>PRESSON<span>FITNESS GYM</span></span>
          </Link>
          <p>© 2026 Presson Fitness Gym. Train harder. Live stronger.</p>
          <Link href="/">Back home ↑</Link>
        </div>
      </footer>
    </main>
  )
}
