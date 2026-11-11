'use client'

import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver to animate [data-reveal] elements once as they enter the viewport.
 * Elements already inside or above the viewport on mount become visible immediately without flicker.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (targets.length === 0) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.setAttribute('data-reveal', 'visible'))
      return
    }

    const pendingTargets: HTMLElement[] = []
    const viewportCutoff = window.innerHeight * 0.96

    targets.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top <= viewportCutoff) {
        el.setAttribute('data-reveal', 'visible')
      } else {
        el.setAttribute('data-reveal', 'pending')
        pendingTargets.push(el)
      }
    })

    if (pendingTargets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-reveal', 'visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -36px 0px',
      },
    )

    pendingTargets.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

/**
 * Thin GPU-accelerated gold scroll progress bar pinned to the bottom edge of .site-header.
 */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let frameId = 0

    const updateProgress = () => {
      frameId = 0
      const el = barRef.current
      if (!el) return
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
      el.style.transform = `scaleX(${ratio})`
    }

    const handleScroll = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateProgress)
      }
    }

    updateProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return <span ref={barRef} className="scroll-progress-bar" aria-hidden="true" />
}

