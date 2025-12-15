export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  owner: User;
  collaborators: User[];
  files: File[];
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
}

export interface File {
  id: string;
  name: string;
  path: string;
  content: string;
  size: number;
  updatedAt: string;
  updatedBy: User;
}
