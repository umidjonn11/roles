import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const builder = new DocumentBuilder()
    .setTitle('Basic api')
    .addBearerAuth()
    .build();
  const factory = () => SwaggerModule.createDocument(app, builder);
  SwaggerModule.setup('api/docs', app, factory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
