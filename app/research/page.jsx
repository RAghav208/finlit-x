'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { GraduationCap, Calendar, BarChart3, TrendingUp, Star, Activity, BookOpen, Target } from 'lucide-react'

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

const contributions = [
  { num: '1', title: 'Behavioral Knowledge Gap Detection', desc: 'Novel use of SHAP-based explainability to detect specific financial knowledge gaps and adapt learning paths — not just quiz scores, but cognitive reasoning patterns.' },
  { num: '2', title: 'Animated Conceptual Metaphors for Finance', desc: 'First systematic mapping of animated visual metaphors to behavioral economics principles (snowball→compound interest, bucket→emergency funds, roller coaster→risk-return).' },
  { num: '3', title: 'Trans-Disciplinary Architecture Pattern', desc: 'Formalization of the 4-disciplines-integration architecture as a reproducible pattern for educational technology, not just a project-specific design.' },
  { num: '4', title: 'Indian Digital Finance Personalization', desc: 'Curriculum and ML personalization grounded in Indian-specific financial instruments (UPI, SIPs, PPF, NPS, CIBIL) — addressing a population outside the Western-centric financial literacy research.' },
  { num: '5', title: 'Indian College Student Pilot Study', desc: 'Empirical user study with Indian college students following a pre/post quiz design with experimental and control groups — providing baseline metrics for the ML model and learning outcomes in a non-Western population.' },
]

const timeline = [
  { date: 'April 2026', title: 'User Study Execution', desc: 'Conduct pilot user study with JAIN University MCA AIML students' },
  { date: 'May 25, 2026', title: 'Paper Draft Complete', desc: 'Full manuscript ready for mentor review and co-author sign-off' },
  { date: 'June 1, 2026', title: 'Mentor Review', desc: 'Prof. Haripriya V reviews and approves final manuscript' },
  { date: 'June 15, 2026', title: 'Submit to IJEDICT', desc: 'Submit to International Journal of Education and Development using ICT' },
  { date: 'August 2026+', title: 'App Phase 2 Development', desc: 'React Native mobile app development for Play Store submission' },
]

export default function ResearchPage() {
  return (
    <main>
      <section className="section">
        <Reveal>
          <div className="section-tag"><GraduationCap size={14} /> Research & Publication</div>
          <h1 className="section-title">Academic Publication Plan</h1>
          <p className="section-desc">FinLit-X is not just a semester project — it's a publishable research contribution targeting the International Journal of Education and Development using ICT (IJEDICT), indexed in Scopus.</p>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', borderRadius: 'var(--radius-xl)', padding: '36px', color: 'white', marginBottom: 48, display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.75, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Target Journal</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>International Journal of Education and Development using ICT (IJEDICT)</div>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.6 }}>Peer-reviewed, open-access journal indexed in Scopus, DOAJ, and ERIC. Focus on technology-enhanced education in developing nations — an ideal fit for FinLit-X's Indian context and AI-driven approach.</p>
            </div>
            <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
              {[{ label: 'Review Time', val: '2-3 months' }, { label: 'Acceptance', val: '~50%' }, { label: 'Open Access', val: 'Yes' }].map(item => (
                <div key={item.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '16px 20px', borderRadius: 14, minWidth: 90 }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{item.val}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </Reveal>

        <Reveal>
          <h2 className="section-title" style={{ fontSize: '1.8rem' }}>5 Novelty Contributions</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 0, fontSize: '0.95rem' }}>Each contribution addresses a specific gap in the existing financial literacy and ed-tech literature.</p>
        </Reveal>
        <div className="contributions-grid">
          {contributions.map((c, i) => (
            <Reveal key={c.num} delay={i * 0.07}>
              <motion.div className="contribution-card" data-num={c.num} whileHover={{ x: 4 }}>
                <div className="contribution-title">{c.title}</div>
                <p className="contribution-desc">{c.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginTop: 64, marginBottom: 40 }}>Project Timeline</h2>
        </Reveal>
        <div className="timeline">
          {timeline.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08}>
              <div className="timeline-item">
                <div className="timeline-date"><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />{t.date}</div>
                <div className="timeline-title">{t.title}</div>
                <div className="timeline-desc">{t.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginTop: 64, marginBottom: 32 }}>Pilot User Study Results</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { icon: BarChart3, label: 'ML Model Accuracy', val: 'TBD', sub: 'Measured post pilot study' },
              { icon: TrendingUp, label: 'Quiz Score Gain', val: 'TBD', sub: 'Pre/post assessment delta' },
              { icon: Star, label: 'Satisfaction', val: 'TBD', sub: '5-point Likert scale survey' },
              { icon: Activity, label: 'Real-User Accuracy', val: 'TBD', sub: 'Actual expense categorization' },
              { icon: BookOpen, label: 'Understanding Gain', val: 'TBD', sub: 'Self-reported improvement' },
              { icon: Target, label: 'Completion Rate', val: 'TBD', sub: 'Modules completed by participants' },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 0.06}>
                <motion.div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }} whileHover={{ y: -4, borderColor: 'var(--primary)' }}>
                  <div style={{ color: 'var(--primary)', marginBottom: 12 }}><item.icon size={22} /></div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{item.val}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', margin: '4px 0' }}>{item.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>
    </main>
  )
}