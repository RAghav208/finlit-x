'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase.js'
import {
  ClipboardList, User, Brain, CheckCircle2, ChevronRight, ChevronLeft,
  AlertTriangle, Info, HeartHandshake, Star, Clock, Eye,
  Shield, ArrowRight, Award, HelpCircle, RotateCcw, Users, BarChart3,
  CheckSquare, Square, ChevronDown, ChevronUp
} from 'lucide-react'

const STEPS = [
  { id: 'info',          label: 'Study Overview',   icon: Info,           color: '#15803D' },
  { id: 'consent',       label: 'Consent',           icon: HeartHandshake, color: '#15803D' },
  { id: 'demo',          label: 'About You',         icon: User,           color: '#15803D' },
  { id: 'prequiz',       label: 'Pre-Quiz',           icon: Brain,          color: '#7c3aed' },
  { id: 'modulesOverview', label: 'Learning Modules', icon: Eye,           color: '#0369a1', isGroup: true },
  { id: 'module1',       label: 'Compound Interest', icon: Brain,         color: '#15803D', parent: 'modulesOverview' },
  { id: 'module2',       label: 'Credit Scores',      icon: BarChart3,      color: '#0369a1', parent: 'modulesOverview' },
  { id: 'module3',       label: 'Inflation',          icon: Star,           color: '#A16207', parent: 'modulesOverview' },
  { id: 'module4',       label: 'Budgeting',          icon: BarChart3,      color: '#7c3aed', parent: 'modulesOverview' },
  { id: 'module5',       label: 'Risk & Return',      icon: AlertTriangle,  color: '#dc2626', parent: 'modulesOverview' },
  { id: 'postquiz',      label: 'Post-Quiz',          icon: CheckCircle2,   color: '#7c3aed' },
  { id: 'satisfaction',  label: 'Feedback',           icon: Star,           color: '#A16207' },
  { id: 'complete',      label: 'Complete',          icon: Award,          color: '#15803D' },
]

const QUIZ_SECTIONS = [
  { id: 'compound', label: 'Compound Interest',  color: '#15803D', questions: 4 },
  { id: 'credit',   label: 'Credit Scores',       color: '#0369a1', questions: 4 },
  { id: 'inflation', label: 'Inflation',          color: '#A16207', questions: 3 },
  { id: 'budget',   label: 'Budgeting',           color: '#7c3aed', questions: 2 },
  { id: 'risk',     label: 'Risk & Return',      color: '#dc2626', questions: 2 },
]

const ALL_QUIZ_QUESTIONS = [
  { section: 'compound', q: 'You invest Rs. 10,000 at 10% annual interest. How much will you have after 2 years (compounded annually)?', opts: ['Rs. 11,000', 'Rs. 12,000', 'Rs. 12,100', 'Rs. 11,500'] },
  { section: 'compound', q: 'Two people start investing at age 25. Person A invests Rs. 5,000/month for 10 years then stops. Person B starts at age 35 for 30 years. Who has more at age 65 (at 12% return)?', opts: ['Person A (started early)', 'Person B (invested 30 years)', 'Both equal', 'Cannot determine'] },
  { section: 'compound', q: 'The "Rule of 72" helps you quickly estimate:', opts: ['How much you need to retire', 'Years to double your investment', 'Your monthly expense ratio', 'The inflation rate'] },
  { section: 'compound', q: 'Why do financial experts call compound interest the "eighth wonder of the world"?', opts: ['It was invented in the 8th century', 'It requires complex math', 'Money grows exponentially over time', 'It only applies to bank deposits'] },
  { section: 'credit', q: 'In India, CIBIL credit scores range from:', opts: ['0 to 500', '300 to 900', '500 to 1000', '100 to 800'] },
  { section: 'credit', q: 'Which of the following has the MOST POSITIVE impact on your credit score?', opts: ['Using >75% of your credit limit', 'Paying only the minimum amount due', 'Paying all bills on time, <30% utilization', 'Closing your oldest credit card'] },
  { section: 'credit', q: 'A credit score of 800 is generally considered:', opts: ['Poor', 'Average', 'Good to Excellent', 'Perfect (maximum)'] },
  { section: 'credit', q: 'If you miss one credit card payment, how long does it typically stay on your CIBIL report?', opts: ['1 month', '6 months', '12 months', '7 years'] },
  { section: 'inflation', q: 'If inflation is 6% per year, how much purchasing power does Rs. 10,000 lose in 1 year?', opts: ['Rs. 100', 'Rs. 600', 'Rs. 1,000', 'Rs. 10,600'] },
  { section: 'inflation', q: 'Your savings account earns 4% interest and inflation is 6%. What is happening to your money in real terms?', opts: ['Growing in real value', 'Maintaining same real value', 'Losing purchasing power', 'Guaranteed to grow'] },
  { section: 'inflation', q: 'At 5% annual inflation, your Rs. 20,000 monthly expenses today would need to be approximately how much in 20 years?', opts: ['Rs. 40,000', 'Rs. 53,000', 'Rs. 80,000', 'Rs. 20,000 (inflation does not matter)'] },
  { section: 'budget', q: 'The 50-30-20 budgeting rule suggests allocating 50% of income to:', opts: ['Investments', 'Needs (rent, groceries, utilities)', 'Wants (entertainment, dining out)', 'Emergency fund'] },
  { section: 'budget', q: 'At Rs. 25,000 monthly income, how much should go to savings/debt repayment per the 50-30-20 rule?', opts: ['Rs. 1,250 (5%)', 'Rs. 2,500 (10%)', 'Rs. 5,000 (20%)', 'Rs. 7,500 (30%)'] },
  { section: 'risk', q: 'Which investment typically carries the HIGHEST risk?', opts: ['Public Provident Fund (PPF)', 'Fixed Deposit (FD)', 'Direct Equity (Individual stocks)', 'Public Sector Bank Savings Account'] },
  { section: 'risk', q: '"Diversification" in investing means:', opts: ['All money in one investment', 'Spreading across assets to reduce risk', 'Only government securities', 'Switching investments monthly'] },
]

const CORRECT = [2, 0, 1, 2, 1, 2, 2, 3, 1, 2, 1, 1, 2, 2, 1]
const SATISFACTION_Q = [
  'The animated visual metaphors (snowball, building blocks, etc.) made financial concepts easier to understand.',
  'I felt engaged and interested while using the FinLit-X platform.',
  'The personalized learning path was relevant to my financial situation.',
  'The expense categorization feature was useful and accurate.',
  'I would recommend this platform to other college students.',
  'My confidence in making financial decisions has improved after this study.',
]

function generateCode() {
  const num = Math.floor(100 + Math.random() * 900)
  return `FIN-${num}`
}

