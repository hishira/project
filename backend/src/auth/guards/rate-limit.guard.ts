import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly store: RateLimitStore = {};
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    // Default: 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const key = this.getKey(request);

    const now = Date.now();
    const current = this.store[key];

    if (!current || current.resetTime < now) {
      // Reset or create new entry
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
      return true;
    }

    if (current.count >= this.maxAttempts) {
      const resetInSeconds = Math.ceil((current.resetTime - now) / 1000);
      throw new HttpException(
        `Too many attempts. Try again in ${resetInSeconds} seconds.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    current.count++;
    return true;
  }

  private getKey(request: Request): string {
    // Use IP address as the key
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';
    const route = request.route?.path || request.url;
    return `${ip}:${route}`;
  }

  // Clean up expired entries periodically
  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }
}
