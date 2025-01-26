import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
// const token = localStorage.getItem("accessToken");

const TestManagement = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { type } = useParams();
  // console.log(type);
  
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
    question:"",
    options: ["","","",""],
    correctAnswer:"",
    explanation:"",
    tags:[]   
  });

  useEffect(() => {
    fetchData();


}, [type])


  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      let endpoint;
          if(type==="mocktest"){
            // console.log(type);
            
              endpoint= `${apiUrl}/api/v1/tests/alltests`
          }else{
            endpoint=  `${apiUrl}/api/v1/questions/GetAllquestion`;
          }

          const response = await axios.get(endpoint);
          // console.log(response.data);
          if(type=="mocktest"){
            // console.log(response.data.data);
      setData(response.data.data || [])}
    else{
      setData(response.data)
    }
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTest = async () => {
    
    let payload
    if( type === "mocktest") {
       payload = newTest;
    }else{
      payload=newQuestion
    }
    // newTest : newQuestion;
    let  endpoint 
    if( type === "mocktest") {
   endpoint=`${apiUrl}/api/v1/tests/addtest`
   }else{
     endpoint= `${apiUrl}/api/v1/questions/addquestion`;
  }

    try {
      // console.log(payload);
      // console.log(endpoint);
      
      const response = await axios.post(endpoint, payload
      );
      
      // console.log(response);
      alert("queation added")
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
    if(type==="mocktest"){
      // console.log(type);
      
        endpoint= `${apiUrl}/api/v1/tests/deletetest/${id}`
        // console.log(endpoint);
        
    }else{
      endpoint=  `${apiUrl}/api/v1/questions/deletequiz/${id}`;
    }
    try {
     const res=  await axios.delete(endpoint);
    //  console.log(res);
     
      setData(data.filter((item) => item._id !== id));
    } catch (err) {
      setError("Failed to delete item. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-gray-800">
      <h1 className="text-2xl text-center text-white font-bold mb-4">
        {type === "mocktest" ? "Mock Test Management" : "Aptitude Question Management"}
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 p-2">
          <h2 className="text-lg font-semibold text-teal-50 mb-2">
            Add New {type === "mocktest" ? "Test" : "Question"}
          </h2>
          <div className="space-y-2">
            {type === "mocktest" ? (
              <>
                <input
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
                  onChange={(e) =>
                    setNewTest({ ...newTest, duration: parseInt(e.target.value) })
                  }
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
                /> 

<div className="border p-4 rounded ">
            <h3 className="font-semibold text-white">Add Question</h3>
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
             
        
              </>
            ):(

              <div className="border p-4 rounded ">
              <h3 className="font-semibold">Add Question</h3>
              <input
                type="text"
                placeholder="Question"
                value={newQuestion.question}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, question: e.target.value })
                }
                className="border rounded p-2 m-1 w-full"
              />

              <input
                type="text"
                placeholder="Title"
                value={newQuestion.title}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, title: e.target.value })
                }
                className="border rounded m-1 p-2 w-full"
              />
                <input
                type="text"
                placeholder="Description"
                value={newQuestion.description}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, description: e.target.value })
                }
                className="border rounded m-1 p-2 w-full"
              />
                    <input
                type="text"
                placeholder="Category"
                value={newQuestion.category}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, category: e.target.value })
                }
                className="border rounded m-1 p-2 w-full"
              />
                    <input
                type="text"
                placeholder="Tags"
                value={newQuestion.tags}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, tags: e.target.value })
                }
                className="border m-1 rounded p-2 w-full"
              />
                    <input
                type="text"
                placeholder="Difficulty"
                value={newQuestion.difficulty}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, difficulty: e.target.value })
                }
                className="border m-1 rounded p-2 w-full"
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
                    className="border m-1 rounded p-2 w-full"
                  />
                ))}
              </div>
              <input
                type="text"
                placeholder="Correct Answer"
                value={newQuestion.correctAnswer}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })
                }
                className="border rounded m-1 p-2 w-full"
              />
              <textarea
                placeholder="Explanation"
                value={newQuestion.explanation}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, explanation: e.target.value })
                }
                className="border rounded p-2 w-full"
              />


            </div>
            )}


            <button
              onClick={handleAddTest}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-2 text-gray-400">
          <h2 className="text-lg font-semibold mb-2 text-center">
            {type === "mocktest" ? "Mock Tests" : "Aptitude Questions"}
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            data.map((item) => (
              <div key={item._id} className="p-4 border rounded shadow mb-2">
                <h3 className="font-semibold">{item.title || item.question}</h3>
                <p>{item.description || item.explanation}</p>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2"
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
