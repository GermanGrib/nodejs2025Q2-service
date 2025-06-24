import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('album')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async findAll() {
    return await this.albumService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.albumService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createArtistDto: CreateAlbumDto) {
    return await this.albumService.create(createArtistDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateArtistDto: UpdateAlbumDto,
  ) {
    return await this.albumService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.albumService.delete(id);
  }
}
