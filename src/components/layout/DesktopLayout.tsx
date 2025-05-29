import React from 'react';
import { useAppStore } from '../../store';
import { ChatView } from '../chat';
import { RoomList } from '../room';

export const DesktopLayout: React.FC = () => {
  const { selectedChatId } = useAppStore();

  return (
    <main className="w-full bg-white h-full">
      <div className="flex h-full">
        <div
          className={`${
            selectedChatId ? "w-1/3" : "w-full"
          } h-full overflow-y-auto no-scrollbar bg-white border-r border-blue-200`}
        >
          <RoomList />
        </div>
        <div className={`${selectedChatId ? "w-2/3" : "w-0"} h-full`}>
          <ChatView />
        </div>
      </div>
    </main>
  );
};