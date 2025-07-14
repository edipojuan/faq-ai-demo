import { Controller, Get, Inject, Query } from '@nestjs/common';
import { FaqService } from './faq.service';

/**
 * Controller for handling FAQ-related endpoints.
 *
 * @controller
 * @route /faq
 */
@Controller('faq')
export class FaqController {
  @Inject(FaqService)
  private readonly faqService: FaqService;

  @Get()
  async ask(@Query('q') question: string) {
    const answer = await this.faqService.findAnswer(question);
    return { answer };
  }
}
