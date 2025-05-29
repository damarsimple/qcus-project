import React from 'react';
import { Navigation } from './Navigation';

interface HeaderProps {
  onUpload: () => void;
  onAddRoom: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onUpload, onAddRoom }) => {
  return (
    <header className="w-full bg-blue-600 text-white shadow-lg flex-shrink-0">
      <Navigation onUpload={onUpload} onAddRoom={onAddRoom} />
    </header>
  );
};