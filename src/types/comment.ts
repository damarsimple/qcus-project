export interface CommentImageMetadata {
  image: {
    width: number;
    height: number;
  };
}

export interface CommentVideoMetadata {
  video: {
    duration: number; // in seconds
  };
}

export type FileType =
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export interface CommentDocumentMetadata {
  document: {
    fileName: string;
    fileSize: number; // in bytes
    fileType: FileType;
  };
}

export interface BaseComment {
  id: string | number;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CommentVariant =
  | { type: "text" }
  | { type: "image"; metadata: CommentImageMetadata }
  | { type: "video"; metadata: CommentVideoMetadata }
  | { type: "document"; metadata: CommentDocumentMetadata };

export type Comment = BaseComment & CommentVariant;