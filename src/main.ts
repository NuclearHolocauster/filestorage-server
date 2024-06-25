import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.APP_PORT || 5000;
  console.log(port);
  
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true
    }
  });
  await app.listen(port);
}
bootstrap();
