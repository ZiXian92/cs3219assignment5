/**
 * server/api/contributors.ts
 * Contributors API route handler.
 * @author zixian92
 */

'use strict';
import { Router, Request, Response, NextFunction } from 'express';
import { Repository } from '../../dataentities/repository';
import { RepoRequest } from '../../dataentities/repo.data.request';
import { getContributors } from '../../datalogic/fetchers/contributor.fetcher';
import { computeContributorTotal } from '../../datalogic/processors/contributor.total';
import { PromisePipe } from '../../datalogic/promise.pipe';

export const ContributorRouter = Router();

ContributorRouter.get('/:owner/:repo', (req: Request, res: Response, next: NextFunction): void => {
  let repo: Repository = { owner: req.params.owner, name: req.params.repo };
  let pipe: PromisePipe = new PromisePipe(
    getContributors, computeContributorTotal
  );
  pipe.processData({
    repo
  }).then((responseData: any): any => res.json(responseData));
});
