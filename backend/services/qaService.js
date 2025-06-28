const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Process an image and question using a multimodal LLM
 * @param {Object} params - Parameters
 * @param {string|null} params.imageFile - Path to the uploaded image file
 * @param {string|null} params.imageUrl - URL of the image
 * @param {string} params.question - Question about the image
 * @returns {Promise<Object>} - Response from the LLM
 */
async function processImageQuestion({ imageFile, imageUrl, question }) {
  try {
    // Determine which LLM to use based on available API keys
    if (process.env.OPENAI_API_KEY) {
      return await processWithGPT4o({ imageFile, imageUrl, question });
    } else if (process.env.GOOGLE_API_KEY) {
      // Implementation for Gemini would go here
      throw new Error('Gemini implementation not available yet');
    } else if (process.env.ANTHROPIC_API_KEY) {
      // Implementation for Claude 3 would go here
      throw new Error('Claude 3 implementation not available yet');
    } else {
      throw new Error('No valid API keys found for any supported LLM');
    }
  } catch (error) {
    console.error('Error in processImageQuestion:', error);
    
    // Fallback to text-only if image analysis fails
    if (error.message.includes('image') || error.message.includes('vision')) {
      return await fallbackToTextOnly(question);
    }
    
    throw error;
  }
}

/**
 * Process with GPT-4o
 */
async function processWithGPT4o({ imageFile, imageUrl, question }) {
  let imageContent;
  
  // Prepare image content
  if (imageFile) {
    // Read image file as base64
    const imageBuffer = fs.readFileSync(imageFile);
    imageContent = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  } else if (imageUrl) {
    // Use image URL directly
    imageContent = imageUrl;
  } else {
    throw new Error('No image provided');
  }
  
  // Prepare messages for GPT-4o
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful assistant that analyzes images and answers questions about them. ' +
               'If you detect any objects, people, or text in the image, include their positions using ' +
               'bounding box coordinates when relevant. Format coordinates as [x1, y1, x2, y2] where ' +
               'each value is between 0 and 1, representing the top-left and bottom-right corners.'
    },
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: question
        },
        {
          type: 'image_url',
          image_url: {
            url: imageContent
          }
        }
      ]
    }
  ];
  
  // Call OpenAI API
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: messages,
    max_tokens: 1000,
  });
  
  // Extract bounding boxes if present in the response
  const answer = response.choices[0].message.content;
  const boundingBoxes = extractBoundingBoxes(answer);
  
  return {
    answer,
    boundingBoxes,
    model: 'gpt-4o'
  };
}

/**
 * Fallback to text-only LLM if image analysis fails
 */
async function fallbackToTextOnly(question) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. The user wanted to ask a question about an image, ' +
                   'but image analysis failed. Please respond as helpfully as possible based on the text alone.'
        },
        {
          role: 'user',
          content: `I wanted to ask about an image, but the image analysis failed. Here was my question: ${question}`
        }
      ],
      max_tokens: 500,
    });
    
    return {
      answer: response.choices[0].message.content,
      boundingBoxes: [],
      model: 'gpt-4 (text-only fallback)',
      fallback: true
    };
  } catch (error) {
    console.error('Error in fallbackToTextOnly:', error);
    throw new Error('Both image analysis and text fallback failed');
  }
}

/**
 * Extract bounding box coordinates from the LLM response
 */
function extractBoundingBoxes(text) {
  const boundingBoxes = [];
  
  // Regular expression to match coordinates in the format [x1, y1, x2, y2]
  const regex = /\[(0\.\d+|1\.0|0|1),\s*(0\.\d+|1\.0|0|1),\s*(0\.\d+|1\.0|0|1),\s*(0\.\d+|1\.0|0|1)\]/g;
  
  let match;
  while ((match = regex.exec(text)) !== null) {
    // Extract the coordinates
    const coordinates = match[0]
      .replace('[', '')
      .replace(']', '')
      .split(',')
      .map(coord => parseFloat(coord.trim()));
    
    // Add context from surrounding text
    const startPos = Math.max(0, match.index - 50);
    const endPos = Math.min(text.length, match.index + match[0].length + 50);
    const context = text.substring(startPos, endPos);
    
    boundingBoxes.push({
      coordinates,
      context
    });
  }
  
  return boundingBoxes;
}

module.exports = {
  processImageQuestion
};