'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FlaskConical, Brain, TrendingUp, Code2, BarChart3, Shield, Zap, Activity, DollarSign, Target } from 'lucide-react'

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

const ml = [
  'Random Forest expense classifier (model trained on labeled Indian expense dataset, accuracy TBD post-study)',
  'K-means clustering for 4 user behavioral segments',
  'SHAP explainability for knowledge gap detection',
  'Financial Health Score composite (0-100)',
  'Adaptive quiz-driven learning path generation',
]
const economics = [
  'Time value of money and net present value',
  'Inflation indexing and real return calculations',
  'Behavioral economics: prospect theory, nudge theory',
  'Indian financial instruments: UPI, SIP, PPF, NPS, CIBIL',
  'Risk-return tradeoff and portfolio theory',
]
const csit = [
  'React.js frontend with Framer Motion animations',
  'Flask REST API backend',
  'SQLite/PostgreSQL persistent storage',
  'REST API with JSON response format',
  'Responsive mobile-first design (React Native Phase 2)',
]

export default function TechnologyPage() {
  return (
    <main>
      <section className="section">
        <Reveal>
          <div className="section-tag"><FlaskConical size={14} /> Technology Stack</div>
          <h1 className="section-title">Built on Three Pillars of Innovation</h1>
          <p className="section-desc">FinLit-X combines cutting-edge machine learning, rigorous economic modeling, and modern software engineering into one integrated platform.</p>
        </Reveal>

        <div className="tech-grid">
          <Reveal delay={0.05}>
            <motion.div className="tech-card" whileHover={{ y: -4, boxShadow: 'var(--shadow)' }}>
              <div className="tech-card-icon"><Brain size={28} /></div>
              <div className="tech-card-title">AI & Machine Learning</div>
              <p className="tech-card-desc">Our ML pipeline transforms raw financial behavior into actionable insights. The Random Forest model classifies expenses, while K-means segmentation identifies behavioral archetypes. Model accuracy will be measured through the pilot user study.</p>
              <ul className="tech-list">{ml.map(item => <li key={item}>{item}</li>)}</ul>
              <div className="tech-badge"><BarChart3 size={14} /> ML Accuracy: Pending Pilot Study</div>
            </motion.div>
          </Reveal>
          <Reveal delay={0.1}>
            <motion.div className="tech-card" whileHover={{ y: -4, boxShadow: 'var(--shadow)' }}>
              <div className="tech-card-icon"><TrendingUp size={28} /></div>
              <div className="tech-card-title">Economics & Behavioral Science</div>
              <p className="tech-card-desc">Grounded in classical economics and modern behavioral science, our curriculum uses nudge theory and prospect theory to drive genuine behavioral change, not just knowledge transfer.</p>
              <ul className="tech-list">{economics.map(item => <li key={item}>{item}</li>)}</ul>
              <div className="tech-badge"><Shield size={14} /> Behavioral-First Design</div>
            </motion.div>
          </Reveal>
          <Reveal delay={0.15}>
            <motion.div className="tech-card" whileHover={{ y: -4, boxShadow: 'var(--shadow)' }}>
              <div className="tech-card-icon"><Code2 size={28} /></div>
              <div className="tech-card-title">Computer Science & IT</div>
              <p className="tech-card-desc">A production-grade architecture with React.js for a smooth, animated UI, Flask for a clean REST API, and SQLite/PostgreSQL for reliable data persistence.</p>
              <ul className="tech-list">{csit.map(item => <li key={item}>{item}</li>)}</ul>
              <div className="tech-badge"><Zap size={14} /> Production-Grade Stack</div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)', margin: '0 -24px', padding: '80px 24px', maxWidth: 'none' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div className="section-tag"><Activity size={14} /> ML Deep Dive</div>
            <h2 className="section-title">How the Financial Health Score Works</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginTop: 40 }}>
            {[
              { icon: DollarSign, label: 'Expense Data', desc: 'Categorizes expense types with ML classifier (accuracy TBD post-study)', color: '#15803D' },
              { icon: BarChart3, label: 'K-Means Segments', desc: '4 behavioral clusters: Saver, Spender, Investor, Planner', color: '#7c3aed' },
              { icon: Shield, label: 'SHAP Explainability', desc: 'Identifies which factors most influence each score', color: '#0369a1' },
              { icon: Target, label: 'Health Score 0-100', desc: 'Composite score tracking financial wellness over time', color: '#A16207' },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 0.1}>
                <motion.div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', textAlign: 'center' }} whileHover={{ y: -4 }}>
                  <div style={{ width: 52, height: 52, background: `${item.color}15`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: item.color }}><item.icon size={24} /></div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>{item.label}</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}