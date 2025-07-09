import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'A smart FAQ demo powered by AI to answer common questions automatically.';
  }
}
