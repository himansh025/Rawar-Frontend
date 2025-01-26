import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import StatesCard from "../components/StatesCard";
import ProgressBar from "../components/ProgressBar";
import { BookOpen, Clock, Brain, Award, User, Check } from "lucide-react";
import { getCurrentUser } from "../utils/userDataFetch.js";

const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [questions, setQuestions] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes, test] = await Promise.all([
          axios.get(`${apiUrl}/api/v1/questions/GetAllquestion`),
          axios.get(`${apiUrl}/api/v1/tests/alltests`),
        ]);

        if (user) {
          const result = await getCurrentUser();
          console.log(result);
          console.log(test);
          console.log(questions);
          
          setProgressData(result.data);
          setQuestions(questionsRes.data || []);
          setMockTests(test.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl, user]);

  const calculateSuccessRate = (completed, correct) => {
    if (completed === 0) return 0;
    return ((correct / completed) * 100).toFixed(2);
  };

  const stats = [
    {
      label: "Questions Solved",
      value: progressData?.progress?.completedQuestions || 0,
      total: 200,
      icon: BookOpen,
      color: "bg-blue-500 text-white",
    },
    {
      label: "Tests Taken",
      value: progressData?.progress?.testsTaken || 0,
      total: 20,
      icon: Clock,
      color: "bg-purple-500 text-white",
    },
    {
      label: "Success Rate",
      value: calculateSuccessRate(
        progressData?.progress?.completedQuestions,
        progressData?.progress?.correctAnswers
      ),
      icon: Brain,
      color: "bg-green-500 text-white",
    },
    {
      label: "Current Rank",
      value: `#${user?.stats?.rank || 0}`,
      icon: Award,
      color: "bg-orange-500 text-white",
    },
  ];



  return (
    <div  className="max-w-7xl mx-auto bg-gray-200  px-4 sm:px-6 lg:px-8 py-8">
      <header className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-md p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {user ? `Welcome back, ${progressData.name}!` : "Welcome to the Learning Platform!"}
            </h1>
            <p className="mt-1 text-sm">
              {user
                ? "Track your progress and continue your learning journey"
                : "Sign in to track your progress and start learning"}
            </p>
          </div>
          {user && (
            <div className="h-28 w-28 rounded-full overflow-hidden bg-white shadow-lg">
              {progressData.avatar ? (
                <img src={progressData.avatar} alt={progressData.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-indigo-600" />
              )}
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatesCard
            key={stat.label}
            icon={<stat.icon className="h-6 w-6" />}
            title={stat.label}
            value={stat.value}
            className={`p-4 rounded-lg shadow-lg ${stat.color}`}
          />
        ))}
      </div>

      {user && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgressBar
              icon={<BookOpen className="h-5 w-5" />}
              label="Questions Completed"
              value={user.progress?.completedQuestions || 0}
              total={200}
            />
            <ProgressBar
              icon={<Check className="h-5 w-5" />}
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
      </div>
    </div>
  );
};

const Card = ({ title, data, link }) => (
  <div className="bg-white shadow-lg rounded-xl p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <Link to={link} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        View all
      </Link>
    </div>
    <div className="space-y-4">
      {data.slice(0, 3).map((item) => (
        <div
          key={item._id}
          className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-sm font-medium text-gray-900">{item.title || item.question}</h3>
          <div className="flex items-center gap-4 mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
