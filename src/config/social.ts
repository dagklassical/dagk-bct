// src/config/social.ts
export const socialProfiles = {
  instagram: "https://instagram.com/dagklassical",
  facebook: "https://www.facebook.com/people/Dagklassical/100063061250762/",
  youtube: "https://www.youtube.com/@dagklassicalLabel",
  spotify: "https://open.spotify.com/intl-es/artist/6BhdkgU5SJGqrhhI8Hok10",
  email: "contacto@dagklassical.com",
  website: "https://dagklassical.com",
} as const;

export type SocialPlatform = keyof typeof socialProfiles;

export const isActiveSocial = (platform: SocialPlatform): boolean => {
  const url = socialProfiles[platform];
  return typeof url === 'string' && url.startsWith('http');
};