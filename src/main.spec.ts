import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

describe('bootstrap', () => {
  let listenMock: jest.Mock;

  beforeEach(() => {
    listenMock = jest.fn().mockResolvedValue(undefined);
    (NestFactory.create as jest.Mock).mockResolvedValue({ listen: listenMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.PORT;
  });

  it('should create the app and listen on the default port if PORT is not set', async () => {
    const { bootstrap } = await import('./main');
    await bootstrap();
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(listenMock).toHaveBeenCalledWith(3000);
  });

  it('should create the app and listen on the port specified by PORT env variable', async () => {
    process.env.PORT = '4000';
    const { bootstrap } = await import('./main');
    await bootstrap();
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(listenMock).toHaveBeenCalledWith('4000');
  });
});
