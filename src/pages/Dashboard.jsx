import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import StatesCard from "../components/StatesCard";
import ProgressBar from "../components/ProgressBar";
import { BookOpen, Clock, Brain, Award, User, Check } from "lucide-react";
import { getCurrentUser } from "../utils/userDataFetch.js";
import { Revisionfetch } from "../utils/revisionDataFetch.js";
// import Images from "../components/Images.jsx";

const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [questions, setQuestions] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [revision, setrevision] = useState([]);
  const [progressData, setProgressData] = useState([]);
// console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes, test] = await Promise.all([
          axios.get(`${apiUrl}/api/v1/questions/GetAllquestion`),
          axios.get(`${apiUrl}/api/v1/tests/alltests`),
        ]);
        const response = await Revisionfetch()
        // console.log("data",response)
        
        setrevision(response || []);
        setQuestions(questionsRes.data || []);
        setMockTests(test.data.data || []);
        if (user) {
          const result = await getCurrentUser();
          setProgressData(result.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl, user]);
  console.log(questions,mockTests,revision)

  const calculateSuccessRate = (completed = 0, correct = 0) => {
    if (!completed) return 0; // Ensures completed is not undefined/null/0
    return ((correct / completed) * 100).toFixed(2);
  };
  

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-10 text-white transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {user ? `Welcome back, ${progressData.name}!` : "Welcome to the Learning Platform!"}
              </h1>
              <p className="text-indigo-100">
                {user
                  ? "Track your progress and continue your learning journey"
                  : "Sign in to track your progress and start learning"}
              </p>
            </div>

            {user && (
             <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-white shadow-2xl ring-4 ring-indigo-400 ring-opacity-50">
             {progressData.avatar ? (
               <img
                 src={progressData.avatar}
                 alt={progressData.name}
                 className="h-full  w-full object-cover"
               />
             ) : (
               <div className="h-full w-full flex items-center justify-center bg-indigo-100">
                 <User className="h-10 w-10 md:h-12 md:w-12 text-indigo-600" />
               </div>
             )}
           </div>
           
            )}
          </div>
        </header>
    

        {user && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-10 transform hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProgressBar
                icon={<BookOpen className="h-6 w-6" />}
                label="Questions Completed"
                value={user.progress?.completedQuestions || 0}
                total={200}
              />
              <ProgressBar
                icon={<Check className="h-6 w-6" />}
                label="Correct Answers"
                value={user.progress?.correctAnswers || 0}
                total={200}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Aptitude Questions" data={questions} link="user/questions" />
          <Card title="Available Mock Tests" data={mockTests} link="user/mocktests" />

          <Card title="Revise Aptitude Questions" data={revision} link="user/allquestions" />
        </div>
        
      </div>
     
    </div>
  );
};


const Card = ({ title, data, link }) => (
  <div className="bg-white shadow-lg rounded-xl p-4 transform hover:shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <Link 
        to={link} 
        className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-300"
      >
        View all
      </Link>
    </div>
    <div className="space-y-3">
      {data.slice(0, 3).map((item) => (
        <div
          key={item._id}
          className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]"
        >
          <h3 className="text-base font-semibold text-gray-900">{item.title || item.question}</h3>
          <div className="flex items-center gap-4 mt-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                item.difficulty === "easy"
                  ? "bg-green-100 text-green-800"
                  : item.difficulty === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Dashboard;