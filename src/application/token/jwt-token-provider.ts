import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';

import { TokenConfig } from '@/application/config/token.config';
import { Token, TokenType } from '@/application/token/token';
import { TokenProvider } from '@/application/token/token-provider.interface';

class JwtTokenProvider implements TokenProvider {
  private readonly jwtAlgorithm: any = 'HS512';

  private readonly jwtSecret: string = TokenConfig.JWT_SECRET;

  private readonly jwtExpiration: number = TokenConfig.JWT_EXPIRATION;

  private readonly jwtRefreshExpiration: number = TokenConfig.JWT_REFRESH_EXPIRATION;

  createAccessToken(userId: string, username: string, email: string, roles: string[]): Token {
    const expiration = this.getAccessTokenExpiration();
    return this.createToken(TokenType.ACCESS, expiration, userId, username, email, roles);
  }

  createRefreshToken(userId: string, username: string, email: string): Token {
    const expiration = this.getRefreshTokenExpiration();
    return this.createToken(TokenType.REFRESH, expiration, userId, username, email);
  }

  validateAccessToken(token: string): boolean {
    return this.validateToken(TokenType.ACCESS, token);
  }

  validateRefreshToken(token: string): boolean {
    return this.validateToken(TokenType.REFRESH, token);
  }

  parseToken(token: string): Token | undefined {
    try {
      const { type, userId, username, email, roles, exp } = <any>jwt.verify(token, this.jwtSecret, {
        algorithms: [this.jwtAlgorithm]
      });
      return new Token(type, token, exp, userId, username, email, roles);
    } catch {
      return undefined;
    }
  }

  getTokenFromHeader(header?: string): string {
    if (header) {
      return header.replace(`Bearer `, '');
    }
    return '';
  }

  private createToken(type: TokenType, exp: number, userId: string, username: string, email: string, roles?: string[]) {
    const jwtToken = jwt.sign({ type, userId, username, email, roles, exp }, this.jwtSecret, {
      algorithm: this.jwtAlgorithm
    });
    return new Token(TokenType.ACCESS, jwtToken, exp, userId, username, email, roles);
  }

  private validateToken(targetType: TokenType, token: string) {
    try {
      const { type } = <any>jwt.verify(token, this.jwtSecret, {
        algorithms: [this.jwtAlgorithm]
      });
      return type === targetType;
    } catch {
      return false;
    }
  }

  private getAccessTokenExpiration(): number {
    return Math.floor(
      DateTime.utc()
        .plus({ millisecond: this.jwtExpiration * 3_600_000 * 24 * 365 })
        .toSeconds()
    );
  }

  private getRefreshTokenExpiration(): number {
    return Math.floor(
      DateTime.utc()
        .plus({ millisecond: this.jwtRefreshExpiration * 3_600_000 * 24 * 365 * 10 })
        .toSeconds()
    );
  }
}

export { JwtTokenProvider };
