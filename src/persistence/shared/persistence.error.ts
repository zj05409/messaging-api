abstract class BaseError extends Error {
  public errorCode: string;

  public errorMessage: string;

  protected constructor(errorCode: string, errorMessage: string) {
    super(errorMessage);
    this.name = new.target.name;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }
}

class PersistenceError extends BaseError {
  constructor() {
    super('PersistenceError', 'persistence failed');
  }
}

export { PersistenceError };
