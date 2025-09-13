import { useEffect, useState } from "react";
import Inputfield from "../Inputfield";
import { useForm } from "react-hook-form";
import Button from "../Button";
import { loginUser } from "../../utils/userDataFetch.js";
import { login } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { load, stopLoad } from "../../store/reloadSlice.js";

function Login() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState("jbkkhbm");
  Cookies.set("accessToken", accessToken);

  useEffect(() => {}, [accessToken]);

  const handleclick = () => {
    navigate("/signup");
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(load());

    try {
      const userdata = await loginUser(data);
      // console.log("userlog data", userdata);

      if (userdata) {
        localStorage.setItem(
          "accessToken",
          userdata?.data?.user?.accesstoken
        );
        localStorage.setItem(
          "refreshToken",
          userdata?.data?.user?.refreshtoken
        );
        const user = userdata.data.user.loggedinuser;
        dispatch(login({ user }));
        navigate("/");
      } else {
        setLoading(false);
        alert("Login failed. Please check your credentials.");
        navigate("/login");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 w-full max-w-md rounded-2xl shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-400">Welcome Back</h1>
          <p className="text-white mt-2">
            Sign in to continue to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Inputfield
            placeholder="Enter your Email"
            name="email"
            type="text"
            label="Email"
            register={register}
            required
            className="w-full px-4 py-3 text-white rounded-lg border border-gray-400 bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <Inputfield
            placeholder="Enter your Password"
            name="password"
            type="password"
            label="Password"
            register={register}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <Button
            content={
              loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Logging in...
                </div>
              ) : (
                "Login"
              )
            }
            disabled={loading}
            className={`w-full px-4 py-3 rounded-lg text-white font-semibold transition duration-200 ease-in-out ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          />
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-300">Don’t have an account? </span>
          <button
            onClick={handleclick}
            className="text-sm text-indigo-400 hover:text-indigo-500 font-semibold"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
