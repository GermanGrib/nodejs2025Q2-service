import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorites } from './interfaces/favorites.interface';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  async findAll() {
    const tracks = await Promise.all(
      this.favorites.tracks.map(async (id) => {
        try {
          return this.trackService.findById(id);
        } catch {
          return null;
        }
      }),
    );

    const albums = await Promise.all(
      this.favorites.albums.map(async (id) => {
        try {
          return this.albumService.findById(id);
        } catch {
          return null;
        }
      }),
    );

    const artists = await Promise.all(
      this.favorites.artists.map(async (id) => {
        try {
          return this.artistService.findById(id);
        } catch {
          return null;
        }
      }),
    );

    return {
      artists: artists.filter(Boolean),
      albums: albums.filter(Boolean),
      tracks: tracks.filter(Boolean),
    };
  }

  async addArtist(id: string) {
    try {
      this.artistService.findById(id);
    } catch {
      throw new UnprocessableEntityException(`Artist with ID ${id} not found`);
    }

    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }
  }

  async removeArtist(id: string) {
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(
        `Artist with ID ${id} not found in favorites`,
      );
    }
    this.favorites.artists.splice(index, 1);
  }

  async addAlbum(id: string) {
    try {
      this.albumService.findById(id);
    } catch {
      throw new UnprocessableEntityException(`Album with ID ${id} not found`);
    }

    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }
  }

  async removeAlbum(id: string) {
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(`Album with ID ${id} not found in favorites`);
    }
    this.favorites.albums.splice(index, 1);
  }

  async addTrack(id: string) {
    try {
      this.trackService.findById(id);
    } catch {
      throw new UnprocessableEntityException(`Track with ID ${id} not found`);
    }

    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }
  }

  async removeTrack(id: string) {
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException(`Track with ID ${id} not found in favorites`);
    }
    this.favorites.tracks.splice(index, 1);
  }

  removeArtistFromFavorites(id: string) {
    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
  }

  removeAlbumFromFavorites(id: string) {
    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
  }

  removeTrackFromFavorites(id: string) {
    this.favorites.tracks = this.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
  }

  @OnEvent('album.deleted')
  handleAlbumDeleted(albumId: string) {
    this.removeAlbumFromFavorites(albumId);
  }

  @OnEvent('artist.deleted')
  handleArtistDeleted(artistId: string) {
    this.removeArtistFromFavorites(artistId);
  }

  @OnEvent('track.deleted')
  handleTrackDeleted(trackId: string) {
    this.removeTrackFromFavorites(trackId);
  }
}
