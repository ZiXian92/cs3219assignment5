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
import { CommitsRouter } from './commits';
import { MeRouter } from './me';
import { SubscribeRouter } from './subscribe';

export const APIRouter: Router = Router();

APIRouter.use('/contributors', ContributorRouter);
APIRouter.use('/repos', RepoRouter);
APIRouter.use('/users', UserRouter);
APIRouter.use('/trees', FilesRouter);
APIRouter.use('/commits', CommitsRouter);
APIRouter.use('/me', MeRouter);
APIRouter.use('/subscribe', SubscribeRouter);
APIRouter.use('*', (req, res, next) => res.sendStatus(404));
