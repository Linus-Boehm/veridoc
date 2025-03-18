import { BaseError } from './base';

export class ForbiddenError extends BaseError {
  constructor(message?: string, cause?: Error) {
    const defaultMessage = 'You do not have permission to access this resource';
    super(message ?? defaultMessage, cause);
    this.name = 'ForbiddenError';
  }

  getHttpErrorCode(): number {
    return 403;
  }
}
