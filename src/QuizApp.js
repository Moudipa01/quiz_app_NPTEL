import React, { useState, useEffect } from "react";
import quizSets from "./questions";

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function shuffleQuestionsAndOptions(questions) {
  return shuffleArray(questions).map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

export default function QuizApp() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});

  useEffect(() => {
    const shuffled = {};
    let allQuestions = [];

    for (const key in quizSets) {
      const shuffledQuiz = shuffleQuestionsAndOptions(quizSets[key]);
      shuffled[key] = shuffledQuiz;
      allQuestions = allQuestions.concat(shuffledQuiz);
    }

    shuffled["all"] = shuffleQuestionsAndOptions(allQuestions); // Add all questions combined
    setQuizzes(shuffled);
  }, []);

  const handleAnswerChange = (quizKey, qIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [quizKey]: {
        ...(prev[quizKey] || {}),
        [qIndex]: option,
      },
    }));
  };

  const handleSubmit = (quizKey) => {
    setSubmitted((prev) => ({
      ...prev,
      [quizKey]: true,
    }));
  };

  const getCorrectCount = (quizKey) => {
    const quiz = quizzes[quizKey] || [];
    const quizAnswers = answers[quizKey] || {};
    return quiz.reduce((count, q, i) => {
      return quizAnswers[i] === q.answer ? count + 1 : count;
    }, 0);
  };

  const renderQuiz = (quizKey) => {
    const quiz = quizzes[quizKey] || [];
    const quizAnswers = answers[quizKey] || {};
    const isSubmitted = submitted[quizKey];

    return (
      <div style={{ marginTop: "20px" }}>
        <h3>{quizKey.toUpperCase()}</h3>
        {quiz.map((q, qIndex) => {
          const isWrong = isSubmitted && quizAnswers[qIndex] !== q.answer;
          return (
            <div key={qIndex} style={{ marginBottom: "20px" }}>
              <p>
                <strong>
                  {qIndex + 1}. {q.question}
                </strong>
              </p>
              {q.options.map((opt, oIndex) => {
                const isCorrect = isSubmitted && opt === q.answer;
                const isSelectedWrong =
                  isSubmitted &&
                  quizAnswers[qIndex] === opt &&
                  quizAnswers[qIndex] !== q.answer;
                return (
                  <label
                    key={oIndex}
                    style={{
                      display: "block",
                      color: isCorrect
                        ? "green"
                        : isSelectedWrong
                        ? "red"
                        : "black",
                    }}
                  >
                    <input
                      type="radio"
                      name={`${quizKey}-q${qIndex}`}
                      value={opt}
                      checked={quizAnswers[qIndex] === opt}
                      onChange={() => handleAnswerChange(quizKey, qIndex, opt)}
                      disabled={isSubmitted}
                    />{" "}
                    {opt}
                  </label>
                );
              })}
              {isWrong && (
                <p style={{ color: "blue" }}>✅ Correct answer: {q.answer}</p>
              )}
            </div>
          );
        })}
        <button
          onClick={() => handleSubmit(quizKey)}
          disabled={isSubmitted}
          style={{
            padding: "10px 20px",
            background: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit{" "}
          {quizKey.toUpperCase() === "ALL"
            ? "ALL SECTION"
            : quizKey.toUpperCase()}
        </button>

        {isSubmitted && (
          <p
            style={{
              marginTop: "10px",
              fontWeight: "bold",
              fontSize: "18px",
              color: "green",
            }}
          >
            Score: {getCorrectCount(quizKey)}/{quiz.length}
          </p>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <h2>Quiz App</h2>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {[...Object.keys(quizSets), "all"].map((key) => (
          <button
            key={key}
            onClick={() => setActiveQuiz(key)}
            style={{
              padding: "15px 25px",
              border: "2px solid #007bff",
              borderRadius: "10px",
              background: activeQuiz === key ? "#007bff" : "white",
              color: activeQuiz === key ? "white" : "#007bff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>
      {activeQuiz && renderQuiz(activeQuiz)}
    </div>
  );
}
