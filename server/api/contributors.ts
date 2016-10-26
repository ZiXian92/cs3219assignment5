/**
 * server/api/contributors.ts
 * Contributors API route handler.
 * @author zixian92
 */

'use strict';
import { Router, Request, Response, NextFunction } from 'express';
import { Repository } from '../../dataentities/repository';
import { RepoRequest } from '../../dataentities/repo.data.request';
import { ContributorTotalStats } from '../../dataentities/contributor.total.stats';
import { getContributors } from '../../datalogic/fetchers/contributor.fetcher';
import { computeContributorTotal } from '../../datalogic/processors/contributor.total';
import { extractContributorName } from '../../datalogic/processors/contributor.name';
import { PromisePipe } from '../../datalogic/promise.pipe';

export const ContributorRouter = Router();

// Get list of contributor names only.
ContributorRouter.get('/:owner/:repo', (req: Request, res: Response, next: NextFunction): void => {
  let repo: Repository = { owner: req.params.owner, name: req.params.repo };
  let pipe: PromisePipe = new PromisePipe(
    getContributors, extractContributorName
  );
  pipe.processData({ repo }).then((responseData: string[]): any => res.json(responseData))
  .catch(err => console.log(err));
});

ContributorRouter.get('/:owner/:repo/summary', (req: Request, res: Response, next: NextFunction): void => {
  let repo: Repository = { owner: req.params.owner, name: req.params.repo };
  let pipe: PromisePipe = new PromisePipe(
    getContributors, computeContributorTotal
  );
  pipe.processData({
    repo
  }).then((responseData: ContributorTotalStats[]): any => res.json(responseData));
});
