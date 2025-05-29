import { useRef } from 'react';
import { type JSONChatRoomResponse } from '../types';

export const useFileUpload = (onFileUpload: (data: JSONChatRoomResponse) => void) => {
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(
          e.target?.result as string
        ) as JSONChatRoomResponse;
        onFileUpload(jsonData);
        console.log("JSON data imported successfully!");
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert("Error parsing JSON file. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  return {
    uploadInputRef,
    handleUploadClick,
    handleFileUpload,
  };
};