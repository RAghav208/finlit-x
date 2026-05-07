'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Target, Lightbulb, Award, Users, Brain, Palette, TrendingUp } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} transition={{ delay }}>
      {children}
    </motion.div>
  )
}

const methodology = [
  { num: '01', title: 'ML-Driven Knowledge Assessment', desc: 'Machine Learning models categorize user expenses and segment behavioral patterns. A composite Financial Health Score (0-100) is computed from spending patterns, savings rate, and financial behaviors. Accuracy metrics will be established from the pilot study.' },
  { num: '02', title: 'Adaptive Learning Paths', desc: 'Quiz responses trigger SHAP-based explainability to detect behavioral knowledge gaps. The system then maps students to personalized learning paths — ensuring each learner gets exactly the concept they need, in the right order.' },
  { num: '03', title: 'Animated Conceptual Metaphors', desc: 'Each financial concept is taught through a custom animated metaphor: compound interest as a snowball rolling downhill, inflation as a silent pickpocket, risk-return as a roller coaster. These maps directly to behavioral economics principles.' },
  { num: '04', title: 'Indian Digital Finance Context', desc: 'All content is localized for Indian students — UPI transactions, Systematic Investment Plans (SIPs), Public Provident Fund (PPF), National Pension System (NPS), and CIBIL scores are integrated throughout the curriculum.' },
]

export default function AboutPage() {
  return (
    <main>
      <div className="about-hero">
        <div className="about-hero-text">
          <Reveal>
            <div className="section-tag"><Target size={14} /> Our Mission</div>
            <h1 className="section-title">Bridging India's Financial Literacy Gap</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
              India has the world's largest population of young adults, yet financial literacy remains critically low. Only 24% of Indian adults understand basic financial concepts — leaving millions unprepared for credit, investing, and long-term financial planning.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              FinLit-X addresses this gap with an AI-powered, trans-disciplinary learning system specifically designed for Indian college students, leveraging Machine Learning, Economics, Animation, and Computer Science as four equal pillars.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="problem-box">
              <div className="problem-box-title">The Problem</div>
              <p>76% of Indian college students lack basic financial literacy. Most graduate without understanding credit scores, compound interest, inflation's impact, or how to start investing — leaving them vulnerable to predatory lending and poor financial decisions.</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="solution-card">
            <h3>FinLit-X Solution</h3>
            <p>A trans-disciplinary AI platform that assesses each learner's financial knowledge, detects gaps using machine learning, and delivers personalized animated learning paths tailored to the Indian digital finance context.</p>
            <div className="solution-steps">
              {[
                { s: <><strong>Assess</strong> — ML models analyze spending patterns and quiz responses</> },
                { s: <><strong>Detect</strong> — SHAP explainability identifies specific knowledge gaps</> },
                { s: <><strong>Personalize</strong> — K-means clusters guide adaptive learning paths</> },
                { s: <><strong>Engage</strong> — 5 animated modules make concepts unforgettable</> },
                { s: <><strong>Measure</strong> — Continuous tracking with Financial Health Score (0-100)</> },
              ].map((step, i) => (
                <div className="solution-step" key={i}>
                  <div className="step-num">{i + 1}</div>
                  <div className="step-text">{step.s}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Methodology */}
      <section className="section">
        <Reveal>
          <div className="section-tag"><Lightbulb size={14} /> Methodology</div>
          <h2 className="section-title">4-Discipline Integration Architecture</h2>
          <p className="section-desc">FinLit-X is not just a content platform — it's a reproducible architecture pattern that fuses four academic disciplines into one coherent learning system.</p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 24 }}>
          {methodology.map((m, i) => (
            <Reveal key={m.num} delay={i * 0.08}>
              <motion.div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', display: 'flex', gap: 20, alignItems: 'flex-start' }} whileHover={{ borderColor: 'var(--primary)', boxShadow: 'var(--shadow)' }} transition={{ duration: 0.2 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--border-strong)', lineHeight: 1, flexShrink: 0, minWidth: 48 }}>{m.num}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 8 }}>{m.title}</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{m.desc}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why Trans-Disciplinary */}
      <section className="section" style={{ background: 'var(--bg-secondary)', margin: '0 -24px', padding: '80px 24px', maxWidth: 'none' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div className="section-tag"><Award size={14} /> Why Trans-Disciplinary?</div>
            <h2 className="section-title">The Power of Integration</h2>
            <p className="section-desc">Traditional financial literacy courses treat economics as theory and technology as a delivery tool. FinLit-X inverts this — AI is the architect, economics is the science, animation is the bridge, and CSIT is the infrastructure.</p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { icon: Brain, title: 'Personalization at Scale', desc: 'ML enables 1-to-1 tutoring quality for thousands of users simultaneously — impossible with traditional classroom instruction.' },
              { icon: Palette, title: 'Metaphor-Based Memory', desc: 'Animated visual metaphors (snowball, roller coaster) leverage dual-coding theory to make abstract financial concepts concrete and memorable.' },
              { icon: TrendingUp, title: 'Behavioral Economics Foundation', desc: "Built on Kahneman's prospect theory, Thaler's nudge framework, and Shefrin's mental accounting — not just formulas, but decision-making science." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
                  <div className="discipline-icon" style={{ marginBottom: 16 }}><item.icon size={24} /></div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 8 }}>{item.title}</div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}