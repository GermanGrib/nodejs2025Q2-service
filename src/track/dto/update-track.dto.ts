import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class UpdateTrackDto {
  @IsOptional()
  @IsString()
  name?: string;

  @ValidateIf((o) => o.artistId !== undefined && o.artistId !== null)
  @IsUUID('4', { message: 'artistId must be a valid UUID' })
  artistId?: string | null;

  @ValidateIf((o) => o.albumId !== undefined && o.albumId !== null)
  @IsUUID('4', { message: 'albumId must be a valid UUID' })
  albumId?: string | null;

  @IsOptional()
  @IsInt()
  duration?: number;
}
