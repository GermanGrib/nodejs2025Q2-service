import {
  BadRequestException,
  NotFoundException,
} from '../common/exceptions/http.exception';
import { Injectable } from '@nestjs/common';
import { validate as isValidUUID } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Album } from './entities/album.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async findById(id: string): Promise<Album> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum: Album = {
      id: crypto.randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId ?? null,
    };

    await this.prisma.album.create({ data: newAlbum });
    return newAlbum;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: {
        ...updateAlbumDto,
        artistId:
          updateAlbumDto.artistId !== undefined
            ? updateAlbumDto.artistId
            : album.artistId,
      },
    });

    return updatedAlbum;
  }

  async delete(id: string): Promise<void> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    await this.prisma.album.delete({ where: { id } });
    this.eventEmitter.emit('album.deleted', id);
  }

  @OnEvent('artist.deleted')
  async handleArtistDeleted(artistId: string) {
    await this.prisma.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }
}
