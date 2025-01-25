import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const MockTestManagement = () => {
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [newTest, setNewTest] = useState({
    title: "",
    description: "",
    duration: "" ,
    category: "",
    difficulty: "",
    questions: [],
  });
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/v1/tests/alltests`);
      console.log("Fetched Tests:", response.data.data);
      setMockTests(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load tests. Please try again later.");
      setLoading(false);
    }
  };

  const handleAddMockTest = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/v1/tests/addtest`, newTest);
      console.log("Test Added:", response.data);
      setMockTests([...mockTests, response.data]);
      setNewTest({ title: "", description: "", duration:"", category: "", difficulty: "", questions: [] });
    } catch (err) {
      setError("Failed to add test. Please try again later.");
    }
  };

  const addQuestionToTest = () => {
    setNewTest({
      ...newTest,
      questions: [...newTest.questions, newQuestion],
    });
    setNewQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "", explanation: "" });
  };

  const handleDeleteMockTest = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/v1/tests/deletetest/${id}`);
      const updatedMockTests = mockTests.filter((test) => test._id !== id);
      setMockTests(updatedMockTests);
    } catch (err) {
      setError("Failed to delete test. Please try again later.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mock Test Management</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Add New Test</h2>
        <div className="space-y-2">
         
       <div className=" flex gap-3 ">   <input
            type="text"
            placeholder="Title"
            value={newTest.title}
            onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
            className="border rounded p-2 w-full"
          />
          <textarea
            placeholder="Description"
            value={newTest.description}
            onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
            className="border rounded p-2 w-full"
          />
          
          <input
          
            type="number"
            placeholder="Duration (seconds)"
            value={newTest.duration}
            onChange={(e) => setNewTest({ ...newTest, duration: parseInt(e.target.value) })}
            className="border rounded p-2 w-full"
          />
          <input
            type="text"
            placeholder="Category"
            value={newTest.category}
            onChange={(e) => setNewTest({ ...newTest, category: e.target.value })}
            className="border rounded p-2 w-full"
          />
          <input
            type="text"
            placeholder="Difficulty"
            value={newTest.difficulty}
            onChange={(e) => setNewTest({ ...newTest, difficulty: e.target.value })}
            className="border rounded p-2 w-full"
          /></div>

          <div className="border p-4 rounded">
            <h3 className="font-semibold">Add Question</h3>
            <input
              type="text"
              placeholder="Question"
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              className="border rounded p-2 w-full mb-2"
            />
           
           <div className="flex gap-3">
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
                className="border rounded p-2 w-full mb-2"
              />
            ))}
           </div>
            <input
              type="text"
              placeholder="Correct Answer"
              value={newQuestion.correctAnswer}
              onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
              className="border rounded p-2 w-full mb-2"
            />
            <textarea
              placeholder="Explanation"
              value={newQuestion.explanation}
              onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
              className="border rounded p-2 w-full mb-2"
            />
            <button
              onClick={addQuestionToTest}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Question
            </button>
          </div>

          <button
            onClick={handleAddMockTest}
            className="bg-blue-500 text-white ml-4 px-4 py-2 rounded"
          >
            Submit Test
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      <div className="space-y-4">
        {mockTests.map((mockTest) => (
          <div key={mockTest._id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{mockTest.title}</h2>
            <p>{mockTest.description}</p>
            <p>Duration: {mockTest.duration} seconds</p>
            <p>Category: {mockTest.category}</p>
            <p>Difficulty: {mockTest.difficulty}</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
              onClick={() => handleDeleteMockTest(mockTest._id)}
            >
              Delete Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockTestManagement;