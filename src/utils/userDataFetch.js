import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL;
console.log(apiUrl);
// const token = localStorage.getItem('accessToken');


const registerUser = async (formData) => {
  console.log("register data", formData);

  try {
    const response = await axios.post(`${apiUrl}/api/v1/user/signup`, formData);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Failed to register user. Please try again.'); 
  }
};

const loginUser = async (formData) => {
  try {
    console.log("Login form data:", formData);

    const response = await axios.post(
      `${apiUrl}/api/v1/user/login`,
      formData,

      { withCredentials: true }
    );

    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server error:", error.response.data);
      alert(error.response.data.message || "An error occurred. Please try again.");
    } else if (error.request) {
      console.error("No response from server:", error.request);
      alert("No response from the server. Please check your connection.");
    } else {
      console.error("Error in request setup:", error.message);
      alert("An unexpected error occurred.");
    }
  }
};
const adminlogin = async (formData) => {
  try {
    console.log("Login form data:", formData);

    const response = await axios.post(
      `${apiUrl}/api/v1/admin/login`,
      formData,

      { withCredentials: true }
    );

    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server error:", error.response.data);
      alert(error.response.data.message || "An error occurred. Please try again.");
    } else if (error.request) {
      console.error("No response from server:", error.request);
      alert("No response from the server. Please check your connection.");
    } else {
      console.error("Error in request setup:", error.message);
      alert("An unexpected error occurred.");
    }
  }
};

const callchatbot = async (data) => {
  console.log(data);
  const {prompt} = data;
  
  try {
    const token = localStorage.getItem('accessToken');
    // console.log(document.cookie.includes('accessToken'))
    // console.log(token)
    // console.log(formData)
    const response = await axios.post(`${apiUrl}/api/v1/user/chatbot`, {prompt},
       {
         headers:{
             Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    } });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching logout data:', error);
  }
}

const logoutUser = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    // console.log(document.cookie.includes('accessToken'))
    // console.log(token)
    // console.log(formData)
    const response = await axios.post(`${apiUrl}/api/v1/logout`, { token }, { headers: { Authorization: `Bearer ${token}` } });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching logout data:', error);
  }
}

const refreshAccessToken = async () => {
  try {
    const token = localStorage.getItem('refreshToken');
    // console.log(token)
    // console.log(formData)
    const response = await axios.post(`${apiUrl}/api/v1/user/refreshtoken`, { headers: { Authorization: `Bearer ${token}` } });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching logout data:', error);
  }
}

const verifyOtp = async (data) => {
  try {
    const response = await axios.post(`${apiUrl}/api/v1/user/verifyotp`, data);
    console.log("Response data:", response); // Successfully fetched response
    console.log("Response data:", response.data); // Successfully fetched response
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server responded with an error:", error.response.data);
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
  }
};

const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    // Check if token exists
    if (!token) {
      throw  new Error('No access token found');
    }
    
    // Make the API request with authorization header
    const response = await axios.get(`${apiUrl}/api/v1/user/userdetail`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  console.log('Current user data:', response.data);
  return response.data;
} catch (error) {
  // Improved error handling
  console.error('Error fetching current user data:', error.response?.data || error.message);
  // throw error; // Optional: rethrow the error if you need to handle it elsewhere
}
};

const  getUserProfileStats= async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw  new Error('No access token found');
    }
    
    const response = await axios.get(`${apiUrl}/api/v1/user/UserProfileStats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  console.log('Current user state data:', response.data);
  return response.data.data;
} catch (error) {
  console.error('Error fetching current user data:', error.response?.data || error.message);

}
};

const updateUserAvatar = async (data)=>{
  try {
    console.log("cover data",data);
    const token = localStorage.getItem('accessToken');
      const response = await axios.patch(`${apiUrl}/api/v1/user/avatar` , data ,{ headers: { Authorization: `Bearer ${token}`}});  
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching updateUserAvatar data:', error);
  }
}

export {
  registerUser,
  getCurrentUser,
  loginUser,
  updateUserAvatar,
  logoutUser,
  getUserProfileStats,
  refreshAccessToken,
  verifyOtp,
  callchatbot,
  adminlogin
}