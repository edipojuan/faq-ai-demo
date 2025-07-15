import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppModule } from './app.module';
import { AppService } from './app.service';
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

  it('should provide AppController', () => {
    const controller = module.get(AppController);
    expect(controller).toBeInstanceOf(AppController);
  });

  it('should provide AppService', () => {
    const service = module.get(AppService);
    expect(service).toBeInstanceOf(AppService);
  });
});
