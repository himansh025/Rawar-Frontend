import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import QuestionBank from './pages/QuestionBank';
import QuestionSolver from './components/QuestionSolver';
import MockTests from './pages/MockTests';
import UserProfile from './pages/UserProfile';
import { Verifyotp } from './components/VerifyOtp';
import Login from './components/auth/Login';
import { AdminAuth } from './components/auth/AdminAuth';
import { Logout } from './components/auth/Logout';
import Register from './components/auth/Register';
import AdminDashboard from './pages/AdminDashboard';
import TestManagement from './components/TestManagement';
import Chatbot from './components/Chatbot';
import Revision from './pages/Revision';

function FloatingChatbot() {
  const user = useSelector((state) => state.auth.user);

  return (
    user && (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600"
          onClick={() => {
            const chatbotElement = document.getElementById('chatbot-container');
            if (chatbotElement) {
              chatbotElement.classList.toggle('hidden');
            }
          }}
        >
          💬
        </button>
        <div
          id="chatbot-container"
          className="hidden fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <Chatbot />
        </div>
      </div>
    )
  );
}

function AdminLayout() {
  return (
    <>
      <FloatingChatbot />
      <Outlet />
    </>
  );
}

function UserLayout() {
  return (
    <>
      <FloatingChatbot />
      <Outlet />
    </>
  );
}

// Updated Dashboard with Floating Chatbot
function EnhancedDashboard() {
  return (
    <div>
      <FloatingChatbot />
      <Dashboard />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div style={{ background: 'linear-gradient(0deg, #29274f 37%, #000000 100%)' }} className="min-h-screen">
        <Navbar />
        <main className="container mt-16 px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<EnhancedDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/verifyotp" element={<Verifyotp />} />
            <Route path="/adminlogin" element={<AdminAuth />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="adminauth" element={<AdminAuth />} />
              <Route path="admindashboard" element={<AdminDashboard />} />
              <Route path="work/:type" element={<TestManagement />} />
            </Route>

            {/* User Routes */}
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="userprofile" element={<UserProfile />} />
              <Route path="questions" element={<QuestionBank />} />
              <Route path="allquestions" element={<Revision />} />
              <Route path="questionsolver" element={<QuestionSolver />} />
              <Route path="mocktests" element={<MockTests />} />
              <Route path="chatbot" element={<Chatbot />} />
            </Route>

            {/* Logout Route */}
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
