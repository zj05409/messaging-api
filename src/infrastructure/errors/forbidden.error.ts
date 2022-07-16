import { StatusCodes } from 'http-status-codes';

import { ApiError } from './api.error';

class ForbiddenError extends ApiError {
  constructor() {
    super(StatusCodes.FORBIDDEN, 'forbidden', `Illegal operation.`);
  }
}

export { ForbiddenError };
