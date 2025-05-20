export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber: string;
  avatar?: string ;
  cover?: string;
  artistProfile?: {
    stageName: string;
    bio: string;
    facebookUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
  };
  // artist: boolean; // user is artist can update artist profile
}