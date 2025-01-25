import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { submitQuestionState } from '../utils/questionDataFetch.js';
function QuestionSolver({ question, onBack, onNext }) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [submissionStats, setSubmissionStats] = useState({
    totalAttempts: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    questionsAttempted: new Set(),
  });
  
  // const [pendingSubmission, setPendingSubmission] = useState(null);
  // const [submissionTimeout, setSubmissionTimeout] = useState(null);
  
  const handleSubmit = async () => {
    if (submissionStats.questionsAttempted.has(question._id)) {
      alert("You have already attempted this question.");
      return;
    }
    const isCorrect = selectedAnswer === question.correctAnswer;
  
    // Update submission stats
    setSubmissionStats((prev) => {
      const newStats = {
        totalAttempts: prev.totalAttempts + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1),
        questionsAttempted: new Set(prev.questionsAttempted).add(question._id),
      };
      return newStats;
    });
  
    // Prepare submission data
    const submissionData = {
      questionId: question._id,
      userAnswer: selectedAnswer,
      isCorrect,
      timestamp: new Date().toISOString(),
      category: question.category,
      difficulty: question.difficulty,
      stats: {
        totalAttempts: submissionStats.totalAttempts + 1,
        correctAnswers: submissionStats.correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: submissionStats.incorrectAnswers + (isCorrect ? 0 : 1),
      },
    };
  
    // setPendingSubmission(submissionData);
    console.log("subsmissision data",submissionData);
  
    // Clear existing timeout and set a new one
    // if (submissionTimeout) clearTimeout(submissionTimeout);
    // const newTimeout = setTimeout(async () => {
      const response= await submitQuestionState(submissionData)
      console.log("res for submit question",response);
        if (!response) throw new Error("Failed to save submission");
        console.log("Submission saved:", response.data);
        
  
    setFeedback({
      isCorrect,
      message: isCorrect
        ? "Correct! Great job!"
        : `Incorrect. The correct answer is: ${question.correctAnswer}`,
      stats: {
        totalAttempts: submissionStats.totalAttempts + 1,
        correctAnswers: submissionStats.correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: submissionStats.incorrectAnswers + (isCorrect ? 0 : 1),
      },
    });
    setIsAnswered(true);
  };
  

  const handleNext = () => {
    if (!isAnswered) {
      alert("Please submit your answer before moving to the next question.");
      return;
    }
    setSelectedAnswer('');
    setIsAnswered(false);
    setFeedback(null);
    onNext();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Questions
        </button>
        <div className="flex gap-4 text-sm">
          <span className="text-green-600">Correct: {submissionStats.correctAnswers}</span>
          <span className="text-red-600">Incorrect: {submissionStats.incorrectAnswers}</span>
          <span className="text-gray-600">Total: {submissionStats.totalAttempts}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {question.category}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {question.difficulty}
          </span>
        </div>

        <h2 className="text-xl font-semibold text-gray-900">{question.title}</h2>
        <p className="text-gray-600">{question.description}</p>
        <p className="text-lg font-medium text-gray-900">{question.question}</p>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAnswer === option
                  ? isAnswered
                    ? option === question.correctAnswer
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                    : 'bg-indigo-50 border-indigo-500'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={isAnswered}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-3">{option}</span>
              </div>
            </label>
          ))}
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-lg ${
              feedback.isCorrect ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <p
              className={`font-medium ${
                feedback.isCorrect ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {feedback.message}
            </p>
            {question.explanation && (
              <div className="mt-2">
                <h4 className="font-medium text-gray-900">Explanation:</h4>
                <p className="mt-1 text-gray-600">{question.explanation}</p>
              </div>
            )}
            <div className="mt-2 text-sm text-gray-600">
              <p>Session Statistics:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Total Attempts: {feedback.stats.totalAttempts}</li>
                <li>Correct Answers: {feedback.stats.correctAnswers}</li>
                <li>Incorrect Answers: {feedback.stats.incorrectAnswers}</li>
                <li>Success Rate: {((feedback.stats.correctAnswers / feedback.stats.totalAttempts) * 100).toFixed(1)}%</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          {!isAnswered ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionSolver;