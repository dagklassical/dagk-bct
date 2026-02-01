export interface Artist {
  id: string;
  name: string;
  avatar?: string;
  website?: string;
  social?: {
    [platform: string]: string | null | undefined;
  };
}

export interface ReleaseTrack {
  title: string;
  duration?: string;
  demo?: string;
  composer?: string;
  workCatalogue?: string;
}

export interface Release {
  id: string;
  title: string;
  artistIds: string[];
  genre: string;
  releaseDate: string;
  type: string;
  status: string;
  description?: string;
  descriptionLong?: string;
  coverImage: string;
  demoAvailable?: boolean;
  fullAlbumAvailable?: boolean;
  sheetMusicAvailable?: boolean;
  platforms?: {
    spotify?: string | null;
    apple?: string | null;
    youtube?: string | null;
    tidal?: string | null;
    deezer?: string | null;
  };
  tracks: ReleaseTrack[];
  duration: string;
  commentary?: string;
  commentaryAuthor?: string;
  musicCards: string[];
  metadata: {
    uuid: string;
    timestamp: string;
    operator: string;
  };
}

export interface MusicCardSocialLink {
  platform: string;
  url: string;
}

export interface MusicCard {
  id: string;
  title: string;
  artist?: string;
  edition: string;
  associatedRelease: string;
  totalSupply: number;
  available: number;
  blockchain: string;
  contractAddress: string;
  tokenId: string;
  price: number;               // ✅ ahora es number
  status: string;
  workType?: string;           // ✅ campo opcional añadido
  benefits: string[];
  cardImage: string;
  socialLinks: MusicCardSocialLink[];
  metadata: {
    uuid: string;
    timestamp: string;
    operator: string;
  };
}