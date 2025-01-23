// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

import React, { useEffect, useState } from 'react';
import Inputfield from '../Inputfield';
import { useForm } from "react-hook-form";
import Button from '../Button';
import { loginUser } from '../../utils/userDataFetch.js';
import { login } from '../../store/authSlice.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { load, stopLoad } from '../../store/reloadSlice.js';



function Login() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState("jbkkhbm");
  Cookies.set('accessToken', accessToken);

  useEffect(() => {}, [accessToken]);

  const handleclick = () => {
    navigate('/signup');
  };
  const onSubmit = async (data, e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    dispatch(load());

    try {
      const userdata = await loginUser(data);
      console.log("userlog data",userdata);

      if (userdata) {
        localStorage.setItem('accessToken', userdata?.data?.user?.accesstoken);
        localStorage.setItem('refreshToken', userdata?.data?.user?.refreshtoken);
        const user = userdata.data.user.loggedinuser;
        dispatch(login({ user }));
        navigate('/');
      } else {
        setLoading(false);
        alert("Login failed. Please check your credentials.");
        navigate('/login');
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      alert("An error occurred during login. Please try again.");
    } finally {
      dispatch(stopLoad());
      setLoading(false);
    }
  };


  return (
    <div className='min-h-screen flex items-center  justify-center '>
    <div className='p-8 w-[90%] md:w-[400px] bg-white text-gray-900 mx-auto rounded-3xl shadow-2xl'>
      <div className='text-center text-4xl font-semibold mb-6'>
        Welcome Back
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <Inputfield 
          placeholder="Enter your Email" 
          name="email" 
          type="text" 
          label="Email:" 
          register={register} 
          required 
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <Inputfield 
          placeholder="Enter your password" 
          name="password" 
          type="password" 
          label="Password:" 
          register={register} 
          required 
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <Button 
          content={loading ? 'Logging in...' : 'Login'} 
          disabled={loading}
          className={`w-full px-4 py-3 rounded-lg text-white ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} transition duration-200 ease-in-out`}
        />
      </form>
      <div className="text-center mt-6">
        <span className="text-sm text-gray-500">Don't have an account? </span>
        <button 
          onClick={handleclick} 
          className="text-sm text-blue-500 hover:text-blue-700">
          Sign Up
        </button>
      </div>
    </div>
  </div>
  );
}

export default Login;