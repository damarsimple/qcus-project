import React from 'react';
import { ParticipantRole } from '../../types';
import { hashColor } from '../../utils';

interface AvatarProps {
  src?: string;
  alt: string;
  role?: ParticipantRole;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, role }) => {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm relative"
      style={{ backgroundColor: src ? "transparent" : hashColor(alt, role) }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full rounded-full" />
      ) : (
        <span className="text-white text-xs font-semibold">
          {alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};