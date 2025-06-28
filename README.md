# Multimodal QA App

A web application that allows users to ask questions about images using Vision + Language LLMs. The app supports both image uploads and image URLs, and provides detailed responses with visual analysis.

## Features

- Upload images or provide image URLs
- Ask questions about the visual content
- Get AI-powered responses using multimodal models
- Visualization of bounding boxes for referenced areas in the image
- Fallback to text-only LLM if image analysis fails

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Dropzone for image uploads
- Axios for API requests

### Backend
- Node.js with Express
- Multer for file uploads
- OpenAI API (GPT-4o) for multimodal analysis

## Project Structure

```
├── backend/             # Express server
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── uploads/         # Uploaded images
└── frontend/           # Next.js application
    ├── src/
    │   ├── app/         # Next.js app router
    │   ├── components/  # React components
    │   ├── services/    # API services
    │   └── types/       # TypeScript types
```

## Setup and Installation

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (for GPT-4o)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   CORS_ORIGIN=http://localhost:3000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.local.example`:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Examples

### Example 1: Object Identification

**Image**: [Photo of a city skyline]

**Question**: "What tall buildings can you see in this image?"

**Response**: [AI identifies and describes the buildings with bounding boxes]

### Example 2: Text Recognition

**Image**: [Photo of a sign]

**Question**: "What does the sign say?"

**Response**: [AI reads and transcribes the text with bounding boxes]

### Example 3: Scene Understanding

**Image**: [Photo of a natural landscape]

**Question**: "Describe the weather conditions in this image."

**Response**: [AI analyzes the visual elements to determine weather conditions]

## LLM API Choice

This application primarily uses OpenAI's GPT-4o model for multimodal analysis because:

1. **Strong Visual Understanding**: GPT-4o demonstrates excellent capabilities in analyzing visual content and understanding spatial relationships.

2. **High-Quality Text Generation**: The model produces coherent, detailed responses based on visual inputs.

3. **Bounding Box Support**: GPT-4o can identify regions of interest in images and provide coordinates, which we use for visualization.

The application is designed to be extensible, with placeholder code for integrating other multimodal models like Google's Gemini or Anthropic's Claude 3.

## Future Improvements

- Add support for video analysis
- Implement user authentication
- Add history of previous queries
- Support for more multimodal models (Gemini, Claude 3)
- Improve bounding box visualization with labels
- Add image preprocessing options