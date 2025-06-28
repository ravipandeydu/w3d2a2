'use client';

import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import QuestionInput from '../components/QuestionInput';
import ResponseDisplay from '../components/ResponseDisplay';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { processImageQuestion } from '../services/qaService';
import { QAResponse } from '../types';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<QAResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageUpload = (file: File) => {
    setImage(file);
    setImageUrl('');
    setImagePreview(URL.createObjectURL(file));
    setResponse(null);
    setError('');
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setImage(null);
    setImagePreview(url);
    setResponse(null);
    setError('');
  };

  const handleQuestionChange = (q: string) => {
    setQuestion(q);
    setError('');
  };

  const handleSubmit = async () => {
    if (!image && !imageUrl) {
      setError('Please upload an image or provide an image URL');
      return;
    }

    if (!question) {
      setError('Please enter a question about the image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await processImageQuestion({
        image,
        imageUrl,
        question,
      });
      setResponse(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImageUrl('');
    setImagePreview('');
    setQuestion('');
    setResponse(null);
    setError('');
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">Multimodal QA</h2>
            
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              onImageUrlChange={handleImageUrlChange}
              imagePreview={imagePreview}
            />
            
            <QuestionInput 
              question={question} 
              onQuestionChange={handleQuestionChange} 
              onSubmit={handleSubmit}
              disabled={loading || (!image && !imageUrl)}
            />
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="card flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              <p className="ml-3 text-lg">Processing...</p>
            </div>
          ) : response ? (
            <ResponseDisplay 
              response={response} 
              imagePreview={imagePreview} 
              onReset={handleReset} 
            />
          ) : null}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}