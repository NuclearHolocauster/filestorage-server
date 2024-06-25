import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './files/file.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', process.env.SAVE_FILES_PATH),
      serveRoot: '/files'
    }),
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
