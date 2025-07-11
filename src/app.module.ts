import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FaqModule } from './faq/faq.module';

@Module({
  imports: [FaqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
