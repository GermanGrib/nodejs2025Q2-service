import {
  BadRequestException,
  NotFoundException,
} from '../common/exceptions/http.exception';
import { Injectable } from '@nestjs/common';
import { validate as isValidUUID } from 'uuid';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(
    private prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async findById(id: string): Promise<Artist> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist: Artist = {
      id: crypto.randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    this.prisma.artist.create({ data: newArtist });
    return newArtist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: {
        name: updateArtistDto.name,
        grammy: updateArtistDto.grammy,
      },
    });

    return updatedArtist;
  }

  async delete(id: string): Promise<void> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    this.prisma.artist.delete({ where: { id } });
    this.eventEmitter.emit('artist.deleted', id);
  }
}
