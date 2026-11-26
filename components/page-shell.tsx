'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScrollReveal } from '@/components/scroll-effects'
import { SiteSidebar, type SidebarNavItem } from '@/components/site-sidebar'

const innerNavLinks: SidebarNavItem[] = [
  { id: 'home', href: '/', label: 'Home' },
  { id: 'about', href: '/about', label: 'About Us' },
  { id: 'rates', href: '/#rates', label: 'Rates' },
  { id: 'services', href: '/services', label: 'Services' },
  { id: 'gallery', href: '/gallery', label: 'Gallery' },
  { id: 'contact', href: '/contact', label: 'Contact Us' },
]

export function PageShell({ eyebrow, title, copy, children }: { eyebrow: string; title: string; copy: string; children: React.ReactNode }) {
  const pathname = usePathname()
  useScrollReveal()

  return (
    <main className="app-shell">
      <SiteSidebar
        items={innerNavLinks}
        activeHref={pathname}
        ctaHref="/#join"
        ctaLabel="Join Now"
        useLinks
      />

      <div className="with-sidebar-main">
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
            <Link className="back-to-top" href="/">Back home ↑</Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
