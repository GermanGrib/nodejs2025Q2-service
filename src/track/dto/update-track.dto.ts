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

  @IsOptional()
  @ValidateIf((o) => o.artistId !== undefined)
  @IsUUID('4', { message: 'artistId must be a valid UUID or null' })
  artistId?: string | null;

  @IsOptional()
  @ValidateIf((o) => o.albumId !== undefined)
  @IsUUID('4', { message: 'albumId must be a valid UUID or null' })
  albumId?: string | null;

  @IsOptional()
  @IsInt()
  duration?: number;
}
