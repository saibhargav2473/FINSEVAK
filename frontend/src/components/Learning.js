import React, { useCallback, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import './Learning.css';
import {
  QUESTIONS,
  ROADMAP_STEPS,
  BADGES,
  DIFFICULTY_ORDER,
  DIFFICULTY_LABEL,
  pointsForDifficulty,
  levelFromPoints,
  nextLevelThreshold
} from '../data/learningContent';

const LS_POINTS = 'finsevak_learning_points';
const LS_BADGES = 'finsevak_learning_badges';
const LS_ROADMAP = 'finsevak_roadmap_done';
const LS_BOARD = 'finsevak_leaderboard';
const QUIZ_LEN = 10;

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function initialMediumQuestion() {
  const u = new Set();
  const pool = QUESTIONS.filter((q) => q.difficulty === DIFFICULTY_ORDER[1]);
  const q = pool[Math.floor(Math.random() * pool.length)];
  u.add(q.id);
  return { usedIds: u, currentQuestion: q };
}

function parseJwtEmail(token) {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return json.email || null;
  } catch {
    return null;
  }
}

function displayNameFromToken() {
  const token = localStorage.getItem('finsevak_token');
  if (!token) return 'Learner';
  const email = parseJwtEmail(token);
  if (!email) return 'Learner';
  return email.split('@')[0];
}

function loadPoints() {
  const n = parseInt(localStorage.getItem(LS_POINTS) || '0', 10);
  return Number.isFinite(n) ? n : 0;
}

function loadBadges() {
  try {
    const j = JSON.parse(localStorage.getItem(LS_BADGES) || '[]');
    return Array.isArray(j) ? j : [];
  } catch {
    return [];
  }
}

function loadRoadmapDone() {
  try {
    const j = JSON.parse(localStorage.getItem(LS_ROADMAP) || '{}');
    return typeof j === 'object' && j !== null ? j : {};
  } catch {
    return {};
  }
}

function loadLeaderboard() {
  try {
    const j = JSON.parse(localStorage.getItem(LS_BOARD) || '[]');
    return Array.isArray(j) ? j : [];
  } catch {
    return [];
  }
}

function saveLeaderboardEntry(totalPoints) {
  const email = parseJwtEmail(localStorage.getItem('finsevak_token') || '') || 'guest@local';
  const name = displayNameFromToken();
  const board = loadLeaderboard();
  const i = board.findIndex((e) => e.email === email);
  const entry = { email, name, points: totalPoints, updated: Date.now() };
  if (i >= 0) {
    board[i] = { ...board[i], ...entry, points: Math.max(board[i].points || 0, totalPoints) };
  } else {
    board.push(entry);
  }
  board.sort((a, b) => (b.points || 0) - (a.points || 0));
  localStorage.setItem(LS_BOARD, JSON.stringify(board.slice(0, 15)));
}

function evaluateBadges({
  totalPoints,
  roadmapDoneCount,
  roadmapTotal,
  hardStreakInRound,
  completedAnyQuiz
}) {
  const earned = new Set(loadBadges());
  if (completedAnyQuiz) earned.add('first_quiz');
  if (totalPoints >= 100) earned.add('points_100');
  if (totalPoints >= 500) earned.add('points_500');
  if (hardStreakInRound >= 3) earned.add('hard_streak');
  if (roadmapDoneCount >= roadmapTotal) earned.add('roadmap_done');
  localStorage.setItem(LS_BADGES, JSON.stringify([...earned]));
}

