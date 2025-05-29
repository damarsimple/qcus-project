import { 
  type Comment, 
  type Room, 
  type JSONComment, 
  type JSONChatRoomResponse,
  type FileType,
} from '../types';

export const convertJSONCommentToInternal = (jsonComment: JSONComment): Comment => {
  const baseComment = {
    id: jsonComment.id.toString(),
    content: jsonComment.message,
    authorId: jsonComment.sender,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  switch (jsonComment.type.toLowerCase()) {
    case "image":
      return {
        ...baseComment,
        type: "image" as const,
        metadata: {
          image: {
            width: jsonComment.metadata?.image?.width || 800,
            height: jsonComment.metadata?.image?.height || 600,
          },
        },
      };

    case "video":
      return {
        ...baseComment,
        type: "video" as const,
        metadata: {
          video: {
            duration: jsonComment.metadata?.video?.duration || 30,
          },
        },
      };

    case "document":
      return {
        ...baseComment,
        type: "document" as const,
        metadata: {
          document: {
            fileName: jsonComment.metadata?.document?.fileName || "document.pdf",
            fileSize: jsonComment.metadata?.document?.fileSize || 1024,
            fileType: (jsonComment.metadata?.document?.fileType as FileType) || "application/pdf",
          },
        },
      };

    case "text":
    default:
      return {
        ...baseComment,
        type: "text" as const,
      };
  }
};

export const convertJSONToInternalFormat = (jsonData: JSONChatRoomResponse): Room[] => {
  return jsonData.results.map((result) => {
    const room: Room = {
      id: result.room.id.toString(),
      name: result.room.name,
      image_url: result.room.image_url,
      participants: result.room.participant.map((p) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        avatarUrl: "",
        lastActive: new Date(),
        isOnline: Math.random() > 0.5,
        isTyping: false,
      })),
      comments: result.comments.map(convertJSONCommentToInternal),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return room;
  });
};