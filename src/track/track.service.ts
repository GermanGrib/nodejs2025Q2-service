import {
  BadRequestException,
  NotFoundException,
} from '../common/exceptions/http.exception';
import { Injectable } from '@nestjs/common';
import { validate as isValidUUID } from 'uuid';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }

  async findById(id: string): Promise<Track> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack: Track = {
      id: crypto.randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId ?? null,
      albumId: createTrackDto.albumId ?? null,
      duration: createTrackDto.duration,
    };

    await this.prisma.track.create({ data: newTrack });

    return newTrack;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: {
        ...track,
        ...updateTrackDto,
        artistId:
          updateTrackDto.artistId !== undefined
            ? updateTrackDto.artistId
            : track.artistId,
        albumId:
          updateTrackDto.albumId !== undefined
            ? updateTrackDto.albumId
            : track.albumId,
      },
    });

    return updatedTrack;
  }

  async delete(id: string): Promise<void> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    await this.prisma.track.delete({ where: { id } });
  }

  @OnEvent('artist.deleted')
  async handleArtistDeleted(artistId: string) {
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  @OnEvent('album.deleted')
  async handleAlbumDeleted(albumId: string) {
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }
}
