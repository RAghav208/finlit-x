export async function GET() {
  return Response.json({ ok: true, time: Date.now() })
}

export async function POST(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) return Response.json({ error: 'NEXT_PUBLIC_SUPABASE_URL missing' }, { status: 500 })
  if (!supabaseKey) return Response.json({ error: 'SUPABASE_SERVICE_ROLE_KEY missing' }, { status: 500 })

  const restUrl = supabaseUrl.replace(/\/$/, '') + '/rest/v1'
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { participantCode, demo, preQuizRaw, postQuizRaw, satisfaction, completed } = body
  if (!participantCode) return Response.json({ error: 'Participant code required' }, { status: 400 })

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
    pre_quiz_score: 0,
    post_quiz_score: 0,
    score_improvement: 0,
    satisfaction_ratings: satisfaction || {},
    completed: completed || false,
    study_group: 'experimental',
  }

  const insertRes = await fetch(`${restUrl}/survey_responses`, {
    method: 'POST',
    headers,
    body: JSON.stringify(insertData),
  })

  const responseText = await insertRes.text()
  if (!insertRes.ok) {
    return Response.json({
      error: 'Failed to save survey response',
      status: insertRes.status,
      detail: responseText.slice(0, 300),
    }, { status: 500 })
  }

  return Response.json({ success: true, data: responseText.slice(0, 100) })
}