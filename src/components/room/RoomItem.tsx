import React from 'react';
import { type Room } from '../../types';
import { AvatarGroup } from '../ui';
import { Profile } from './Profile';

interface RoomItemProps {
  room: Room;
  onClick: () => void;
}

export const RoomItem: React.FC<RoomItemProps> = ({ room, onClick }) => {
  return (
    <li
      onClick={onClick}
      className="flex gap-2 border-b border-blue-100 hover:bg-blue-50 transition-colors p-4 cursor-pointer"
    >
      {room.image_url ? (
        <img
          src={room.image_url}
          alt={room.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
      ) : (
        <AvatarGroup participants={room.participants} />
      )}
      <Profile room={room} />
    </li>
  );
};