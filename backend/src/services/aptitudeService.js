/**
 * Server-side aptitude scoring.
 * Never trust client-provided isCorrect or score values.
 */
export const scoreAptitudeAttempt = (questions, submittedAnswers = []) => {
  const answerMap = new Map();

  submittedAnswers.forEach((ans) => {
    if (!ans || ans.questionId == null) return;
    answerMap.set(String(ans.questionId), ans.selectedOption);
  });

  let correctAnswers = 0;
  const details = questions.map((q) => {
    const raw = answerMap.has(q._id.toString()) ? answerMap.get(q._id.toString()) : null;
    const selectedOption = Number.isInteger(Number(raw)) ? Number(raw) : null;
    const isCorrect = selectedOption === q.correctAnswerIndex;
    if (isCorrect) correctAnswers += 1;

    return {
      questionId: q._id,
      question: q.question,
      category: q.category,
      difficulty: q.difficulty,
      options: q.options,
      selectedOption,
      correctAnswerIndex: q.correctAnswerIndex,
      isCorrect,
      explanation: q.explanation || '',
    };
  });

  const totalQuestions = questions.length;
  const scorePercentage =
    totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return {
    totalQuestions,
    correctAnswers,
    scorePercentage,
    details,
  };
};

export const buildCategoryPerformance = (attempts = []) => {
  const byCategory = {};

  attempts.forEach((attempt) => {
    if (attempt.status && attempt.status !== 'completed') return;
    const cat = attempt.category || 'Mixed';
    if (!byCategory[cat]) {
      byCategory[cat] = { attempts: 0, totalScore: 0, averageScore: 0 };
    }
    byCategory[cat].attempts += 1;
    byCategory[cat].totalScore += attempt.scorePercentage || 0;
  });

  Object.keys(byCategory).forEach((cat) => {
    const row = byCategory[cat];
    row.averageScore = row.attempts > 0 ? Math.round(row.totalScore / row.attempts) : 0;
    delete row.totalScore;
  });

  const weakTopics = Object.entries(byCategory)
    .filter(([, stats]) => stats.attempts > 0)
    .sort((a, b) => a[1].averageScore - b[1].averageScore)
    .map(([category, stats]) => ({
      category,
      averageScore: stats.averageScore,
      recommendation:
        stats.averageScore < 70
          ? `Revise ${category} — average score is ${stats.averageScore}%.`
          : `Maintain ${category} with mixed difficulty drills.`,
    }));

  return { byCategory, weakTopics };
};