function RoadmapSection() {
  const [done, setDone] = useState(() => loadRoadmapDone());

  const toggle = (id) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    localStorage.setItem(LS_ROADMAP, JSON.stringify(next));
    const count = ROADMAP_STEPS.filter((s) => next[s.id]).length;
    evaluateBadges({
      totalPoints: loadPoints(),
      roadmapDoneCount: count,
      roadmapTotal: ROADMAP_STEPS.length,
      hardStreakInRound: 0,
      completedAnyQuiz: loadBadges().includes('first_quiz')
    });
  };

  return (
    <div className="learning-section learning-roadmap">
      <h2>Financial roadmap</h2>
      <p className="learning-lead">
        Follow these topics in order—or jump to what you need. Mark a module done when you have finished the
        video.
      </p>
      <ol className="roadmap-list">
        {ROADMAP_STEPS.map((step, idx) => (
          <li key={step.id} className="roadmap-item">
            <div className="roadmap-index">{idx + 1}</div>
            <div className="roadmap-body">
              <div className="roadmap-head">
                <h3>{step.title}</h3>
                <label className="roadmap-check">
                  <input
                    type="checkbox"
                    checked={!!done[step.id]}
                    onChange={() => toggle(step.id)}
                  />
                  <span>Done</span>
                </label>
              </div>
              <p className="roadmap-summary">{step.summary}</p>
              <div className="video-wrap">
                <iframe
                  title={step.title}
                  src={`https://www.youtube-nocookie.com/embed/${step.videoId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <span className="video-meta">{step.durationHint}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function AdaptiveQuiz({ onPointsChange }) {
  const init = useMemo(() => initialMediumQuestion(), []);
  const [round, setRound] = useState(0);
  const [diffIndex, setDiffIndex] = useState(1);
  const [streak, setStreak] = useState(0);
  const [usedIds, setUsedIds] = useState(() => new Set(init.usedIds));
  const [currentQuestion, setCurrentQuestion] = useState(() => init.currentQuestion);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [sessionPointsEarned, setSessionPointsEarned] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const hardStreakRef = useRef(0);
  const [maxHardStreak, setMaxHardStreak] = useState(0);

  const pickNext = useCallback(
    (nextUsed) => {
      const tier = DIFFICULTY_ORDER[diffIndex];
      const pool = QUESTIONS.filter((q) => q.difficulty === tier);
      const fresh = pool.filter((q) => !nextUsed.has(q.id));
      const source = fresh.length ? fresh : pool;
      if (!source.length) return null;
      const q = source[Math.floor(Math.random() * source.length)];
      nextUsed.add(q.id);
      return q;
    },
    [diffIndex]
  );

  const currentDiffLabel = DIFFICULTY_LABEL[DIFFICULTY_ORDER[diffIndex]];

  const handleOptionClick = (index) => {
    if (showAnswer) return;
    setSelectedOption(index);
  };

  const fetchExplanation = async (q, wrongIdx) => {
    setAiLoading(true);
    setAiExplanation('');
    try {
      const res = await axios.post(`${API_BASE}/api/learning/explain`, {
        question: q.question,
        options: q.options,
        correctIndex: q.answerIndex,
        selectedIndex: wrongIdx
      });
      setAiExplanation(res.data?.explanation || '');
    } catch {
      const correct = q.options[q.answerIndex];
      setAiExplanation(
        `The correct answer is: "${correct}". Review the concept and try another question at this difficulty.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;
    const correct = selectedOption === currentQuestion.answerIndex;
    if (correct) {
      const pts = pointsForDifficulty(currentQuestion.difficulty);
      setRoundScore((s) => s + 1);
      setSessionPointsEarned((p) => p + pts);
      const prev = loadPoints();
      localStorage.setItem(LS_POINTS, String(prev + pts));
      onPointsChange?.();

      setStreak((s) => {
        const ns = s + 1;
        if (ns >= 2) {
          setDiffIndex((d) => Math.min(2, d + 1));
          return 0;
        }
        return ns;
      });

      if (currentQuestion.difficulty === 'hard') {
        hardStreakRef.current += 1;
        setMaxHardStreak((m) => Math.max(m, hardStreakRef.current));
      } else {
        hardStreakRef.current = 0;
      }
    } else {
      setStreak(0);
      setDiffIndex((d) => Math.max(0, d - 1));
      hardStreakRef.current = 0;
      fetchExplanation(currentQuestion, selectedOption);
    }
    setShowAnswer(true);
  };

  const goNext = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    setAiExplanation('');
    setAiLoading(false);

    if (round >= QUIZ_LEN - 1) {
      const totalPts = loadPoints();
      const roadmapDone = ROADMAP_STEPS.filter((s) => loadRoadmapDone()[s.id]).length;
      evaluateBadges({
        totalPoints: totalPts,
        roadmapDoneCount: roadmapDone,
        roadmapTotal: ROADMAP_STEPS.length,
        hardStreakInRound: maxHardStreak,
        completedAnyQuiz: true
      });
      saveLeaderboardEntry(totalPts);
      onPointsChange?.();
      setQuizCompleted(true);
      return;
    }

    const nextRound = round + 1;
    setRound(nextRound);
    const nextSet = new Set(usedIds);
    let q = pickNext(nextSet);
    if (!q) {
      q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
      nextSet.add(q.id);
    }
    setCurrentQuestion(q);
    setUsedIds(nextSet);
  };

  const handleRetry = () => {
    const { usedIds: u, currentQuestion: q } = initialMediumQuestion();
    setRound(0);
    setDiffIndex(1);
    setStreak(0);
    setUsedIds(u);
    setCurrentQuestion(q);
    setSelectedOption(null);
    setShowAnswer(false);
    setRoundScore(0);
    setSessionPointsEarned(0);
    setQuizCompleted(false);
    setAiExplanation('');
    setAiLoading(false);
    hardStreakRef.current = 0;
    setMaxHardStreak(0);
  };

  if (quizCompleted) {
    const pct = Math.round((roundScore / QUIZ_LEN) * 100);
    return (
      <div className="quiz-inner">
        <div className="quiz-card">
          <div className="quiz-results">
            <h2>Round complete</h2>
            <div className="score-display">
              {roundScore}/{QUIZ_LEN}
            </div>
            <div className="score-message">
              {pct >= 80 ? 'Excellent work.' : pct >= 60 ? 'Nice progress.' : 'Keep practicing.'}
            </div>
            <div className="score-percentage">
              {pct}% correct · +{sessionPointsEarned} pts this round
            </div>
            <p className="adaptive-hint">Next round adapts again from medium difficulty.</p>
            <button type="button" className="retry-btn" onClick={handleRetry}>
              Play again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-inner">
      <div className="quiz-meta-bar">
        <span>
          Question {round + 1} / {QUIZ_LEN}
        </span>
        <span className="diff-pill">Adaptive: {currentDiffLabel}</span>
        <span className="streak-pill">Streak to level up: {streak}/2</span>
      </div>
      <div className="quiz-card">
        <p className="question">{currentQuestion.question}</p>
        <div className="options">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              type="button"
              className={`option-btn ${selectedOption === idx ? 'selected' : ''} ${
                showAnswer
                  ? idx === currentQuestion.answerIndex
                    ? 'correct'
                    : selectedOption === idx
                      ? 'wrong'
                      : ''
                  : ''
              }`}
              onClick={() => handleOptionClick(idx)}
              disabled={showAnswer}
            >
              {option}
            </button>
          ))}
        </div>

        {showAnswer && selectedOption !== currentQuestion.answerIndex && (
          <div className="ai-explain">
            <h4>Why this was tricky</h4>
            {aiLoading && <p className="ai-loading">Getting a short explanation…</p>}
            {!aiLoading && aiExplanation && <p className="ai-text">{aiExplanation}</p>}
          </div>
        )}

        {!showAnswer && (
          <button
            type="button"
            className="check-btn"
            onClick={handleCheckAnswer}
            disabled={selectedOption === null}
          >
            Check answer
          </button>
        )}

        {showAnswer && (
          <button type="button" className="next-btn" onClick={goNext}>
            {round >= QUIZ_LEN - 1 ? 'View results' : 'Next question'}
          </button>
        )}
      </div>
    </div>
  );
}

