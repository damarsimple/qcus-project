import { type Participant } from './participant';
import { type Comment } from './comment';

export interface Room {
  id: string | number;
  name: string;
  image_url?: string;
  participants: Participant[];
  comments: Comment[];
  createdAt?: Date;
  updatedAt?: Date;
}