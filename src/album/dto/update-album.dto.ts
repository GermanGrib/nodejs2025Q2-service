import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAlbumDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  year: number;

  @ValidateIf((o) => o.artistId !== undefined)
  @IsUUID('4', { message: 'artistId must be a valid UUID or null' })
  @Type(() => String)
  artistId: string | null;
}
