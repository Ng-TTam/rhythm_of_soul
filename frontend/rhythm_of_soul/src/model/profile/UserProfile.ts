import { Artist } from "./ArtistProfile";

export interface User {
  user_id: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  cover_url: string;
  role: "USER" | "ARTIST";
  artist : Artist | null;
}