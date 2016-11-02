/**
 * server/api/me.ts
 * Endpoint router for authenticated user.
 * @author zixian92
 */

'use strict';
import { Router, Request, Response, NextFunction } from 'express';

export const MeRouter = Router();

MeRouter.get('/', (req: Request, res: Response, next: NextFunction): void => {
  let user: any = req['user'];
  console.log(user);
  if(!user) res.sendStatus(401);
  else res.json(user.user);
});
