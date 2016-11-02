/**
 * server/api/me.ts
 * Endpoint router for authenticated user.
 * @author zixian92
 */

'use strict';
import { Router, Request, Response, NextFunction } from 'express';

export const MeRouter = Router();

MeRouter.get('/me', (req: Request, res: Response, next: NextFunction): void => {
  let username: string = req['user'].user;
  if(!username) res.status(401);
  else res.json(username);
});
