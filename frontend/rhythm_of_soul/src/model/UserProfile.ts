export interface User {
    id: string;
    name: string;
    position: string;
    avatar: string;
    description: string;
    bio: string;
    joined: string;
    location: string;
    email: string;
    url: string;
    contact: string;
    role: "user" | "artist";
  }