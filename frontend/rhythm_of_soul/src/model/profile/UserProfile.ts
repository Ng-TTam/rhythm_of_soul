import { ArtistProfile } from "./ArtistProfile";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber: string;
  avatar?: string ;
  cover?: string;
  artistProfile?: ArtistProfile;
  createdAt: string | null;
  updatedAt: string | null;
  artist: boolean;
}