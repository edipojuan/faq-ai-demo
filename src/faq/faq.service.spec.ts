import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { FaqService } from './faq.service';

jest.mock('./../../data/faq.json', () => [
  { question: 'What is Node.js?', answer: 'Node.js is a JavaScript runtime.' },
  { question: 'How to install Node.js?', answer: 'Download from nodejs.org.' },
]);

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FaqService', () => {
  let faqService: FaqService;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue('fake-api-key'),
    } as any;
    faqService = new FaqService();
    // @ts-ignore
    faqService.configService = configService;
  });

  describe('getEmbedding', () => {
    it('should throw if OPENAI_API_KEY is not set', async () => {
      (configService.get as jest.Mock).mockReturnValue(undefined);
      await expect(faqService.getEmbedding('test')).rejects.toThrow(
        'The OPENAI_API_KEY environment variable is not set!',
      );
    });

    it('should call OpenAI API and return embedding', async () => {
      const fakeEmbedding = [0.1, 0.2, 0.3];
      mockedAxios.post.mockResolvedValueOnce({
        data: { data: [{ embedding: fakeEmbedding }] },
      });
      const result = await faqService.getEmbedding('test');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.openai.com/v1/embeddings',
        { model: 'text-embedding-3-small', input: 'test' },
        { headers: { Authorization: 'Bearer fake-api-key' } },
      );
      expect(result).toEqual(fakeEmbedding);
    });
  });

  describe('cosineSimilarity', () => {
    it('should return 1 for identical vectors', () => {
      const v = [1, 2, 3];
      expect(faqService.cosineSimilarity(v, v)).toBeCloseTo(1);
    });

    it('should return 0 for orthogonal vectors', () => {
      const a = [1, 0];
      const b = [0, 1];
      expect(faqService.cosineSimilarity(a, b)).toBeCloseTo(0);
    });

    it('should return -1 for opposite vectors', () => {
      const a = [1, 0];
      const b = [-1, 0];
      expect(faqService.cosineSimilarity(a, b)).toBeCloseTo(-1);
    });
  });

  describe('findAnswer', () => {
    beforeEach(() => {
      jest
        .spyOn(faqService, 'getEmbedding')
        .mockImplementation(async (text: string) => {
          if (text === 'What is Node.js?') return [1, 0];
          if (text === 'How to install Node.js?') return [0, 1];
          if (text === 'Node.js info') return [0.9, 0.1];
          if (text === 'Install Node.js') return [0.1, 0.9];
          return [0, 0];
        });
    });

    it('should return the best matching answer', async () => {
      const answer = await faqService.findAnswer('Node.js info');
      expect(answer).toBe('Node.js is a JavaScript runtime.');
    });

    it('should return the best matching answer for install', async () => {
      const answer = await faqService.findAnswer('Install Node.js');
      expect(answer).toBe('Download from nodejs.org.');
    });

    it('should return default message if no good match', async () => {
      (faqService.getEmbedding as jest.Mock).mockResolvedValue([0, 0]);
      const answer = await faqService.findAnswer('Unrelated question');
      expect(answer).toBe('No good answer found.');
    });
  });
});
