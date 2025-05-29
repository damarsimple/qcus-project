import React from 'react';
import { Icon } from './Icon';
import { type IconType } from '../../types';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: IconType;
}

export const IconButton: React.FC<IconButtonProps> = ({ name, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`p-2 rounded hover:bg-blue-100 hover:text-blue-700 transition-colors ${className}`}
    >
      <Icon name={name} />
    </button>
  );
};