import React, { useState, useEffect } from 'react';
import { verifyOtp } from '../utils/userDataFetch.js';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice.js';

const Verifyotp = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isOtpValid, setIsOtpValid] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const email = useSelector((state) => state.email.email);

    useEffect(() => {
        document.getElementById('otp').focus();
    }, []);

    const handleChange = (e) => {
        const otpValue = e.target.value;
        setOtp(otpValue);

        const otpPattern = /^[0-9]{4}$/; // Updated regex for 6 digits
        setIsOtpValid(otpPattern.test(otpValue));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const data = { email, otp };
            const response = await verifyOtp(data);
console.log(response);

            if (response.data) {
                setSuccess('OTP verified successfully!');
                setOtp('');
                setError('');
                toast.success('OTP verified successfully!');
                localStorage.setItem('accessToken', response.data.user.accesstoken);
                localStorage.setItem('refreshToken', response.data.user.refreshtoken);
                dispatch(login({ user: response.data.user }));
                navigate('/');
            }
        } catch (err) {
            console.error('Error during OTP verification:', err);
            setError('Invalid OTP. Please try again.');
            setSuccess('');
            toast.error('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-500">
            <div className="w-full max-w-md p-10 rounded-lg shadow-lg bg-gradient-to-b from-blue-600 to-black text-white">
                <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
                    Verify Emial Address
                </h1>
                <p className="text-sm text-center text-gray-400 mb-8">
                    Enter the 4-digit OTP Sent to your registered email.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="email" value={email} />
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium">
                            OTP Code:
                        </label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={otp}
                            onChange={handleChange}
                            required
                            maxLength="6"
                            placeholder="Enter 4-digit OTP"
                            className={`w-full p-3 rounded-lg bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 border ${
                                isOtpValid ? 'border-gray-600' : 'border-red-500'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {!isOtpValid && (
                            <span className="block mt-2 text-sm text-red-500">
                                OTP must be 4 digits long.
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                            loading
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 transition'
                        } flex items-center justify-center`}
                    >
                        {loading ? (
                            <TailSpin height="24" width="24" color="#fff" ariaLabel="loading" />
                        ) : (
                            'Verify OTP'
                        )}
                    </button>
                    {error && (
                        <div className="mt-4 text-center text-sm text-red-500">{error}</div>
                    )}
                    {success && (
                        <div className="mt-4 text-center text-sm text-green-500">{success}</div>
                    )}
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export { Verifyotp };