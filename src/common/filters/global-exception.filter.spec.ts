import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockHost: ArgumentsHost;
  let mockResponse: any;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    } as any;
  });

  it('should handle HttpException and return its status', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.FORBIDDEN,
        timestamp: expect.any(String),
      })
    );
  });

  it('should handle non-HttpException and return 500', () => {
    const exception = new Error('Some error');
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
      })
    );
  });

  it('should return a valid ISO timestamp', () => {
    const exception = new Error('Test');
    filter.catch(exception, mockHost);
    const jsonArg = mockResponse.json.mock.calls[0][0];
    expect(new Date(jsonArg.timestamp).toISOString()).toBe(jsonArg.timestamp);
  });
});
