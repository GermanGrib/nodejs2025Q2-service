import { Artist } from '../../artist/entities/artist.entity';
import { Track } from '../../track/entities/track.entity';
import { Album } from '../../album/entities/album.entity';

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
