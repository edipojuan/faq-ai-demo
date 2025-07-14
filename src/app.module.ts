import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FaqModule } from './faq/faq.module';

/**
 * The root module of the application.
 *
 * @module AppModule
 * @description
 * This module imports the `FaqModule` and configures the `ConfigModule` to be global.
 * It also declares the main application controller and service.
 *
 * @imports FaqModule - Handles FAQ-related functionality.
 * @imports ConfigModule - Loads and manages application configuration globally.
 * @controller AppController - Handles incoming HTTP requests.
 * @provider AppService - Provides application-wide services.
 */
@Module({
  imports: [FaqModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
