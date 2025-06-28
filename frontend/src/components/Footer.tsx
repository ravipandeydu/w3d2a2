import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Multimodal QA App</p>
          <p className="text-sm mt-2">
            Built with Next.js and powered by GPT-4o
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;