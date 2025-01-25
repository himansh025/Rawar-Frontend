import React, { useEffect, useState } from 'react';
import {  Award, Target, BookOpen, Brain, User, Pencil, Check } from 'lucide-react';
import StatesCard from '../components/StatesCard';
import ProgressBar from '../components/ProgressBar';
import { getCurrentUser,getUserProfileStats, updateUserAvatar } from '../utils/userDataFetch'; // Import utility functions
import { useSelector } from 'react-redux';
const apiUrl = import.meta.env.VITE_API_URL;
import axios from 'axios'

function UserProfile({ userId }) {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
const [totaltestconduct,settotaltestconduct]= useState(0)
  
  const fetchTests = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/tests/alltests`);
    let  len = response.data.data.length;
    console.log(len); 
    settotaltestconduct(len)
}
    catch (err) {
      console.log(err);
    }
  };

  const handleSubmitAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const data = await updateUserAvatar(formData);
      if (data) {
        setUserStats((prev) => ({
          ...prev,
          avatar: data.avatar, // Update avatar in state
        }));
        console.log('Avatar updated successfully');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if(user){
        const { data, success } = await getCurrentUser();
        const  statsData = await getUserProfileStats();
        console.log("states",statsData);
        console.log("user",data.progress);

        const stats= statsData.stats
        // settestlength(data.progress.testsTaken)
        if (success) {
          setUserStats({
            name: data.name,
            email: data.email,
            avatar: data.avatar,
            joinedDate: new Date(data.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            }),
            stats: {
              rank:stats.rank,
              accuracyRate:stats.accuracyRate,
              completedQuestions: data.progress.completedQuestions|| 0,
              correctAnswers: data.progress.correctAnswers|| 0,
              testsTaken: data.progress.testsTaken || 0,
              averageScore: stats.completedQuestions
                ? Math.round((stats.correctAnswersCount / stats.completedQuestions) * 100)
                : 0,
              rank: 42            },
          });
// console.log(userStats.avatar);
        } else {
          console.error('Failed to fetch user data');
        }}
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
fetchTests()
    fetchUserData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!userStats) return <div>No user data available.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <label htmlFor="avatar" className="relative block cursor-pointer">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-indigo-800">
                {userStats.avatar ? (
                  <img
                    src={userStats.avatar}
                    alt={userStats.name }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-indigo-600 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Pencil className="h-6 w-6 text-white" />
              </div>
            </label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleSubmitAvatar}
              className="hidden"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{userStats.name}</h1>
            <p className="text-gray-600">{userStats.email}</p>
            <p className="text-sm text-gray-500">Member since {userStats.joinedDate}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {user.role=="user"?(

   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
   <StatesCard
     icon={<Target className="h-6 w-6 text-indigo-600" />}
     title="Accuracy Rate"
     value={`${userStats.stats.accuracyRate}%`}
   />
   <StatesCard
     icon={<Award className="h-6 w-6 text-indigo-600" />}
     title="Current Rank"
     value={`#${userStats.stats.rank}`}
   />

 </div>
 
):null
}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
     
     <div className="bg-white rounded-lg shadow-md p-6">
       <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
       <div className="space-y-4">
         <ProgressBar
           icon={<BookOpen className="h-5 w-5" />}
           label="Questions Completed"
           value={userStats.stats.completedQuestions && user.role=="user"}
           total={200}
         />
           <ProgressBar
           icon={<Check className="h-5 w-5" />}
           label="Questions Correct"
           value={userStats.stats.correctAnswers  }
           total={200}
         />
         <ProgressBar
           icon={<Brain className="h-5 w-5" />}
           label="Tests Completed"
           value={userStats.stats.testsTaken}
           total={totaltestconduct}
         />
    
       </div>
     </div>
    
    </div>
     
</div>
   

      
  );
}

export default UserProfile;
