import Link from 'next/link'
import { PageShell } from '@/components/page-shell'

const services = [['01','Personal training','Focused coaching built around your goals, your pace, and your strongest possible form.'],['02','Group strength','High-energy sessions that make hard work more motivating and more social.'],['03','Open gym access','The space, equipment, and freedom to train on your schedule.']]
export default function ServicesPage() { return <PageShell eyebrow="02 — Services" title="Find your edge." copy="Everything you need to train harder, recover better, and keep showing up."><section className="container service-cards">{services.map(([number,title,copy]) => <article className="service-card" key={number}><span>{number}</span><h2>{title}</h2><p>{copy}</p><Link className="button button-dark" href="/#join">Book a session <span>→</span></Link></article>)}</section></PageShell> }
