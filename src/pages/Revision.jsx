import React, { useState, useEffect } from 'react';
import { 
  Revisionfetch
} from '../utils/revisionDataFetch.js';
import { Search } from 'lucide-react';


function Revision() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchQuestionsData = async () => {
      setLoading(true);
      try {
        const response = await Revisionfetch()
        console.log("data",response)
        ;
        setQuestions(response || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsData();
  }, []);

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-800 rounded-lg p-4 shadow-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
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
            <li
              key={question._id}
              className="bg-gray-800 rounded-xl p-4 sm:p-6 hover:bg-gray-700 transition-all duration-200"
            >
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-white">{question.title}</h3>
                <p className="text-gray-300 text-sm sm:text-base line-clamp-3">{question.description}</p>
                <button
                  onClick={() =>
                    setSelectedQuestion(
                      selectedQuestion && selectedQuestion._id === question._id ? null : question
                    )
                  }
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
                >
                  {selectedQuestion && selectedQuestion._id === question._id
                    ? 'Hide Explanation'
                    : 'Explain'}
                </button>
              </div>
              {selectedQuestion && selectedQuestion._id === question._id && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg text-white">
                  <h4 className="text-lg font-bold">Explanation:</h4>
                  <p>{selectedQuestion.explanation}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Revision