// ============================================================
// STEP SIDEBAR — matches website card style exactly
// ============================================================
function StepSidebar({ currentStep, onStepClick }) {
  const moduleIds = ['module1', 'module2', 'module3', 'module4', 'module5']
  const inModules = moduleIds.includes(currentStep) || currentStep === 'modulesOverview'
  const pastModules = ['postquiz', 'satisfaction', 'complete'].includes(currentStep)

  // Auto-open when in modules section, auto-close when past
  const [modulesOpen, setModulesOpen] = useState(inModules && !pastModules)

  // Sync open state if user navigates programmatically
  useEffect(() => {
    if (inModules && !pastModules) setModulesOpen(true)
    if (pastModules) setModulesOpen(false)
  }, [currentStep])

  const stepOrder = ['info', 'consent', 'demo', 'prequiz', 'modulesOverview', 'module1', 'module2', 'module3', 'module4', 'module5', 'postquiz', 'satisfaction', 'complete']
  const currentIdx = stepOrder.indexOf(currentStep)

  // Count progress: group and children each count as 1 for the progress bar
  const totalSteps = STEPS.length
  const completedCount = stepOrder.slice(0, currentIdx).filter(id => !moduleIds.includes(id) || moduleIds.indexOf(id) < moduleIds.indexOf(currentStep)).length

  // Individual step status
  const getStatus = (step) => {
    if (step.parent) {
      const parentIdx = stepOrder.indexOf(step.parent)
      const stepIdx = stepOrder.indexOf(step.id)
      if (stepIdx < currentIdx) return 'done'
      if (stepIdx === currentIdx) return 'current'
      return 'future'
    }
    const idx = STEPS.findIndex(s => s.id === step.id)
    const stepActualIdx = stepOrder.indexOf(step.id)
    if (stepActualIdx < currentIdx) return 'done'
    if (stepActualIdx === currentIdx) return 'current'
    return 'future'
  }

  // Group status
  const groupIdx = STEPS.findIndex(s => s.id === 'modulesOverview')
  const groupActualIdx = stepOrder.indexOf('modulesOverview')
  const getGroupStatus = () => {
    if (currentIdx > groupActualIdx + 5) return 'done'
    if (currentIdx >= groupActualIdx) return inModules ? 'current' : 'done'
    return 'future'
  }

  // Top-level steps (excluding module children)
  const topSteps = STEPS.filter(s => !s.parent)
  const childSteps = STEPS.filter(s => s.parent === 'modulesOverview')

  return (
    <div style={{
      width: 260,
      flexShrink: 0,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow)',
      height: 'fit-content',
      position: 'sticky',
      top: 96,
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '20px 20px 16px',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--bg)',
          border: '1px solid var(--border-strong)',
          color: 'var(--primary)',
          padding: '3px 12px',
          borderRadius: 100,
          fontSize: '0.72rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: 8,
        }}>
          <ClipboardList size={11} /> Research Study
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
          FinLit-X User Study
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>Study ID: FINLIT-2026-001</div>
      </div>

      {/* Step list */}
      <div style={{ padding: '8px 12px' }}>
        {topSteps.map((step) => {
          const status = getStatus(step)
          const groupStatus = step.id === 'modulesOverview' ? getGroupStatus() : status
          const isGroup = step.isGroup

          return (
            <div key={step.id}>
              {/* Group header (Learning Modules) */}
              {isGroup ? (
                <div>
                  <div
                    onClick={() => setModulesOpen(o => !o)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 10px',
                      borderRadius: 10,
                      background: groupStatus === 'current' ? 'var(--bg)' : 'transparent',
                      border: groupStatus === 'current' ? '1px solid var(--border)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      marginBottom: modulesOpen ? 4 : 0,
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: groupStatus === 'done' ? 'var(--primary)' : groupStatus === 'current' ? step.color : 'var(--bg)',
                      border: groupStatus === 'done' ? '1px solid var(--primary)' : groupStatus === 'current' ? `1px solid ${step.color}` : '1px solid var(--border)',
                      transition: 'all 0.2s',
                    }}>
                      {groupStatus === 'done' ? (
                        <CheckCircle2 size={13} color="white" />
                      ) : (
                        <Eye size={13} color={groupStatus === 'current' ? step.color : 'var(--text-muted)'} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: groupStatus === 'current' ? '0.85rem' : '0.8rem',
                        fontWeight: groupStatus === 'current' ? 700 : groupStatus === 'done' ? 600 : 400,
                        color: groupStatus === 'current' ? step.color : groupStatus === 'done' ? 'var(--text)' : 'var(--text-muted)',
                        transition: 'all 0.2s',
                      }}>{step.label}</div>
                      {groupStatus === 'current' && (
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>In progress</div>
                      )}
                    </div>
                    <motion.div animate={{ rotate: modulesOpen ? 0 : -90 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={14} color="var(--text-muted)" />
                    </motion.div>
                  </div>

                  {/* Module children */}
                  <AnimatePresence>
                    {modulesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden', paddingLeft: 12 }}
                      >
                        {childSteps.map((child, ci) => {
                          const childStatus = getStatus(child)
                          return (
                            <div
                              key={child.id}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '8px 10px', borderRadius: 8,
                                background: childStatus === 'current' ? 'var(--bg)' : 'transparent',
                                border: childStatus === 'current' ? '1px solid var(--border)' : '1px solid transparent',
                                transition: 'all 0.2s', marginBottom: 2,
                              }}
                            >
                              <div style={{
                                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: childStatus === 'done' ? 'var(--primary)' : childStatus === 'current' ? child.color : 'var(--bg)',
                                border: childStatus === 'done' ? '1px solid var(--primary)' : childStatus === 'current' ? `1px solid ${child.color}` : '1px solid var(--border)',
                                transition: 'all 0.2s',
                              }}>
                                {childStatus === 'done' ? (
                                  <CheckCircle2 size={10} color="white" />
                                ) : (
                                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: childStatus === 'current' ? child.color : 'var(--text-muted)' }}>{ci + 1}</span>
                                )}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: childStatus === 'current' ? '0.8rem' : '0.75rem',
                                  fontWeight: childStatus === 'current' ? 700 : childStatus === 'done' ? 600 : 400,
                                  color: childStatus === 'current' ? child.color : childStatus === 'done' ? 'var(--text)' : 'var(--text-muted)',
                                  transition: 'all 0.2s',
                                }}>{child.label}</div>
                                {childStatus === 'current' && (
                                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>In progress</div>
                                )}
                              </div>
                              {childStatus === 'done' && (
                                <ChevronRight size={12} color="var(--text-muted)" />
                              )}
                            </div>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Regular step */
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 10px', borderRadius: 10,
                    background: status === 'current' ? 'var(--bg)' : 'transparent',
                    border: status === 'current' ? '1px solid var(--border)' : '1px solid transparent',
                    cursor: 'default', transition: 'all 0.2s', marginBottom: 2,
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: status === 'done' ? 'var(--primary)' : status === 'current' ? step.color : 'var(--bg)',
                    border: status === 'done' ? '1px solid var(--primary)' : status === 'current' ? `1px solid ${step.color}` : '1px solid var(--border)',
                    transition: 'all 0.2s',
                  }}>
                    {status === 'done' ? (
                      <CheckCircle2 size={13} color="white" />
                    ) : (
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: status === 'current' ? step.color : 'var(--text-muted)' }}>
                        {stepOrder.indexOf(step.id) + 1}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: status === 'current' ? '0.85rem' : '0.8rem',
                      fontWeight: status === 'current' ? 700 : status === 'done' ? 600 : 400,
                      color: status === 'current' ? step.color : status === 'done' ? 'var(--text)' : 'var(--text-muted)',
                      transition: 'all 0.2s',
                    }}>{step.label}</div>
                    {status === 'current' && (
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 1 }}>In progress</div>
                    )}
                  </div>
                  {status === 'done' && (
                    <ChevronRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom stats */}
      <div style={{
        marginTop: 4, padding: '16px 20px',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: 0, background: 'var(--bg)',
      }}>
        <div style={{ flex: 1, textAlign: 'center', paddingRight: 12 }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
            {completedCount}/{totalSteps}
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            Steps done
          </div>
        </div>
        <div style={{ width: 1, background: 'var(--border)' }} />
        <div style={{ flex: 1, textAlign: 'center', paddingLeft: 12 }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
            {Math.round((currentIdx / (stepOrder.length - 1)) * 100)}%
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            Complete
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// INFO STEP
// ============================================================
function InfoStep({ onNext, studyGroup }) {
  return (
    <div style={{ flex: 1, maxWidth: 680 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 40px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52,
            background: 'var(--bg-secondary)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <ClipboardList size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
              Study ID: FINLIT-2026-001
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', margin: 0 }}>
              Welcome to the FinLit-X Research Study
            </h2>
          </div>
          {studyGroup === 'control' && (
            <div style={{
              marginLeft: 'auto',
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#ede9fe', border: '1px solid #c4b5fd',
              borderRadius: 100, padding: '6px 14px',
              fontSize: '0.78rem', fontWeight: 700, color: '#6d28d9'
            }}>
              Control Group
            </div>
          )}
        </div>

        {studyGroup === 'control' && (
          <div style={{
            background: '#ede9fe', border: '1px solid #c4b5fd',
            borderRadius: 12, padding: '16px 18px', marginBottom: 24,
            display: 'flex', gap: 12, alignItems: 'flex-start'
          }}>
            <div style={{ fontSize: '1.2rem', flexShrink: 0 }}>ℹ️</div>
            <div style={{ fontSize: '0.88rem', color: '#4c1d95', lineHeight: 1.6 }}>
              <strong>Control Group:</strong> You will take the pre-quiz and post-quiz with a short delay between them — no animated modules in between. This helps us measure the effectiveness of the FinLit-X learning platform against a baseline.
            </div>
          </div>
        )}

        {/* Time + privacy badges */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 100, padding: '6px 14px',
            fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)'
          }}>
            <Clock size={14} /> ~60-90 minutes total
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--accent-lightest)', border: '1px solid #fde68a',
            borderRadius: 100, padding: '6px 14px',
            fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)'
          }}>
            <Shield size={14} /> Your data stays anonymous
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 100, padding: '6px 14px',
            fontSize: '0.82rem', color: 'var(--text-muted)'
          }}>
            <AlertTriangle size={14} /> Exit anytime
          </div>
        </div>

        <div style={{ background: 'rgba(21,128,61,0.06)', border: '1px solid rgba(21,128,61,0.12)', borderRadius: 14, padding: '20px 24px', marginBottom: 28, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
            <ClipboardList size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 8, lineHeight: 1.5 }}>
              "Evaluating the Impact of AI-Driven Animated Financial Literacy Modules on Indian College Students"
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              This study is conducted by students at <strong>JAIN (Deemed-to-be University), Bengaluru</strong>, under the mentorship of <strong>Prof. Haripriya V</strong>, as part of the MCA AIML Semester 2 FinLit-X project.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
          {[
            { icon: Clock, title: '60-90 minutes', desc: 'Total time for all steps' },
            { icon: Shield, title: '100% Anonymous', desc: 'No names or IDs collected' },
            { icon: Users, title: '50+ participants', desc: 'Target sample size' },
            { icon: Brain, title: 'Pre & Post Quiz', desc: '15 questions each round' },
          ].map(item => (
            <div key={item.title} style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '14px 16px',
              display: 'flex', gap: 12, alignItems: 'flex-start'
            }}>
              <div style={{
                width: 36, height: 36,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)', flexShrink: 0
              }}>
                <item.icon size={17} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '12px 20px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>
            What happens in this study
          </div>
          {[
            { step: '01', text: 'Complete a brief demographics form (age, program, year, etc.) — no names collected' },
            { step: '02', text: 'Take a 15-question financial literacy pre-quiz (~10 minutes)' },
            { step: '03', text: 'Use the FinLit-X interactive learning platform (~45-60 minutes)' },
            { step: '04', text: 'Take the same 15 questions as a post-quiz to measure learning' },
            { step: '05', text: 'Share your feedback through a short satisfaction survey (~5 minutes)' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 20px', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 28, height: 28, background: 'var(--primary)', color: 'white', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.72rem', flexShrink: 0, marginTop: 1 }}>
                {item.step}
              </div>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.text}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--accent-lightest)', border: '1px solid #fde68a', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 28 }}>
          <Info size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent)', marginBottom: 4 }}>Privacy Guarantee</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              <strong>No personal information is collected.</strong> You receive an anonymous code (e.g., FIN-742). All quiz responses are linked only to this code. Data is used only for academic research — no individual is ever identifiable.
            </p>
          </div>
        </div>

        <motion.button
          onClick={onNext}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          Begin Study — Continue to Consent <ChevronRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  )
}

// ============================================================
// CONSENT STEP
// ============================================================
function ConsentStep({ onNext }) {
  const [checked, setChecked] = useState({
    c1: false, c2: false, c3: false, c4: false,
    c5: false, c6: false, c7: false, c8: false
  })

  // Select All toggle
  const allChecked = Object.values(checked).every(Boolean)
  const toggleAll = () => {
    if (allChecked) {
      setChecked({ c1: false, c2: false, c3: false, c4: false, c5: false, c6: false, c7: false, c8: false })
    } else {
      setChecked({ c1: true, c2: true, c3: true, c4: true, c5: true, c6: true, c7: true, c8: true })
    }
  }

  const items = [
    { key: 'c1', text: 'I have read and understood the Study Information Sheet above.' },
    { key: 'c2', text: 'I understand that no personal identifying information (name, email, enrollment number) will be collected.' },
    { key: 'c3', text: 'I understand I will be assigned an anonymous participant code for this study.' },
    { key: 'c4', text: 'I understand what is expected of me as a participant (pre-quiz, learning platform, post-quiz, survey).' },
    { key: 'c5', text: 'I understand that participation is voluntary and I may withdraw at any time without consequence.' },
    { key: 'c6', text: 'I understand that my anonymous data will be used for academic research and may be published.' },
    { key: 'c7', text: 'I understand data will be stored securely and destroyed 12 months post-publication.' },
    { key: 'c8', text: 'I am 18 years or older and freely consent to participate in this research.' },
  ]

  return (
    <div style={{ flex: 1, maxWidth: 680 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 40px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 52, height: 52,
            background: 'var(--bg-secondary)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <HeartHandshake size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Step 2 of 8</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: 0 }}>Informed Consent</h2>
          </div>
        </div>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.7 }}>
          Please read and confirm each statement below. You must check all boxes to proceed. Participation is entirely voluntary — you may stop at any time.
        </p>

        {/* Individual checkboxes — user reads all before seeing Select All */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {items.map((item) => (
            <motion.label
              key={item.key}
              style={{
                display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 16px',
                background: checked[item.key] ? 'var(--bg-secondary)' : 'var(--bg)',
                border: checked[item.key] ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
              }}
              whileTap={{ scale: 0.995 }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                background: checked[item.key] ? 'var(--primary)' : 'var(--surface)',
                border: checked[item.key] ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                {checked[item.key] && <CheckCircle2 size={14} color="white" />}
              </div>
              <span style={{ fontSize: '0.88rem', lineHeight: 1.5, color: checked[item.key] ? 'var(--text)' : 'var(--text-secondary)' }}>
                {item.text}
              </span>
              <input type="checkbox" checked={checked[item.key]} onChange={() => setChecked(p => ({ ...p, [item.key]: !p[item.key] }))} style={{ display: 'none' }} />
            </motion.label>
          ))}
        </div>

        {/* Select All — after items so user reads all first */}
        <motion.button
          onClick={toggleAll}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            width: '100%', padding: '12px 18px',
            marginBottom: 24,
            background: allChecked ? 'var(--bg-secondary)' : 'var(--bg)',
            border: allChecked ? '2px solid var(--primary)' : '1.5px solid var(--border)',
            borderRadius: 12,
            cursor: 'pointer',
            fontFamily: 'var(--font)',
            transition: 'all 0.2s',
          }}
          whileTap={{ scale: 0.995 }}
        >
          <div style={{
            width: 24, height: 24, borderRadius: 6, flexShrink: 0,
            background: allChecked ? 'var(--primary)' : 'var(--surface)',
            border: allChecked ? '2px solid var(--primary)' : '1.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
            {allChecked ? <CheckSquare size={14} color="white" /> : <Square size={14} color="var(--text-muted)" />}
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.92rem', color: allChecked ? 'var(--primary)' : 'var(--text)' }}>
            {allChecked ? 'Deselect All' : 'Select All'}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {Object.values(checked).filter(Boolean).length}/{items.length} confirmed
          </span>
        </motion.button>

        <div style={{ display: 'flex', gap: 12 }}>
          <motion.button
            onClick={onNext}
            disabled={!allChecked}
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center', opacity: allChecked ? 1 : 0.45, cursor: allChecked ? 'pointer' : 'not-allowed' }}
            whileHover={allChecked ? { scale: 1.01 } : {}}
            whileTap={allChecked ? { scale: 0.99 } : {}}
          >
            I Consent — Continue <ChevronRight size={18} />
          </motion.button>
        </div>
        {!allChecked && (
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 12 }}>
            Please confirm all {items.length} statements to proceed.
          </p>
        )}
      </motion.div>
    </div>
  )
}

