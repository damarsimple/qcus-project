import React from 'react';
import { Avatar } from './Avatar';
import {type  Participant } from '../../types';

interface AvatarGroupProps {
  participants: Participant[];
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ participants }) => {
  if (participants.length === 0) return null;

  const displayedParticipants = participants.slice(0, 3);
  const remainingCount = participants.length - displayedParticipants.length;

  return (
    <div className="flex -space-x-4">
      {displayedParticipants.map((participant) => (
        <Avatar
          key={participant.id}
          src={participant.avatarUrl}
          alt={participant.name}
          role={participant.role}
        />
      ))}
      {remainingCount > 0 && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs border-2 border-white shadow-sm">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};