import React from 'react';
import { Icon } from './Icon';
import { useAppStore } from '../../store';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useAppStore();

  return (
    <div className="flex h-9 items-center bg-white border border-blue-200 rounded-xl p-0.5 min-w-full shadow-sm">
      <input
        type="text"
        placeholder="Search..."
        className="bg-transparent text-blue-900 outline-none flex-grow px-2 placeholder-blue-400"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="p-2 rounded hover:bg-blue-50 transition-colors text-blue-600">
        <Icon name="search" />
      </button>
    </div>
  );
};