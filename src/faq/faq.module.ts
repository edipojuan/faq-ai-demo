import { Module } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';

/**
 * The FaqModule is a feature module that encapsulates the FAQ functionality.
 *
 * @module FaqModule
 * @description
 * Registers the FaqController and FaqService to handle FAQ-related operations.
 *
 * @see FaqController
 * @see FaqService
 */
@Module({
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule {}