// ============================================================
// DEMOGRAPHICS STEP
// ============================================================
function DemoStep({ data, onChange, onNext }) {
  const set = (k, v) => onChange({ ...data, [k]: v })

  const answeredFields = [data.age, data.gender, data.program, data.year, data.allowance, data.priorApp, data.confidence].filter(Boolean).length
  const totalFields = 7

  const done = data.age && data.gender && data.program && data.year && data.allowance && data.priorApp !== null

  return (
    <div style={{ flex: 1, maxWidth: 680 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 40px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 52, height: 52,
            background: 'var(--bg-secondary)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <User size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Step 3 of 8</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: 0 }}>Tell Us About Yourself</h2>
          </div>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
            {answeredFields}/{totalFields}
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 24 }}>
          This helps us understand our participant group. All data is anonymous — no names or identifying information is collected.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>Age (in years) <span style={{ color: 'var(--accent)' }}>*</span></div>
            <input type="number" className="form-input" placeholder="Enter your age" min="18" max="60" value={data.age || ''} onChange={e => set('age', e.target.value)} />
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>Gender <span style={{ color: 'var(--accent)' }}>*</span></div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Male', 'Female', 'Other', 'Prefer not to say'].map(o => (
                <button key={o} onClick={() => set('gender', o)} style={{
                  padding: '10px 16px', borderRadius: 10,
                  border: data.gender === o ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  background: data.gender === o ? 'var(--bg-secondary)' : 'var(--surface)',
                  color: data.gender === o ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: data.gender === o ? 600 : 400, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font)', minHeight: 44,
                }}>{o}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>Academic Program <span style={{ color: 'var(--accent)' }}>*</span></div>
            <input type="text" className="form-input" placeholder="e.g., MCA, BSc, MSc, MA, MBA" value={data.program || ''} onChange={e => set('program', e.target.value)} />
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>Year of Study <span style={{ color: 'var(--accent)' }}>*</span></div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['1st Year', '2nd Year', '3rd Year', 'Other'].map(o => (
                <button key={o} onClick={() => set('year', o)} style={{
                  padding: '10px 16px', borderRadius: 10,
                  border: data.year === o ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  background: data.year === o ? 'var(--bg-secondary)' : 'var(--surface)',
                  color: data.year === o ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: data.year === o ? 600 : 400, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font)', minHeight: 44,
                }}>{o}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>Monthly Allowance / Income (approx.) <span style={{ color: 'var(--accent)' }}>*</span></div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['< Rs. 5,000', 'Rs. 5,000 - 10,000', 'Rs. 10,000 - 20,000', 'Rs. 20,000 - 30,000', '> Rs. 30,000'].map(o => (
                <button key={o} onClick={() => set('allowance', o)} style={{
                  padding: '10px 14px', borderRadius: 10,
                  border: data.allowance === o ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  background: data.allowance === o ? 'var(--bg-secondary)' : 'var(--surface)',
                  color: data.allowance === o ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: data.allowance === o ? 600 : 400, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font)', minHeight: 44,
                }}>{o}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>Have you used a financial planning/budgeting app before? <span style={{ color: 'var(--accent)' }}>*</span></div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['Yes', true], ['No', false]].map(([label, val]) => (
                <button key={label} onClick={() => set('priorApp', val)} style={{
                  padding: '10px 24px', borderRadius: 10,
                  border: data.priorApp === val ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  background: data.priorApp === val ? 'var(--bg-secondary)' : 'var(--surface)',
                  color: data.priorApp === val ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: data.priorApp === val ? 600 : 400, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font)', minHeight: 44,
                }}>{label}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>How confident are you about your financial knowledge? <span style={{ color: 'var(--accent)' }}>*</span></div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                [1, 'Not at all'],
                [2, 'Slightly'],
                [3, 'Moderately'],
                [4, 'Very'],
                [5, 'Extremely'],
              ].map(([val, label]) => (
                <div key={val} style={{ flex: 1, textAlign: 'center' }}>
                  <button
                    onClick={() => set('confidence', val)}
                    style={{
                      width: '100%', padding: '10px 0', borderRadius: 10, marginBottom: 4,
                      border: data.confidence === val ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                      background: data.confidence === val ? 'var(--primary)' : 'var(--surface)',
                      color: data.confidence === val ? 'white' : 'var(--text-secondary)',
                      fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'var(--font)',
                      transition: 'all 0.15s', minHeight: 44,
                    }}
                  >{val}</button>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <motion.button
            onClick={onNext}
            disabled={!done}
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center', opacity: done ? 1 : 0.45 }}
            whileHover={done ? { scale: 1.01 } : {}}
            whileTap={done ? { scale: 0.99 } : {}}
          >
            Continue to Pre-Quiz <ChevronRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// ============================================================
// QUIZ STEP
// ============================================================
function QuizStep({ title, subtitle, onNext, answers, onAnswer, preQuizScore }) {
  const [current, setCurrent] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const allAnswered = answers.every(a => a !== null)
  const answeredCount = answers.filter(a => a !== null).length
  const currentQ = ALL_QUIZ_QUESTIONS[current]
  const sectionInfo = QUIZ_SECTIONS.find(s => s.id === currentQ.section)

  // Build section map
  const sectionMap = {}
  ALL_QUIZ_QUESTIONS.forEach((q, i) => {
    if (!sectionMap[q.section]) sectionMap[q.section] = []
    sectionMap[q.section].push(i)
  })

  // Auto-advance on selection (400ms delay)
  const handleAnswer = (value) => {
    onAnswer(current, value)
    if (current < ALL_QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrent(c => c + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 400)
    }
  }

  // Section completion count
  const sectionIndices = sectionMap[currentQ.section]
  const secAnswered = sectionIndices.filter(i => answers[i] !== null).length
  const isPostQuiz = title === 'Post-Quiz'
  const quizScore = answers.filter((a, i) => a === CORRECT[i]).length

  // Show score screen after quiz submitted
  if (showScore) {
    const maxScore = ALL_QUIZ_QUESTIONS.length
    const percentage = Math.round((quizScore / maxScore) * 100)
    const isGood = percentage >= 60

    return (
      <div style={{ flex: 1, maxWidth: 680 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <div style={{
              width: 52, height: 52,
              background: isGood ? 'var(--bg-secondary)' : 'var(--accent-lightest)',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isGood ? 'var(--primary)' : 'var(--accent)',
            }}>
              <Award size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                {title}
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: 0 }}>
                Quiz Complete
              </h2>
            </div>
          </div>

          {/* Score card — matches website stat card style */}
          <div style={{
            background: isGood ? 'var(--bg-secondary)' : 'var(--accent-lightest)',
            border: `1px solid ${isGood ? 'var(--border)' : '#fde68a'}`,
            borderRadius: 20,
            padding: '28px 32px',
            marginBottom: 24,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
              Your Score
            </div>
            <div style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              color: isGood ? 'var(--primary)' : 'var(--accent)',
              fontFamily: 'var(--font-display)',
              lineHeight: 1,
              marginBottom: 4,
            }}>
              {quizScore}<span style={{ fontSize: '1.5rem', fontWeight: 400, color: 'var(--text-muted)' }}>/{maxScore}</span>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 100,
              padding: '4px 14px',
              fontSize: '0.82rem', fontWeight: 700,
              color: isGood ? 'var(--primary)' : 'var(--accent)',
              marginTop: 8,
            }}>
              {percentage}% correct
            </div>
          </div>

          {/* Performance message */}
          <div style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 24,
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 8 }}>
              {isGood ? "Great start!" : "Keep learning!"}
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {quizScore >= 12 ? "You have a strong financial literacy foundation. The learning modules will help you deepen your understanding."
                : quizScore >= 8 ? "You've covered the basics well. Focus on the areas below to strengthen your knowledge."
                : quizScore >= 5 ? "You're building your financial foundations. The animated modules will make concepts clearer and more memorable."
                : "Everyone starts somewhere. The FinLit-X learning modules are designed to make financial concepts accessible and engaging."}
            </p>
          </div>

          {/* Pre vs Post comparison for post-quiz */}
          {isPostQuiz && preQuizScore !== undefined && (
            <div style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '20px 24px',
              marginBottom: 24,
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 16 }}>Learning Progress</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>
                <div style={{ textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>{preQuizScore}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 4 }}>Before</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                  <ArrowRight size={20} color="var(--text-muted)" />
                  {quizScore > preQuizScore && (
                    <div style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: 100,
                      padding: '3px 10px',
                      fontSize: '0.72rem', fontWeight: 700,
                      color: 'var(--primary)',
                    }}>
                      +{quizScore - preQuizScore}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: quizScore > preQuizScore ? 'var(--primary)' : 'var(--accent)', fontFamily: 'var(--font-display)' }}>{quizScore}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 4 }}>After</div>
                </div>
              </div>
            </div>
          )}

          {/* Topic breakdown */}
          <div style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 28,
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 16 }}>Score by Topic</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {QUIZ_SECTIONS.map(sec => {
                const indices = sectionMap[sec.id]
                const sectionCorrect = indices.filter(i => answers[i] === CORRECT[i]).length
                const total = indices.length
                const pct = Math.round((sectionCorrect / total) * 100)
                return (
                  <div key={sec.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: sec.color }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{sec.label}</span>
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: pct >= 50 ? 'var(--primary)' : 'var(--accent)' }}>
                        {sectionCorrect}/{total}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
                      <div style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: pct >= 50 ? sec.color : 'var(--accent)',
                        borderRadius: 100,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <motion.button
            onClick={onNext}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isPostQuiz ? 'Continue to Feedback' : 'Continue to Learning Module'} <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
            <div style={{ flex: 1, maxWidth: 720 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40, height: 40,
              background: `${sectionInfo.color}15`,
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: sectionInfo.color
            }}>
              <Brain size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{subtitle}</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', margin: 0 }}>{title}</h2>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{answeredCount}/15 answered</div>
            {isPostQuiz && preQuizScore !== undefined && (
              <div style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600 }}>Pre: {preQuizScore}/15</div>
            )}
          </div>
        </div>

        {/* Section tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {QUIZ_SECTIONS.map(sec => {
            const indices = sectionMap[sec.id]
            const secDone = indices.filter(i => answers[i] !== null).length
            const isActive = ALL_QUIZ_QUESTIONS[current].section === sec.id
            return (
              <button
                key={sec.id}
                onClick={() => { setCurrent(indices[0]) }}
                style={{
                  padding: '5px 12px', borderRadius: 100,
                  border: isActive ? `2px solid ${sec.color}` : '1.5px solid var(--border)',
                  background: isActive ? `${sec.color}15` : 'var(--surface)',
                  color: isActive ? sec.color : 'var(--text-secondary)',
                  fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'var(--font)',
                  display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, minHeight: 36,
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: secDone === indices.length ? sec.color : 'var(--border)' }} />
                {sec.label} <span style={{ opacity: 0.7 }}>({secDone}/{indices.length})</span>
              </button>
            )
          })}
        </div>

        {/* Dot navigation */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
          {ALL_QUIZ_QUESTIONS.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: i === current ? `2px solid ${sectionInfo.color}` : answers[i] !== null ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                background: answers[i] !== null ? (i === current ? `${sectionInfo.color}15` : 'var(--bg-secondary)') : 'var(--bg)',
                color: answers[i] !== null ? (i === current ? sectionInfo.color : 'var(--primary)') : 'var(--text-muted)',
                fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font)',
                transition: 'all 0.15s',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`q-${current}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: sectionInfo.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {sectionInfo.label}
              </div>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {current + 1} / {ALL_QUIZ_QUESTIONS.length}
              </div>
            </div>

            {/* Question */}
            <div style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.5, marginBottom: 20, color: 'var(--text)' }}>
              {currentQ.q}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {currentQ.opts.map((opt, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                    borderRadius: 12,
                    border: answers[current] === i ? `2px solid ${sectionInfo.color}` : '1.5px solid var(--border)',
                    background: answers[current] === i ? `${sectionInfo.color}10` : 'var(--bg)',
                    color: answers[current] === i ? sectionInfo.color : 'var(--text)',
                    fontWeight: answers[current] === i ? 600 : 400,
                    fontSize: '0.92rem',
                    cursor: 'pointer', fontFamily: 'var(--font)',
                    textAlign: 'left',
                    transition: 'all 0.15s', minHeight: 48,
                  }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    border: answers[current] === i ? `2px solid ${sectionInfo.color}` : '1.5px solid var(--border)',
                    background: answers[current] === i ? sectionInfo.color : 'var(--surface)',
                    color: answers[current] === i ? 'white' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.78rem',
                  }}>
                    {answers[current] === i ? <CheckCircle2 size={14} /> : String.fromCharCode(65 + i)}
                  </div>
                  <span>{opt}</span>
                </motion.button>
              ))}

              {/* Not sure option */}
              <motion.button
                onClick={() => handleAnswer(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px',
                  borderRadius: 12,
                  border: answers[current] === null ? '2px dashed var(--text-muted)' : '1.5px dashed var(--border)',
                  background: answers[current] === null ? 'rgba(107,114,128,0.08)' : 'var(--bg)',
                  color: 'var(--text-muted)',
                  fontWeight: answers[current] === null ? 600 : 400,
                  fontSize: '0.88rem',
                  cursor: 'pointer', fontFamily: 'var(--font)',
                  textAlign: 'left',
                  transition: 'all 0.15s', minHeight: 44,
                }}
                whileTap={{ scale: 0.99 }}
              >
                <HelpCircle size={16} style={{ flexShrink: 0, opacity: 0.5 }} />
                <span style={{ opacity: 0.7 }}>Not sure — skip this question</span>
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          <motion.button
            onClick={() => { setCurrent(Math.max(0, current - 1)) }}
            disabled={current === 0}
            className="btn-secondary"
            style={{ opacity: current === 0 ? 0.35 : 1 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            <ChevronLeft size={16} /> Previous
          </motion.button>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {secAnswered}/{sectionIndices.length} in {sectionInfo.label}
          </div>

          <motion.button
            onClick={() => setShowScore(true)}
            disabled={!allAnswered}
            className="btn-primary"
            style={{ background: allAnswered ? 'var(--primary)' : '#9ca3af' }}
            whileHover={allAnswered ? { scale: 1.02 } : {}}
            whileTap={allAnswered ? { scale: 0.98 } : {}}
          >
            Submit Quiz <CheckCircle2 size={16} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// ============================================================
// MODULES OVERVIEW
// ============================================================
function ModulesOverviewStep({ onNext }) {
  const modules = [
    { id: 'module1', label: 'Compound Interest', color: '#15803D', icon: '❄️', desc: 'Watch your money grow exponentially over time — like a snowball rolling downhill, getting bigger with each revolution.', metaphor: 'The Snowball Effect' },
    { id: 'module2', label: 'Credit Scores',       color: '#0369a1', icon: '🏗️', desc: 'Understand how CIBIL scores are built block by block, and how every financial decision adds or removes a brick.', metaphor: 'Building Your Score' },
    { id: 'module3', label: 'Inflation',           color: '#A16207', icon: '💸', desc: 'See how silent inflation eats away at your purchasing power — like a thief stealing in the night.', metaphor: 'The Silent Thief' },
    { id: 'module4', label: 'Budgeting',           color: '#7c3aed', icon: '🎢', desc: 'Experience how income volatility and expenses create ups and downs — and how to smooth out the ride.', metaphor: 'The Budget Roller Coaster' },
    { id: 'module5', label: 'Risk & Return',      color: '#dc2626', icon: '🪣', desc: 'Learn how to allocate across buckets of safety, growth, and risk — like filling and managing a portfolio of buckets.', metaphor: 'The Bucket System' },
  ]

  return (
    <div style={{ flex: 1, maxWidth: 720 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56,
            background: 'var(--bg-secondary)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Eye size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
              Step 5 of 13
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: 0 }}>
              Learning Modules
            </h2>
          </div>
        </div>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
          Each module combines an animated visual metaphor with an interactive sandbox. You will manipulate variables, make predictions, and answer a check question before proceeding. Complete all 5 to unlock the post-quiz.
        </p>

        {/* Module list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {modules.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              {/* Module number */}
              <div style={{
                width: 44, height: 44,
                background: `${m.color}15`,
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{m.label}</span>
                  <span style={{
                    background: `${m.color}15`,
                    color: m.color,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 100,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}>
                    {m.metaphor}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{m.desc}</p>
              </div>

              {/* Arrow */}
              <ChevronRight size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          onClick={onNext}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '0.95rem' }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          Start Module 1: Compound Interest <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  )
}

// ============================================================
// MODULE STEP — shared component for all 5 learning modules
// Each module has: animated intro, interactive sandbox, prediction input, check question
// ============================================================
const MODULE_CONFIGS = {
  module1: {
    title: 'Compound Interest',
    subtitle: 'Module 1 of 5',
    color: '#15803D',
    icon: '❄️',
    metaphor: 'The Snowball Effect',
    concept: 'Compound interest is when you earn interest on your principal AND on the interest you have already earned. Over time, this creates exponential growth — like a snowball rolling downhill, collecting more snow with every turn.',
    sandbox: {
      label: 'Adjust the interest rate and years to see how the snowball grows',
      principal: 10000,
      rate: 10,
      years: 10,
    },
    prediction: {
      prompt: 'If you invested Rs. 10,000 at 20% interest instead of 10%, would your final amount roughly double, or more than double?',
      placeholder: 'Think: if rate doubles, does the result double too?',
    },
    checkQ: {
      q: 'Why does a small increase in interest rate make a big difference over many years?',
      opts: ['Banks want to give you more money', 'Compound interest means you earn interest on previous interest, creating exponential growth', 'The government forces banks to pay more', 'Inflation reduces the value of money over time'],
      correctIdx: 1,
    },
  },
  module2: {
    title: 'Credit Scores',
    subtitle: 'Module 2 of 5',
    color: '#0369a1',
    icon: '🏗️',
    metaphor: 'Building Your Score',
    concept: 'Your CIBIL credit score (300-900) is like a building you construct with every financial decision. On-time payments add floors. Missed payments crack the foundation. Low credit utilization keeps the structure strong.',
    sandbox: {
      label: 'Adjust your credit behavior to see your score change',
      utilization: 30,
      onTimeRate: 80,
      creditAge: 24,
    },
    prediction: {
      prompt: 'If you stop using your credit card completely (0% utilization), will your score improve?',
      placeholder: 'Think: does CIBIL reward active responsible usage or no usage?',
    },
    checkQ: {
      q: 'What is the ideal credit utilization ratio to maintain a good CIBIL score?',
      opts: ['As high as possible (shows you use credit)', '0% (never use credit)', 'Below 30% of your limit', 'Exactly 50% of your limit'],
      correctIdx: 2,
    },
  },
  module3: {
    title: 'Inflation',
    subtitle: 'Module 3 of 5',
    color: '#A16207',
    icon: '💸',
    metaphor: 'The Silent Thief',
    concept: 'Inflation is the gradual rise in prices over time, reducing what your money can buy. At 6% annual inflation, something costing Rs. 100 today will cost Rs. 169 in 10 years. It is a silent thief that erodes your purchasing power year by year.',
    sandbox: {
      label: 'Watch inflation silently reduce your purchasing power',
      initialAmount: 50000,
      inflationRate: 6,
      years: 10,
    },
    prediction: {
      prompt: 'If inflation is 10% per year, will your Rs. 10,000 lose more or less purchasing power compared to 5% inflation?',
      placeholder: 'Think: does higher inflation mean faster or slower erosion?',
    },
    checkQ: {
      q: 'If inflation is 6% and your savings account earns 4%, what is happening to your money in real terms?',
      opts: ['It is growing in real value', 'It is maintaining the same real value', 'It is losing purchasing power (negative real return)', 'It will double in value'],
      correctIdx: 2,
    },
  },
  module4: {
    title: 'Budgeting',
    subtitle: 'Module 4 of 5',
    color: '#7c3aed',
    icon: '🎢',
    metaphor: 'The Budget Roller Coaster',
    concept: 'Budgeting is about creating a plan so your money is intentional, not a chaotic ride. The 50-30-20 rule is a simple framework: 50% for needs (rent, food), 30% for wants (entertainment), and 20% for savings and debt repayment.',
    sandbox: {
      label: 'Adjust your income and see how 50-30-20 allocation changes in rupees',
      income: 25000,
      needs: 50,
      wants: 30,
      savings: 20,
    },
    prediction: {
      prompt: 'If your income doubles but your needs stay the same amount, what happens to the percentage spent on needs?',
      placeholder: 'Think: does a bigger income mean needs cost more, or do they stay fixed?',
    },
    checkQ: {
      q: 'Using the 50-30-20 rule, how much of Rs. 40,000 monthly income should go to needs?',
      opts: ['Rs. 4,000 (10%)', 'Rs. 12,000 (30%)', 'Rs. 20,000 (50%)', 'Rs. 8,000 (20%)'],
      correctIdx: 2,
    },
  },
  module5: {
    title: 'Risk & Return',
    subtitle: 'Module 5 of 5',
    color: '#dc2626',
    icon: '🪣',
    metaphor: 'The Bucket System',
    concept: 'The Bucket Strategy divides your investments into three buckets based on time horizon. Bucket 1 (short-term): safe, liquid (savings, FD). Bucket 2 (mid-term): moderate growth (mutual funds). Bucket 3 (long-term): high-growth, higher risk (equity). Each bucket has a different risk profile.',
    sandbox: {
      label: 'Allocate Rs. 1,00,000 across the three buckets and see your projected outcomes',
      bucket1Pct: 20,
      bucket2Pct: 40,
      bucket3Pct: 40,
      years: 10,
    },
    prediction: {
      prompt: 'If you put all your money in Bucket 3 (equity/stocks), can you lose money in the short term?',
      placeholder: 'Think: do stocks go up every year, or do they fluctuate?',
    },
    checkQ: {
      q: 'Which bucket should hold your emergency fund (money you might need in 1-2 months)?',
      opts: ['Bucket 1 — safe and liquid (FD, savings account)', 'Bucket 2 — moderate growth (mutual funds)', 'Bucket 3 — high-growth (equity/stocks)', 'All buckets equally'],
      correctIdx: 0,
    },
  },
}

function ModuleStep({ moduleId, onNext, onComplete }) {
  const cfg = MODULE_CONFIGS[moduleId]
  const [phase, setPhase] = useState(0) // 0=intro, 1=sandbox, 2=prediction, 3=check
  const [predAnswer, setPredAnswer] = useState('')
  const [checkAnswer, setCheckAnswer] = useState(null)
  const [checkFeedback, setCheckFeedback] = useState(null)
  const [startTime] = useState(Date.now())

  // Sandbox state per module
  const sandboxStates = {
    module1: useState({ principal: cfg.sandbox.principal, rate: cfg.sandbox.rate, years: cfg.sandbox.years }),
    module2: useState({ utilization: cfg.sandbox.utilization, onTimeRate: cfg.sandbox.onTimeRate, creditAge: cfg.sandbox.creditAge }),
    module3: useState({ initialAmount: cfg.sandbox.initialAmount, inflationRate: cfg.sandbox.inflationRate, years: cfg.sandbox.years }),
    module4: useState({ income: cfg.sandbox.income, needs: cfg.sandbox.needs, wants: cfg.sandbox.wants, savings: cfg.sandbox.savings }),
    module5: useState({ bucket1Pct: cfg.sandbox.bucket1Pct, bucket2Pct: cfg.sandbox.bucket2Pct, bucket3Pct: cfg.sandbox.bucket3Pct, years: cfg.sandbox.years }),
  }
  const [sandboxVal, setSandboxVal] = sandboxStates[moduleId]

  const handleCheckSubmit = () => {
    if (checkAnswer === null) return
    setCheckFeedback(checkAnswer === cfg.checkQ.correctIdx ? 'correct' : 'wrong')
  }

  const phases = ['Concept', 'Explore', 'Predict', 'Check']
  const phaseColors = ['#15803D', '#0369a1', '#A16207', '#7c3aed']

  // ---- Compound Interest Timeline (Module 1) ----
  const CompoundTimelineAnim = ({ principal, rate, years }) => {
    const data = []
    let current = principal
    for (let y = 0; y <= years; y++) {
      data.push({ year: y, value: y === 0 ? principal : current })
      if (y > 0) current = current * (1 + rate / 100)
    }

    const maxVal = data[data.length - 1].value
    const maxH = 160
    const barW = Math.max(6, Math.min(24, Math.floor(440 / (years + 1)) - 2))
    const colors = ['#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#15803D']
    const getColor = (v) => {
      const pct = (v - principal) / (maxVal - principal || 1)
      const idx = Math.min(4, Math.floor(pct * 5))
      return colors[idx]
    }

    return (
      <div>
        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 2 }}>You Invested</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#0369a1' }}>₹{principal.toLocaleString()}</div>
          </div>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 2 }}>You Earned</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#A16207' }}>₹{Math.round(maxVal - principal).toLocaleString()}</div>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 2 }}>Total Value</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: '#15803D' }}>₹{Math.round(maxVal).toLocaleString()}</div>
          </div>
        </div>

        {/* Timeline chart */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: maxH, width: '100%' }}>
            {data.map((d, i) => {
              const h = Math.max(4, ((d.value - principal) / (maxVal - principal || 1)) * (maxH - 20) + 8)
              return (
                <motion.div
                  key={d.year}
                  initial={{ height: 4 }}
                  animate={{ height: h }}
                  transition={{ duration: 0.4, delay: i * 0.01 }}
                  style={{
                    flex: 1,
                    background: getColor(d.value),
                    borderRadius: '4px 4px 0 0',
                    minWidth: 4,
                    position: 'relative',
                    cursor: 'default',
                  }}
                  title={`Year ${d.year}: ₹${Math.round(d.value).toLocaleString()}`}
                >
                  {d.year === 0 && (
                    <div style={{
                      position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
                      fontSize: '0.55rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: 600
                    }}>Start</div>
                  )}
                  {d.year === years && (
                    <div style={{
                      position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
                      fontSize: '0.55rem', color: '#15803D', whiteSpace: 'nowrap', fontWeight: 700
                    }}>Yr {years}</div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Bottom labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Year 0
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>
              Year {Math.floor(years / 2)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Year {years}
            </div>
          </div>
        </div>

        {/* Key insight */}
        {years >= 10 && (
          <div style={{ marginTop: 12, background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: '1rem' }}>💡</div>
            <div style={{ fontSize: '0.8rem', color: '#92400e', lineHeight: 1.5 }}>
              In the <strong>last 5 years</strong>, your money grew by ₹{Math.round(data[years].value - data[years - 5].value).toLocaleString()} — more than the entire first {years - 5} years combined.
            </div>
          </div>
        )}
      </div>
    )
  }

  // ---- Credit Score Decision Lab (Module 2) ----
  const CreditDecisionAnim = ({ utilization, onTimeRate, creditAge }) => {
    const score = Math.round(300 + (100 - utilization) * 4 + (onTimeRate / 100) * 150 + (creditAge / 12) * 5)
    const scoreColor = score >= 750 ? '#15803D' : score >= 650 ? '#A16207' : '#dc2626'
    const scoreLabel = score >= 750 ? 'Excellent' : score >= 650 ? 'Fair' : 'Poor'

    // Factors breakdown
    const factors = [
      { label: 'Payment History', pct: onTimeRate, color: '#15803D', icon: '✓' },
      { label: 'Credit Utilization', pct: 100 - utilization, color: '#0369a1', icon: '⚡' },
      { label: 'Credit Age', pct: Math.min(creditAge / 3, 100), color: '#A16207', icon: '📅' },
    ]

    return (
      <div>
        {/* Score display */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px', textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
            Your CIBIL Score
          </div>
          <motion.div
            key={score}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              fontSize: '3.5rem', fontWeight: 800, color: scoreColor,
              fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: 6,
            }}
          >{Math.min(900, score)}</motion.div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${scoreColor}15`, border: `1px solid ${scoreColor}40`,
            borderRadius: 100, padding: '4px 14px',
            fontSize: '0.78rem', fontWeight: 700, color: scoreColor,
          }}>
            {scoreLabel} — {score >= 750 ? 'Great rates available' : score >= 650 ? 'Room for improvement' : 'Start building today'}
          </div>
        </div>

        {/* Score range bar */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>
            <span>300 Poor</span><span>650 Fair</span><span>750 Good</span><span>900 Excellent</span>
          </div>
          <div style={{ height: 8, background: 'var(--border)', borderRadius: 100, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '75%', top: -4, bottom: -4, width: 2, background: '#15803D', borderRadius: 2 }} />
            <motion.div
              animate={{ width: `${((Math.min(900, score) - 300) / 600) * 100}%` }}
              transition={{ duration: 0.5 }}
              style={{ height: '100%', background: `linear-gradient(90deg, #dc2626 0%, #A16207 50%, #15803D 100%)`, borderRadius: 100 }}
            />
            <motion.div
              animate={{ left: `calc(${((Math.min(900, score) - 300) / 600) * 100}% - 1px)` }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute', top: -4, bottom: -4, width: 4, background: 'var(--text)', borderRadius: 2 }}
            />
          </div>
        </div>

        {/* Factor breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {factors.map((f, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)' }}>{f.label}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: f.color }}>{Math.round(f.pct)}%</span>
              </div>
              <div style={{ height: 8, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${Math.min(100, f.pct)}%` }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  style={{ height: '100%', background: f.color, borderRadius: 100 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Key insight */}
        <div style={{ marginTop: 14, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: '1rem' }}>💡</div>
          <div style={{ fontSize: '0.78rem', color: '#166534', lineHeight: 1.5 }}>
            Keeping utilization <strong>below 30%</strong> is the single fastest way to improve your score.
          </div>
        </div>
      </div>
    )
  }

  // ---- Inflation Shopping Cart (Module 3) ----
  const InflationShoppingAnim = ({ initialAmount, inflationRate, years }) => {
    const items = [
      { name: 'Metro Pass', orig: 300, icon: '🚇' },
      { name: 'Samosa + Chai', orig: 50, icon: '🥤' },
      { name: 'Monthly Groceries', orig: 4000, icon: '🛒' },
      { name: 'Phone Recharge', orig: 499, icon: '📱' },
      { name: 'Rent (PG)', orig: 8000, icon: '🏠' },
      { name: 'Course Books', orig: 2000, icon: '📚' },
    ]

    const futureItems = items.map(item => ({
      ...item,
      future: Math.round(item.orig * Math.pow(1 + inflationRate / 100, years)),
      lost: Math.round(item.orig * Math.pow(1 + inflationRate / 100, years) - item.orig),
    }))

    return (
      <div>
        {/* Header comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>Your Monthly Budget</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: '#0369a1' }}>₹{initialAmount.toLocaleString()}</div>
          </div>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>Total Cost in {years} Years</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: '#dc2626' }}>
              ₹{futureItems.reduce((s, i) => s + i.future, 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Items list */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr 70px 70px 50px', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div />
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Item</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', textAlign: 'right' }}>Today</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', textAlign: 'right' }}>Year {years}</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', textAlign: 'right' }}>+%</div>
          </div>
          {futureItems.map((item, i) => {
            const pct = Math.round(((item.future - item.orig) / item.orig) * 100)
            const canAfford = item.future <= initialAmount
            return (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '20px 1fr 70px 70px 50px', gap: 8,
                padding: '10px 14px', borderBottom: i < futureItems.length - 1 ? '1px solid var(--border)' : 'none',
                background: canAfford ? 'transparent' : '#fef2f2',
              }}>
                <div style={{ fontSize: '0.9rem' }}>{item.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: canAfford ? 'var(--text)' : '#991b1b' }}>{item.name}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>₹{item.orig.toLocaleString()}</div>
                <motion.div
                  key={item.future}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626', textAlign: 'right' }}
                >
                  ₹{item.future.toLocaleString()}
                </motion.div>
                <div style={{
                  fontSize: '0.72rem', fontWeight: 700, color: '#dc2626', textAlign: 'right',
                  background: '#fee2e2', borderRadius: 6, padding: '2px 6px',
                }}>
                  +{pct}%
                </div>
              </div>
            )
          })}
        </div>

        {/* Warning */}
        <div style={{ marginTop: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: '1rem' }}>💸</div>
          <div style={{ fontSize: '0.78rem', color: '#991b1b', lineHeight: 1.5 }}>
            At {inflationRate}% inflation, your ₹{initialAmount.toLocaleString()} budget buys <strong>{futureItems.filter(i => i.future <= initialAmount).length} of {futureItems.length} items</strong> in {years} years — down from {futureItems.filter(i => i.orig <= initialAmount).length} today.
          </div>
        </div>
      </div>
    )
  }

  // ---- Budget Allocation Blocks (Module 4) ----
  const BudgetBlocksAnim = ({ income, needs, wants, savings }) => {
    const total = needs + wants + savings
    const needsAmt = Math.round(income * needs / total)
    const wantsAmt = Math.round(income * wants / total)
    const savingsAmt = income - needsAmt - wantsAmt
    const isBalanced = needs <= 55 && savings >= 15

    const categories = [
      { label: 'Needs', amt: needsAmt, pct: Math.round((needsAmt / income) * 100), color: '#15803D', desc: 'Rent, food, utilities, transport' },
      { label: 'Wants', amt: wantsAmt, pct: Math.round((wantsAmt / income) * 100), color: '#7c3aed', desc: 'Entertainment, dining, subscriptions' },
      { label: 'Savings', amt: savingsAmt, pct: Math.round((savingsAmt / income) * 100), color: '#0369a1', desc: 'Emergency fund, investments' },
    ]

    return (
      <div>
        {/* Stacked bar */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px', marginBottom: 14 }}>
          <div style={{ display: 'flex', height: 52, borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
            {categories.map((c, i) => (
              <motion.div
                key={c.label}
                animate={{ flex: c.pct }}
                transition={{ duration: 0.4 }}
                style={{
                  background: c.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}
                title={`${c.label}: ₹${c.amt.toLocaleString()} (${c.pct}%)`}
              >
                {c.pct >= 15 && (
                  <span style={{ color: 'white', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', padding: '0 8px' }}>
                    {c.pct}%
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Category breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {categories.map((c, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: c.color }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{c.label}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>— {c.desc}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: c.color }}>₹{c.amt.toLocaleString()}</div>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${c.pct}%` }}
                    transition={{ duration: 0.4 }}
                    style={{ height: '100%', background: c.color, borderRadius: 100 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Balance check */}
        <div style={{
          background: isBalanced ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${isBalanced ? '#86efac' : '#fecaca'}`,
          borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ fontSize: '1rem' }}>{isBalanced ? '✓' : '⚠️'}</div>
          <div style={{ fontSize: '0.78rem', color: isBalanced ? '#166534' : '#991b1b', lineHeight: 1.5 }}>
            {isBalanced
              ? `Your budget is well-balanced. Needs at ${Math.round((needsAmt/income)*100)}%, savings at ${Math.round((savingsAmt/income)*100)}% — you're on track.`
              : savingsAmt < income * 0.1
                ? `Warning: Only ₹${savingsAmt.toLocaleString()} goes to savings (${Math.round((savingsAmt/income)*100)}%). Aim for at least 15% to build an emergency fund.`
                : `Needs at ${Math.round((needsAmt/income)*100)}% is high. Consider if all items labeled "needs" are truly essential.`
            }
          </div>
        </div>
      </div>
    )
  }

  // ---- Bucket Scenario Tester (Module 5) ----
  const BucketScenarioAnim = ({ bucket1Pct, bucket2Pct, bucket3Pct, years }) => {
    const returns = { 1: 5, 2: 9, 3: 14 }
    const risks = { 1: 1, 2: 4, 3: 12 }

    const buckets = [
      {
        label: 'Bucket 1', sub: 'Safe (FD, Savings)', color: '#0369a1',
        invested: Math.round(100000 * bucket1Pct / 100),
        ret: returns[1], risk: risks[1],
        outcome: Math.round(100000 * bucket1Pct / 100 * Math.pow(1 + returns[1] / 100, years)),
        years
      },
      {
        label: 'Bucket 2', sub: 'Moderate (MF)', color: '#A16207',
        invested: Math.round(100000 * bucket2Pct / 100),
        ret: returns[2], risk: risks[2],
        outcome: Math.round(100000 * bucket2Pct / 100 * Math.pow(1 + returns[2] / 100, years)),
        years
      },
      {
        label: 'Bucket 3', sub: 'Growth (Equity)', color: '#dc2626',
        invested: Math.round(100000 * bucket3Pct / 100),
        ret: returns[3], risk: risks[3],
        outcome: Math.round(100000 * bucket3Pct / 100 * Math.pow(1 + returns[3] / 100, years)),
        years
      },
    ]

    const totalOutcome = buckets.reduce((s, b) => s + b.outcome, 0)
    const totalInvested = buckets.reduce((s, b) => s + b.invested, 0)
    const totalGain = totalOutcome - totalInvested
    const avgReturn = (((totalOutcome / totalInvested) - 1) * 100).toFixed(1)

    return (
      <div>
        {/* Bucket cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
          {buckets.map((b, i) => (
            <div key={i} style={{
              background: `${b.color}10`, border: `1px solid ${b.color}30`,
              borderRadius: 12, padding: '12px 10px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: b.color, textTransform: 'uppercase', marginBottom: 2 }}>{b.label}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 8 }}>{b.sub}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>Invested</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>₹{b.invested.toLocaleString()}</div>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 100, overflow: 'hidden', marginBottom: 8 }}>
                <motion.div
                  animate={{ width: `${b.invested / 1000}%` }}
                  transition={{ duration: 0.4 }}
                  style={{ height: '100%', background: b.color, borderRadius: 100 }}
                />
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>After {years}yr</div>
              <motion.div
                key={b.outcome}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ fontSize: '0.88rem', fontWeight: 800, color: b.outcome >= b.invested ? '#15803D' : '#dc2626' }}
              >
                ₹{b.outcome.toLocaleString()}
              </motion.div>
              <div style={{ fontSize: '0.62rem', color: b.color, marginTop: 2 }}>+{b.ret}% p.a. · Risk: {b.risk}/10</div>
            </div>
          ))}
        </div>

        {/* Total outcome */}
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>Your Portfolio After {years} Years</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#15803D', lineHeight: 1 }}>
            ₹{totalOutcome.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 600, marginTop: 4 }}>
            +₹{totalGain.toLocaleString()} ({avgReturn}% total gain)
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
            Avg return: {avgReturn}% · Started with ₹1,00,000
          </div>
        </div>

        <div style={{ marginTop: 10, background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: '1rem' }}>💡</div>
          <div style={{ fontSize: '0.78rem', color: '#92400e', lineHeight: 1.5 }}>
            {bucket3Pct > 60 ? 'Heads up: Putting too much in Bucket 3 (growth) means big swings — in a crash year, your portfolio could drop 30%+. The bucket strategy exists to reduce this risk.' :
             bucket1Pct > 50 ? 'Your portfolio is very safe. Inflation at 6% could quietly erode your real returns. Consider some growth exposure for long-term wealth.' :
             'Solid allocation. The mix of safety, growth, and stability gives you both protection and upside.'}
          </div>
        </div>
      </div>
    )
  }

  const sandboxComponents = {
    module1: CompoundTimelineAnim,
    module2: CreditDecisionAnim,
    module3: InflationShoppingAnim,
    module4: BudgetBlocksAnim,
    module5: BucketScenarioAnim,
  }
  const SandboxComp = sandboxComponents[moduleId]

  const sandboxSliders = {
    module1: [
      { label: 'Principal (Rs.)', min: 1000, max: 100000, step: 1000, key: 'principal' },
      { label: 'Rate (% p.a.)', min: 1, max: 30, step: 1, key: 'rate' },
      { label: 'Years', min: 1, max: 30, step: 1, key: 'years' },
    ],
    module2: [
      { label: 'Credit Utilization (%)', min: 0, max: 90, step: 5, key: 'utilization' },
      { label: 'On-Time Payment Rate (%)', min: 0, max: 100, step: 5, key: 'onTimeRate' },
      { label: 'Credit Age (months)', min: 1, max: 60, step: 1, key: 'creditAge' },
    ],
    module3: [
      { label: 'Initial Amount (Rs.)', min: 5000, max: 200000, step: 5000, key: 'initialAmount' },
      { label: 'Inflation Rate (% p.a.)', min: 1, max: 20, step: 1, key: 'inflationRate' },
      { label: 'Years', min: 1, max: 30, step: 1, key: 'years' },
    ],
    module4: [
      { label: 'Monthly Income (Rs.)', min: 10000, max: 200000, step: 5000, key: 'income' },
      { label: 'Needs %', min: 10, max: 80, step: 5, key: 'needs' },
      { label: 'Savings %', min: 5, max: 60, step: 5, key: 'savings' },
    ],
    module5: [
      { label: 'Bucket 1 % (Safe)', min: 0, max: 60, step: 5, key: 'bucket1Pct' },
      { label: 'Bucket 2 % (Moderate)', min: 0, max: 60, step: 5, key: 'bucket2Pct' },
      { label: 'Bucket 3 % (Growth)', min: 0, max: 80, step: 5, key: 'bucket3Pct' },
    ],
  }

  const canContinue = (() => {
    if (phase === 3) return checkFeedback === 'correct'
    return true
  })()

  return (
    <div style={{ flex: 1, maxWidth: 720 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 40px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Phase progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52,
            background: `${cfg.color}15`,
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem',
          }}>
            {cfg.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
              {cfg.subtitle} · {cfg.metaphor}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: 0 }}>{cfg.title}</h2>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {phases.map((p, i) => (
              <div key={i} style={{
                width: i === phase ? 20 : 8, height: 8, borderRadius: 4,
                background: i <= phase ? phaseColors[i] : 'var(--border)',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </div>

        {/* Phase 0: Concept intro */}
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="phase0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{
                background: `${cfg.color}10`,
                border: `1px solid ${cfg.color}30`,
                borderRadius: 16,
                padding: '24px',
                marginBottom: 24,
                textAlign: 'center',
                fontSize: '1.4rem',
                marginTop: 8,
              }}>
                {cfg.icon} {cfg.metaphor}
              </div>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
                {cfg.concept}
              </p>

              <div style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '20px',
                marginBottom: 24,
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 12, color: 'var(--text)' }}>
                  How it works in 4 steps:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { step: '1', label: 'Explore', desc: 'Play with the interactive sandbox below' },
                    { step: '2', label: 'Predict', desc: 'Answer a "what if" question to activate your thinking' },
                    { step: '3', label: 'Check', desc: 'Answer a quick question to confirm your understanding' },
                    { step: '4', label: 'Continue', desc: 'Move to the next module once you pass the check' },
                  ].map(s => (
                    <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: `${cfg.color}15`,
                        color: cfg.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.72rem', fontWeight: 700,
                        flexShrink: 0,
                      }}>{s.step}</div>
                      <div style={{ fontSize: '0.82rem' }}>
                        <span style={{ fontWeight: 700, color: cfg.color }}>{s.label}:</span>{' '}
                        <span style={{ color: 'var(--text-secondary)' }}>{s.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={() => setPhase(1)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              >
                Start Exploring <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          )}

          {/* Phase 1: Interactive sandbox */}
          {phase === 1 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 12, color: 'var(--text)' }}>
                {cfg.sandbox.label}
              </div>

              {/* Animation area */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px', marginBottom: 20 }}>
                <SandboxComp {...sandboxVal} />
              </div>

              {/* Sliders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                {sandboxSliders[moduleId].map((slider) => (
                  <div key={slider.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{slider.label}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: cfg.color }}>{sandboxVal[slider.key]}</span>
                    </div>
                    <input
                      type="range"
                      min={slider.min}
                      max={slider.max}
                      step={slider.step}
                      value={sandboxVal[slider.key]}
                      onChange={e => setSandboxVal(v => ({ ...v, [slider.key]: Number(e.target.value) }))}
                      style={{ width: '100%', accentColor: cfg.color, cursor: 'pointer', height: 6 }}
                    />
                  </div>
                ))}
              </div>

              <motion.button
                onClick={() => setPhase(2)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              >
                I have a prediction in mind <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          )}

          {/* Phase 2: Prediction */}
          {phase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{
                background: `${cfg.color}10`,
                border: `1px solid ${cfg.color}30`,
                borderRadius: 14,
                padding: '16px 20px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${cfg.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '1.1rem',
                }}>💭</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: cfg.color, marginBottom: 2 }}>Think about it</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{cfg.prediction.prompt}</div>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 8 }}>
                  Your prediction <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(required — this activates your learning)</span>
                </div>
                <textarea
                  value={predAnswer}
                  onChange={e => setPredAnswer(e.target.value)}
                  placeholder={cfg.prediction.placeholder}
                  rows={3}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: 12,
                    border: predAnswer ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                    background: 'var(--surface)',
                    fontFamily: 'var(--font)', fontSize: '0.88rem', color: 'var(--text)',
                    resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                {predAnswer && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={12} /> Thought recorded — keep thinking!
                  </div>
                )}
              </div>

              <motion.button
                onClick={() => setPhase(3)}
                disabled={!predAnswer.trim()}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: predAnswer.trim() ? 1 : 0.45 }}
                whileHover={predAnswer.trim() ? { scale: 1.01 } : {}}
                whileTap={predAnswer.trim() ? { scale: 0.99 } : {}}
              >
                Take the Check Question <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          )}

          {/* Phase 3: Check question */}
          {phase === 3 && (
            <motion.div
              key="phase3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '16px 20px',
                marginBottom: 20,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Knowledge Check</div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', lineHeight: 1.5 }}>
                  {cfg.checkQ.q}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {cfg.checkQ.opts.map((opt, i) => {
                  const isSelected = checkAnswer === i
                  const isCorrect = i === cfg.checkQ.correctIdx
                  const showResult = checkFeedback !== null
                  let borderColor = 'var(--border)'
                  let bg = 'var(--bg)'
                  let color = 'var(--text)'

                  if (showResult) {
                    if (isCorrect) { borderColor = '#15803D'; bg = '#f0fdf4'; color = '#15803D' }
                    else if (isSelected && !isCorrect) { borderColor = '#dc2626'; bg = '#fef2f2'; color = '#dc2626' }
                  } else if (isSelected) {
                    borderColor = cfg.color
                    bg = `${cfg.color}10`
                    color = cfg.color
                  }

                  return (
                    <motion.button
                      key={i}
                      onClick={() => !checkFeedback && setCheckAnswer(i)}
                     style={{
                        padding: '14px 16px',
                        borderRadius: 12,
                        border: `2px solid ${borderColor}`,
                        background: bg,
                        color,
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.88rem',
                        textAlign: 'left',
                        cursor: checkFeedback ? 'default' : 'pointer',
                        fontFamily: 'var(--font)',
                        transition: 'all 0.15s',
                      }}
                      whileHover={checkFeedback ? {} : { scale: 1.01 }}
                      whileTap={checkFeedback ? {} : { scale: 0.99 }}
                    >
                      {opt}
                    </motion.button>
                  )
                })}
              </div>

              {checkFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: checkFeedback === 'correct' ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${checkFeedback === 'correct' ? '#15803D' : '#dc2626'}`,
                    borderRadius: 12,
                    padding: '14px 18px',
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  {checkFeedback === 'correct' ? (
                    <>
                      <CheckCircle2 size={18} color="#15803D" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#15803D' }}>Correct!</div>
                        <div style={{ fontSize: '0.8rem', color: '#166534' }}>You have a solid understanding of {cfg.title}.</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={18} color="#dc2626" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#dc2626' }}>Not quite — read the concept again and retry</div>
                        <div style={{ fontSize: '0.8rem', color: '#991b1b', cursor: 'pointer', textDecoration: 'underline', marginTop: 4 }} onClick={() => { setCheckAnswer(null); setCheckFeedback(null) }}>
                          Try again
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {!checkFeedback && (
                <motion.button
                  onClick={handleCheckSubmit}
                  disabled={checkAnswer === null}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: checkAnswer !== null ? 1 : 0.45 }}
                  whileHover={checkAnswer !== null ? { scale: 1.01 } : {}}
                  whileTap={checkAnswer !== null ? { scale: 0.99 } : {}}
                >
                  Submit Answer
                </motion.button>
              )}

              {checkFeedback === 'correct' && (
                <motion.button
                  onClick={() => {
                    if (onComplete) {
                      onComplete({
                        moduleId,
                        moduleType: cfg.title,
                        timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
                        completed: true,
                        interactionData: { sandboxVal, phasesCompleted: phase + 1 },
                      })
                    }
                    onNext()
                  }}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                >
                  Continue to Next Module <ArrowRight size={18} />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ============================================================
// SATISFACTION
// ============================================================
function SatisfactionStep({ data, onChange, onNext }) {
  const set = (k, v) => onChange({ ...data, [k]: v })
  const answeredCount = SATISFACTION_Q.filter((_, i) => data[`sat_${i}`] !== null && data[`sat_${i}`] !== undefined).length
  const allAnswered = answeredCount === SATISFACTION_Q.length

  return (
    <div style={{ flex: 1, maxWidth: 680 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 40px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 52, height: 52,
            background: 'var(--bg-secondary)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)'
          }}>
            <Star size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Step 12 of 13</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: 0 }}>Final Feedback</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-lightest)', border: '1px solid #fde68a', borderRadius: 100, padding: '6px 14px' }}>
            <Clock size={13} /> ~2 minutes
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
          Rate each statement on a scale of 1 to 5. Your honest feedback helps us improve FinLit-X for future students.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {SATISFACTION_Q.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 12, lineHeight: 1.5 }}>
                {i + 1}. {q}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(val => (
                  <div key={val} style={{ flex: 1, textAlign: 'center' }}>
                    <button
                      onClick={() => set(`sat_${i}`, val)}
                      style={{
                        width: '100%', padding: '10px 0', borderRadius: 8, marginBottom: 3,
                        border: data[`sat_${i}`] === val ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                        background: data[`sat_${i}`] === val ? 'var(--primary)' : 'var(--surface)',
                        color: data[`sat_${i}`] === val ? 'white' : 'var(--text-secondary)',
                        fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font)',
                        transition: 'all 0.15s', minHeight: 44,
                      }}
                    >{val}</button>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                      {val === 1 ? 'Disagree' : val === 5 ? 'Agree' : ''}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', padding: '2px 2px 0', marginTop: 2 }}>
                <span>Strongly Disagree</span><span>Neutral</span><span>Strongly Agree</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Open ended — optional */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>
              What did you find most helpful? <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </div>
            <textarea className="form-textarea" rows={3} placeholder="Your thoughts..." value={data.open1 || ''} onChange={e => set('open1', e.target.value)} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>
              What would you improve? <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </div>
            <textarea className="form-textarea" rows={3} placeholder="Your suggestions..." value={data.open2 || ''} onChange={e => set('open2', e.target.value)} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>Would you use a financial literacy app?</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Yes', 'No', 'Maybe'].map(opt => (
                <button key={opt} onClick={() => set('wouldUse', opt)} style={{
                  flex: 1, padding: '12px', borderRadius: 10,
                  border: data.wouldUse === opt ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  background: data.wouldUse === opt ? 'var(--bg-secondary)' : 'var(--surface)',
                  color: data.wouldUse === opt ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: data.wouldUse === opt ? 600 : 400, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font)', minHeight: 44,
                }}>{opt}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <motion.button
            onClick={async () => {
              if (!allAnswered) return
              setIsSubmitting(true)
              const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000)
              try {
                await fetch('/api/survey/submit', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    participantCode,
                    demo: data.demo,
                    preQuizRaw: data.preQuiz,
                    postQuizRaw: data.postQuiz,
                    satisfaction: data.sat,
                    completed: true,
                    studyGroup,
                    timeTakenSeconds,
                    moduleInteractions: data.moduleInteractions,
                    qualitativeFeedback: data.sat.open1 ? [data.sat.open1, data.sat.open2].filter(Boolean).join('\n---\n') : null,
                  }),
                })
                setStep('complete')
                if (typeof window !== 'undefined') {
                  try { localStorage.removeItem(STORAGE_KEY) } catch {}
                }
                window.scrollTo({ top: 0, behavior: 'smooth' })
              } catch (err) {
                console.error('Failed to submit survey:', err)
              } finally {
                setIsSubmitting(false)
              }
            }}
            disabled={!allAnswered || isSubmitting}
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center', opacity: allAnswered && !isSubmitting ? 1 : 0.45 }}
            whileHover={allAnswered && !isSubmitting ? { scale: 1.01 } : {}}
            whileTap={allAnswered && !isSubmitting ? { scale: 0.99 } : {}}
          >
            {isSubmitting ? <><Clock size={18} style={{ animation: 'spin 1s linear infinite' }} /> Saving... </> : <>Complete Study <CheckCircle2 size={18} /></>}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// ============================================================
// COMPLETE STEP
// ============================================================
function CompleteStep({ data, isSubmitting }) {
  const preScore = data.preQuiz.filter((a, i) => a === CORRECT[i]).length
  const postScore = data.postQuiz.filter((a, i) => a === CORRECT[i]).length
  const participantCode = data.participantCode
  const handlePrint = () => window.print()

  return (
    <div style={{ flex: 1, maxWidth: 600 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180 }}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
        }}
      >
        {/* Award circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 280 }}
          style={{ marginBottom: 24 }}
        >
          <div style={{
            width: 88, height: 88,
            background: 'var(--bg-secondary)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto', color: 'var(--primary)'
          }}>
            <Award size={40} />
          </div>
        </motion.div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 8 }}>
          Your Voice Matters
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24, fontSize: '0.95rem' }}>
          Thank you for completing the FinLit-X research study. Your anonymous responses will help measure how animated AI-driven learning can improve financial literacy for Indian college students.
        </p>

        {/* Anonymous code */}
        <div style={{ background: 'var(--primary-dark)', borderRadius: 16, padding: '24px', marginBottom: 20, color: 'white' }}>
          <div style={{ fontSize: '0.72rem', opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Your Anonymous Participant Code</div>
          <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 800, letterSpacing: '2px', marginBottom: 8 }}>{participantCode}</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: 16 }}>Save this code if you wish to request data deletion later</div>
          <motion.button
            onClick={handlePrint}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
              color: 'white', padding: '8px 18px', borderRadius: 10,
              cursor: isSubmitting ? 'wait' : 'pointer', fontFamily: 'var(--font)', fontSize: '0.82rem', fontWeight: 600,
            }}
            whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
          >
            <RotateCcw size={14} /> Print / Save Code
          </motion.button>
        </div>

        {/* Score comparison */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px', marginBottom: 20, textAlign: 'left' }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 16 }}>Your Quiz Performance</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>{preScore}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pre-Quiz</div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRight size={20} color="var(--text-muted)" />
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: postScore > preScore ? 'var(--primary)' : 'var(--accent)' }}>{postScore}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Post-Quiz</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.88rem', fontWeight: 700, color: postScore > preScore ? 'var(--primary)' : postScore < preScore ? 'var(--accent)' : 'var(--text-muted)' }}>
            {postScore > preScore ? `+${postScore - preScore} improvement — great work!` : postScore < preScore ? `${postScore - preScore} fewer correct — still valuable data` : 'No change in scores'}
          </div>
        </div>

        {/* Session summary */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px', textAlign: 'left', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={16} color="var(--accent)" /> What's next?
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Aggregate results from all participants will be published in the FinLit-X research paper targeting IJEDICT. The mobile app is planned for late 2026. No individual data will ever be published or shared.
          </p>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Questions? Email: <strong>finlitx.jainuniversity@gmail.com</strong><br />
          Study by JAIN University MCA AIML students · Mentor: Prof. Haripriya V
        </p>
      </motion.div>
    </div>
  )
}

// ============================================================
// SURVEY FLOW
// ============================================================
const STORAGE_KEY = 'finlitx_survey_v1'

export default function SurveyFlow() {
  const [step, setStep] = useState('info')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // RCT: detect group from URL param — client-side only (window not available in SSR)
  const [studyGroup, setStudyGroup] = useState('experimental')
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('group') === 'control') setStudyGroup('control')
  }, [])

  const [data, setData] = useState(() => {
    // Restore from localStorage on first render (browser only)
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.step && parsed.data && parsed.participantCode) {
            return { ...parsed.data, participantCode: parsed.participantCode }
          }
        }
      } catch {
        // Corrupted data — start fresh
      }
    }
    return {
      participantCode: generateCode(),
      demo: { age: '', gender: null, program: '', year: null, allowance: null, priorApp: null, confidence: null },
      preQuiz: Array(ALL_QUIZ_QUESTIONS.length).fill(null),
      postQuiz: Array(ALL_QUIZ_QUESTIONS.length).fill(null),
      sat: {},
      moduleInteractions: [],
      startTime: Date.now(),
    }
  })

  // Restore step from localStorage separately (can't mix with useState init that depends on window)
  const [restoredStep, setRestoredStep] = useState(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.step) setRestoredStep(parsed.step)
        }
      } catch {}
    }
  }, [])

  // Apply restored step once
  useEffect(() => {
    if (restoredStep) {
      setStep(restoredStep)
      setRestoredStep(null) // only apply once
    }
  }, [restoredStep])

  // Persist to localStorage on every data/step change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data, participantCode: data.participantCode }))
      } catch {
        // Storage full or unavailable — silently skip
      }
    }
  }, [step, data])

  // Create session record on survey start (for dropout tracking)
  useEffect(() => {
    fetch('/api/survey/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantCode: data.participantCode,
        studyGroup,
        deviceInfo: navigator.userAgent,
      }),
    }).catch(() => {}) // fire and forget
  }, [])

  const stepOrderExperimental = ['info', 'consent', 'demo', 'prequiz', 'modulesOverview', 'module1', 'module2', 'module3', 'module4', 'module5', 'postquiz', 'satisfaction', 'complete']
  const stepOrderControl = ['info', 'consent', 'demo', 'prequiz', 'controlPostQuiz', 'satisfaction', 'complete']

  const stepOrder = studyGroup === 'control' ? stepOrderControl : stepOrderExperimental
  const currentIdx = stepOrder.indexOf(step)

  const navigate = (direction) => {
    const idx = stepOrder.indexOf(step)
    if (direction === 'next' && idx < stepOrder.length - 1) {
      setStep(stepOrder[idx + 1])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (direction === 'prev' && idx > 0) {
      setStep(stepOrder[idx - 1])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const preScore = data.preQuiz.filter((a, i) => a === CORRECT[i]).length

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    const timeTakenSeconds = Math.round((Date.now() - data.startTime) / 1000)
    try {
      await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantCode: data.participantCode,
          demo: data.demo,
          preQuizRaw: data.preQuiz,
          postQuizRaw: data.postQuiz,
          satisfaction: data.sat,
          completed: true,
          studyGroup,
          timeTakenSeconds,
          moduleInteractions: data.moduleInteractions,
          qualitativeFeedback: data.sat.open1 ? [data.sat.open1, data.sat.open2].filter(Boolean).join('\n---\n') : null,
        }),
      })
    } catch (err) {
      console.error('Failed to submit survey:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 80, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 32, alignItems: 'flex-start' }} className="survey-layout">
        {/* Sidebar — matches website card styling exactly */}
        <StepSidebar currentStep={step} onStepClick={setStep} />

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {step === 'info' && <InfoStep onNext={() => navigate('next')} studyGroup={studyGroup} />}
              {step === 'consent' && <ConsentStep onNext={() => navigate('next')} />}
              {step === 'demo' && <DemoStep data={data.demo} onChange={d => setData(p => ({ ...p, demo: d }))} onNext={() => navigate('next')} />}
              {step === 'prequiz' && (
                <QuizStep
                  title="Pre-Quiz"
                  subtitle="Step 4 of 13"
                  answers={data.preQuiz}
                  onAnswer={(i, v) => setData(p => { const u = [...p.preQuiz]; u[i] = v; return { ...p, preQuiz: u } })}
                  onNext={() => navigate('next')}
                />
              )}
              {step === 'modulesOverview' && <ModulesOverviewStep onNext={() => navigate('next')} />}
              {step === 'module1' && <ModuleStep moduleId="module1" onNext={() => navigate('next')} onComplete={(interaction) => setData(p => ({ ...p, moduleInteractions: [...p.moduleInteractions, interaction] }))} />}
              {step === 'module2' && <ModuleStep moduleId="module2" onNext={() => navigate('next')} onComplete={(interaction) => setData(p => ({ ...p, moduleInteractions: [...p.moduleInteractions, interaction] }))} />}
              {step === 'module3' && <ModuleStep moduleId="module3" onNext={() => navigate('next')} onComplete={(interaction) => setData(p => ({ ...p, moduleInteractions: [...p.moduleInteractions, interaction] }))} />}
              {step === 'module4' && <ModuleStep moduleId="module4" onNext={() => navigate('next')} onComplete={(interaction) => setData(p => ({ ...p, moduleInteractions: [...p.moduleInteractions, interaction] }))} />}
              {step === 'module5' && <ModuleStep moduleId="module5" onNext={() => navigate('next')} onComplete={(interaction) => setData(p => ({ ...p, moduleInteractions: [...p.moduleInteractions, interaction] }))} />}
              {step === 'controlPostQuiz' && (
                <QuizStep
                  title="Post-Quiz"
                  subtitle="Step 5 of 7 (Control Group)"
                  answers={data.postQuiz}
                  onAnswer={(i, v) => setData(p => { const u = [...p.postQuiz]; u[i] = v; return { ...p, postQuiz: u } })}
                  onNext={() => navigate('next')}
                  preQuizScore={preScore}
                />
              )}
              {step === 'postquiz' && (
                <QuizStep
                  title="Post-Quiz"
                  subtitle="Step 11 of 13"
                  answers={data.postQuiz}
                  onAnswer={(i, v) => setData(p => { const u = [...p.postQuiz]; u[i] = v; return { ...p, postQuiz: u } })}
                  onNext={() => navigate('next')}
                  preQuizScore={preScore}
                />
              )}
              {step === 'satisfaction' && <SatisfactionStep data={data.sat} onChange={s => setData(p => ({ ...p, sat: s }))} onNext={() => navigate('next')} />}
              {step === 'complete' && <CompleteStep data={data} isSubmitting={isSubmitting} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}