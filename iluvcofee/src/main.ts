import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Globally scoped pipes, one limitation is that we cannot instantiate any dependency
  // here since we ahe setting up ourselves outside the context of any nestjs module
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalGuards(new ApiKeyGuard());
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor()
  );
  await app.listen(3000);
}
bootstrap();
