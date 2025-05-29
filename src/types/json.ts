import { ParticipantRole } from './participant';

export interface JSONComment {
  id: number;
  type: string;
  message: string;
  sender: string;
  metadata?: {
    image?: {
      width: number;
      height: number;
    };
    video?: {
      duration: number;
    };
    document?: {
      fileName: string;
      fileSize: number;
      fileType: string;
    };
  };
}

export interface JSONParticipant {
  id: string;
  name: string;
  role: ParticipantRole;
}

export interface JSONRoom {
  name: string;
  id: number;
  image_url: string;
  participant: JSONParticipant[];
}

export interface JSONChatRoomResult {
  room: JSONRoom;
  comments: JSONComment[];
}

export interface JSONChatRoomResponse {
  results: JSONChatRoomResult[];
}