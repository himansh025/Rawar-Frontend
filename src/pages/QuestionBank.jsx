import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { fetchQuestions, getQuestionById } from '../utils/questionDataFetch';
import QuestionSolver from '../components/QuestionSolver';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
function QuestionBank() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user) || false;
  const navigate= useNavigate()

  // Fetch questions based on filters
  useEffect(() => {
    const fetchQuestionsData = async () => {
      setLoading(true);
      try {
        const response = await fetchQuestions({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
          search: searchQuery || undefined,
        });
        // console.log(response);
        
        setQuestions(response || []); // Access the data array from the response
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
if(user){
    try {
      const detailedQuestion = await getQuestionById(question._id);
      setSelectedQuestion(detailedQuestion);
    } catch (err) {
      console.error('Failed to load question details:', err);
    }}
    else{
      alert("Please login ")
      navigate('/login')
    }
  };

  const handleNextQuestion = () => {
    const currentIndex = questions.findIndex((q) => q._id === selectedQuestion._id);
    const nextQuestion = questions[currentIndex + 1] 

 if(nextQuestion) {
    handleSolveClick(nextQuestion);
  } else {
    alert("No more questions available.");
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
  
  if (loading) return <div className="text-center mt-10">Loading questions...</div>;

  if (error) return <div className="text-red-500 mt-10">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {selectedQuestion ? (
        <QuestionSolver
          question={selectedQuestion}
          onNext={handleNextQuestion}
          onBack={() => setSelectedQuestion(null)}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
            <div className="flex space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="quantitative">Quantitative</option>
                <option value="logical">Logical</option>
                <option value="verbal">Verbal</option>
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => {
                // Update the state to the current input value
                setSearchQuery(e.target.value);
              }}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <ul className="divide-y divide-gray-200">
            {filteredQuestions.map((question) => (
              <li key={question._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{question.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {question.category}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {question.difficulty}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSolveClick(question)}
                    className="ml-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
                  >
                    Solve
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default QuestionBank;