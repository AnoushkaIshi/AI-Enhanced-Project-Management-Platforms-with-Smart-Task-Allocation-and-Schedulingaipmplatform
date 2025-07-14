import axios from 'axios';

const AI_API_URL = process.env.REACT_APP_AI_SERVICE_URL;

export const getRecommendations = async (taskData) => {
  try {
    const response = await axios.post('http://localhost:5001/recommend', {
      task_description: taskData.description || taskData.title,
      potential_assignees: taskData.teamMembers || []
    }, {
      timeout: 5000 // 5 second timeout
    });

    if (response.status !== 200) {
      throw new Error(`AI service returned ${response.status}`);
    }

    return {
      recommendations: response.data.recommendations,
      reasoning: response.data.reasoning
    };

  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'AI recommendation service unavailable'
    );
  }
};