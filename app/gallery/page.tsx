'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'

const galleryPhotos = [
  {
    id: 1,
    title: 'The Facility & Main Floor',
    subtitle: 'Free weights, racks, and functional equipment',
    img: '/gallery/828554454_1096056716270076_7678644003964894617_n.png',
    badge: 'Facility Overview',
    desc: 'An open-concept strength training floor engineered for serious work. Complete with heavy-duty tiered dumbbell racks, adjustable incline/flat benches, dual cable pulley station, and signature hexagonal LED ceiling illumination.',
    features: ['Dumbbell Racks', 'Dual Cable System', 'Hexagonal Lighting', 'Multiple Benches', 'Rubberized Flooring'],
  },
  {
    id: 2,
    title: 'Strength & Personal Coaching',
    subtitle: 'Expert guidance on every rep and set',
    img: '/gallery/839167560_1104821698726911_999525515312939096_n.png',
    badge: 'Coaching in Action',
    desc: 'Dedicated coaching floor where trainers spot, cue form, and support athletes pushing their limits safely. Whether you are learning proper dumbbell bench press mechanics or training for progressive overload, you are never left guessing.',
    features: ['1-on-1 Spotting', 'Form Correction', 'Dumbbell Press', 'Safety Protocol', 'All Skill Levels'],
  },
  {
    id: 3,
    title: 'Community & Conditioning Zone',
    subtitle: 'Targeted machine work and athlete energy',
    img: '/gallery/839766751_1104821828726898_7443232933410309067_n.png',
    badge: 'Training Floor',
    desc: 'Equipped with commercial leg curl and extension machines, pull-up and dip station towers, stationary bikes, and our hand-painted Presson Fitness Gym signature mural that sets the tone for hard work.',
    features: ['Leg Extensions', 'Dip & Pull-up Tower', 'Conditioning Bike', 'Signature Mural', 'Welcoming Atmosphere'],
  },
]

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') {
        setLightboxIndex(prev => (prev === null ? null : (prev - 1 + galleryPhotos.length) % galleryPhotos.length))
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex(prev => (prev === null ? null : (prev + 1) % galleryPhotos.length))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex])

  return (
    <PageShell
      eyebrow="03 — Gallery / The Facility"
      title="The space for the work."
      copy="A focused training floor, serious equipment, and a community that keeps the energy high. Explore our Quezon City gym."
    >
      <div className="container">
        {/* Gallery Grid */}
        <section className="gallery-page-grid">
          {galleryPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              className="gallery-card"
              data-reveal=""
              style={{ '--reveal-delay': `${idx * 90}ms` } as React.CSSProperties}
              tabIndex={0}
              role="button"
              aria-label={`View ${photo.title} photo`}
              onClick={() => setLightboxIndex(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setLightboxIndex(idx)
                }
              }}
            >
              <div className="gallery-card-img-wrap">
                <span className="gallery-card-badge">{photo.badge}</span>
                <img src={photo.img} alt={photo.title} />
              </div>
              <div className="gallery-card-body">
                <h3>{photo.title}</h3>
                <p>{photo.desc}</p>
                <div className="gallery-card-features">
                  {photo.features.map((feature, fIdx) => (
                    <span key={fIdx} className="gallery-tag-pill">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Call to action */}
        <section className="gallery-page-cta" data-reveal="">
          <h2>Ready to experience the space in person?</h2>
          <p>
            Drop by for a walk-through, meet our coaches, and see the facility for yourself.
            First-time day passes and tours available every day.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="button button-gold" href="/#services">
              Book a Tour / Free Trial ↗
            </Link>
            <Link className="button button-ghost" href="/#join">
              View Memberships & Rates
            </Link>
          </div>
        </section>
      </div>

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
                setLightboxIndex((lightboxIndex - 1 + galleryPhotos.length) % galleryPhotos.length)
              }
            >
              &#8592;
            </button>
            <div className="lightbox-img-wrapper">
              <img
                className="lightbox-img"
                src={galleryPhotos[lightboxIndex].img}
                alt={galleryPhotos[lightboxIndex].title}
              />
            </div>
            <button
              className="lightbox-nav-btn lightbox-next-btn"
              aria-label="Next image"
              onClick={() => setLightboxIndex((lightboxIndex + 1) % galleryPhotos.length)}
            >
              &#8594;
            </button>
            <div className="lightbox-caption-box">
              <h3 className="lightbox-title">{galleryPhotos[lightboxIndex].title}</h3>
              <p className="lightbox-desc">{galleryPhotos[lightboxIndex].desc}</p>
              <div className="lightbox-counter">
                {lightboxIndex + 1} / {galleryPhotos.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
