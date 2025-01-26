import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL; // Backend API URL
const token = localStorage.getItem('accessToken'); // Retrieve the JWT token from local storage

// // Fetch questions from external API
const fetchQuestions = async (params) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/questions/GetAllquestion`,params,{
      headers: {
        "Content-Type": "application/json",
      }});
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    const data = await response.json();
    return data; // Return the questions data
  } catch (error) {
    console.error('Error:', error);
    return { error: error.message }; // Error handling
  }
};

const getResult = async (userid) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/questions/getResult`,userid,{
      headers: {
        "Content-Type": "application/json",
      }});
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    const data = await response.json();
    return data; // Return the questions data
  } catch (error) {
    console.error('Error:', error);
    return { error: error.message }; // Error handling
  }
};


// Get a question by ID
const getQuestionById = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/api/v1/questions/GetquestionbyID/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the fetched question
  } catch (error) {
    console.error(`Error fetching question with ID ${id}:`, error);
    throw new Error('Failed to fetch question. Please try again.');
  }
};

// Submit an answer for a question
export const submitQuestionState = async (questionState,userid) => {
  console.log("Submitting Question State:", questionState);
  try {
    const response = await axios.post(`${apiUrl}/api/v1/questions/SubResult`, {questionState,userid}, {
      headers:         {"Content-Type": "application/json",
      }
    });
    console.log("Response from server:", response);
    return response.data; // Return the response data
  } catch (error) {
    throw new Error('Failed to submit answer. Please try again.');
  }
};

// Bulk add questions
const bulkAddQuestions = async (questions) => {
  try {
    const response = await axios.post(`${apiUrl}/api/v1/questions/bulkadd`, questions, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the bulk add response
  } catch (error) {
    console.error('Error bulk adding questions:', error);
    throw new Error('Failed to bulk add questions. Please try again.');
  }
};

// Add a single question
const addQuestion = async (questionData) => {
  try {
    const response = await axios.post(`${apiUrl}/api/v1/questions/addquestion`, questionData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the add question response
  } catch (error) {
    console.error('Error adding question:', error);
    throw new Error('Failed to add question. Please try again.');
  }
};

// Delete a question
const deleteQuestion = async (id) => {
  try {
    const response = await axios.delete(`${apiUrl}/api/v1/questions/deletequiz/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the delete question response
  } catch (error) {
    console.error(`Error deleting question with ID ${id}:`, error);
    throw new Error('Failed to delete question. Please try again.');
  }
};

export {
  fetchQuestions,
  getQuestionById,
  bulkAddQuestions,
  addQuestion,
  getResult,
  deleteQuestion,
};
