import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const TestManagement = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { type } = useParams();

  const [newTest, setNewTest] = useState({
    title: "",
    description: "",
    duration: "",
    category: "",
    difficulty: "",
    questions: [],
  });

  const [newQuestion, setNewQuestion] = useState({
    category: "",
    difficulty: "",
    title: "",
    description: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
    tags: [],
  });

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      let endpoint;
      if (type === "mocktest") {
        endpoint = `${apiUrl}/api/v1/tests/alltests`;
      } else {
        endpoint = `${apiUrl}/api/v1/questions/GetAllquestion`;
      }

      const response = await axios.get(endpoint);
      setData(response.data.data || response.data);
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTest = async () => {
    let payload;
    if (type === "mocktest") {
      payload = newTest;
    } else {
      payload = newQuestion;
    }

    let endpoint;
    if (type === "mocktest") {
      endpoint = `${apiUrl}/api/v1/tests/addtest`;
    } else {
      endpoint = `${apiUrl}/api/v1/questions/addquestion`;
    }

    try {
      const response = await axios.post(endpoint, payload);
      alert("Question added");
      setData([...data, response.data.newQuestion]);
      resetInputs();
    } catch (err) {
      setError("Failed to add item. Please try again.");
    }
  };

  const resetInputs = () => {
    if (type === "mocktest") {
      setNewTest({
        title: "",
        description: "",
        duration: "",
        category: "",
        difficulty: "",
        questions: [],
      });
    } else {
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
      });
    }
  };

  const addQuestionToTest = () => {
    setNewTest({
      ...newTest,
      questions: [...newTest.questions, newQuestion],
    });
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
    });
  };

  const handleDelete = async (id) => {
    let endpoint;
    if (type === "mocktest") {
      endpoint = `${apiUrl}/api/v1/tests/deletetest/${id}`;
    } else {
      endpoint = `${apiUrl}/api/v1/questions/deletequiz/${id}`;
    }
    try {
      await axios.delete(endpoint);
      setData(data.filter((item) => item._id !== id));
    } catch (err) {
      setError("Failed to delete item. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl text-center text-white font-bold mb-6">
        {type === "mocktest" ? "Mock Test Management" : "Aptitude Question Management"}
      </h1>
      {error && <p className="text-red-400 text-center">{error}</p>}
      <div className="flex   justify-between gap-6">
        <div className="w-full md:w-1/2 p-4 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-teal-300 mb-4">
            Add New {type === "mocktest" ? "Test" : "Question"}
          </h2>
          <div className="space-y-4">
            {type === "mocktest" ? (
              <>
                <input
                  type="text"
                  placeholder="Test Title"
                  value={newTest.title}
                  onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                  className="border bg-gray-700 rounded-lg p-3 w-full text-white placeholder:text-gray-400"
                />
                <textarea
                  placeholder="Description"
                  value={newTest.description}
                  onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                  className="border bg-gray-700 rounded-lg p-3 w-full text-white placeholder:text-gray-400"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Duration (seconds)"
                    value={newTest.duration}
                    onChange={(e) => setNewTest({ ...newTest, duration: e.target.value })}
                    className="border bg-gray-700 rounded-lg p-3 w-full text-white placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newTest.category}
                    onChange={(e) => setNewTest({ ...newTest, category: e.target.value })}
                    className="border bg-gray-700 rounded-lg p-3 w-full text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Difficulty"
                    value={newTest.difficulty}
                    onChange={(e) => setNewTest({ ...newTest, difficulty: e.target.value })}
                    className="border bg-gray-700 rounded-lg p-3 w-full text-white placeholder:text-gray-400"
                  />
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Question"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  className="border bg-gray-700 rounded-lg p-3 w-full text-white placeholder:text-gray-400"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    className="border bg-gray-700 rounded-lg p-3 w-full text-white placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                    className="border bg-gray-700 rounded-lg p-3 w-full text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Tags"
                    value={newQuestion.tags}
                    onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                    className="border bg-gray-700 rounded-lg p-3 w-full text-white placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Difficulty"
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                    className="border bg-gray-700 rounded-lg p-3 w-full text-white placeholder:text-gray-400"
                  />
                </div>
              </>
            )}
            <div className="flex gap-4">
              {newQuestion.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...newQuestion.options];
                    updatedOptions[index] = e.target.value;
                    setNewQuestion({ ...newQuestion, options: updatedOptions });
                  }}
                  className="border bg-gray-700 rounded-lg p-3 w-full text-white placeholder:text-gray-400"
                />
              ))}
            </div>
            <button
              onClick={handleAddTest}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 w-full mt-4"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-4 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-teal-300 mb-4 text-center">
            {type === "mocktest" ? "Mock Tests" : "Aptitude Questions"}
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="spinner-border animate-spin text-white" role="status"></div>
            </div>
          ) : (
            data.map((item) => (
              <div key={item._id} className="p-4 border rounded-lg shadow-md mb-4 bg-gray-700">
                <h3 className="font-semibold text-white">{item.title || item.question}</h3>
                <p className="text-gray-400">{item.description || item.explanation}</p>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-6 py-2 mt-4"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TestManagement;
