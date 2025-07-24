import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { FaqModule } from './faq/faq.module';

describe('AppModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should import FaqModule', () => {
    const faqModule = module.select(FaqModule);
    expect(faqModule).toBeDefined();
  });
});
