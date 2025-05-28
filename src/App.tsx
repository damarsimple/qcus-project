import { useEffect, useRef, useState } from "react";
import { create } from "zustand";

export const ParticipantRole = {
  ADMIN: 0,
  AGENT: 1,
  CUSTOMER: 2,
} as const;
type ParticipantRole = (typeof ParticipantRole)[keyof typeof ParticipantRole];

interface CommentImageMetadata {
  image: {
    width: number;
    height: number;
  };
}

interface CommentVideoMetadata {
  video: {
    duration: number; // in seconds
  };
}

// Base interface with common properties
interface BaseComment {
  id: string | number; // Support both string and number IDs
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

type FileType =
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

interface CommentDocumentMetadata {
  document: {
    fileName: string;
    fileSize: number; // in bytes
    fileType: FileType;
  };
}

type CommentVariant =
  | { type: "text" }
  | { type: "image"; metadata: CommentImageMetadata }
  | { type: "video"; metadata: CommentVideoMetadata }
  | { type: "document"; metadata: CommentDocumentMetadata };

// Final Comment type combining base properties with variants
type Comment = BaseComment & CommentVariant;

// Extended Participant interface with role support
interface Participant {
  id: string;
  name: string;
  role?: ParticipantRole; // Optional for backward compatibility
  avatarUrl?: string; // Optional for JSON compatibility
  lastActive?: Date; // Optional for JSON compatibility
  isOnline?: boolean; // Optional for JSON compatibility
  isTyping?: boolean; // Optional for JSON compatibility
}

// Extended Room interface
interface Room {
  id: string | number; // Support both string and number IDs
  name: string;
  image_url?: string; // Optional image URL from JSON
  participants: Participant[]; // Changed from participant to participants for consistency
  comments: Comment[];
  createdAt?: Date; // Optional for JSON compatibility
  updatedAt?: Date; // Optional for JSON compatibility
}

// JSON compatibility interfaces
interface JSONComment {
  id: number;
  type: string;
  message: string;
  sender: string;
  metadata?: {
    image?: {
      width: number;
      height: number;
    };
    video?: {
      duration: number;
    };
    document?: {
      fileName: string;
      fileSize: number;
      fileType: string;
    };
  };
}

interface JSONParticipant {
  id: string;
  name: string;
  role: ParticipantRole;
}

interface JSONRoom {
  name: string;
  id: number;
  image_url: string;
  participant: JSONParticipant[];
}

interface JSONChatRoomResult {
  room: JSONRoom;
  comments: JSONComment[];
}

interface JSONChatRoomResponse {
  results: JSONChatRoomResult[];
}

interface AppStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;

  comments: Comment[];
  setComments: (comments: Comment[]) => void;

  rooms: Room[];
  setRooms: (rooms: Room[]) => void;

  getSelectedRoom: () => Room | undefined;

  // New method to import JSON data
  importFromJSON: (jsonData: JSONChatRoomResponse) => void;
}

// Utility function to convert JSON comment to internal Comment format
function convertJSONCommentToInternal(jsonComment: JSONComment): Comment {
  const baseComment = {
    id: jsonComment.id.toString(),
    content: jsonComment.message,
    authorId: jsonComment.sender,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Convert based on type with metadata support
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
            fileName:
              jsonComment.metadata?.document?.fileName || "document.pdf",
            fileSize: jsonComment.metadata?.document?.fileSize || 1024,
            fileType:
              (jsonComment.metadata?.document?.fileType as FileType) ||
              "application/pdf",
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
}

// Utility function to convert JSON data to internal format
function convertJSONToInternalFormat(jsonData: JSONChatRoomResponse): Room[] {
  return jsonData.results.map((result) => {
    const room: Room = {
      id: result.room.id.toString(),
      name: result.room.name,
      image_url: result.room.image_url,
      participants: result.room.participant.map((p) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        avatarUrl: "", // Default empty avatar
        lastActive: new Date(),
        isOnline: Math.random() > 0.5, // Random online status
        isTyping: false,
      })),
      comments: result.comments.map(convertJSONCommentToInternal),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return room;
  });
}

