/**
 * server/api/users.ts
 * Defines user-related route handler.
 * @author ZiXian92
 */

'use strict';
import { Router, Request, Response, NextFunction } from 'express';
import { PromisePipe } from '../../datalogic/promise.pipe';
import { getUsers } from '../../datalogic/fetchers/users.fetcher';
import { formatUsersList } from '../../datalogic/processors/users';

export const UserRouter = Router();

UserRouter.get('/', (req: Request, res: Response, next: NextFunction): void => {
  new PromisePipe(getUsers, formatUsersList).processData()
    .then((users: string[]): any => res.json(users));
});
