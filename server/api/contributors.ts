/**
 * server/api/contributors.ts
 * Contributors API route handler.
 * @author zixian92
 */

'use strict';
import { Router, Request, Response, NextFunction } from 'express';
import Repository from '../../dataentities/repository';
import { ContributorFetcher } from '../../datalogic/fetchers/contributorfetcher';
import { PromisePipe } from '../../datalogic/promise.pipe';
import { GitDataProcessingPipe } from '../../datalogic/gitdataprocessingpipe';
import { ContributorTotalProcessor } from '../../datalogic/processors/contributortotalprocessor';
import { ContributorTotalStats } from '../../dataentities/contributortotalstats';

export const ContributorRouter = Router();

ContributorRouter.get('/:owner/:repo', (req: Request, res: Response, next: NextFunction): void => {
  let repo: Repository = new Repository(req.params.owner, req.params.repo);
  let contribfetcher: ContributorFetcher = new ContributorFetcher();
  let pipe: GitDataProcessingPipe = new GitDataProcessingPipe(new ContributorTotalProcessor());
  pipe.processData(contribfetcher.get(repo))
  .then((stats: ContributorTotalStats[]): void => {
    res.json(stats);
  });
});
