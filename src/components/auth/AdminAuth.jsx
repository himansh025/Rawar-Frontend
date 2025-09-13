import React, { useEffect, useState } from 'react';
import Inputfield from '../Inputfield.jsx';
import { adminlogin } from '../../utils/userDataFetch.js';
import { useForm } from "react-hook-form";
import Button from '../Button';
// import {login} from '../utils/userDataFetch';
import { login } from '../../store/authSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { load, stopLoad } from '../../store/reloadSlice.js';

const AdminAuth = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState("jbkkhbm");
  Cookies.set('accessToken', accessToken);
  const user= useSelector((state)=>state.auth.user)

  // useEffect(() => {
  // }, [accessToken]);
  // console.log("isadmin",user);
  

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    dispatch(load());

    try {
      const userdata = await adminlogin(data);
      // console.log("data",userdata);
       
      if(userdata.data.role){
   
        localStorage.setItem('accessToken', userdata.data.accesstoken);
        localStorage.setItem('refreshToken', userdata.data.refreshtoken);
        const user = userdata.data;
        // console.log(user);
        
        dispatch(login({ user }));
        navigate('/admin');}
      else {
        setLoading(false);
        alert("Please check your credentials.");
        // navigate('/');
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
    <div className='min-h-screen flex items-center justify-center  '>
      <div className='p-8 w-[90%] md:w-[400px] bg-gray-800 shadow-lg rounded-3xl border-2'>
        <div className='text-center text-4xl font-semibold mb-8 text-slate-200'>
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