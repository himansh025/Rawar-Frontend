import React, { useState } from "react";



const AdminPage = () => {
  const [tests, setTests] = useState([]);
  const [testName, setTestName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    type: "mcq",
    question: "",
    options: [],
    correctAnswer: "",
    starterCode: "",
    correctOutput: "",
  });

  const addQuestion = () => {
    const questionCopy = { ...newQuestion }; // Clone the question
    setQuestions([...questions, questionCopy]); // Add the clone to the questions array
    // Reset the form
    setNewQuestion({
      type: "mcq",
      question: "",
      options: [],
      correctAnswer: "",
      starterCode: "",
      correctOutput: "",
    });
  };
  

  const handleSubmitTest = () => {
    const newTest = { id: Date.now(), name: testName, problems: questions };
    setTests([...tests, newTest]);
    setTestName("");
    setQuestions([]);
    alert("Test added successfully!");
  };

  return (
    <div className="admin-page p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

<main className="min-h-screen bg-gradient-to-r mt-16 from-blue-700 via-indigo-250 to-purple-200 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-black mb-10">
          Welcome 
        </h1>

        {/* Action Buttons in a Flex Layout */}
        <div className="flex justify-center gap-6">
       
          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-2xl transition-all transform hover:scale-105">
         
            <button
              onClick={handleaddtest}
              className="px-10 py-4 bg-green-600 text-white rounded-lg w-48 hover:bg-green-700 transition duration-300"
            >
              add questions
            </button>
          </div>

    
          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-2xl transition-all transform hover:scale-105">
            <button
              onClick={handleSubmitTest}
              className="px-10 py-4 bg-green-600 text-white rounded-lg w-48 hover:bg-green-700 transition duration-300"
            >
              Add test 
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-2xl transition-all transform hover:scale-105">
            <button
              onClick={handleSubmitTest}
              className="px-10 py-4 bg-green-600 text-white rounded-lg w-48 hover:bg-green-700 transition duration-300"
            >
              Update Test 
            </button>
          </div>
        </div>
      </div>
    </main>
    </div>
  );
};

export default AdminPage;