import { forwardRef, Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
