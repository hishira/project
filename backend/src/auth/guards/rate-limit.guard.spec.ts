import { ExecutionContext, HttpException } from '@nestjs/common';
import { RateLimitGuard } from './rate-limit.guard';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let mockExecutionContext: ExecutionContext;

  const mockRequest = {
    ip: '127.0.0.1',
    route: { path: '/auth/login' },
    url: '/auth/login',
  };

  beforeEach(() => {
    guard = new RateLimitGuard(3, 5000); // 3 attempts per 5 seconds for testing
    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
  });

  afterEach(() => {
    // Clear the internal store
    (guard as any).store = {};
  });

  describe('canActivate', () => {
    it('should allow the first request', () => {
      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should allow multiple requests within limit', () => {
      expect(guard.canActivate(mockExecutionContext)).toBe(true);
      expect(guard.canActivate(mockExecutionContext)).toBe(true);
      expect(guard.canActivate(mockExecutionContext)).toBe(true);
    });

    it('should throw HttpException when limit exceeded', () => {
      // Exhaust the limit
      guard.canActivate(mockExecutionContext);
      guard.canActivate(mockExecutionContext);
      guard.canActivate(mockExecutionContext);

      // This should throw
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        HttpException,
      );
    });

    it('should reset count after window expires', async () => {
      const shortWindowGuard = new RateLimitGuard(2, 100); // 100ms window

      // Exhaust the limit
      shortWindowGuard.canActivate(mockExecutionContext);
      shortWindowGuard.canActivate(mockExecutionContext);

      // Should throw on third attempt
      expect(() => shortWindowGuard.canActivate(mockExecutionContext)).toThrow(
        HttpException,
      );

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should allow request again
      expect(shortWindowGuard.canActivate(mockExecutionContext)).toBe(true);
    });

    it('should handle different IP addresses separately', () => {
      const mockRequest2 = { ...mockRequest, ip: '192.168.1.1' };
      const mockExecutionContext2 = {
        switchToHttp: () => ({
          getRequest: () => mockRequest2,
        }),
      } as ExecutionContext;

      // Exhaust limit for first IP
      guard.canActivate(mockExecutionContext);
      guard.canActivate(mockExecutionContext);
      guard.canActivate(mockExecutionContext);

      // Should throw for first IP
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        HttpException,
      );

      // Should still allow for second IP
      expect(guard.canActivate(mockExecutionContext2)).toBe(true);
    });

    it('should handle missing IP address gracefully', () => {
      const mockRequestNoIP = {
        route: { path: '/auth/login' },
        url: '/auth/login',
      };
      const mockExecutionContextNoIP = {
        switchToHttp: () => ({
          getRequest: () => mockRequestNoIP,
        }),
      } as ExecutionContext;

      expect(guard.canActivate(mockExecutionContextNoIP)).toBe(true);
    });
  });
});
