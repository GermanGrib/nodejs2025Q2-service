import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  @ValidateIf((o) => o.artistId !== null)
  @IsUUID('4', { message: 'artistId must be a valid UUID or null' })
  @Type(() => String)
  artistId: string | null;
}
