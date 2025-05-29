import React from 'react';
import { useAppStore } from '../../store';
import { IconButton, AvatarGroup, SearchBar } from '../ui';

interface NavigationProps {
  onUpload: () => void;
  onAddRoom: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onUpload, onAddRoom }) => {
  const { selectedChatId, getSelectedRoom, setSelectedChatId } = useAppStore();

  return (
    <nav>
      <div className="flex items-center justify-between">
        <ul className="flex items-center">
          {selectedChatId && (
            <li>
              <IconButton
                name="arrow-left"
                onClick={() => setSelectedChatId(null)}
              />
            </li>
          )}
        </ul>
        
        {selectedChatId ? (
          <div className="flex items-center p-4 gap-2 w-full">
            <AvatarGroup
              participants={getSelectedRoom()?.participants || []}
            />
            <div className="flex flex-col">
              <div className="text-sm font-semibold text-white">
                {getSelectedRoom()?.name || "Chat Room"}
              </div>
              <div className="text-xs font-light text-blue-100">
                {getSelectedRoom()
                  ?.participants.map((p) => p.name)
                  .join(", ")}
              </div>
            </div>
          </div>
        ) : (
          <ul className="flex items-center w-full gap-2 justify-end-safe">
            <IconButton
              name="up"
              onClick={onUpload}
              title="Import JSON file"
            />
            <IconButton
              name="+"
              onClick={onAddRoom}
              title="Add new room"
            />
          </ul>
        )}
      </div>

      {!selectedChatId && (
        <div className="flex items-center justify-between p-4">
          <SearchBar />
        </div>
      )}
    </nav>
  );
};