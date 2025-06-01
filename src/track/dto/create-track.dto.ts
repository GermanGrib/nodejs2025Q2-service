import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateIf((o) => o.artistId !== undefined)
  @IsUUID('4', { message: 'artistId must be a valid UUID or null' })
  @Type(() => String)
  artistId: string | null;

  @ValidateIf((o) => o.albumId !== undefined)
  @IsUUID('4', { message: 'albumId must be a valid UUID or null' })
  @Type(() => String)
  albumId: string | null;

  @IsNotEmpty()
  @IsInt()
  duration: number;
}
