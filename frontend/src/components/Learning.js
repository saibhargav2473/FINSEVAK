import React, { useState } from 'react';
import './Learning.css';

const QUESTIONS = [
  {
    id: 1,
    question: 'What is an emergency fund?',
    options: [
      'Money borrowed for emergencies',
      '3-6 months of expenses saved for unexpected events',
      'Insurance policy for health issues',
      'Stock investment for quick profit'
    ],
    answerIndex: 1
  },
  {
    id: 2,
    question: 'Which option best describes diversification?',
    options: [
      'Putting all money in one stock',
      'Spreading investments across assets to reduce risk',
      'Keeping cash only',
      'Investing only in gold'
    ],
    answerIndex: 1
  },
  {
    id: 3,
    question: 'What is compound interest?',
    options: [
      'Interest on the initial principal only',
      'Interest calculated on principal plus accumulated interest',
      'A fixed fee charged monthly',
      'Tax on investment returns'
    ],
    answerIndex: 1
  },
  {
    id: 4,
    question: 'What does ROI stand for in finance?',
    options: [
      'Rate of Inflation',
      'Return on Investment',
      'Risk of Interest',
      'Revenue on Income'
    ],
    answerIndex: 1
  },
  {
    id: 5,
    question: 'Which of the following is a liquid asset?',
    options: [
      'House',
      'Car',
      'Savings account',
      'Retirement fund'
    ],
    answerIndex: 2
  },
  {
    id: 6,
    question: 'What is a budget?',
    options: [
      'A plan for spending and saving money',
      'A type of investment account',
      'A government tax form',
      'A short-term loan'
    ],
    answerIndex: 0
  },
  {
    id: 7,
    question: 'What is the main purpose of insurance?',
    options: [
      'To increase income',
      'To protect against financial loss',
      'To invest in stocks',
      'To reduce taxes'
    ],
    answerIndex: 1
  },
  {
    id: 8,
    question: 'Which investment is considered least risky?',
    options: [
      'Government bonds',
      'Individual stocks',
      'Cryptocurrency',
      'Commodities'
    ],
    answerIndex: 0
  },
  {
    id: 9,
    question: 'What is the main benefit of a 401(k) plan?',
    options: [
      'Immediate cash withdrawal',
      'Tax-deferred retirement savings',
      'High-risk investment returns',
      'No employer contribution'
    ],
    answerIndex: 1
  },
  {
    id: 10,
    question: 'What is inflation?',
    options: [
      'Decrease in prices over time',
      'Increase in prices over time',
      'Government tax on income',
      'A type of investment'
    ],
    answerIndex: 1
  },
  {
    id: 11,
    question: 'What is a credit score?',
    options: [
      'A measure of income',
      'A rating of financial health and borrowing reliability',
      'The interest rate on loans',
      'A tax identification number'
    ],
    answerIndex: 1
  },
  {
    id: 12,
    question: 'Which is an example of a fixed expense?',
    options: [
      'Electricity bill',
      'Groceries',
      'Monthly rent',
      'Dining out'
    ],
    answerIndex: 2
  },
  {
    id: 13,
    question: 'What is a stock?',
    options: [
      'A loan to a company',
      'Ownership share in a company',
      'A government bond',
      'A savings account'
    ],
    answerIndex: 1
  },
  {
    id: 14,
    question: 'What is the purpose of an interest rate?',
    options: [
      'To measure inflation',
      'To compensate lenders for lending money',
      'To calculate taxes',
      'To track stock performance'
    ],
    answerIndex: 1
  },
  {
    id: 15,
    question: 'Which option best describes a mutual fund?',
    options: [
      'A single company stock',
      'A pooled investment managed by professionals',
      'A bank account with interest',
      'A type of insurance'
    ],
    answerIndex: 1
  },
  {
    id: 16,
    question: 'What is financial planning?',
    options: [
      'Making short-term loans',
      'Creating a strategy for spending, saving, and investing',
      'Buying stocks randomly',
      'Applying for credit cards only'
    ],
    answerIndex: 1
  },
  {
    id: 17,
    question: 'Which of the following is a long-term financial goal?',
    options: [
      'Buying groceries',
      'Saving for retirement',
      'Paying monthly bills',
      'Emergency cash for today'
    ],
    answerIndex: 1
  },
  {
    id: 18,
    question: 'What is a liability?',
    options: [
      'Something you own',
      'Something you owe',
      'A type of income',
      'A tax deduction'
    ],
    answerIndex: 1
  },
  {
    id: 19,
    question: 'Which is an example of passive income?',
    options: [
      'Salary from a job',
      'Rental income from property',
      'Overtime pay',
      'Freelance consulting'
    ],
    answerIndex: 1
  },
  {
    id: 20,
    question: 'What does APR stand for?',
    options: [
      'Annual Percentage Rate',
      'Average Profit Return',
      'Asset Performance Ratio',
      'Annual Payment Requirement'
    ],
    answerIndex: 0
  },
  {
    id: 21,
    question: 'What is the main goal of retirement savings?',
    options: [
      'To pay off debt',
      'To provide income after leaving work',
      'To buy a house',
      'To invest in cryptocurrency'
    ],
    answerIndex: 1
  },
  {
    id: 22,
    question: 'Which of the following reduces financial risk?',
    options: [
      'Diversification',
      'Spending more',
      'Borrowing heavily',
      'Ignoring taxes'
    ],
    answerIndex: 0
  },
  {
    id: 23,
    question: 'What is a financial asset?',
    options: [
      'Cash, stocks, bonds, or investments',
      'House or car only',
      'Debt owed to others',
      'Monthly expenses'
    ],
    answerIndex: 0
  },
  {
    id: 24,
    question: 'What is a budget deficit?',
    options: [
      'Spending more than income',
      'Spending less than income',
      'Equal income and spending',
      'Savings invested in stocks'
    ],
    answerIndex: 0
  },
  {
    id: 25,
    question: 'Which of the following is a good practice for financial health?',
    options: [
      'Regularly tracking expenses',
      'Ignoring bills',
      'Spending all income immediately',
      'Taking unnecessary loans'
    ],
    answerIndex: 0
  }
];

export default function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  const handleOptionClick = (index) => {
    if (showAnswer) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    if (selectedOption === currentQuestion.answerIndex) {
      setScore(score + 1);
    }
    setShowAnswer(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowAnswer(false);
    setQuizCompleted(false);
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return "Excellent! 🎉";
    if (percentage >= 80) return "Great Job! 👍";
    if (percentage >= 70) return "Good Work! 👌";
    if (percentage >= 60) return "Not Bad! 😊";
    return "Keep Learning! 📚";
  };

  // Quiz completion screen
  if (quizCompleted) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="quiz-results">
            <h2>Quiz Complete!</h2>
            <div className="score-display">{score}/{totalQuestions}</div>
            <div className="score-message">{getScoreMessage()}</div>
            <div className="score-percentage">You scored {percentage}%</div>
            <button className="retry-btn" onClick={handleRetry}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main quiz screen
  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <h2>Question {currentIndex + 1} of {totalQuestions}</h2>
        <p className="question">{currentQuestion.question}</p>
        <div className="options">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              className={`option-btn ${
                selectedOption === idx ? 'selected' : ''
              } ${
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

        {!showAnswer && (
          <button
            className="check-btn"
            onClick={handleCheckAnswer}
            disabled={selectedOption === null}
          >
            Check Answer
          </button>
        )}

        {showAnswer && (
          <button className="next-btn" onClick={handleNext}>
            {currentIndex === QUESTIONS.length - 1 ? 'View Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}