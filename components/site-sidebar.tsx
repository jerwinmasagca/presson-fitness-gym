'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Home,
  Images,
  Info,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Search,
  Sun,
  Tag,
  X,
} from 'lucide-react'
import { FacebookIcon } from '@/components/social-icons'
import { GYM_FACEBOOK_URL } from '@/lib/formsubmit'
import { ScrollProgressBar } from '@/components/scroll-effects'

export interface SidebarNavItem {
  id: string
  label: string
  href: string
}

interface SiteSidebarProps {
  items: readonly SidebarNavItem[]
  activeId?: string
  activeHref?: string
  ctaHref: string
  ctaLabel?: string
  useLinks?: boolean
  onNavClick?: (id: string) => void
  onOpenSearch?: () => void
}

function renderNavIcon(id: string) {
  switch (id) {
    case 'home':
      return <Home size={19} strokeWidth={2} aria-hidden="true" />
    case 'about':
      return <Info size={19} strokeWidth={2} aria-hidden="true" />
    case 'rates':
      return <Tag size={19} strokeWidth={2} aria-hidden="true" />
    case 'services':
      return <Dumbbell size={19} strokeWidth={2} aria-hidden="true" />
    case 'gallery':
      return <Images size={19} strokeWidth={2} aria-hidden="true" />
    case 'contact':
    default:
      return <Mail size={19} strokeWidth={2} aria-hidden="true" />
  }
}

/**
 * Collapsible dark-theme navigation sidebar (open by default on desktop with mini-rail toggle, slide-in drawer on mobile).
 */
