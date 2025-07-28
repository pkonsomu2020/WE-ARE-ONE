import React from 'react';
import { Link } from 'react-router-dom';

const ChatHome: React.FC = () => (
  <div className="flex flex-col items-center justify-center w-full h-full py-8 sm:py-12 px-4 bg-[#101522]">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 text-center">Mental Health Assistant</h1>
    <p className="text-base sm:text-lg text-gray-300 mb-6 text-center max-w-2xl px-4">Your private, AI-powered companion for mental wellness and emotional support.</p>
    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-8 sm:mb-10 w-full max-w-md">
      <Link to="/chat" className="bg-white text-gray-900 font-semibold px-6 py-3 rounded shadow hover:bg-gray-200 transition text-center">Start Chatting</Link>
      <Link to="/chat/mood" className="border border-white text-white font-semibold px-6 py-3 rounded hover:bg-gray-800 transition text-center">Track Your Mood</Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl mt-8 px-4">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 text-white flex flex-col">
        <div className="text-xl sm:text-2xl font-bold mb-2">AI Chat Support</div>
        <div className="mb-4 text-sm sm:text-base">Talk about your feelings and get supportive responses. Our AI assistant is available 24/7 to listen, provide coping strategies, and offer emotional support.</div>
        <Link to="/chat" className="text-ngo-orange font-semibold hover:underline mt-auto text-sm sm:text-base">Start a conversation →</Link>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 text-white flex flex-col">
        <div className="text-xl sm:text-2xl font-bold mb-2">Mood Tracking</div>
        <div className="mb-4 text-sm sm:text-base">Monitor your emotional wellbeing over time. Track your daily mood patterns to gain insights into your emotional health and identify triggers.</div>
        <Link to="/chat/mood" className="text-ngo-orange font-semibold hover:underline mt-auto text-sm sm:text-base">Track your mood →</Link>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 text-white flex flex-col">
        <div className="text-xl sm:text-2xl font-bold mb-2">Journal</div>
        <div className="mb-4 text-sm sm:text-base">Express yourself through private journaling. Write down your thoughts and feelings in a secure, private journal to process emotions.</div>
        <Link to="/chat/journal" className="text-ngo-orange font-semibold hover:underline mt-auto text-sm sm:text-base">Write in journal →</Link>
      </div>
    </div>
  </div>
);

export default ChatHome; 