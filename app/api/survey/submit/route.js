import { createClient } from '@supabase/supabase-js'

const CORRECT_ANSWERS = [2, 0, 1, 2, 1, 2, 2, 3, 1, 2, 1, 1, 2, 2, 1]

// Base URL for Supabase REST API
function getSupabaseRestUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return null
  // Convert https://xyz.supabase.co → https://xyz.supabase.co/rest/v1
  return url.endsWith('/') ? url + 'rest/v1' : url + '/rest/v1'
}

export async function POST(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return Response.json({
      error: 'Missing env vars',
      vars: {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl || 'MISSING',
        SUPABASE_SERVICE_ROLE_KEY: supabaseKey ? 'SET' : 'MISSING'
      }
    }, { status: 500 })
  }

  const restUrl = getSupabaseRestUrl()
  if (!restUrl) {
    return Response.json({ error: 'Invalid SUPABASE_URL' }, { status: 500 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { participantCode, demo, preQuizRaw, postQuizRaw, satisfaction, completed } = body

  if (!participantCode) {
    return Response.json({ error: 'Participant code required' }, { status: 400 })
  }

  function computeScore(answers) {
    if (!answers || !Array.isArray(answers)) return 0
    return answers.reduce((score, answer, i) => {
      return answer === CORRECT_ANSWERS[i] ? score + 1 : score
    }, 0)
  }

  const preScore = computeScore(preQuizRaw)
  const postScore = computeScore(postQuizRaw)
  const improvement = postScore - preScore

  const insertData = {
    participant_code: participantCode,
    age: demo?.age || null,
    gender: demo?.gender || null,
    program: demo?.program || null,
    study_year: demo?.year || null,
    monthly_allowance: demo?.allowance || null,
    prior_finlit_app: demo?.priorApp ?? null,
    confidence_before: demo?.confidence ?? null,
    pre_quiz_answers: preQuizRaw,
    post_quiz_answers: postQuizRaw,
    pre_quiz_score: preScore,
    post_quiz_score: postScore,
    score_improvement: improvement,
    satisfaction_ratings: satisfaction || {},
    completed: completed || false,
    study_group: 'experimental',
  }

  // Use native fetch to avoid supabase-js Headers.set issue with JWT chars
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }

  const insertRes = await fetch(`${restUrl}/survey_responses`, {
    method: 'POST',
    headers,
    body: JSON.stringify(insertData)
  })

  if (!insertRes.ok) {
    const detail = await insertRes.text()
    return Response.json({
      error: 'Failed to save survey response',
      detail,
      status: insertRes.status,
      fetchUrl: `${restUrl}/survey_responses`
    }, { status: 500 })
  }

  const data = await insertRes.json()

  if (preQuizRaw && Array.isArray(preQuizRaw)) {
    const sectionMap = ['compound', 'compound', 'compound', 'compound', 'credit', 'credit', 'credit', 'credit', 'inflation', 'inflation', 'inflation', 'budget', 'budget', 'risk', 'risk']
    const quizEntries = preQuizRaw.map((answer, i) => ({
      participant_code: participantCode,
      quiz_type: 'pre',
      section: sectionMap[i],
      question_index: i,
      selected_option: answer,
      is_correct: answer === CORRECT_ANSWERS[i],
    }))
    await fetch(`${restUrl}/quiz_answers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(quizEntries)
    })
  }

  if (postQuizRaw && Array.isArray(postQuizRaw)) {
    const sectionMap = ['compound', 'compound', 'compound', 'compound', 'credit', 'credit', 'credit', 'credit', 'inflation', 'inflation', 'inflation', 'budget', 'budget', 'risk', 'risk']
    const quizEntries = postQuizRaw.map((answer, i) => ({
      participant_code: participantCode,
      quiz_type: 'post',
      section: sectionMap[i],
      question_index: i,
      selected_option: answer,
      is_correct: answer === CORRECT_ANSWERS[i],
    }))
    await fetch(`${restUrl}/quiz_answers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(quizEntries)
    })
  }

  return Response.json({ success: true, data })
}
