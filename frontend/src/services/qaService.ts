import axios from 'axios';
import { ImageQuestionRequest, QAResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

/**
 * Process an image and question using the backend API
 */
export async function processImageQuestion(request: ImageQuestionRequest): Promise<QAResponse> {
  try {
    let response;
    
    if (request.image) {
      // If we have a file, use FormData to send it
      const formData = new FormData();
      formData.append('image', request.image);
      formData.append('question', request.question);
      
      response = await axios.post(`${API_URL}/api/qa/image-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else if (request.imageUrl) {
      // If we have a URL, send it as JSON
      response = await axios.post(`${API_URL}/api/qa/image-url`, {
        imageUrl: request.imageUrl,
        question: request.question,
      });
    } else {
      throw new Error('Either image or imageUrl must be provided');
    }
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Unknown error');
    }
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || `Server error: ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw error;
    }
  }
}