export function SiteSidebar({
  items,
  activeId,
  activeHref,
  ctaHref,
  ctaLabel = 'Join Now',
  useLinks = false,
  onNavClick,
  onOpenSearch,
}: SiteSidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('presson-theme')
      const initial = saved === 'light' ? 'light' : 'dark'
      setTheme(initial)
      document.documentElement.setAttribute('data-theme', initial)
    } catch {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('presson-theme', next)
    } catch {
      // Ignore storage errors
    }
  }

  useEffect(() => {
    if (!drawerOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [drawerOpen])

  const closeDrawer = () => setDrawerOpen(false)

  const handleItemSelect = (id: string) => {
    closeDrawer()
    onNavClick?.(id)
  }

  return (
    <>
      {/* Mobile / Tablet Top Header Bar */}
      <header className="mobile-topbar">
        {useLinks ? (
          <Link className="brand" href="/" onClick={closeDrawer}>
            <img className="logo-image" src="/images/logo.png" alt="Presson Fitness Gym logo" />
            <span>PRESSON<span>FITNESS GYM</span></span>
          </Link>
        ) : (
          <a className="brand" href="#home" onClick={() => handleItemSelect('home')}>
            <img className="logo-image" src="/images/logo.png" alt="Presson Fitness Gym logo" />
            <span>PRESSON<span>FITNESS GYM</span></span>
          </a>
        )}

        <div className="mobile-topbar-actions">
          <button
            type="button"
            className="sidebar-icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={19} strokeWidth={2.1} /> : <Moon size={19} strokeWidth={2.1} />}
          </button>
          {onOpenSearch && (
            <button
              type="button"
              className="sidebar-icon-btn"
              onClick={() => {
                closeDrawer()
                onOpenSearch()
              }}
              aria-label="Search rates, parking, or services"
            >
              <Search size={20} strokeWidth={2.1} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="sidebar-icon-btn"
            onClick={() => setDrawerOpen((prev) => !prev)}
            aria-label={drawerOpen ? 'Close navigation sidebar' : 'Open navigation sidebar'}
            aria-expanded={drawerOpen}
          >
            {drawerOpen ? <X size={24} strokeWidth={2.1} /> : <Menu size={24} strokeWidth={2.1} />}
          </button>
        </div>
        <ScrollProgressBar />
      </header>

      {/* Mobile Drawer Backdrop */}
      {drawerOpen && (
        <div
          className="sidebar-backdrop"
          aria-hidden="true"
          onClick={closeDrawer}
        />
      )}

      {/* Collapsible Left Sidebar (Desktop) / Slide-in Drawer (Mobile) */}
      <aside
        className={`site-sidebar ${drawerOpen ? 'is-open' : ''} ${collapsed ? 'is-collapsed' : ''}`}
        aria-label="Sidebar navigation"
      >
        <div className="sidebar-top">
          {useLinks ? (
            <Link className="brand sidebar-brand" href="/" onClick={closeDrawer} title="Presson Fitness Gym">
              <img className="logo-image" src="/images/logo.png" alt="Presson Fitness Gym logo" />
              <span className="sidebar-brand-text">PRESSON<span>FITNESS GYM</span></span>
            </Link>
          ) : (
            <a className="brand sidebar-brand" href="#home" onClick={() => handleItemSelect('home')} title="Presson Fitness Gym">
              <img className="logo-image" src="/images/logo.png" alt="Presson Fitness Gym logo" />
              <span className="sidebar-brand-text">PRESSON<span>FITNESS GYM</span></span>
            </a>
          )}

          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={closeDrawer}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {onOpenSearch && (
          <button
            type="button"
            className="sidebar-search-btn"
            title="Quick Search"
            aria-label="Quick Search"
            onClick={() => {
              closeDrawer()
              onOpenSearch()
            }}
          >
            <span className="sidebar-search-left">
              <Search size={17} strokeWidth={2.2} aria-hidden="true" />
              <span className="sidebar-label">Quick Search...</span>
            </span>
            <kbd className="sidebar-search-kbd sidebar-label">/</kbd>
          </button>
        )}

        <div className="sidebar-nav-section">
          <span className="sidebar-section-label sidebar-label">Menu</span>
          <nav className="sidebar-nav" aria-label="Primary navigation">
          {items.map((item) => {
            const isActive = useLinks
              ? item.href === activeHref
              : activeId === item.id

            return useLinks ? (
              <Link
                key={item.id}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                className={`sidebar-link ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={closeDrawer}
              >
                <span className="sidebar-link-icon">{renderNavIcon(item.id)}</span>
                <span className="sidebar-label sidebar-link-text">{item.label}</span>
                {isActive && <span className="sidebar-active-dot sidebar-label" aria-hidden="true" />}
              </Link>
            ) : (
              <a
                key={item.id}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                className={`sidebar-link ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={() => handleItemSelect(item.id)}
              >
                <span className="sidebar-link-icon">{renderNavIcon(item.id)}</span>
                <span className="sidebar-label sidebar-link-text">{item.label}</span>
                {isActive && <span className="sidebar-active-dot sidebar-label" aria-hidden="true" />}
              </a>
            )
          })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-theme-segmented" role="group" aria-label="Color theme">
            <button
              type="button"
              className={`theme-seg-btn ${theme === 'dark' ? 'is-selected' : ''}`}
              onClick={() => {
                if (theme !== 'dark') toggleTheme()
              }}
              aria-pressed={theme === 'dark'}
              title="Dark Mode"
            >
              <Moon size={15} strokeWidth={2.1} aria-hidden="true" />
              <span className="sidebar-label">Dark</span>
            </button>
            <button
              type="button"
              className={`theme-seg-btn ${theme === 'light' ? 'is-selected' : ''}`}
              onClick={() => {
                if (theme !== 'light') toggleTheme()
              }}
              aria-pressed={theme === 'light'}
              title="Light Mode"
            >
              <Sun size={15} strokeWidth={2.1} aria-hidden="true" />
              <span className="sidebar-label">Light</span>
            </button>
          </div>

          <button
            type="button"
            className="sidebar-theme-mini-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} strokeWidth={2.1} /> : <Moon size={18} strokeWidth={2.1} />}
          </button>

          <div className="sidebar-info-card">
            <div className="sidebar-status-row" title="Open Daily · 8 AM – 10 PM">
              <span className="status-badge">
                <span className="status-dot" aria-hidden="true" />
                OPEN
              </span>
              <span className="sidebar-label">Daily · 8 AM – 10 PM</span>
            </div>
            <div className="sidebar-meta-row" title="1807 Kapalaran St., Litex Rd., Brgy. Commonwealth, QC">
              <MapPin size={15} strokeWidth={2} aria-hidden="true" />
              <span className="sidebar-label">Litex Rd., Commonwealth, QC</span>
            </div>
            <div className="sidebar-quick-links">
              <a href="tel:+639270660386" className="sidebar-quick-btn" title="Call 0927 066 0386">
                <Phone size={14} strokeWidth={2.1} aria-hidden="true" />
                <span className="sidebar-label">Call</span>
              </a>
              <a
                href={GYM_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-quick-btn"
                title="Facebook Page"
              >
                <FacebookIcon size={14} strokeWidth={2.1} />
                <span className="sidebar-label">Facebook</span>
              </a>
            </div>
          </div>

          {useLinks ? (
            <Link className="sidebar-cta" href={ctaHref} onClick={closeDrawer} title={ctaLabel}>
              <span className="sidebar-label">{ctaLabel}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ) : (
            <a
              className="sidebar-cta"
              href={ctaHref}
              title={ctaLabel}
              onClick={() => handleItemSelect('rates')}
            >
              <span className="sidebar-label">{ctaLabel}</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </aside>
    </>
  )
}
