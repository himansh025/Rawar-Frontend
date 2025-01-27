
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL; // Backend API URL
const token = localStorage.getItem('accessToken'); // Retrieve the JWT token from local storage


const createQuestion = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/revision/createQuestion`,{
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




const getQuestionById = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/revision/GetquestionbyID/:id`,{
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



// Delete a question 

const deleteQuestion = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/revision//deletequiz/:id`,{
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

const Revisionfetch = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/revision/GetAllquestion`,{
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

export {
    createQuestion,
    getQuestionById,
    deleteQuestion,
    Revisionfetch
  };