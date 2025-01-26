import React, { useState, useEffect } from 'react';
import { BookOpen, Users, GraduationCap, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchalluser } from '../utils/userDataFetch.js';
import { getAllTests } from '../utils/testDataFetch.js'

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [mockTests, setMockTests] = useState([]);
    const [showAllUsers, setShowAllUsers] = useState(false);  // State for toggling user list visibility
    const [showAllTests, setShowAllTests] = useState(false);  // State for toggling user list visibility

    const navigate = useNavigate();
    const fetchData = async () => {
        try {

            const userResponse = await fetchalluser();
            //   console.log("aya kya", userResponse);
            const testResponse = await getAllTests();
            //   console.log("aya kya", testResponse.data[0]);
            setUsers(userResponse.data || []);
            setMockTests(testResponse.data || []);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="text-center">
                    <h1 className="text-4xl font-bold text-white tracking-tight">Admin Dashboard</h1>
                    <p className="mt-2 text-gray-400">Manage your platform's resources</p>
                </header>

                <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <h2 className="text-2xl font-semibold text-white">Quick Actions</h2>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate("/admin/work/mocktest")}
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
                            >
                                <ClipboardList className="h-5 w-5" />
                                Handle MockTest
                            </button>
                            <button
                                onClick={() => navigate("/admin/work/question")}
                                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
                            >
                                <BookOpen className="h-5 w-5" />
                                Handle Aptitude Questions
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-[1.02] transition-all duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-600 rounded-lg">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Total Users</h2>
                        </div>
                        <div className="text-3xl font-bold text-white mb-4">{users.length || 0}</div>

                        {/* Show users in a list when button is clicked */}
                        <div className="space-y-3">
                            {showAllUsers && users.map((user) => (
                                <div key={user.id} className="p-3 bg-gray-700 rounded-lg">
                                    <p className="text-gray-200">{user.name}</p>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                </div>
                            ))}
                        </div>

                        {/* Button to toggle the visibility of the full users list */}

                        <button
                            onClick={() => setShowAllUsers(!showAllUsers)}
                            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 focus:outline-none"
                        >
                            {showAllUsers ? 'Hide Users' : 'Show All Users'}
                        </button>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-[1.02] transition-all duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-purple-600 rounded-lg">
                                <ClipboardList className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Mock Tests</h2>
                        </div>
                        <div className="space-y-3">
                            {mockTests.map((test) => (
                                <div key={test.id} className="p-3 bg-gray-700 rounded-lg">
                                    <p className="text-gray-200">{test.title}</p>
                                    <p className="text-sm text-gray-400">{test.category}</p>
                                </div>
                            ))}
                        </div>
                        {mockTests.length > 2 ? (
                            <button
                                onClick={() => setShowAllTests(!showAllTests)}
                                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 focus:outline-none"
                            >
                                {showAllTests ? 'Hide test' : 'Show All test'}
                            </button>
                        ) : null}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
