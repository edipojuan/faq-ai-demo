import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

/**
 * Bootstraps the NestJS application by creating an instance of the app and starting the HTTP server.
 * The server listens on the port specified by the `PORT` environment variable, or defaults to 3000 if not set.
 *
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when the application has started listening.
 */
export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
