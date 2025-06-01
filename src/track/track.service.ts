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

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  findAll(): Track[] {
    return this.tracks;
  }

  findById(id: string): Track {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: crypto.randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId ?? null,
      albumId: createTrackDto.albumId ?? null,
      duration: createTrackDto.duration,
    };

    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    const updatedTrack = {
      ...this.tracks[trackIndex],
      ...updateTrackDto,
      artistId:
        updateTrackDto.artistId !== undefined
          ? updateTrackDto.artistId
          : this.tracks[trackIndex].artistId,
      albumId:
        updateTrackDto.albumId !== undefined
          ? updateTrackDto.albumId
          : this.tracks[trackIndex].albumId,
    };

    this.tracks[trackIndex] = updatedTrack;
    return updatedTrack;
  }

  delete(id: string): void {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    this.tracks.splice(trackIndex, 1);
  }

  @OnEvent('artist.deleted')
  handleArtistDeleted(artistId: string) {
    this.tracks = this.tracks.map((track) => {
      if (track.artistId === artistId) {
        return { ...track, artistId: null };
      }
      return track;
    });
  }
}
