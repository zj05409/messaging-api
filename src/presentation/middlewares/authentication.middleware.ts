import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';

import { tokenProvider } from '@application/token';
import { UnauthorizedError } from '@infrastructure/errors';

class AuthenticationMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, _response: Response, next: NextFunction): void {
    const token = tokenProvider.getTokenFromHeader(request.headers.authorization);

    if (!tokenProvider.validateAccessToken(token)) {
      throw new UnauthorizedError();
    }

    next();
  }
}

export { AuthenticationMiddleware };
