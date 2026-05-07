'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Mail, MapPin, GraduationCap, Calendar, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} transition={{ delay }}>
      {children}
    </motion.div>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const handleSubmit = (e) => { e.preventDefault(); setSent(true) }

  return (
    <main>
      <section className="section">
        <Reveal>
          <div className="section-tag"><Mail size={14} /> Get in Touch</div>
          <h1 className="section-title">Contact the FinLit-X Team</h1>
          <p className="section-desc">Interested in collaborating, have questions about the research, or want to know when the app launches? We'd love to hear from you.</p>
        </Reveal>

        <div className="contact-grid">
          <Reveal delay={0.1}>
            {sent ? (
              <motion.div style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-xl)', padding: '48px 36px', textAlign: 'center', boxShadow: 'var(--shadow)' }} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 300 }} style={{ marginBottom: 20 }}>
                  <div style={{ width: 72, height: 72, background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'var(--primary)' }}><CheckCircle2 size={36} /></div>
                </motion.div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 12 }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Thank you for reaching out. The FinLit-X team will get back to you within 2-3 business days.</p>
              </motion.div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" placeholder="Your name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" type="text" placeholder="What's this about?" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-textarea" placeholder="Tell us what's on your mind..." required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <motion.button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Send Message <ArrowRight size={18} />
                </motion.button>
              </form>
            )}
          </Reveal>

          <Reveal delay={0.2}>
            <div className="contact-info">
              <h3>Let's Connect</h3>
              <p>FinLit-X is an open academic project. Whether you're a researcher, educator, developer, or student — we're happy to connect.</p>
              {[
                { icon: Mail, label: 'Project Email', value: 'finlitx.jainuniversity@gmail.com', href: 'mailto:finlitx.jainuniversity@gmail.com' },
                { icon: MapPin, label: 'Institution', value: 'JAIN (Deemed-to-be University), Bengaluru', href: null },
                { icon: GraduationCap, label: 'Program', value: 'MCA AIML — Semester 2, Academic Year 2025-26', href: null },
                { icon: Calendar, label: 'Paper Submission', value: 'Target: June 15, 2026 — IJEDICT Journal', href: null },
              ].map(d => (
                <div key={d.label} className="contact-detail">
                  <div className="contact-detail-icon"><d.icon size={20} /></div>
                  <div>
                    <div className="contact-detail-label">{d.label}</div>
                    {d.href ? (
                      <a href={d.href} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>{d.value}</a>
                    ) : (
                      <div className="contact-detail-value">{d.value}</div>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginTop: 16 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={16} color="var(--accent)" />Mobile App Waitlist
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>Want early access to the FinLit-X mobile app? Join our waitlist to be notified when we launch on the Play Store.</p>
                <Link href="/survey">
                  <motion.button className="btn-primary" style={{ fontSize: '0.9rem', padding: '10px 20px' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    Join Waitlist <ArrowRight size={16} />
                  </motion.button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}