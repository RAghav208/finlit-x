export async function GET() {
  return Response.json({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
    NODE_VERSION: process.version,
  })
}

export async function POST(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) return Response.json({ error: 'NEXT_PUBLIC_SUPABASE_URL missing' }, { status: 500 })
  if (!supabaseKey) return Response.json({ error: 'SUPABASE_SERVICE_ROLE_KEY missing' }, { status: 500 })

  const restUrl = supabaseUrl.replace(/\/$/, '') + '/rest/v1'

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

  // Test 1: Service role key in apikey + Authorization headers
  const test1 = await fetch(`${restUrl}/survey_responses`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(insertData),
  })

  // Test 2: Anon key in apikey, service role in Authorization
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const test2 = anonKey ? await fetch(`${restUrl}/survey_responses`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(insertData),
  }) : null

  const text1 = await test1.text()
  const result1 = { status: test1.status, ok: test1.ok, preview: text1.slice(0, 200) }

  let result2 = null
  if (test2) {
    const text2 = await test2.text()
    result2 = { status: test2.status, ok: test2.ok, preview: text2.slice(0, 200) }
  }

  return Response.json({
    restUrl: restUrl.slice(0, 50) + '...',
    keyPrefix: supabaseKey.slice(0, 20) + '...',
    test1: result1,
    test2: result2,
    usedAnonKey: !!anonKey,
  })
}