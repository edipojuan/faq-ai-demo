import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

// Mock NestFactory
const mockApp = {
  useGlobalFilters: jest.fn(),
  listen: jest.fn().mockResolvedValue(undefined),
};

const mockNestFactory = {
  create: jest.fn().mockResolvedValue(mockApp),
};

jest.mock('@nestjs/core', () => ({
  NestFactory: mockNestFactory,
}));

// Mock GlobalExceptionFilter
const mockGlobalExceptionFilter = jest.fn().mockImplementation(() => ({}));
jest.mock('./common/filters/global-exception.filter', () => ({
  GlobalExceptionFilter: mockGlobalExceptionFilter,
}));

// Import bootstrap after mocks are set up
const { bootstrap } = require('./main');

describe('Main Bootstrap', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    mockApp.useGlobalFilters.mockClear();
    mockApp.listen.mockClear();
    mockNestFactory.create.mockClear();
    mockGlobalExceptionFilter.mockClear();
    
    // Reset mock implementations
    mockNestFactory.create.mockResolvedValue(mockApp);
    mockApp.listen.mockResolvedValue(undefined);
    
    // Reset environment variables
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('bootstrap', () => {
    it('should create NestJS application with AppModule', async () => {
      await bootstrap();

      expect(mockNestFactory.create).toHaveBeenCalledWith(AppModule);
      expect(mockNestFactory.create).toHaveBeenCalledTimes(1);
    });

    it('should configure global exception filter', async () => {
      await bootstrap();

      expect(mockGlobalExceptionFilter).toHaveBeenCalledTimes(1);
      expect(mockApp.useGlobalFilters).toHaveBeenCalledWith(expect.any(Object));
      expect(mockApp.useGlobalFilters).toHaveBeenCalledTimes(1);
    });

    it('should listen on default port 3000 when PORT env var is not set', async () => {
      delete process.env.PORT;

      await bootstrap();

      expect(mockApp.listen).toHaveBeenCalledWith(3000);
      expect(mockApp.listen).toHaveBeenCalledTimes(1);
    });

    it('should listen on PORT environment variable when set', async () => {
      process.env.PORT = '8080';

      await bootstrap();

      expect(mockApp.listen).toHaveBeenCalledWith('8080');
      expect(mockApp.listen).toHaveBeenCalledTimes(1);
    });

    it('should handle PORT as undefined and use default 3000', async () => {
      process.env.PORT = undefined;

      await bootstrap();

      expect(mockApp.listen).toHaveBeenCalledWith(3000);
    });

    it('should handle empty PORT string and use default 3000', async () => {
      process.env.PORT = '';

      await bootstrap();

      expect(mockApp.listen).toHaveBeenCalledWith(3000);
    });

    it('should execute all bootstrap steps in correct order', async () => {
      const callOrder: string[] = [];

      mockNestFactory.create.mockImplementation(async () => {
        callOrder.push('create');
        return mockApp;
      });

      mockApp.useGlobalFilters.mockImplementation(() => {
        callOrder.push('useGlobalFilters');
      });

      mockApp.listen.mockImplementation(async () => {
        callOrder.push('listen');
      });

      await bootstrap();

      expect(callOrder).toEqual(['create', 'useGlobalFilters', 'listen']);
    });

    it('should handle NestFactory.create rejection', async () => {
      const error = new Error('Failed to create app');
      mockNestFactory.create.mockRejectedValue(error);

      await expect(bootstrap()).rejects.toThrow('Failed to create app');
    });

    it('should handle app.listen rejection', async () => {
      const error = new Error('Failed to start server');
      mockApp.listen.mockRejectedValue(error);

      await expect(bootstrap()).rejects.toThrow('Failed to start server');
    });

    it('should return Promise<void>', async () => {
      const result = await bootstrap();

      expect(result).toBeUndefined();
    });
  });
});
