import React from 'react';
import { useAppStore } from '../../store';
import { RoomItem } from './RoomItem';

export const RoomList: React.FC = () => {
  const { rooms, setSelectedChatId } = useAppStore();

  return (
    <ul className="flex flex-col overflow-y-auto no-scrollbar min-h-full">
      {rooms.map((room) => (
        <RoomItem
          key={room.id}
          room={room}
          onClick={() => setSelectedChatId(room.id.toString())}
        />
      ))}
    </ul>
  );
};