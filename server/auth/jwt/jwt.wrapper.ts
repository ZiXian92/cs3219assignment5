/**
 * server/auth/jwt/jwt.wrapper.ts
 * Defines the wrapper component for generating and verifying JWT.
 * This is to abstract away unnecessary details from higher level.
 * @author zixian92
 */

import { sign, verify } from 'jsonwebtoken';
import { jwtconf } from './jwtconf';

export function generateToken(payload: any): string {
  return sign(payload, jwtconf.secret);
}

export function verifyToken(token: string): any {
  return verify(token, jwtconf.secret);
}
