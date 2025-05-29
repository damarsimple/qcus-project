import { ParticipantRole } from '../types';

export const hashColor = (text: string, role?: ParticipantRole): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate colors based on role
  if (role === ParticipantRole.ADMIN) return "hsl(0, 70%, 60%)"; // Red for admin
  if (role === ParticipantRole.AGENT) return "hsl(220, 70%, 60%)"; // Blue for agent
  if (role === ParticipantRole.CUSTOMER) return "hsl(120, 70%, 60%)"; // Green for customer
  
  // Default blue-ish colors
  const hue = (hash % 60) + 200; // Blue range: 200-260
  return `hsl(${hue}, 70%, 60%)`;
};