const dummyComments: Comment[] = [
  {
    id: "comment1",
    content: "Hello everyone!",
    type: "text",
    authorId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "comment2",
    content: "Hi Alice!",
    type: "text",
    authorId: "user2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // example image comment
  {
    id: "comment3",
    content: "/image.png",
    type: "image",
    authorId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {
      image: {
        width: 800,
        height: 600,
      },
    },
  },
  // example video comment
  {
    id: "comment4",
    content: "/veo3.mp4",
    type: "video",
    authorId: "user2",
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {
      video: {
        duration: 8, // seconds
      },
    },
  },
  {
    id: "comment5",
    content: "/project-report.pdf",
    type: "document" as const,
    authorId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {
      document: {
        fileName: "Project Report Q4.pdf",
        fileSize: 2048576, // 2MB in bytes
        fileType: "application/pdf",
      },
    },
  },
];

const useAppStore = create<AppStore>((set, get) => ({
  getSelectedRoom: () => {
    const selectedChatId = get().selectedChatId;
    if (!selectedChatId) return undefined;
    return get().rooms.find((room) => room.id.toString() === selectedChatId);
  },

  importFromJSON: (jsonData: JSONChatRoomResponse) => {
    const convertedRooms = convertJSONToInternalFormat(jsonData);
    set({ rooms: convertedRooms });
    // Optionally select the first room
    if (convertedRooms.length > 0) {
      set({
        selectedChatId: convertedRooms[0].id.toString(),
        comments: convertedRooms[0].comments, // Set comments for the first room
      });
    }
  },

  searchQuery: "",
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  selectedChatId: "room1",
  setSelectedChatId: (id: string | null) => set({ selectedChatId: id }),

  comments: dummyComments,
  setComments: (comments: Comment[]) => set({ comments }),

  // dummy data with role support
  rooms: [
    {
      id: "room1",
      name: "General Chat",
      participants: [
        {
          id: "admin@mail.com",
          name: "Admin",
          role: ParticipantRole.ADMIN,
          avatarUrl: "",
          lastActive: new Date(),
          isOnline: true,
          isTyping: false,
        },
        {
          id: "agent@mail.com",
          name: "Agent A",
          role: ParticipantRole.AGENT,
          avatarUrl: "",
          lastActive: new Date(),
          isOnline: true,
          isTyping: false,
        },
        {
          id: "customer@mail.com",
          name: "King Customer",
          role: ParticipantRole.CUSTOMER,
          avatarUrl: "",
          lastActive: new Date(),
          isOnline: false,
          isTyping: false,
        },
      ],
      comments: dummyComments,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  setRooms: (rooms: Room[]) => set({ rooms }),
}));

// Role badge component
function RoleBadge({ role }: { role?: ParticipantRole }) {
  if (role === undefined) return null;

  const getRoleInfo = (role: ParticipantRole) => {
    switch (role) {
      case ParticipantRole.ADMIN:
        return { text: "Admin", color: "bg-red-100 text-red-800" };
      case ParticipantRole.AGENT:
        return { text: "Agent", color: "bg-blue-100 text-blue-800" };
      case ParticipantRole.CUSTOMER:
        return { text: "Customer", color: "bg-green-100 text-green-800" };
      default:
        return { text: "User", color: "bg-gray-100 text-gray-800" };
    }
  };

  const roleInfo = getRoleInfo(role);

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}
    >
      {roleInfo.text}
    </span>
  );
}

type IconType = "arrow-left" | "up" | "+" | "search" | "menu" | "send" | string;

function Icon({ name }: { name: IconType }) {
  switch (name) {
    case "arrow-left":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      );

    case "up":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
          />
        </svg>
      );
    case "+":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      );
    case "search":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      );
    case "menu":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      );

    case "send":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
      );
    default:
      return <>{name}</>;
  }
}

