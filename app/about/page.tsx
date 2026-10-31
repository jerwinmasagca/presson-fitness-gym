import { PageShell } from '@/components/page-shell'

export default function AboutPage() {
  return (
    <PageShell eyebrow="01 — About Presson" title="Built for the work." copy="More than just a gym — it is a lifestyle. Presson is a clean, motivating space for people who want to become stronger, healthier, and more disciplined.">
      <section className="container inner-page-grid">
        <div className="statement-card">
          <span>01</span>
          <h2>Strength is a daily practice.</h2>
        </div>
        <div>
          <p className="lead-copy">We believe progress is built one decision at a time. Show up, train with purpose, fuel your body, and stay connected to a community that wants to see you win.</p>
          <div className="principles">
            <article><span>01</span><h3>Discipline</h3><p>Turn intention into a routine that lasts.</p></article>
            <article><span>02</span><h3>Community</h3><p>Train alongside people who raise your standard.</p></article>
            <article><span>03</span><h3>Progress</h3><p>Measure the work and celebrate every gain.</p></article>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
