import React from 'react'
import { GYM_FACEBOOK_URL } from '@/lib/formsubmit'

/**
 * Clean stroke-based Facebook glyph matching lucide-react icon proportions.
 */
export function FacebookIcon({
  size = 18,
  strokeWidth = 1.85,
}: {
  size?: number
  strokeWidth?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

/**
 * Shared footer link to the official Presson Fitness Gym Facebook page.
 */
export function FooterFacebookLink() {
  return (
    <a
      className="footer-social-link"
      href={GYM_FACEBOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Presson Fitness Gym on Facebook"
    >
      <FacebookIcon size={15} strokeWidth={1.9} />
      <span>Facebook</span>
    </a>
  )
}
