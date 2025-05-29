import { type Comment, type Room, ParticipantRole } from '../types';

export const dummyComments: Comment[] = [
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
  {
    id: "comment4",
    content: "/veo3.mp4",
    type: "video",
    authorId: "user2",
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {
      video: {
        duration: 8,
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
        fileSize: 2048576,
        fileType: "application/pdf",
      },
    },
  },
];

export const dummyRooms: Room[] = [
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
];