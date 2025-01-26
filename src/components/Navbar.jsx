import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Layout, Menu, TestTube2, Trophy, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice.js";
import pcteLogo from '../image.png' 

function Navbar() {
  const user = useSelector((state) => state.auth.user) || false;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
console.log(user.role);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/logout");
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50"> 
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center"> 
            <img src={pcteLogo} alt="PCTE Logo" className="h-11 w-11 mr-2" /> 
            <Link to="/" className="flex items-center">
              <span className="ml-2 text-sm font-bold text-gray-800">Placement Cell </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-8 items-center">
            {user.role=="admin"?(
              <NavLink to="/admin/admindashboard" icon={<Layout className="h-5 w-5" />} text="Admin DashBoard" />
            ): <  NavLink to="/" icon={<Layout className="h-5 w-5" />} text="Dashboard" />}
         
            <NavLink to="/user/questions" icon={<BookOpen className="h-5 w-5" />} text="Questions" />
            <NavLink to="/user/mocktests" icon={<TestTube2 className="h-5 w-5" />} text="Mock Tests" />
            {/* <NavLink to="/leaderboard" icon={<Trophy className="h-5 w-5" />} text="Leaderboard" /> */}
          </div>

          {/* User Authentication Section */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Signup
                </Link>
                <Link
                  to="/adminlogin"
                  className="px-3 py-1 bg-blue-600 hidden md:hidden lg:block text-white rounded-md hover:bg-blue-700" // Corrected class 
                >
                  Admin
                </Link>
              </>
            ) : (
              <>
              {user.role=="user"?(
              <Link
              to="/user/userprofile"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <User className="h-5 w-5" />
              <span className="ml-2">Profile</span>
            </Link>
           ):(<>
           </>) }
             
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"} bg-gray-100 rounded-lg shadow-md p-4 space-y-4`}
      >
        <MobileNavLink to="/" text="Home" onClick={toggleMobileMenu} />
        <MobileNavLink to="/questions" text="Questions" onClick={toggleMobileMenu} />
        <MobileNavLink to="/mocktests" text="Mock Tests" onClick={toggleMobileMenu} />
        {/* <MobileNavLink to="/leaderboard" text="Leaderboard" onClick={toggleMobileMenu} /> */}
        {!user ? (
          <div className="space-y-2">
            <MobileNavLink to="/login" text="Login" onClick={toggleMobileMenu} />
            <MobileNavLink to="/signup" text="Signup" onClick={toggleMobileMenu} />
            <MobileNavLink to="/adminlogin" text="Admin" onClick={toggleMobileMenu} />
          </div>
        ) : (
          <button
            onClick={() => {
              handleLogout();
              toggleMobileMenu();
            }}
            className="block w-full text-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

// NavLink Component for Desktop Navigation
function NavLink({ to, icon, text }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-gray-300"
    >
      {icon}
      <span className="ml-2">{text}</span>
    </Link>
  );
}
// mobile
function MobileNavLink({ to, text, onClick }) {
  return (
    <Link
      to={to}
      className="block text-gray-700 hover:text-blue-600 px-4 py-2"
      onClick={onClick}
    >
      {text}
    </Link>
  );
}

export default Navbar;