'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, ArrowRight, ChevronRight, Activity, Users, BarChart3, TrendingUp, Award, ClipboardList, Clock, Shield, Brain, Palette, Code2, GraduationCap, MapPin, AlertTriangle, Target, BookOpen, Layers, Lightbulb } from 'lucide-react'

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

const disciplines = [
  { icon: Brain, name: 'AI & Machine Learning', lead: 'Priyansu Sahoo', desc: 'Random Forest classifier, K-means user segmentation, SHAP explainability, Financial Health Score computation', color: '#15803D' },
  { icon: TrendingUp, name: 'Economics', lead: 'Osman Alther', desc: 'Time value of money, inflation analysis, behavioral economics, Indian financial context (UPI, SIP, PPF)', color: '#A16207' },
  { icon: Palette, name: 'Animation', lead: 'Karthik', desc: '5 animated modules using metaphor-based visual storytelling for intuitive financial concept absorption', color: '#7c3aed' },
  { icon: Code2, name: 'CSIT', lead: 'Harsh Nagar & Harshit Khanna', desc: 'React.js frontend, Flask backend, SQLite/PostgreSQL database, REST API architecture', color: '#0369a1' },
]

const stats = [
  { value: 'Pending', label: 'ML Model Accuracy', sub: 'To be measured post-study' },
  { value: 'Pending', label: 'Quiz Score Improvement', sub: 'To be measured post-study' },
  { value: 'Pending', label: 'User Satisfaction', sub: 'To be measured post-study' },
  { value: 'Pending', label: 'Module Completion', sub: 'To be measured post-study' },
]

