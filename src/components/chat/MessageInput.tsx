import React, { useState } from 'react';
import { IconButton } from '../ui';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSend = () => {
    if (!currentMessage.trim()) return;
    onSendMessage(currentMessage.trim());
    setCurrentMessage("");
  };

  return (
    <div className="mt-4 h-[5vh] flex gap-2 items-center py-6 md:py-0">
      <input
        type="text"
        className="w-full p-2 bg-white border border-blue-200 text-blue-900 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        placeholder="Type a message..."
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && currentMessage.trim()) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <IconButton
        onClick={handleSend}
        name="send"
        className="p-2 bg-blue-600 text-white hover:text-white rounded-lg hover:bg-blue-700 transition-colors"
      />
    </div>
  );
};