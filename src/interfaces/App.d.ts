declare type Note = {
  title: string;
  tags: string[];
  body: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

declare type NoteInput = {
  title: string;
  tags: string[];
  body: string;
}

declare type User = {
  username: string;
  password: string;
  fullname: string;
}

declare type Validator = {
  validatePayload: (payload: any) => any;
} 

declare type Token = {
  accessToken: string;
  refreshToken: string;
}

declare type Collab = {
  noteId: string;
  userId: string;
}