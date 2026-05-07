'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, Menu, X, GraduationCap } from 'lucide-react'

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/modules', label: 'Modules' },
    { href: '/technology', label: 'Technology' },
    { href: '/research', label: 'Research' },
    { href: '/team', label: 'Team' },
    { href: '/contact', label: 'Contact' },
    { href: '/help', label: 'Help' },
  ]

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            FinLit<span>-X</span>
          </Link>
          <ul className="nav-links">
            {links.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={pathname === l.href ? 'active' : ''}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/survey" className="nav-survey-btn">
            <ClipboardList size={14} />
            Take Survey
          </Link>
          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={`mobile-menu ${menuOpen ? 'open' : ''}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={pathname === l.href ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/help" className={pathname === '/help' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              Help
            </Link>
            <Link href="/survey" onClick={() => setMenuOpen(false)}>
              <ClipboardList size={16} style={{ marginRight: 8 }} />
              Take Survey
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
