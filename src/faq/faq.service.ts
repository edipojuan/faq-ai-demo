import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as faqData from './../../data/faq.json';

@Injectable()
export class FaqService {
  /**
   * Instance of the ConfigService used to access application configuration values.
   * Injected via dependency injection to provide access to environment variables and configuration settings.
   */
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  /**
   * Generates an embedding vector for the provided text using the OpenAI API.
   *
   * @param text - The input string to generate an embedding for.
   * @returns A promise that resolves to an array of numbers representing the embedding vector.
   * @throws Will throw an error if the OPENAI_API_KEY environment variable is not set or if the API request fails.
   *
   * @todo Store precomputed embeddings in a database to avoid repeated calls to OpenAI.
   *       This will reduce response time and API costs, especially with large datasets.
   */
  async getEmbedding(text: string): Promise<number[]> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error('The OPENAI_API_KEY environment variable is not set!');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        model: 'text-embedding-3-small',
        input: text,
      },
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      },
    );
    return response.data.data[0].embedding;
  }

  cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    /**
     * Calculates the dot product of two numeric vectors.
     *
     * @param vectorA - The first vector as an array of numbers.
     * @param vectorB - The second vector as an array of numbers, must be the same length as `vectorA`.
     * @returns The dot product of the two vectors as a number.
     *
     * @throws {Error} If the vectors are not of the same length.
     */
    const dotProduct = vectorA.reduce((sum, value, index) => {
      return sum + value * vectorB[index];
    }, 0);

    /**
     * Calculates the magnitude (Euclidean norm) of the vector `vectorA`.
     * This is done by taking the square root of the sum of the squares of its elements.
     *
     * @remarks
     * The magnitude is useful for normalizing vectors or computing distances in vector space.
     *
     * @example
     * ```typescript
     * const vectorA = [3, 4];
     * // magnitudeA will be 5
     * ```
     */
    const magnitudeA = Math.sqrt(
      vectorA.reduce((sum, value) => sum + value * value, 0),
    );

    const magnitudeB = Math.sqrt(
      vectorB.reduce((sum, value) => sum + value * value, 0),
    );

    /**
     * Calculates the cosine similarity between two vectors.
     * The result is a value between -1 and 1, where 1 indicates identical direction,
     * 0 indicates orthogonality, and -1 indicates opposite direction.
     *
     * @remarks
     * The similarity is computed as the dot product of the two vectors divided by the product of their magnitudes.
     *
     * @example
     * ```typescript
     * const similarity = dotProduct / (magnitudeA * magnitudeB);
     * ```
     */
    const similarity = dotProduct / (magnitudeA * magnitudeB);

    return similarity;
  }

  /**
   * Finds the most relevant answer from the FAQ data based on the user's question.
   *
   * This method generates an embedding for the user's question and compares it to the embeddings
   * of each FAQ question using cosine similarity. It returns the answer corresponding to the FAQ
   * question with the highest similarity score. If no good match is found, a default message is returned.
   *
   * @param userQuestion - The question provided by the user.
   * @returns A promise that resolves to the best matching answer as a string.
   */
  async findAnswer(userQuestion: string): Promise<string> {
    const userQuestionEmbedding = await this.getEmbedding(userQuestion);

    let bestMatch = { score: -1, answer: 'No good answer found.' };

    for (const item of faqData) {
      const faqQuestionEmbedding = await this.getEmbedding(item.question);
      const score = this.cosineSimilarity(
        userQuestionEmbedding,
        faqQuestionEmbedding,
      );
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
