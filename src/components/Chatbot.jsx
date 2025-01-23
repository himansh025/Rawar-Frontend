import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, UserPlus, X } from 'lucide-react';
import {callchatbot} from '../utils/userDataFetch.js'
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage = {
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await callchatbot({prompt:input})


      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, {
          content: data.data,
          isUser: false,
          timestamp: new Date(),
        }]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         setError('File size should be less than 5MB');
//         return;
//       }
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatarPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
      
//       setRegistrationData(prev => ({
//         ...prev,
//         avatar: file
//       }));
//     }
//   };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData();
    Object.entries(registrationData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const response = Chatbot(formData)

    
      
      if (response.ok) {
        setShowRegistration(false);
        setMessages(prev => [...prev, {
          content: 'Registration successful! You can now start chatting.',
          isUser: false,
          timestamp: new Date(),
        }]);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Interactive Storytelling Chat</h1>
          <button
            onClick={() => setShowRegistration(prev => !prev)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {showRegistration ? <X className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            {showRegistration ? 'Close' : 'Register'}
          </button>
        </div>

        {showRegistration ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold mb-4">Register</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={registrationData.fullname}
                  onChange={handleRegistrationChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleRegistrationChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
           
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={registrationData.password}
                  onChange={handleRegistrationChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Register'
                )}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex-1 bg-white rounded-lg shadow-md p-4 mb-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.isUser
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs opacity-75 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;