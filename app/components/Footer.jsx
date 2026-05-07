'use client'

import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-brand-name">FinLit-X</div>
            <p className="footer-brand-desc">
              An AI-Driven Financial Literacy System bridging the knowledge gap for Indian college students through interdisciplinary learning.
            </p>
            <div className="footer-badge">
              <GraduationCap size={14} />
              JAIN University MCA AIML — Semester 2
            </div>
          </div>
          <div>
            <div className="footer-col-title">Explore</div>
            <ul className="footer-links">
              <li><Link href="/modules">Modules</Link></li>
              <li><Link href="/technology">Technology</Link></li>
              <li><Link href="/research">Research Paper</Link></li>
              <li><Link href="/team">Team</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Disciplines</div>
            <ul className="footer-links">
              <li><Link href="/about">AI & Machine Learning</Link></li>
              <li><Link href="/about">Economics</Link></li>
              <li><Link href="/about">Animation</Link></li>
              <li><Link href="/about">CSIT</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Connect</div>
            <ul className="footer-links">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/research">IJEDICT Journal</Link></li>
              <li><Link href="/modules">Google Slides</Link></li>
              <li><Link href="/survey">Mobile App</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 FinLit-X · JAIN University · MCA AIML Semester 2</span>
          <span>Mentor: Prof. Haripriya V</span>
        </div>
      </div>
    </footer>
  )
}
