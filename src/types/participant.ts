export const ParticipantRole = {
  ADMIN: 0,
  AGENT: 1,
  CUSTOMER: 2,
} as const;

export type ParticipantRole = (typeof ParticipantRole)[keyof typeof ParticipantRole];

export interface Participant {
  id: string;
  name: string;
  role?: ParticipantRole;
  avatarUrl?: string;
  lastActive?: Date;
  isOnline?: boolean;
  isTyping?: boolean;
}