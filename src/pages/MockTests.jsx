import React, { useState, useEffect } from 'react';
import { Clock, Brain, Target, CheckCircle, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTimer } from '../utils/hooks';
import { formatTime } from '../utils/formatTime';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { startTest, submitTestAnswers } from '../utils/testDataFetch.js';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

function MockTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTest, setActiveTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testResults, setTestResults] = useState(null);
  const user = useSelector((state) => state.auth.user) || false;
  const navigate = useNavigate();

  const { time, startTimer, pauseTimer } = useTimer(activeTest?.duration || 3600);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/tests/alltests`);
      setTests(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load tests. Please try again later.');
      setLoading(false);
    }
  };

  const handleStartTest = async (test) => {
    if (!user) {
      alert("Please login");
      navigate('/user/login');
      return;
    }
// console.log(user);

    const isTestTaken = user?.testSessions?.some(session => session.testId === test._id);
    if (isTestTaken) {
      alert("You have already started this test. You cannot start it again.");
      return;
    }
   const id=  user._id ? user._id :user.createdUser._id

    try {
      // console.log(id);
      
      await startTest(test._id, id);
      setActiveTest(test);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setTestResults(null);
      startTimer();
    } catch (error) {
      console.error('Error starting test:', error);
      alert('Failed to start test. Please try again.');
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    const id=  user._id ? user._id :user.createdUser._id
    try {
      pauseTimer();
      const answers = Object.values(userAnswers);
      const response = await submitTestAnswers(activeTest._id, answers,id);
      setTestResults(response.data.data);
    } catch (err) {
      console.error('Error submitting test:', err);
      alert('Failed to submit test. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="bg-red-50 text-red-800 rounded-lg p-4 shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  if (activeTest && !testResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-medium text-white">
                    Question {currentQuestionIndex + 1} of {activeTest.questions.length}
                  </span>
                  <div className="h-2 w-48 bg-gray-700 rounded-full">
                    <div
                      className="h-2 bg-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / activeTest.questions.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center text-white">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-medium">{formatTime(time)}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                {activeTest.questions[currentQuestionIndex].question}
              </h2>
              
              <div className="space-y-4">
                {activeTest.questions[currentQuestionIndex].options.map((option, index) => (
                  <label
                    key={index}
                    className={`block p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      userAnswers[activeTest.questions[currentQuestionIndex]._id] === option
                        ? 'bg-indigo-900 border-2 border-indigo-500'
                        : 'bg-gray-700 border-2 border-transparent hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={userAnswers[activeTest.questions[currentQuestionIndex]._id] === option}
                        onChange={() => handleAnswerSelect(activeTest.questions[currentQuestionIndex]._id, option)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-white">{option}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>
                
                {currentQuestionIndex === activeTest.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitTest}
                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors duration-200"
                  >
                    Submit Test
                    <CheckCircle className="h-5 w-5 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors duration-200"
                  >
                    Next
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (testResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-8">Test Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-700 rounded-xl p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">Correct Answers</p>
                      <p className="text-2xl font-semibold text-green-400">{testResults.correct}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-xl p-6">
                  <div className="flex items-center">
                    <XCircle className="h-8 w-8 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">Incorrect Answers</p>
                      <p className="text-2xl font-semibold text-red-400">{testResults.incorrect}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-xl p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-blue-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">Accuracy</p>
                      <p className="text-2xl font-semibold text-blue-400">{testResults.accuracy}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-6">Performance Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-gray-300">
                    <span>Total Questions</span>
                    <span className="font-medium">{testResults.totalQuestions}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <span>Time Taken</span>
                    <span className="font-medium">{formatTime(activeTest.duration)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Final Score</span>
                    <span className="font-medium text-lg text-indigo-400">{testResults.score} points</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => {
                    setActiveTest(null);
                    setTestResults(null);
                  }}
                  className="w-full flex justify-center items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors duration-200"
                >
                  Back to Tests
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Mock Tests</h1>
          <p className="text-gray-400 text-center max-w-2xl">
            Practice with our comprehensive mock tests to improve your skills and track your progress
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test._id}
              className="bg-gray-800 rounded-xl p-6 shadow-xl hover:transform hover:scale-[1.02] transition-all duration-200"
            >
              <h3 className="text-xl font-semibold text-white mb-3">{test.title}</h3>
              <p className="text-gray-400 h-24 mb-6">{test.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-300">
                  <Clock className="h-5 w-5 mr-3 text-indigo-400" />
                  <span>{formatTime(test.duration)}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Brain className="h-5 w-5 mr-3 text-indigo-400" />
                  <span>{test.questions.length} Questions</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Target className="h-5 w-5 mr-3 text-indigo-400" />
                  <span className="capitalize">{test.difficulty} Difficulty</span>
                </div>
              </div>
              
              <button
                onClick={() => handleStartTest(test)}
                className="w-full flex justify-center items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors duration-200"
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MockTests;