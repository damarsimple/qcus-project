import React from 'react';
import { type Room } from '../../types';
import { RoleBadge } from '../ui';

interface ProfileProps {
  room: Room;
}

export const Profile: React.FC<ProfileProps> = ({ room }) => {
  return (
    <div className="flex-1">
      <div className="text-sm font-semibold text-blue-900 mb-1">
        {room.name}
      </div>
      <div className="text-xs font-light text-blue-600 mb-1">
        {room.comments[room.comments.length - 1]?.content}
      </div>
      <div className="flex flex-wrap gap-1">
        {room.participants.slice(0, 2).map((participant) => (
          <RoleBadge key={participant.id} role={participant.role} />
        ))}
      </div>
    </div>
  );
};