import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstraps the NestJS application by creating an instance of the app and starting the HTTP server.
 * The server listens on the port specified by the `PORT` environment variable, or defaults to 3000 if not set.
 *
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when the application has started listening.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
