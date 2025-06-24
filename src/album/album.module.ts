import { forwardRef, Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
