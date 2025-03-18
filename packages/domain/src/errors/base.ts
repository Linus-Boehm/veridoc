export abstract class BaseError extends Error {
  protected readonly _cause: Error | undefined;
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = this.constructor.name;
    this._cause = cause;
  }

  get cause() {
    return this._cause;
  }

  getHttpErrorCode(): number {
    return 500;
  }
}
