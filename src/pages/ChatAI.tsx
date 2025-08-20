import React from 'react';
import { useNavigate } from 'react-router-dom';

const HF_SPACE_URL = 'https://pinchez254-wao-chat.hf.space';

const ChatAI: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#101522] flex flex-col">
      <div className="px-4 sm:px-6 py-4 bg-[#232c36] border-b border-[#2d3748] flex items-center justify-between">
        <h1 className="text-white text-lg sm:text-xl font-semibold">WAO Chat</h1>
        <div className="flex items-center gap-2">
          <a href={HF_SPACE_URL} target="_blank" rel="noreferrer" className="px-4 py-2 bg-ngo-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm">Open in new tab</a>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-ngo-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm">BACK HOME</button>
        </div>
      </div>
      <div className="flex-1 p-2 sm:p-4">
        <div className="w-full h-[80vh] rounded-lg overflow-hidden shadow-lg">
          <iframe src={HF_SPACE_URL} title="WAO-CHAT" className="w-full h-full border-0" allow="clipboard-write; clipboard-read; autoplay" />
        </div>
        <div className="text-gray-400 text-xs mt-2">If the chat does not load, <a href={HF_SPACE_URL} target="_blank" rel="noreferrer" className="text-ngo-orange underline">click here</a>.</div>
      </div>
    </div>
  );
};

export default ChatAI;