function ProgressSection({ points, level }) {
  const badges = loadBadges();
  const board = loadLeaderboard();
  const nextAt = nextLevelThreshold(level);

  return (
    <div className="learning-section learning-progress">
      <h2>Progress & leaderboard</h2>
      <div className="progress-hero">
        <div>
          <div className="stat-big">{points}</div>
          <div className="stat-label">Learning points</div>
        </div>
        <div>
          <div className="stat-big">Level {level}</div>
          <div className="stat-label">
            Next level at {nextAt} pts
          </div>
        </div>
      </div>
      <div className="level-bar-outer">
        <div
          className="level-bar-inner"
          style={{ width: `${Math.min(100, (points / nextAt) * 100)}%` }}
        />
      </div>

      <h3 className="subh">Badges</h3>
      <div className="badge-grid">
        {BADGES.map((b) => {
          const on = badges.includes(b.id);
          return (
            <div key={b.id} className={`badge-card ${on ? 'earned' : 'locked'}`}>
              <span className="badge-icon">{b.icon}</span>
              <div className="badge-name">{b.name}</div>
              <div className="badge-desc">{b.desc}</div>
            </div>
          );
        })}
      </div>

      <h3 className="subh">Leaderboard</h3>
      <p className="board-note">Scores are stored on this device for demo purposes.</p>
      <table className="leader-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Learner</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {board.length === 0 && (
            <tr>
              <td colSpan={3}>Complete a quiz to appear here.</td>
            </tr>
          )}
          {board.map((row, i) => (
            <tr key={row.email + i}>
              <td>{i + 1}</td>
              <td>{row.name || row.email}</td>
              <td>{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Learning() {
  const [tab, setTab] = useState('roadmap');
  const [points, setPoints] = useState(loadPoints);

  const level = useMemo(() => levelFromPoints(points), [points]);

  const refreshPoints = useCallback(() => {
    setPoints(loadPoints());
  }, []);

  return (
    <div className="learning-hub">
      <header className="learning-top">
        <div>
          <h1 className="learning-title">Learning hub</h1>
          <p className="learning-sub">Roadmap, adaptive quiz, and rewards.</p>
        </div>
        <div className="learning-mini-stats">
          <span className="mini-stat">
            Level <strong>{level}</strong>
          </span>
          <span className="mini-stat">
            <strong>{points}</strong> pts
          </span>
        </div>
      </header>

      <nav className="learning-nav" aria-label="Learning sections">
        <button
          type="button"
          className={tab === 'roadmap' ? 'active' : ''}
          onClick={() => setTab('roadmap')}
        >
          Roadmap
        </button>
        <button
          type="button"
          className={tab === 'quiz' ? 'active' : ''}
          onClick={() => setTab('quiz')}
        >
          Adaptive quiz
        </button>
        <button
          type="button"
          className={tab === 'progress' ? 'active' : ''}
          onClick={() => setTab('progress')}
        >
          Progress
        </button>
      </nav>

      {tab === 'roadmap' && <RoadmapSection />}
      {tab === 'quiz' && (
        <div className="learning-quiz-wrap">
          <p className="learning-lead quiz-intro">
            Difficulty starts at <strong>medium</strong>. Two correct answers in a row raise it; a wrong answer
            lowers it. Wrong answers trigger an AI explanation when the API is configured.
          </p>
          <AdaptiveQuiz onPointsChange={refreshPoints} />
        </div>
      )}
      {tab === 'progress' && <ProgressSection points={points} level={level} />}
    </div>
  );
}
