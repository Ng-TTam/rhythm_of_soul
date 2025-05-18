export const DEFAULT_PAGE_SIZE = 10;

export const ArtistStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export const Gender = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    OTHER: 'OTHER'
} as const

export const Status = {
    ACTIVE: 'ACTIVE',
    BAN: 'BAN'
}

export type StatusType = keyof typeof Status;
export type GenderType = keyof typeof Gender;
export type ArtistStatusType = keyof typeof ArtistStatus;
