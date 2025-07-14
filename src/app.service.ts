import { Injectable } from '@nestjs/common';

/**
 * Service providing application-level functionalities.
 *
 * @class AppService
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'A smart FAQ demo powered by AI to answer common questions automatically.';
  }
}
