import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { Outlet } from 'react-router-dom';

// Parent Component for Admin Routes
function AdminLayout() {
  return (
    <>
    <Outlet />
</>
  );
}

// Parent Component for User Routes
function UserLayout() {
  return (
<>
      <Outlet />
</>
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/verifyotp" element={<Verifyotp />} /><Route path="/adminlogin" element={<AdminAuth />} />

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
              <Route path="questionsolver" element={<QuestionSolver />} />
              <Route path="mocktests" element={<MockTests />} />
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
