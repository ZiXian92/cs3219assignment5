/**
 * server/api/apirouter.ts
 * Defines the router used to handle all API routes.
 * @author zixian92
 */

'use strict';
import { Router } from 'express';
import { ContributorRouter } from './contributors';
import { RepoRouter } from './repository';

export const APIRouter: Router = Router();

APIRouter.use('/contributors', ContributorRouter);
APIRouter.use('/repos', RepoRouter);
