import {type Room } from './room';
import {type Comment } from './comment';
import {type JSONChatRoomResponse } from './json';

export interface AppStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
  
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  
  getSelectedRoom: () => Room | undefined;
  importFromJSON: (jsonData: JSONChatRoomResponse) => void;
}
