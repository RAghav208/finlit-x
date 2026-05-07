'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, CheckCircle2, Lightbulb, Users, Activity, TrendingUp, BarChart3, FlaskConical, Shield, Zap, DollarSign, Target } from 'lucide-react'

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

const modules = [
  { id: 'snowball', tag: 'Compound Interest', name: 'The Snowball Method', metaphor: 'Watch your money grow exponentially — like a snowball rolling downhill, gaining momentum with every rotation.', visual: <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="36" fill="#dcfce7" /><circle cx="40" cy="40" r="28" fill="#86efac" opacity="0.6" /><circle cx="40" cy="40" r="20" fill="#22c55e" opacity="0.7" /><circle cx="40" cy="40" r="12" fill="#15803D" /><text x="40" y="44" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">₹</text></svg>, outcome: 'Understand exponential growth and why starting early matters — even small amounts grow massively over time.', concepts: ['Exponential growth', 'Rule of 72', 'Time value of money', 'Power of early investing'] },
  { id: 'building', tag: 'Savings Goals', name: 'Building Blocks', metaphor: 'Construct your financial goals like building blocks — each one stacked deliberately toward your dream life.', visual: <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><rect x="16" y="52" width="48" height="14" rx="3" fill="#fde047" /><rect x="22" y="38" width="36" height="14" rx="3" fill="#facc15" opacity="0.8" /><rect x="28" y="24" width="24" height="14" rx="3" fill="#eab308" opacity="0.7" /><rect x="34" y="10" width="12" height="14" rx="3" fill="#ca8a04" /><path d="M40 6 L40 0" stroke="#ca8a04" strokeWidth="2" strokeDasharray="2 2" /><circle cx="40" cy="-2" r="3" fill="#A16207" /></svg>, outcome: 'Learn SMART goal-setting, emergency funds, and how to prioritize financial goals across competing life needs.', concepts: ['SMART goals', 'Goal prioritization', 'Emergency fund', 'Budget allocation'] },
  { id: 'silent', tag: 'Inflation Impact', name: 'The Silent Thief', metaphor: 'Inflation silently erodes your purchasing power — like a thief who never gets caught, unless you know to look for them.', visual: <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="36" fill="#e5e7eb" /><text x="40" y="36" textAnchor="middle" fontSize="22" fill="#6b7280" fontWeight="bold">₹</text><text x="40" y="54" textAnchor="middle" fontSize="14" fill="#9ca3af">???</text><path d="M20 30 Q30 20 40 30 Q50 40 60 30" stroke="#dc2626" strokeWidth="2" fill="none" opacity="0.7" /><path d="M20 40 Q30 30 40 40 Q50 50 60 40" stroke="#dc2626" strokeWidth="2" fill="none" opacity="0.5" /></svg>, outcome: 'Understand how inflation quietly shrinks your savings and why investing is essential to maintain purchasing power.', concepts: ['Purchasing power', 'Real vs nominal returns', 'Inflation-adjusted growth', 'Cost of waiting'] },
  { id: 'roller', tag: 'Risk & Return', name: 'The Roller Coaster', metaphor: 'Risk and return are inseparable companions — the higher you climb, the steeper the drops. Learn to ride the waves.', visual: <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><path d="M10 60 Q20 20 30 40 Q40 60 50 30 Q60 0 70 30 L70 60" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round" /><circle cx="30" cy="40" r="5" fill="#ef4444" /><circle cx="50" cy="30" r="5" fill="#f97316" /><circle cx="65" cy="15" r="4" fill="#22c55e" /><text x="65" y="12" fontSize="6" fill="#15803D" fontWeight="bold">WIN</text></svg>, outcome: 'Grasp portfolio diversification, risk tolerance assessment, and why avoiding all risk is actually the biggest risk.', concepts: ['Risk tolerance', 'Diversification', 'Portfolio theory', 'Long-term vs short-term'] },
  { id: 'bucket', tag: 'Emergency Funds', name: 'The Bucket System', metaphor: "Organize your money into purpose-filled buckets — so life's surprises never knock your financial plan off track.", visual: <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><rect x="10" y="20" width="60" height="44" rx="8" fill="#bfdbfe" /><rect x="14" y="24" width="52" height="12" rx="4" fill="#60a5fa" /><rect x="14" y="40" width="52" height="12" rx="4" fill="#3b82f6" opacity="0.7" /><rect x="14" y="56" width="52" height="6" rx="3" fill="#2563eb" opacity="0.5" /><circle cx="40" cy="10" r="6" fill="#15803D" /><path d="M40 16 L40 20" stroke="#15803D" strokeWidth="2" /></svg>, outcome: 'Build financial resilience with proper emergency fund sizing, liquidity management, and psychological safety nets.', concepts: ['3-6 month emergency fund', 'Liquidity tiers', 'Financial safety net', 'Psychological resilience'] },
]

export default function ModulesPage() {
  return (
    <main>
      <section className="section">
        <Reveal>
          <div className="section-tag"><BookOpen size={14} /> Learning Modules</div>
          <h1 className="section-title">5 Animated Modules That Make Finance Click</h1>
          <p className="section-desc">Each module uses a carefully crafted visual metaphor grounded in behavioral economics research. Students don't just memorize — they viscerally understand.</p>
        </Reveal>
        <div className="modules-grid">
          {modules.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.08}>
              <motion.div className="module-card" whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(21,128,61,0.12)' }}>
                <div className={`module-preview ${m.id}`}>
                  <div className="module-preview-icon">{m.visual}</div>
                </div>
                <div className="module-content">
                  <span className="module-tag">{m.tag}</span>
                  <h3 className="module-title">{m.name}</h3>
                  <p className="module-desc">{m.metaphor}</p>
                  <div style={{ marginBottom: 16 }}>
                    {m.concepts.map(c => (
                      <div key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem', marginRight: 6, marginBottom: 6 }}>
                        <CheckCircle2 size={10} color="var(--primary)" />{c}
                      </div>
                    ))}
                  </div>
                  <div className="module-outcome"><Lightbulb size={14} />{m.outcome}</div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="stats-strip">
        <div className="stats-strip-inner">
          {[{ value: 'Pending', label: 'Module Completion Rate' }, { value: 'Pending', label: 'Self-Reported Understanding' }, { value: 'Pending', label: 'Average Quiz Score Gain' }, { value: 'Pending', label: 'Student Satisfaction Rating' }].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="stat-item-value">{s.value}</div>
              <div className="stat-item-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}