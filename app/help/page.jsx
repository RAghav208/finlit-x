'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { HelpCircle, Mail, Clock, Shield, Eye, Keyboard, ChevronRight, ExternalLink } from 'lucide-react'

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

const faqs = [
  {
    q: 'What is the FinLit-X research study about?',
    a: 'FinLit-X is an interdisciplinary academic project by JAIN University MCA AIML students that combines Machine Learning, Economics, Animation, and Computer Science to teach financial literacy to Indian college students. The study measures how animated, AI-driven learning modules improve financial knowledge compared to traditional study methods.',
  },
  {
    q: 'How long does the study take?',
    a: 'The study takes approximately 60-90 minutes to complete. It includes a demographics form (~5 min), a pre-quiz (~10 min), interactive learning modules (~45-60 min), a post-quiz (~10 min), and a satisfaction survey (~5 min). You can exit at any time and return later — your progress is saved.',
  },
  {
    q: 'Is my data anonymous?',
    a: 'Yes — completely. No personal identifying information is collected. You are assigned a random anonymous code (e.g., FIN-742) at the start. All quiz responses and survey answers are linked only to this code. Data is used solely for academic research, stored securely, and destroyed 12 months after publication.',
  },
  {
    q: 'Who can participate?',
    a: 'The study targets Indian college students, particularly those enrolled in undergraduate or postgraduate programs. You must be 18 years or older to participate. Prior financial knowledge is not required — the study measures learning improvement, not existing expertise.',
  },
  {
    q: 'What if I want to withdraw?',
    a: 'Participation is entirely voluntary. You may withdraw at any time without consequence by closing the browser window. If you provided a participant code and later wish to have your data deleted, contact finlitx.jainuniversity@gmail.com with your code.',
  },
  {
    q: 'Can I use the study on my phone?',
    a: 'Yes, the study is accessible on mobile devices. The interactive learning modules include animations and interactive sandboxes that work on both desktop and mobile browsers. For the best experience with the interactive components, a tablet or larger screen is recommended.',
  },
  {
    q: 'What are the learning modules about?',
    a: 'Five animated modules cover: Compound Interest (snowball metaphor), Credit Scores (building blocks metaphor), Inflation (silent thief metaphor), Budgeting (roller coaster metaphor), and Risk & Return (bucket system metaphor). Each module includes an interactive sandbox where you can manipulate variables and see real-time outcomes.',
  },
  {
    q: 'When will results be published?',
    a: 'The target journal is IJEDICT (International Journal of Education and Development using ICT). The paper is planned for submission on June 15, 2026. Aggregate results will be published as part of the research paper — no individual data is ever identifiable.',
  },
  {
    q: 'Is there a mobile app?',
    a: 'A React Native mobile app (FinLit-X) is planned for Phase 2 development in late 2026, targeting Play Store submission. Join the waitlist through the contact page or during the study survey.',
  },
  {
    q: 'How was this project evaluated?',
    a: 'FinLit-X is evaluated by JAIN University faculty as an MCA AIML Semester 2 trans-disciplinary project (TDPCL). It is also being submitted as a research paper to the IJEDICT journal for peer-reviewed academic evaluation.',
  },
]

const quickLinks = [
  { href: '/survey', label: 'Start the Study', desc: 'Take the pre-quiz and begin the learning modules', icon: Clock, color: '#15803D' },
  { href: '/research', label: 'Research Paper', desc: 'Learn about the 5 novelty contributions and publication plan', icon: Eye, color: '#0369a1' },
  { href: '/modules', label: 'View Modules', desc: 'See the 5 animated learning modules in detail', icon: Eye, color: '#7c3aed' },
  { href: '/contact', label: 'Contact Team', desc: 'Reach the FinLit-X team directly via email', icon: Mail, color: '#A16207' },
]

const accessibilityItems = [
  { label: 'Focus States', desc: 'All interactive elements have visible focus indicators (2px outline offset) for keyboard navigation.' },
  { label: 'Color Contrast', desc: 'All text meets WCAG 2.1 AA standards with contrast ratios above 4.5:1 for body text and 3:1 for large text.' },
  { label: 'Motion Respect', desc: 'All animations respect prefers-reduced-motion. The system will disable or reduce motion effects if requested by the operating system.' },
  { label: 'Screen Reader', desc: 'The survey flow is navigable by screen readers. Form labels are properly associated with inputs.' },
  { label: 'Keyboard Navigation', desc: 'All interactive elements are reachable and operable via keyboard alone. Tab order follows visual layout.' },
]

export default function HelpPage() {
  return (
    <main>
      <section className="section">
        <Reveal>
          <div className="section-tag"><HelpCircle size={14} /> Help & FAQ</div>
          <h1 className="section-title">Questions? We Have Answers.</h1>
          <p className="section-desc">Everything you need to know about the FinLit-X research study, from anonymity guarantees to how the learning modules work.</p>
        </Reveal>

        {/* Quick links */}
        <Reveal delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 64 }}>
            {quickLinks.map(link => (
              <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                <motion.div
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                    padding: '20px 24px', boxShadow: 'var(--shadow-sm)', cursor: 'pointer',
                  }}
                  whileHover={{ y: -4, boxShadow: 'var(--shadow-md)', borderColor: 'var(--border-medium)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, background: `${link.color}15`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <link.icon size={18} color={link.color} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{link.label}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{link.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* FAQ */}
        <Reveal>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 32 }}>Frequently Asked Questions</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 16, marginBottom: 64 }}>
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                  padding: '20px 24px', boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <HelpCircle size={14} color="var(--primary)" />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', lineHeight: 1.4 }}>{faq.q}</div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, paddingLeft: 40 }}>{faq.a}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Accessibility Statement */}
        <Reveal delay={0.1}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '40px', marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eye size={20} color="var(--primary)" />
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: 0 }}>Accessibility Statement</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>FinLit-X is committed to WCAG 2.1 AA compliance</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {accessibilityItems.map(item => (
                <div key={item.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Keyboard size={14} />{item.label}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Contact CTA */}
        <Reveal delay={0.1}>
          <div style={{ textAlign: 'center', paddingTop: 48, paddingBottom: 32 }}>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: 16 }}>Still have questions? The FinLit-X team is happy to help.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:finlitx.jainuniversity@gmail.com" style={{ textDecoration: 'none' }}>
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Mail size={16} /> Email the Team
                </motion.button>
              </a>
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <motion.button
                  className="btn-secondary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Contact Page <ChevronRight size={16} />
                </motion.button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  )
}