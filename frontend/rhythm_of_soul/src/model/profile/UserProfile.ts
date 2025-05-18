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
  followerCount: number;
  followedCount: number;
  isFollowed?: boolean; // thêm thuộc tính này để theo dõi trạng thái follow
}