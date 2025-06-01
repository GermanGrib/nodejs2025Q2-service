import {
  BadRequestException,
  NotFoundException,
} from '../common/exceptions/http.exception';
import { Injectable } from '@nestjs/common';
import { validate as isValidUUID } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  findAll(): Album[] {
    return this.albums;
  }

  findById(id: string): Album {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: crypto.randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId ?? null,
    };

    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const albumIndex = this.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    const updatedAlbum = {
      ...this.albums[albumIndex],
      ...updateAlbumDto,
      artistId:
        updateAlbumDto.artistId !== undefined
          ? updateAlbumDto.artistId
          : this.albums[albumIndex].artistId,
    };

    this.albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  delete(id: string): void {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const albumIndex = this.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.albums.splice(albumIndex, 1);
  }

  @OnEvent('artist.deleted')
  handleArtistDeleted(artistId: string) {
    this.albums = this.albums.map((album) => {
      if (album.artistId === artistId) {
        return { ...album, artistId: null };
      }
      return album;
    });
  }
}
