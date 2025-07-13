import { Controller, Get, Query } from '@nestjs/common';
import { FaqService } from './faq.service';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  async ask(@Query('q') question: string) {
    const answer = await this.faqService.findAnswer(question);
    return { answer };
  }
}
