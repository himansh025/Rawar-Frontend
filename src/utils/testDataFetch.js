import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL 

export const getAllTests = async () => {
  const response = await axios.get(`${API_URL}/ap1/v1/tests`);
  return response.data.data;
};

export const getTestById = async (id) => {
  const response = await axios.get(`${API_URL}/ap1/v1/tests/${id}`);
  return response.data.data;
};

export const startTest = async (id) => {
  try {
    console.log("dfs", id);
    
    const token = localStorage.getItem('accessToken');
    console.log("Token sent to server:", token);
    
    const response = await axios.post(
      `${API_URL}/api/v1/tests/start/${id}`, 
      {}, // Empty object for request body since no data needs to be sent
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching updateUserAvatar data:', error);
  }
}

const token = localStorage.getItem("accessToken")
export const submitTestAnswers = async (id, answers) => {
  try{
  const response = await axios.post(`${API_URL}/api/v1/tests/submit/${id}`, { answers },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }
  )
 
  console.log(response.data);
  return response;
} catch (error) {
  console.error('Error fetching updateUserAvatar data:', error);
}}
