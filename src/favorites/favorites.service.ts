import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(
    private prisma: PrismaService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  async findAll() {
    const [artists, albums, tracks] = await Promise.all([
      this.prisma.favoriteArtist.findMany({
        include: { artist: true },
      }),
      this.prisma.favoriteAlbum.findMany({
        include: { album: true },
      }),
      this.prisma.favoriteTrack.findMany({
        include: { track: true },
      }),
    ]);

    return {
      artists: artists.map((fav) => fav.artist).filter(Boolean),
      albums: albums.map((fav) => fav.album).filter(Boolean),
      tracks: tracks.map((fav) => fav.track).filter(Boolean),
    };
  }

  async addArtist(id: string) {
    try {
      await this.artistService.findById(id);
    } catch {
      throw new UnprocessableEntityException(`Artist with ID ${id} not found`);
    }

    try {
      await this.prisma.favoriteArtist.create({
        data: { artistId: id },
      });
    } catch {}
  }

  async removeArtist(id: string) {
    try {
      await this.prisma.favoriteArtist.delete({
        where: { artistId: id },
      });
    } catch {
      throw new NotFoundException(
        `Artist with ID ${id} not found in favorites`,
      );
    }
  }

  async addAlbum(id: string) {
    try {
      await this.albumService.findById(id);
    } catch {
      throw new UnprocessableEntityException(`Album with ID ${id} not found`);
    }

    try {
      await this.prisma.favoriteAlbum.create({
        data: { albumId: id },
      });
    } catch {}
  }

  async removeAlbum(id: string) {
    try {
      await this.prisma.favoriteAlbum.delete({
        where: { albumId: id },
      });
    } catch {
      throw new NotFoundException(`Album with ID ${id} not found in favorites`);
    }
  }

  async addTrack(id: string) {
    try {
      await this.trackService.findById(id);
    } catch {
      throw new UnprocessableEntityException(`Track with ID ${id} not found`);
    }

    try {
      await this.prisma.favoriteTrack.create({
        data: { trackId: id },
      });
    } catch {}
  }

  async removeTrack(id: string) {
    try {
      await this.prisma.favoriteTrack.delete({
        where: { trackId: id },
      });
    } catch {
      throw new NotFoundException(`Track with ID ${id} not found in favorites`);
    }
  }

  @OnEvent('album.deleted')
  async handleAlbumDeleted(albumId: string) {
    await this.removeAlbumFromFavorites(albumId);
  }

  @OnEvent('artist.deleted')
  async handleArtistDeleted(artistId: string) {
    await this.removeArtistFromFavorites(artistId);
  }

  @OnEvent('track.deleted')
  async handleTrackDeleted(trackId: string) {
    await this.removeTrackFromFavorites(trackId);
  }

  private async removeTrackFromFavorites(id: string) {
    try {
      await this.prisma.favoriteTrack.delete({
        where: { trackId: id },
      });
    } catch {}
  }

  private async removeAlbumFromFavorites(id: string) {
    try {
      await this.prisma.favoriteAlbum.delete({
        where: { albumId: id },
      });
    } catch {}
  }

  private async removeArtistFromFavorites(id: string) {
    try {
      await this.prisma.favoriteArtist.delete({
        where: { artistId: id },
      });
    } catch {}
  }
}
