import React, { useState } from "react";
import Inputfield from "../Inputfield";
import { useForm } from "react-hook-form";
import Button from "../Button";
import { login } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../utils/userDataFetch.js";
import { toast } from "react-toastify";
import { load, stopLoad } from "../../store/reloadSlice.js";
import { VerifyEmail } from "../../store/emailSlice.js";

function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleclick = () => {
    navigate("/login");
  };

  const onSubmit = async (data) => {
    setLoading(true); // Start loading

    try {
      const userData = await registerUser(data);

      if (userData) {
        const email = data.email;
        const obj = { email };
        dispatch(VerifyEmail(obj));
        navigate("/verifyotp");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);

      setLoading(false);
      dispatch(stopLoad());
    }
  };

  return (
    <div className="max-w-md mx-auto rounded-3xl bg-slate-800 shadow-2xl mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 mt-5 pt-5">
        Create Account
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Inputfield
    placeholder="Enter FullName"
    name="name"
    type="text"
    label="Name"
    register={register}
    required
    className="mt-1 block w-full rounded-lg border border-gray-400 shadow-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white py-3 px-4 text-base text-gray-800 placeholder-gray-500"
  />  
          <Inputfield
            placeholder="Enter your Email"
            name="email"
            type="text"
            label="Email:"
            register={register}
            required
            className="mt-1 block w-full rounded-lg border border-gray-400 shadow-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white py-3 px-4 text-base text-gray-800 placeholder-gray-500"
            />
          <Inputfield
            placeholder="Enter your password"
            name="password"
            type="password"
            label="Password:"
            register={register}
            required
            className="mt-1 block w-full rounded-lg border border-gray-400 shadow-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white py-3 px-4 text-base text-gray-800 placeholder-gray-500"
            />
   
        <Button
          content={loading ? "Signing up..." : "Sign Up"}
          disabled={loading}
          className={`w-full px-2 py-3 rounded-lg text-white ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } transition duration-200 ease-in-out`}
        />
      </form>
      <div className="text-center mt-6 mb-6">
        <span className="text-sm text-gray-500 ">Already have an account? </span>
        <button
          onClick={handleclick}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Register;
