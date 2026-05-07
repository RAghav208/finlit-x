import { createClient } from '@supabase/supabase-js'

const CORRECT_ANSWERS = [2, 0, 1, 2, 1, 2, 2, 3, 1, 2, 1, 1, 2, 2, 1]

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  return createClient(supabaseUrl, supabaseKey)
}

function computeScore(answers) {
  if (!answers || !Array.isArray(answers)) return 0
  return answers.reduce((score, answer, i) => {
    if (answer === CORRECT_ANSWERS[i]) return score + 1
    return score
  }, 0)
}

function parseQuizAnswers(raw) {
  if (!raw || !Array.isArray(raw)) return Array(15).fill(null)
  return raw.map(a => {
    if (typeof a === 'object' && a !== null && 'selected' in a) return a.selected
    return a
  })
}

export async function POST(request) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const {
      participantCode,
      demo,
      preQuizRaw,
      postQuizRaw,
      satisfaction,
      completed,
      timeTakenSeconds,
      studyGroup = 'experimental',
    } = body

    if (!participantCode) {
      return Response.json({ error: 'Participant code required' }, { status: 400 })
    }

    const preQuizAnswers = parseQuizAnswers(preQuizRaw)
    const postQuizAnswers = parseQuizAnswers(postQuizRaw)
    const preScore = computeScore(preQuizAnswers)
    const postScore = computeScore(postQuizAnswers)
    const improvement = postScore - preScore

    const { data, error } = await supabase
      .from('survey_responses')
      .insert({
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
        time_taken_seconds: timeTakenSeconds || null,
        study_group: studyGroup,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error))
      return Response.json({ error: 'Failed to save survey response', detail: error.message }, { status: 500 })
    }

    if (preQuizRaw && Array.isArray(preQuizRaw)) {
      const quizEntries = preQuizAnswers.map((answer, i) => ({
        participant_code: participantCode,
        quiz_type: 'pre',
        section: ['compound', 'compound', 'compound', 'compound', 'credit', 'credit', 'credit', 'credit', 'inflation', 'inflation', 'inflation', 'budget', 'budget', 'risk', 'risk'][i],
        question_index: i,
        selected_option: answer,
        is_correct: answer === CORRECT_ANSWERS[i],
      }))
      await supabase.from('quiz_answers').insert(quizEntries)
    }

    if (postQuizRaw && Array.isArray(postQuizRaw)) {
      const quizEntries = postQuizAnswers.map((answer, i) => ({
        participant_code: participantCode,
        quiz_type: 'post',
        section: ['compound', 'compound', 'compound', 'compound', 'credit', 'credit', 'credit', 'credit', 'inflation', 'inflation', 'inflation', 'budget', 'budget', 'risk', 'risk'][i],
        question_index: i,
        selected_option: answer,
        is_correct: answer === CORRECT_ANSWERS[i],
      }))
      await supabase.from('quiz_answers').insert(quizEntries)
    }

    return Response.json({ success: true, data })
  } catch (err) {
    console.error('Survey submit error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
