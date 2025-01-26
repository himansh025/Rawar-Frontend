import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { fetchQuestions, getQuestionById } from '../utils/questionDataFetch';
import QuestionSolver from '../components/QuestionSolver';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Question Bank Component
function QuestionBank() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user) || false;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionsData = async () => {
      setLoading(true);
      try {
        const response = await fetchQuestions({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
          search: searchQuery || undefined,
        });
        setQuestions(response || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsData();
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const handleSolveClick = async (question) => {
    if (user) {
      try {
        const detailedQuestion = await getQuestionById(question._id);
        setSelectedQuestion(detailedQuestion);
      } catch (err) {
        console.error('Failed to load question details:', err);
      }
    } else {
      alert('Please login');
      navigate('/login');
    }
  };

  const handleNextQuestion = () => {
    const currentIndex = questions.findIndex((q) => q._id === selectedQuestion._id);
    const nextQuestion = questions[currentIndex + 1];

    if (nextQuestion) {
      handleSolveClick(nextQuestion);
    } else {
      alert('No more questions available.');
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const isMatchingCategory =
      selectedCategory === 'all' || (question.category && question.category.toLowerCase() === selectedCategory.toLowerCase());
    const isMatchingDifficulty =
      selectedDifficulty === 'all' || (question.difficulty && question.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());
    const isSearchMatch =
      (question.question && question.question.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (question.description && question.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return isMatchingCategory && isMatchingDifficulty && isSearchMatch;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-800 rounded-lg p-4 shadow-lg">Error: {error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6">
      {selectedQuestion ? (
        <QuestionSolver
          question={selectedQuestion}
          onNext={handleNextQuestion}
          onBack={() => setSelectedQuestion(null)}
          user={user._id}
        />
      ) : (
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-center sm:text-left">
              Question Bank
            </h1>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <option value="all">All Categories</option>
                <option value="quantitative">Quantitative</option>
                <option value="logical">Logical</option>
                <option value="verbal">Verbal</option>
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="appearance-none bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            />
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuestions.map((question) => (
              <li key={question._id} className="bg-gray-800 rounded-xl p-4 sm:p-6 hover:bg-gray-700 transition-all duration-200">
                <div className="flex flex-col space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">{question.title}</h3>
                  <p className="text-gray-300 text-sm sm:text-base">{question.description}</p>
                  <div className="flex gap-3 flex-wrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200">
                      {question.category}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        question.difficulty === 'easy'
                          ? 'bg-green-900 text-green-200'
                          : question.difficulty === 'medium'
                          ? 'bg-yellow-900 text-yellow-200'
                          : 'bg-red-900 text-red-200'
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleSolveClick(question)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
                >
                  Solve
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default QuestionBank;
