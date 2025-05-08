export interface ArtistProfile {
    id: string;
    stageName: string;
    bio: string;
    facebookUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string | null;
    updatedAt: string | null;
}