interface IconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: IconType;
}

function IconButton({ name, ...props }: IconProps) {
  return (
    <button
      {...props}
      className={
        "p-2 rounded hover:bg-blue-100 hover:text-blue-700 transition-colors " +
        props.className
      }
    >
      <Icon name={name} />
    </button>
  );
}

function SearchBar() {
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
}

function Avatar({
  src,
  alt,
  role,
}: {
  src?: string;
  alt: string;
  role?: ParticipantRole;
}) {
  const hashColor = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Generate colors based on role
    if (role === ParticipantRole.ADMIN) return "hsl(0, 70%, 60%)"; // Red for admin
    if (role === ParticipantRole.AGENT) return "hsl(220, 70%, 60%)"; // Blue for agent
    if (role === ParticipantRole.CUSTOMER) return "hsl(120, 70%, 60%)"; // Green for customer

    // Default blue-ish colors
    const hue = (hash % 60) + 200; // Blue range: 200-260
    return `hsl(${hue}, 70%, 60%)`;
  };

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm relative"
      style={{ backgroundColor: src ? "transparent" : hashColor(alt) }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full rounded-full" />
      ) : (
        <span className="text-white text-xs font-semibold">
          {alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function AvatarGroup({ participants }: { participants: Participant[] }) {
  if (participants.length === 0) return null;
  const displayedParticipants = participants.slice(0, 3);
  const remainingCount = participants.length - displayedParticipants.length;
  return (
    <div className="flex -space-x-4">
      {displayedParticipants.map((participant) => (
        <Avatar
          key={participant.id}
          src={participant.avatarUrl}
          alt={participant.name}
          role={participant.role}
        />
      ))}
      {remainingCount > 0 && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs border-2 border-white shadow-sm">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

function Profile({ room }: { room: Room }) {
  return (
    <div className="flex-1">
      <div className="text-sm font-semibold text-blue-900 mb-1">
        {room.name}
      </div>
      <div className="text-xs font-light text-blue-600 mb-1">
        {room.comments[room.comments.length - 1]?.content}
      </div>
      <div className="flex flex-wrap gap-1">
        {room.participants.slice(0, 2).map((participant) => (
          <RoleBadge key={participant.id} role={participant.role} />
        ))}
      </div>
    </div>
  );
}

function RoomList() {
  const { rooms, setSelectedChatId } = useAppStore();

  return (
    <ul className="flex flex-col overflow-y-auto no-scrollbar min-h-full">
      {rooms.map((room) => (
        <li
          key={room.id}
          onClick={() => setSelectedChatId(room.id.toString())}
          className="flex gap-2 border-b border-blue-100 hover:bg-blue-50 transition-colors p-4 cursor-pointer"
        >
          {room.image_url ? (
            <img
              src={room.image_url}
              alt={room.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <AvatarGroup participants={room.participants} />
          )}
          <Profile room={room} />
        </li>
      ))}
    </ul>
  );
}

function FullscreenModal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-blue-900 bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-full max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-blue-200 z-10"
        >
          ×
        </button>
        <div onClick={(e) => e.stopPropagation()}>{children}</div>
      </div>
    </div>
  );
}

// Utility function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Utility function to get file icon based on type
function getFileIcon(fileType: string): string {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return "📄";
    case "doc":
    case "docx":
      return "📝";
    case "xls":
    case "xlsx":
      return "📊";
    case "ppt":
    case "pptx":
      return "📑";
    case "txt":
      return "📋";
    default:
      return "📎";
  }
}

const mimeAliasMap: Record<string, string> = {
  "application/pdf": "PDF Document",
  "application/msword": "Word Document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "Word Document",
  "application/vnd.ms-excel": "Excel Spreadsheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "Excel Spreadsheet",
  "text/plain": "Text File",
};

function getFileAlias(fileType: string): string {
  return mimeAliasMap[fileType] || "File";
}

function ChatContentPreview({ comment }: { comment: Comment }) {
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
}

function ChatView() {
  const { selectedChatId, getSelectedRoom, comments, setComments } =
    useAppStore();
  const [currentMessage, setCurrentMessage] = useState("");
  const chatContainerRef = useRef<HTMLUListElement>(null);

  const addComment = (content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      content,
      type: "text",
      authorId: "user1", // hardcoded for now
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setComments([...comments, newComment]);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleAddComment = () => {
    if (!currentMessage.trim()) return;
    addComment(currentMessage.trim());
    setCurrentMessage("");
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
        ref={chatContainerRef}
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

      <div className="mt-4 h-[5vh] flex gap-2 items-center  py-6 md:py-0">
        <input
          type="text"
          className="w-full p-2 bg-white border border-blue-200 text-blue-900 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && currentMessage.trim()) {
              e.preventDefault();
              handleAddComment();
            }
          }}
        />
        <IconButton
          onClick={() => {
            handleAddComment();
          }}
          name="send"
          className="p-2 bg-blue-600 text-white hover:text-white rounded-lg hover:bg-blue-700 transition-colors"
        />
      </div>
    </div>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

function App() {
  const { selectedChatId, getSelectedRoom, rooms, setRooms, importFromJSON } =
    useAppStore();
  const isMobile = useMediaQuery("(max-width: 768px)");
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
        importFromJSON(jsonData);
        console.log("JSON data imported successfully!");
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert("Error parsing JSON file. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleAddRoom = () => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: `New Room ${Math.floor(Math.random() * 1000)}`,
      participants: [
        {
          id: "user1",
          name: "Alice",
          role: ParticipantRole.ADMIN,
          avatarUrl: "",
          lastActive: new Date(),
          isOnline: true,
          isTyping: false,
        },
        {
          id: "user2",
          name: "Bob",
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
  };

  return (
    <div
      className="h-screen flex flex-col bg-blue-50"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* hidden input upload */}
      <input
        ref={uploadInputRef}
        type="file"
        className="hidden"
        accept=".json"
        onChange={handleFileUpload}
      />
      <header className="w-full bg-blue-600 text-white shadow-lg flex-shrink-0">
        <nav>
          <div className="flex items-center justify-between">
            <ul className="flex items-center">
              <li>
                <IconButton
                  name={selectedChatId ? "arrow-left" : "menu"}
                  onClick={() => {
                    if (selectedChatId) {
                      useAppStore.getState().setSelectedChatId(null);
                    } else {
                      // Handle menu toggle logic here
                    }
                  }}
                />
              </li>
            </ul>
            {selectedChatId ? (
              <div className="flex items-center p-4 gap-2 w-full">
                <AvatarGroup
                  participants={
                    useAppStore
                      .getState()
                      .rooms.find(
                        (room) => room.id.toString() === selectedChatId
                      )?.participants || []
                  }
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
                  onClick={handleUploadClick}
                  title="Import JSON file"
                />
                <IconButton
                  name="+"
                  onClick={handleAddRoom}
                  title="Add new room"
                />
              </ul>
            )}
          </div>

          {selectedChatId ? (
            <></>
          ) : (
            <div className="flex items-center justify-between p-4">
              <SearchBar />
            </div>
          )}
        </nav>
      </header>

      <main className="w-full bg-white h-full">
        {isMobile ? (
          selectedChatId ? (
            <ChatView />
          ) : (
            <RoomList />
          )
        ) : (
          <div className="flex h-full">
            <div
              className={`${
                selectedChatId ? "w-1/3" : "w-full"
              } h-full overflow-y-auto no-scrollbar bg-white border-r border-blue-200`}
            >
              <RoomList />
            </div>
            <div className={`${selectedChatId ? "w-2/3" : "w-0"} h-full`}>
              <ChatView />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
