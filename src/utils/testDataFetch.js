import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL 
console.log(API_URL);

export const getAllTests = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/tests/alltests`)
    console.log(response);  
    return response.data
  } catch (error) {
    console.log(error);
    
  }
  
  
  return response.data.data;
};

export const getTestById = async (id) => {
  const response = await axios.get(`${API_URL}/ap1/v1/tests/${id}`);
  return response.data.data;
};

export const startTest = async (id, userid) => {
  try {
    const token = localStorage.getItem('accessToken');
    console.log("Token sent to server:", token);
console.log(userid);

    const response = await axios.post(
      `${API_URL}/api/v1/tests/start/${id}`,
      { userid }, // Pass userid as an object
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error starting test:", error.response?.data || error.message);
    throw error;
  }
};




// const token = localStorage.getItem("accessToken")
export const submitTestAnswers = async (id, answers,userid) => {
  try{
  const response = await axios.post(`${API_URL}/api/v1/tests/submit/${id}`,{answers,userid},
    {
      headers: {
        "Content-Type": "application/json",
      }
    }
  )
 
  console.log(response.data);
  return response;
} catch (error) {
  console.error('Error fetching updateUserAvatar data:', error);
}}
