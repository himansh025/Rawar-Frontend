import { Target, CheckCircle, XCircle } from 'lucide-react';

export default function TestResults({ results, test, onBackToTests }) {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">Correct Answers</p>
                    <p className="text-2xl font-semibold text-green-900">{results.correct}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="h-8 w-8 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">Incorrect Answers</p>
                    <p className="text-2xl font-semibold text-red-900">{results.incorrect}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-blue-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">Accuracy</p>
                    <p className="text-2xl font-semibold text-blue-900">{results.accuracy}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Questions</span>
                <span className="font-medium">{results.totalQuestions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Time Taken</span>
                <span className="font-medium">{formatTime(test.duration)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Final Score</span>
                <span className="font-medium text-lg text-indigo-600">{results.score} points</span>
              </div>
            </div>
          </div>
  
          <div className="mt-6">
            <button
              onClick={onBackToTests}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Tests
            </button>
          </div>
        </div>
      </div>
    );
  }
  