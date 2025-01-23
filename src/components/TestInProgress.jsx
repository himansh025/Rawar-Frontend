import { Clock } from 'lucide-react';
import formatTime from '../pages/MockTests'

 export default function TestInProgress({
    test,
    currentQuestionIndex,
    totalQuestions,
    timeRemaining,
    userAnswers,
    onAnswerSelect,
    onNext,
    onPrev,
    onSubmit
  }) {
    const currentQuestion = test.questions[currentQuestionIndex];
  
    return (
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-medium">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <div className="h-2 w-48 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-indigo-600 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
  
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`block p-4 border rounded-lg cursor-pointer transition-colors
                  ${userAnswers[currentQuestion._id] === option
                    ? 'bg-indigo-50 border-indigo-500'
                    : 'hover:bg-gray-50 border-gray-200'
                  }
                `}>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={userAnswers[currentQuestion._id] === option}
                    onChange={() => onAnswerSelect(currentQuestion._id, option)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3">{option}</span>
                </div>
              </label>
            ))}
          </div>
  
          <div className="flex justify-between mt-6">
            <button
              onClick={onPrev}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Previous
            </button>
            
            {currentQuestionIndex === totalQuestions - 1 ? (
              <button
                onClick={onSubmit}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={onNext}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  