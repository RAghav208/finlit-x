const CORRECT_ANSWERS = [2, 0, 1, 2, 1, 2, 2, 3, 1, 2, 1, 1, 2, 2, 1]

export async function POST(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    return Response.json({ error: 'NEXT_PUBLIC_SUPABASE_URL is not set' }, { status: 500 })
  }
  if (!supabaseKey) {
    return Response.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not set' }, { status: 500 })
  }

  const restUrl = supabaseUrl.replace(/\/$/, '') + '/rest/v1'

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
    pre_quiz_score: computeScore(preQuizRaw),
    post_quiz_score: computeScore(postQuizRaw),
    score_improvement: computeScore(postQuizRaw) - computeScore(preQuizRaw),
    satisfaction_ratings: satisfaction || {},
    completed: completed || false,
    study_group: 'experimental',
  }

  // Native fetch against Supabase REST API — no supabase-js, no JWT Header issues.
  // The apikey header with the service role JWT grants bypass-RLS access.
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  }

  const insertRes = await fetch(`${restUrl}/survey_responses`, {
    method: 'POST',
    headers,
    body: JSON.stringify(insertData),
  })

  if (!insertRes.ok) {
    let detail
    try { detail = await insertRes.json() } catch { detail = await insertRes.text() }
    return Response.json({
      error: 'Failed to save survey response',
      detail: detail?.message || detail?.error_description || JSON.stringify(detail),
      status: insertRes.status,
    }, { status: 500 })
  }

  const data = await insertRes.json()

  const quizSectionMap = ['compound','compound','compound','compound','credit','credit','credit','credit','inflation','inflation','inflation','budget','budget','risk','risk']

  if (preQuizRaw && Array.isArray(preQuizRaw)) {
    await fetch(`${restUrl}/quiz_answers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(preQuizRaw.map((answer, i) => ({
        participant_code: participantCode,
        quiz_type: 'pre',
        section: quizSectionMap[i],
        question_index: i,
        selected_option: answer,
        is_correct: answer === CORRECT_ANSWERS[i],
      }))),
    })
  }

  if (postQuizRaw && Array.isArray(postQuizRaw)) {
    await fetch(`${restUrl}/quiz_answers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(postQuizRaw.map((answer, i) => ({
        participant_code: participantCode,
        quiz_type: 'post',
        section: quizSectionMap[i],
        question_index: i,
        selected_option: answer,
        is_correct: answer === CORRECT_ANSWERS[i],
      }))),
    })
  }

  return Response.json({ success: true, data })
}