/**
 * server/api/apirouter.ts
 * Defines the router used to handle all API routes.
 * @author zixian92
 */

'use strict';
import { Router } from 'express';
import { ContributorRouter } from './contributors';
import { RepoRouter } from './repository';
import { UserRouter } from './users';
import { FilesRouter } from './files';

export const APIRouter: Router = Router();

APIRouter.use('/contributors', ContributorRouter);
APIRouter.use('/repos', RepoRouter);
APIRouter.use('/users', UserRouter);
APIRouter.use('/trees', FilesRouter);
