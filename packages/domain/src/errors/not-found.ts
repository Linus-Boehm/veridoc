import { BaseError } from "./base";

export class NotFoundError extends BaseError {
  constructor(message?: string, cause?: Error) {
    const defaultMessage = 'The requested resource was not found';
    super(message ?? defaultMessage, cause);
    this.name = 'NotFoundError';
  }

  getHttpErrorCode(): number {
    return 404;
  }
}


