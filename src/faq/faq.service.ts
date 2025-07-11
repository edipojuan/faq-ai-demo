import { Injectable } from '@nestjs/common';

@Injectable()
export class FaqService {
  findAnswer(question: string) {
    return `This action returns a #${question} faq`;
  }
}
