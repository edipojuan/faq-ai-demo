import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as faqData from './../../data/faq.json';

@Injectable()
export class FaqService {
  async getEmbedding(text: string): Promise<number[]> {
    // process.env.OPENAI_API_KEY ||= '<put your token>';

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('The OPENAI_API_KEY environment variable is not set!');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        model: 'text-embedding-3-small',
        input: text,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      },
    );
    return response.data.data[0].embedding;
  }

  cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (normA * normB);
  }

  async findAnswer(question: string): Promise<string> {
    const userEmbedding = await this.getEmbedding(question);

    let bestMatch = { score: -1, answer: 'No good answer found.' };

    for (const item of faqData) {
      const qEmbedding = await this.getEmbedding(item.question);
      const score = this.cosineSimilarity(userEmbedding, qEmbedding);
      if (score > bestMatch.score) {
        bestMatch = { score, answer: item.answer };
      }
    }

    return bestMatch.answer;
  }
}

// (async () => {
//   const sut = new FaqService();

//   const response = await sut.findAnswer('Where to find Node?');

//   console.log('The best answer is:\n', response);
// })();
