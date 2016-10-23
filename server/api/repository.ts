/**
 * server/api/repository.ts
 * Defines the route handler for handling requests to get repository listing
 * or basic data.
 * @autohor zixian92
 */

'use strict';
import { Router, Request, Response, NextFunction } from 'express';
import { PromisePipe } from '../../datalogic/promise.pipe';
import { getRepos } from '../../datalogic/fetchers/repos.fetcher';
import { formatReposList } from '../../datalogic/processors/repos';
import { Repository } from '../../dataentities/repository';

export const RepoRouter: Router = Router();

RepoRouter.get('/:owner', (req: Request, res: Response, next: NextFunction): void => {
  new PromisePipe(getRepos, formatReposList).processData(req.params.owner)
    .then((repos: Repository[]): any => res.json(repos), (err: any): void => {
      console.log('Error getting user repositories.');
      console.log(err);
      res.json([]);
    });
});
