import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
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
  async ask(@Query('question') question: string) {
    if (!question || question.trim() === '') {
      throw new BadRequestException('Query parameter "question" is required');
    }

    const answer = await this.faqService.findAnswer(question);
    return { answer };
  }
}
