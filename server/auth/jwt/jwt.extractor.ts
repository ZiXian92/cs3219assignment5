/**
 * server/auth/jwt.jwt.extractor.ts
 * Defines middleware to get requestor identity from JWT token in request header.
 * @author zixian92
 */

'use strict';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './jwt.wrapper';

export function JwtExtractor(req: Request, res: Response, next: NextFunction): any {
  let authHeader: string = req.get('Authorization');
  if(authHeader && /^token[\s]+[\w\.]+/.test(authHeader)){
    let token: string = authHeader.replace(/token[\s]+/, '');
    try{
      req['user'] = verifyToken(token);
    } catch(err) { console.log(err); }
  }
  next();
}
