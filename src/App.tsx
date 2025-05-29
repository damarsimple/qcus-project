import React from 'react';
import { useAppStore } from './store';
import { useMediaQuery, useFileUpload } from './hooks';
import { Header, MobileLayout, DesktopLayout } from './components/layout';
import { type Room, ParticipantRole } from './types';

const App: React.FC = () => {
  const { rooms, setRooms, setComments, importFromJSON } = useAppStore();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const { uploadInputRef, handleUploadClick, handleFileUpload } = useFileUpload(
    (jsonData) => {
      importFromJSON(jsonData);
    }
  );

  const handleAddRoom = () => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: `New Room ${Math.floor(Math.random() * 1000)}`,
      participants: [
        {
          id: "user1",
          name: "Alice Alice New Room",
          role: ParticipantRole.ADMIN,
          avatarUrl: "",
          lastActive: new Date(),
          isOnline: true,
          isTyping: false,
        },
        {
          id: "user2",
          name: "Bob New Room",
          role: ParticipantRole.AGENT,
          avatarUrl: "",
          lastActive: new Date(),
          isOnline: false,
          isTyping: false,
        },
      ],
      comments: [
        {
          id: `comment-${Date.now()}`,
          content: "Welcome to the new room!",
          type: "text",
          authorId: "user1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRooms([...rooms, newRoom]);
    setComments([]);
  };

  return (
    <div
      className="h-screen flex flex-col bg-blue-50"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Hidden file input for JSON upload */}
      <input
        ref={uploadInputRef}
        type="file"
        className="hidden"
        accept=".json"
        onChange={handleFileUpload}
      />

      <Header onUpload={handleUploadClick} onAddRoom={handleAddRoom} />

      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
};

export default App;