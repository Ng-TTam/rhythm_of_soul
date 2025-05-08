export const Roles = {
    USER: 'USER',
    ARTIST: 'ARTIST',
    ADMIN: 'ADMIN',
  } as const;
  
  export type RoleType = keyof typeof Roles;
  