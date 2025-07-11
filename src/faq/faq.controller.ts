import { Controller, Get, Query } from '@nestjs/common';
import { FaqService } from './faq.service';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  ask(@Query('q') question: string) {
    const answer = this.faqService.findAnswer(question);
    return { answer };
  }
}
