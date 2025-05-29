import React from 'react';
import { useAppStore } from '../../store';
import { useScrollToBottom } from '../../hooks';
import { Avatar, RoleBadge } from '../ui';
import { ChatContentPreview } from './ChatContentPreview';
import { MessageInput } from './MessageInput';
import { type Comment } from '../../types';

export const ChatView: React.FC = () => {
  const { selectedChatId, getSelectedRoom, comments, setComments } = useAppStore();
  const { containerRef, scrollToBottom } = useScrollToBottom();

  const addComment = (content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      content,
      type: "text",
      authorId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setComments([...comments, newComment]);
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  if (!selectedChatId) return null;

  const room = getSelectedRoom();
  if (!room) return <div className="p-4 text-blue-900">No chat selected</div>;

  return (
    <div className="px-4 pt-2 flex flex-col h-[90vh] bg-white justify-between">
      <ul
        className="space-y-4 h-[85vh] overflow-y-auto no-scrollbar"
        ref={containerRef}
      >
        {comments.map((comment) => {
          const author = room.participants.find(
            (p) => p.id === comment.authorId
          );
          return (
            <li key={comment.id} className="flex items-start gap-2">
              <Avatar
                src={author?.avatarUrl || ""}
                alt={author?.name || "Unknown"}
                role={author?.role}
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-sm font-semibold text-blue-900">
                    {author?.name || "Unknown"}
                  </div>
                  <RoleBadge role={author?.role} />
                </div>
                <ChatContentPreview comment={comment} />
              </div>
            </li>
          );
        })}
      </ul>

      <MessageInput onSendMessage={addComment} />
    </div>
  );
};