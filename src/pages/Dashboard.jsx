import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StatesCard from '../components/StatesCard';
import ProgressBar from '../components/ProgressBar';
import { BookOpen, Clock, Brain, Award, User, Check } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL;
import {getCurrentUser} from '../utils/userDataFetch.js'

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [questions, setQuestions] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [progressData, setprogressData] = useState([]);

// console.log(user);

  // Fetch Questions and Tests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes,test] = await Promise.all([
          axios.get(`${apiUrl}/api/v1/questions/GetAllquestion`),
          axios.get(`${apiUrl}/api/v1/tests/alltests`),
          // axios.get(`${apiUrl}/api/v1/questions/getResult`)

        ]);

        if(user){
          const result= await getCurrentUser()
        // console.log(questionsRes.data);
        // console.log(test);
          setprogressData(result.data)
          // console.log(progressData);
        
        
        setQuestions(questionsRes.data || []);
        setMockTests(test.data.data || []);
      }} catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  
  }, [apiUrl,user]);


  // const progress = { completedQuestions: 8, correctAnswers: 7, testsTaken: 2 };

const calculateSuccessRate = (comp,correct) => {
  console.log(comp,correct);
  
  // const { completedQuestions, co   } = progress;
  if (comp === 0) {
    return 0; // Avoid division by zero
  }
  const successRate = (correct / comp) * 100;
  return successRate.toFixed(2); // Return as a string with 2 decimal places
};

// console.log(`Success Rate: ${calculateSuccessRate(comp,correct)}%`);

  // Stats Data
  const stats = [
    { label: 'Questions Solved', value: progressData?.progress?.completedQuestions || 0, total: 200, icon: BookOpen, color: 'text-blue-500' },
    { label: 'Tests Taken', value: progressData?.progress?.testsTaken || 0, total: 20, icon: Clock, color: 'text-purple-500' },
    { label: 'Success Rate', value: calculateSuccessRate(progressData?.progress?.completedQuestions,progressData?.progress?.correctAnswers) || 0, icon: Brain, color: 'text-green-500' },
    { label: 'Current Rank', value: `#${user?.stats?.rank || 0}`, icon: Award, color: 'text-orange-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user ? `Welcome back, ${user.name}!` : 'Welcome to the Learning Platform!'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {user ? 'Track your progress and continue your learning journey' : 'Sign in to track your progress and start learning'}
            </p>
          </div>
          {user && (
            <div className="h-16 w-16 rounded-full overflow-hidden bg-indigo-100">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-indigo-600" />
              )}
            </div>
          )}
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatesCard key={stat.label} icon={<stat.icon className={`h-6 w-6 ${stat.color}`} />} title={stat.label} value={stat.value} />
        ))}
      </div>

      {/* Progress Bars */}
      {user && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgressBar icon={<BookOpen className="h-5 w-5" />} label="Questions Completed" value={user.progress?.completedQuestions || 0} total={200} />
            <ProgressBar icon={<Check className="h-5 w-5" />} label="Correct Answers" value={user.progress?.correctAnswers || 0} total={200} />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Aptitude Questions" data={questions} link="/questions" />
        <Card title="Available Mock Tests" data={mockTests} link="/mocktests" />
      </div>
    </div>
  );
};
// Generic Card for Questions and Tests
const Card = ({ title, data, link }) => (
  <div className="bg-white shadow-lg rounded-xl p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <Link to={link} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all</Link>
    </div>
    <div className="space-y-4">
    {data.slice(1, 3).map((item) => (
  <div key={item._id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <h3 className="text-sm font-medium text-gray-900">{item.title || item.question}</h3>
    <div className="flex items-center gap-4 mt-2">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        item.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
        item.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
        'bg-red-100 text-red-800'
      }`}>
        {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
      </span>
    </div>
  </div>
))}

    </div>
  </div>
);

export default Dashboard;
