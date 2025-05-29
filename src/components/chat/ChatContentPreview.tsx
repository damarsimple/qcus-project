import React, { useState } from 'react';
import { type Comment } from '../../types';
import { formatFileSize, getFileIcon, getFileAlias } from '../../utils';
import { FullscreenModal } from '../ui';

interface ChatContentPreviewProps {
  comment: Comment;
}

export const ChatContentPreview: React.FC<ChatContentPreviewProps> = ({ comment }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openFullscreen = () => setIsFullscreen(true);
  const closeFullscreen = () => setIsFullscreen(false);

  switch (comment.type) {
    case "image":
      return (
        <>
          <div className="cursor-pointer max-w-xs" onClick={openFullscreen}>
            <img
              src={comment.content}
              alt="Shared image"
              className="w-full h-auto max-h-64 object-contain rounded-lg hover:opacity-90 transition-opacity border border-blue-200"
              style={{ maxWidth: "100%" }}
            />
            <div className="text-xs text-blue-500 mt-1">
              Click to view full size
            </div>
          </div>

          <FullscreenModal isOpen={isFullscreen} onClose={closeFullscreen}>
            <img
              src={comment.content}
              alt="Shared image"
              className="max-w-full max-h-screen object-contain"
            />
          </FullscreenModal>
        </>
      );

    case "video":
      return (
        <>
          <div className="max-w-xs">
            <video
              src={comment.content}
              className="w-full h-auto max-h-64 object-contain rounded-lg cursor-pointer border border-blue-200"
              controls
              preload="metadata"
              onPlay={(e) => {
                e.currentTarget.pause();
                openFullscreen();
              }}
              style={{ maxWidth: "100%" }}
            >
              Your browser does not support the video tag.
            </video>
            <div className="text-xs text-blue-500 mt-1 flex justify-between">
              <span>Duration: {comment.metadata.video.duration}s</span>
              <span>Click to view fullscreen</span>
            </div>
          </div>

          <FullscreenModal isOpen={isFullscreen} onClose={closeFullscreen}>
            <video
              src={comment.content}
              className="max-w-full max-h-full"
              controls
              autoPlay
            >
              Your browser does not support the video tag.
            </video>
          </FullscreenModal>
        </>
      );

    case "document":
      return (
        <div className="max-w-xs">
          <div
            className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
            onClick={() => {
              window.open(comment.content, "_blank");
            }}
          >
            <div className="text-2xl">
              {getFileIcon(comment.metadata.document.fileType)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-blue-900 truncate">
                {comment.metadata.document.fileName}
              </div>
              <div className="text-xs text-blue-600">
                {getFileAlias(comment.metadata.document.fileType).toUpperCase()}{" "}
                • {formatFileSize(comment.metadata.document.fileSize)}
              </div>
            </div>
            <div className="text-blue-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>

          {comment.metadata.document.fileType === "application/pdf" && (
            <div className="mt-2">
              <iframe
                src={`${comment.content}#toolbar=0`}
                className="w-full h-32 rounded border border-blue-300"
                title="PDF Preview"
              />
              <div className="text-xs text-blue-500 mt-1">
                PDF Preview - Click document to open full version
              </div>
            </div>
          )}
        </div>
      );

    case "text":
      return (
        <div className="text-sm max-w-xs break-words text-blue-900">
          {comment.content}
        </div>
      );

    default:
      return (
        <div className="text-sm text-red-500">Unsupported content type</div>
      );
  }
};