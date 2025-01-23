import React, { useState,useEffect } from 'react';
import Inputfield from '../Inputfield';
import { useForm } from "react-hook-form";
import Button from '../Button';
import { login } from '../../store/authSlice.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const AdminAuth = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState("jbkkhbm");
  Cookies.set('accessToken', accessToken);

  useEffect(() => {
  }, [accessToken]);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const userdata = await loginUser(data);
      if(userdata.isAdmin){
  //  console.log(userd);
   
        localStorage.setItem('accessToken', userdata.data.accesstoken);
        localStorage.setItem('refreshToken', userdata.data.refreshtoken);
        const user = userdata.data.user;
        
        dispatch(login({ user }));
        navigate('/');}
      else {
        setLoading(false);
        alert("Please check your credentials.");
        navigate('/login');
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      alert("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r mt-10 from-blue-500 via-indigo-300 to-purple-300'>
      <div className='p-8 w-[90%] md:w-[400px] bg-white shadow-lg rounded-3xl border-2 border-gray-200'>
        <div className='text-center text-4xl font-semibold mb-8 text-gray-800'>
          Admin Login
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
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">Don't have an account? </span>
          <button className="text-sm text-blue-500 hover:text-blue-700">Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export { AdminAuth };