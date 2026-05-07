import { createClient } from '@supabase/supabase-js'

const CORRECT_ANSWERS = [2, 0, 1, 2, 1, 2, 2, 3, 1, 2, 1, 1, 2, 2, 1]

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

  // Supabase-js internally encodes the key as base64 for the apikey header.
  // Node.js 18+ Headers.set() rejects values containing chars outside the
  // visible ASCII range, which is stricter than what the JWT actually needs.
  // We use a URL-safe base64 encode to avoid any char-set issues.
  const base64urlKey = supabaseKey.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const supabase = createClient(supabaseUrl, base64urlKey)

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

  const { data, error } = await supabase
    .from('survey_responses')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return Response.json({
      error: 'Failed to save survey response',
      detail: error.message,
      code: error.code,
      hint: error.hint
    }, { status: 500 })
  }

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
    await supabase.from('quiz_answers').insert(quizEntries)
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
    await supabase.from('quiz_answers').insert(quizEntries)
  }

  return Response.json({ success: true, data })
}
