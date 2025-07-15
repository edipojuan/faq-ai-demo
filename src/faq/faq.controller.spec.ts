import { Test, TestingModule } from '@nestjs/testing';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';

describe('FaqController', () => {
  let faqController: FaqController;
  let faqService: FaqService;

  beforeEach(async () => {
    const mockFaqService = {
      findAnswer: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaqController],
      providers: [
        {
          provide: FaqService,
          useValue: mockFaqService,
        },
      ],
    }).compile();

    faqController = module.get<FaqController>(FaqController);
    faqService = module.get<FaqService>(FaqService);
  });

  describe('ask', () => {
    it('should return the answer from faqService', async () => {
      const question = 'What is AI?';
      const expectedAnswer = 'Artificial Intelligence';
      jest.spyOn(faqService, 'findAnswer').mockResolvedValue(expectedAnswer);

      const result = await faqController.ask(question);

      expect(faqService.findAnswer).toHaveBeenCalledWith(question);
      expect(result).toEqual({ answer: expectedAnswer });
    });

    it('should return undefined if faqService returns undefined', async () => {
      const question = 'Unknown question';
      jest
        .spyOn(faqService, 'findAnswer')
        .mockResolvedValue(undefined as unknown as string);

      const result = await faqController.ask(question);

      expect(faqService.findAnswer).toHaveBeenCalledWith(question);
      expect(result).toEqual({ answer: undefined });
    });
  });
});
