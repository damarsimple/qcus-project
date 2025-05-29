import React from 'react';
import { ParticipantRole } from '../../types';

interface RoleBadgeProps {
  role?: ParticipantRole;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  if (role === undefined) return null;

  const getRoleInfo = (role: ParticipantRole) => {
    switch (role) {
      case ParticipantRole.ADMIN:
        return { text: "Admin", color: "bg-red-100 text-red-800" };
      case ParticipantRole.AGENT:
        return { text: "Agent", color: "bg-blue-100 text-blue-800" };
      case ParticipantRole.CUSTOMER:
        return { text: "Customer", color: "bg-green-100 text-green-800" };
      default:
        return { text: "User", color: "bg-gray-100 text-gray-800" };
    }
  };

  const roleInfo = getRoleInfo(role);

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}
    >
      {roleInfo.text}
    </span>
  );
};