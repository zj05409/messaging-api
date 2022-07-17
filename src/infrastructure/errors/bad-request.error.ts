import { StatusCodes } from 'http-status-codes';

import { ApiError } from './api.error';

class BadRequestError extends ApiError {
  constructor(message = '') {
    super(StatusCodes.BAD_REQUEST, 'forbidden', `Illegal operation:` + message);
  }
}

export { BadRequestError };
