import { create } from "zustand";
import { type AppStore, type Room, type Comment } from '../types';
import { convertJSONToInternalFormat } from '../utils';
import { dummyComments, dummyRooms } from './dummyData';

export const useAppStore = create<AppStore>((set, get) => ({
  getSelectedRoom: () => {
    const selectedChatId = get().selectedChatId;
    if (!selectedChatId) return undefined;
    return get().rooms.find((room) => room.id.toString() === selectedChatId);
  },

  importFromJSON: (jsonData) => {
    const convertedRooms = convertJSONToInternalFormat(jsonData);
    set({ rooms: convertedRooms });
    if (convertedRooms.length > 0) {
      set({
        selectedChatId: convertedRooms[0].id.toString(),
        comments: convertedRooms[0].comments,
      });
    }
  },

  searchQuery: "",
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  selectedChatId: "room1",
  setSelectedChatId: (id: string | null) => set({ selectedChatId: id }),

  comments: dummyComments,
  setComments: (comments: Comment[]) => set({ comments }),

  rooms: dummyRooms,
  setRooms: (rooms: Room[]) => set({ rooms }),
}));