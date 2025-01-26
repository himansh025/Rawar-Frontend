import React, { useState, useEffect } from 'react';
import { Clock, Brain, Target, CheckCircle, XCircle } from 'lucide-react';
import { useTimer } from '../utils/hooks';
import { formatTime } from '../utils/formatTime';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { startTest,submitTestAnswers } from '../utils/testDataFetch.js';
import { useNavigate } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
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
  let userid= user._id
  // console.log(userid);
  const navigate= useNavigate()
  

  const { time, startTimer, pauseTimer } = useTimer(activeTest?.duration || 3600);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/tests/alltests`);
      console.log("kya aya",response);
      
      setTests(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load tests. Please try again later.');
      setLoading(false);
    }
  };

    const handleStartTest = async (test) => {
      if(user){
   
        console.log("test",test);
          // Check if the test has already been taken
          console.log("user",user);

          const isTestTaken = user?.testSessions.some(session => session.testId === test._id);
          // console.log("is test laken",isTestTaken);  
          if (isTestTaken) {
            alert("You have already started this test. You cannot start it again.");
            return;
          }
         
      const response= await startTest(test._id,user._id)
   console.log(response);
        setActiveTest(test);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setTestResults(null);
        startTimer();
      
    }
    else{
      alert("please login")
      navigate('/login')
      return
    }}


  const handleAnswerSelect = (questionId, answer,) => {
    console.log("question ans",questionId,answer);
    
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeTest.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    try {
      pauseTimer();
      console.log(userAnswers);
  
      const answers = Object.values(userAnswers);
      console.log("User ID:", userid);
      console.log("Active Test ID:", activeTest._id);
  
      const response = await submitTestAnswers(activeTest._id, answers, userid);
      setTestResults(response.data.data);
    } catch (err) {
      console.error('Error submitting test:', err);
      setError('Failed to submit test. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading tests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (activeTest && !testResults) {
    return (
      <TestInProgress
        test={activeTest}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={activeTest.questions.length}
        timeRemaining={time}
        userAnswers={userAnswers}
        onAnswerSelect={handleAnswerSelect}
        onNext={handleNextQuestion}
        onPrev={handlePrevQuestion}
        onSubmit={handleSubmitTest}
      />
    );
  }

  if (testResults) {
    return (
      <TestResults
        results={testResults}
        test={activeTest}
        onBackToTests={() => {
          setActiveTest(null);
          setTestResults(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Mock Tests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <TestCard
            key={test._id}
            test={test}
            onStart={() => handleStartTest(test)}
          />
        ))}
      </div>
    </div>
  );
}

function TestCard({ test, onStart }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{test.title}</h3>
      <p className="text-gray-600 mb-4">{test.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          <span>{formatTime(test.duration)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Brain className="h-4 w-4 mr-2" />
          <span>{test.questions.length} Questions</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Target className="h-4 w-4 mr-2" />
          <span className="capitalize">{test.difficulty} Difficulty</span>
        </div>
      </div>
      
      <button
        onClick={onStart}
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Start Test
      </button>
    </div>
  );
}

function TestInProgress({
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

function TestResults({ results, test, onBackToTests }) {
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

export default MockTests;