import React from 'react';
import { useAppStore } from '../../store';
import { ChatView } from '../chat';
import { RoomList } from '../room';

export const MobileLayout: React.FC = () => {
  const { selectedChatId } = useAppStore();

  return (
    <main className="w-full bg-white h-full">
      {selectedChatId ? <ChatView /> : <RoomList />}
    </main>
  );
};