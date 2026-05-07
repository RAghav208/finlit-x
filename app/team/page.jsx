'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users } from 'lucide-react'

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

const members = [
  { initials: 'RK', name: 'Raghav Kejriwal', role: 'Project Lead', stream: 'MCA AIML', desc: 'Oversees the entire project, coordinates cross-team integration, and manages publication timeline and mentor communications.' },
  { initials: 'PS', name: 'Priyansu Sahoo', role: 'ML Module Lead', stream: 'MCA AIML', desc: 'Building the Random Forest expense classifier, K-means user segmentation, and Financial Health Score computation. ML model accuracy will be validated through the pilot user study.' },
  { initials: 'HN', name: 'Harsh Nagar', role: 'CSIT Module Lead', stream: 'MSc CSIT', desc: 'Designed and implemented the Flask backend architecture, REST API endpoints, and SQLite/PostgreSQL database schema.' },
  { initials: 'HK', name: 'Harshit Khanna', role: 'CSIT Module Support', stream: 'MSc CSIT', desc: 'Led frontend UI design and React.js component development, ensuring mobile-responsive, accessible user experience.' },
  { initials: 'KA', name: 'Karthik', role: 'Animation Module Lead', stream: 'MSc Animation', desc: 'Created all 5 animated learning modules — Snowball, Building Blocks, Silent Thief, Roller Coaster, and Bucket System.' },
  { initials: 'OA', name: 'Osman Alther', role: 'Economics Module Lead', stream: 'MA Economics', desc: 'Developed the behavioral economics curriculum, Indian financial context content, and quiz question bank.' },
]
const mentor = { initials: 'HP', name: 'Prof. Haripriya V', role: 'Faculty Mentor', stream: 'JAIN University', desc: 'Provides academic guidance, research methodology oversight, and paper review across all four discipline modules.' }

export default function TeamPage() {
  return (
    <main>
      <section className="section">
        <Reveal>
          <div className="section-tag"><Users size={14} /> Our Team</div>
          <h1 className="section-title">The People Behind FinLit-X</h1>
          <p className="section-desc">A trans-disciplinary team of 6 students from JAIN University's MCA AIML and MSc programs, each contributing deep expertise from their respective discipline.</p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {members.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.07}>
              <motion.div className="team-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }} transition={{ duration: 0.2 }}>
                <div className="team-avatar" style={{ margin: '0 0 16px 0' }}>{m.initials}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div className="team-name">{m.name}</div>
                    <div className="team-role">{m.role}</div>
                    <div className="team-stream">{m.stream}</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>{m.initials}</div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{m.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.5}>
          <motion.div className="team-card mentor" style={{ textAlign: 'center', marginTop: 24 }} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <div className="team-avatar" style={{ margin: '0 auto 16px' }}>{mentor.initials}</div>
            <div className="team-name">{mentor.name}</div>
            <div className="team-role">{mentor.role}</div>
            <div className="team-stream">{mentor.stream}</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 12, maxWidth: 400, margin: '12px auto 0' }}>{mentor.desc}</p>
          </motion.div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginTop: 64, marginBottom: 24 }}>Team Structure</h2>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '36px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: 500 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Student', 'Stream', 'Role', 'Discipline'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Raghav Kejriwal', 'MCA AIML', 'Project Lead', 'All disciplines'],
                  ['Priyansu Sahoo', 'MCA AIML', 'ML Module Lead', 'AI & Machine Learning'],
                  ['Harsh Nagar', 'MSc CSIT', 'CSIT Module Lead', 'CSIT / Architecture'],
                  ['Harshit Khanna', 'MSc CSIT', 'CSIT Module Support', 'CSIT / UI Design'],
                  ['Karthik', 'MSc Animation', 'Animation Module Lead', 'Animation / Design'],
                  ['Osman Alther', 'MA Economics', 'Economics Module Lead', 'Economics'],
                  ['Prof. Haripriya V', 'Faculty', 'Mentor', 'All disciplines'],
                ].map((row, i) => (
                  <tr key={row[0]} style={{ borderBottom: i < 6 ? '1px solid var(--border)' : 'none' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '14px 12px', fontWeight: j === 0 ? 600 : 400, color: j === 0 ? 'var(--text)' : 'var(--text-secondary)' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>
    </main>
  )
}