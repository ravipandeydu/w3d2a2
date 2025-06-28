import React from 'react';
import { FiSend } from 'react-icons/fi';

interface QuestionInputProps {
  question: string;
  onQuestionChange: (question: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ 
  question, 
  onQuestionChange, 
  onSubmit,
  disabled = false
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !disabled) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Ask a question about the image
      </label>
      <div className="flex">
        <input
          type="text"
          id="question"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          placeholder="What's in this image?"
          className="input-field flex-grow rounded-r-none"
          disabled={disabled}
        />
        <button
          type="submit"
          className="btn-primary rounded-l-none flex items-center"
          disabled={disabled || !question.trim()}
        >
          <FiSend className="mr-2" />
          Ask
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Be specific with your questions for better results
      </p>
    </form>
  );
};

export default QuestionInput;