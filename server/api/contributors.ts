/**
 * server/api/contributors.ts
 * Contributors API route handler.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import { RedisClient } from 'redis';
import { Router, Request, Response, NextFunction } from 'express';
import { Repository } from '../../dataentities/repository';
import { RepoRequest } from '../../dataentities/repo.data.request';
import { ContributorTotalStats } from '../../dataentities/contributor.total.stats';
import { getContributors } from '../../datalogic/fetchers/contributor.fetcher';
import { computeContributorTotal } from '../../datalogic/processors/contributor.total';
import { extractContributorName } from '../../datalogic/processors/contributor.name';
import { PromisePipe } from '../../datalogic/promise.pipe';
import { connectToRedisAndDo } from '../redis';

export const ContributorRouter = Router();

// Get list of contributor names only.
ContributorRouter.get('/:owner/:repo', (req: Request, res: Response, next: NextFunction): void => {
  let repo: Repository = { owner: req.params.owner, name: req.params.repo };
  let redisKey: string = `/api/contributors/${repo.owner}/${repo.name}`;
  let ttl: number = 3600;
  connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(redisKey, (err: any, contributors: string) => {
      if(err) reject(err);
      else resolve(contributors);
    })
  )).then((contributors: string): any => {
    if(contributors){
      return res.json(JSON.parse(contributors));
    }
    return new PromisePipe(getContributors, extractContributorName).processData({ repo })
    .then((contributors: string[]): Promise<any> =>
      connectToRedisAndDo((conn: RedisClient) => new Promise((resolve, reject): any =>
        conn.setex(redisKey, ttl, JSON.stringify(contributors), (err: any): any => err? reject(err): resolve())))
      .then((): any => res.json(contributors)));
  }).catch((err: any): void => {
    console.log(err);
    res.status(500);
  });
});

ContributorRouter.get('/:owner/:repo/summary', (req: Request, res: Response, next: NextFunction): void => {
  let repo: Repository = { owner: req.params.owner, name: req.params.repo };
  let redisKey: string = `/api/contributors/${repo.owner}/${repo.name}/summary`;
  let ttl: number = 3600;
  connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(redisKey, (err: any, summary: string) => {
      if(err) reject(err);
      else resolve(summary);
    })
  )).then((summary: string): any => {
    if(summary){
      return res.json(JSON.parse(summary));
    } else {
      return new PromisePipe(getContributors, computeContributorTotal).processData({ repo })
      .then((responseData: ContributorTotalStats[]): any =>
        connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject): any =>
          conn.setex(redisKey, ttl, JSON.stringify(responseData), (err: any): any => err? reject(err): resolve()))
        .then((): any => res.json(responseData))
      ));
    }
  }).catch((err: any): void => {
    console.log(err); res.status(500);
  });
});