const team = [
  { initials: 'RK', name: 'Raghav Kejriwal', role: 'Project Lead', stream: 'AI & ML' },
  { initials: 'PS', name: 'Priyansu Sahoo', role: 'ML Module Lead', stream: 'AI & ML' },
  { initials: 'HN', name: 'Harsh Nagar', role: 'CSIT Module Lead', stream: 'MSc CSIT' },
  { initials: 'HK', name: 'Harshit Khanna', role: 'CSIT Support / UI', stream: 'MSc CSIT' },
  { initials: 'KA', name: 'Karthik', role: 'Animation Module Lead', stream: 'MSc Animation' },
  { initials: 'OA', name: 'Osman Alther', role: 'Economics Module Lead', stream: 'MA Economics' },
]

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-inner">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="hero-badge">
              <Sparkles size={14} />
              MCA AIML Semester 2 — JAIN University
            </div>
            <h1 className="hero-title">
              AI-Driven Financial Literacy for <span>Indian Students</span>
            </h1>
            <p className="hero-sub">
              FinLit-X bridges the financial knowledge gap through an interdisciplinary approach — combining Machine Learning, Economics, Animation, and Computer Science into one unified learning system.
            </p>
            <div className="hero-actions">
              <Link href="/modules">
                <motion.button className="btn-primary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  Explore Modules <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link href="/research">
                <motion.button className="btn-secondary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  Read the Paper <ChevronRight size={18} />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div className="hero-visual" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="hero-card-icon"><Activity size={24} /></div>
                <div>
                  <div className="hero-card-title">Financial Health Score</div>
                  <div className="hero-card-sub">Powered by ML · Real-time assessment</div>
                </div>
              </div>
              <div className="financial-score">
                <div className="score-label">Financial Health Score</div>
                <div className="score-value" style={{ fontSize: '2rem', marginBottom: 4 }}>Pilot Study Pending</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>Results to be measured post user study</div>
                <div className="score-bar-bg">
                  <div style={{ height: '100%', width: '0%', background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', borderRadius: '100px' }} />
                </div>
              </div>
              <div className="hero-stats">
                {[{ v: 'TBD', l: 'ML Accuracy' }, { v: 'TBD', l: 'Quiz Gain' }, { v: 'TBD', l: 'Completion' }, { v: 'TBD', l: 'Satisfaction' }].map(s => (
                  <div key={s.l} className="hero-stat">
                    <div className="hero-stat-value">{s.v}</div>
                    <div className="hero-stat-label">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4 Disciplines */}
      <section className="section">
        <Reveal>
          <div className="section-tag"><Layers size={14} /> Integrated Disciplines</div>
          <h2 className="section-title">Four Streams, One Unified System</h2>
          <p className="section-desc">
            FinLit-X is the first financial literacy platform to seamlessly integrate AI/ML, behavioral economics, animated learning, and full-stack development — purpose-built for the Indian digital finance context.
          </p>
        </Reveal>
        <motion.div className="disciplines-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          {disciplines.map((d, i) => (
            <motion.div key={d.name} className="discipline-card" variants={fadeUp} custom={i}>
              <div className="discipline-icon"><d.icon size={26} /></div>
              <div className="discipline-name">{d.name}</div>
              <div className="discipline-lead">{d.lead}</div>
              <p className="discipline-desc">{d.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip">
        <div className="stats-strip-inner">
          {stats.map((s, i) => (
            <motion.div key={s.label} className="stat-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="stat-item-value">{s.value}</div>
              <div className="stat-item-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Preview */}
      <section className="section">
        <Reveal>
          <div className="section-tag"><Users size={14} /> Our Team</div>
          <h2 className="section-title">Meet the Minds Behind FinLit-X</h2>
          <p className="section-desc">A cross-disciplinary team of 6 students from JAIN University's MCA AIML and MSc programs, guided by Prof. Haripriya V.</p>
        </Reveal>
        <div className="team-grid">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.07}>
              <motion.div className="team-card" whileHover={{ y: -4, boxShadow: '0 8px 40px rgba(21,128,61,0.12)' }} transition={{ duration: 0.2 }}>
                <div className="team-avatar">{m.initials}</div>
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
                <div className="team-stream">{m.stream}</div>
              </motion.div>
            </Reveal>
          ))}
          <Reveal delay={0.5}>
            <div className="team-card mentor">
              <div className="team-avatar">HP</div>
              <div className="team-name">Prof. Haripriya V</div>
              <div className="team-role">Faculty Mentor</div>
              <div className="team-stream">JAIN University</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Research Study CTA */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <motion.div
            style={{
              background: 'linear-gradient(135deg, #15803D, #14532D)',
              borderRadius: 28, padding: '56px 48px', color: 'white', position: 'relative',
              overflow: 'hidden', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'center',
            }}
            className="research-cta-grid"
            whileHover={{ scale: 1.005 }}
          >
            <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '4px 14px', borderRadius: 100, fontSize: '0.78rem', fontWeight: 700, marginBottom: 20 }}>
                <ClipboardList size={14} /> Participate in Our Research Study
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: 16, lineHeight: 1.2 }}>
                Help Us Measure What Works in Financial Education
              </h2>
              <p style={{ fontSize: '0.95rem', opacity: 0.85, lineHeight: 1.7, marginBottom: 28, maxWidth: 540 }}>
                We are conducting a pre/post quiz study to measure how effectively FinLit-X's animated learning modules improve financial literacy among Indian college students. Participation takes 60-90 minutes and is completely anonymous.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
                {[{ icon: Clock, text: '60-90 min' }, { icon: Shield, text: '100% Anonymous' }, { icon: Users, text: '50+ participants needed' }, { icon: Brain, text: '15-question quiz' }].map(item => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', opacity: 0.9 }}>
                    <item.icon size={16} />{item.text}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/survey">
                  <motion.button className="btn-primary" style={{ background: 'white', color: '#15803D', fontSize: '1rem' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                    Take the Survey <ArrowRight size={18} />
                  </motion.button>
                </Link>
                <Link href="/research">
                  <motion.button className="btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', fontSize: '0.9rem', padding: '14px 20px' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    Learn About the Study
                  </motion.button>
                </Link>
              </div>
            </div>
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ step: '01', title: 'About You', desc: 'Brief demographics form' }, { step: '02', title: 'Pre-Quiz', desc: '15 financial questions' }, { step: '03', title: 'Learning Module', desc: 'Interactive FinLit-X modules' }, { step: '04', title: 'Post-Quiz', desc: 'Same 15 questions again' }, { step: '05', title: 'Feedback', desc: 'Quick satisfaction survey' }].map(item => (
                <div key={item.step} style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '11px 16px' }}>
                  <div style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem', flexShrink: 0 }}>{item.step}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </Reveal>
      </section>
    </main>
  )
}