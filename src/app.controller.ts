import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * The main application controller.
 *
 * Handles incoming HTTP requests to the root endpoint and delegates business logic to the AppService.
 */
@Controller()
export class AppController {
  @Inject(AppService)
  private readonly appService: AppService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
