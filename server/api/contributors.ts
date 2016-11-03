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
import { weeklyContributions } from '../../datalogic/processors/contributor.weekly';
import { PromisePipe } from '../../datalogic/promise.pipe';
import { connectToRedisAndDo } from '../redis';

export const ContributorRouter = Router();

// Get list of contributor names only.
ContributorRouter.get('/:owner/:repo', (req: Request, res: Response, next: NextFunction): void => {
  let repo: Repository = { owner: req.params.owner, name: req.params.repo };
  let redisKey: string = `/api/contributors/${repo.owner}/${repo.name}`;
  let ttl: number = 3600;
  let user: string = req['user']? req['user'].user: null;
  let reqObj: RepoRequest = { repo };
  // if(user) reqObj.requestor = user;

  // Get cached result. Fall back to API call if fails.
  connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(redisKey, (err: any, contributors: string) => {
      if(err){ console.log('Unable to get cached result'); console.log(err); }
      if(contributors) resolve({ contributors });
      if(user) conn.get(user, (err: any, token: string): any => {
        if(err){ console.log(`Unable to get access token for ${user}`); console.log(err); }
        resolve({ contributors, token });
      });
    })
  )).then(({contributors = null, token = null}): any => {
    if(contributors){ return res.json(JSON.parse(contributors)); }
    if(token) reqObj.requestor = token;
    return new PromisePipe(getContributors, extractContributorName).processData(reqObj)
    .then((contributors: string[]): void => {
      // Asynchronously cache result. It's ok if it fails.
      connectToRedisAndDo((conn: RedisClient) => new Promise((resolve, reject): any =>
        conn.setex(redisKey, ttl, JSON.stringify(contributors), (err: any): any => err? reject(err): resolve())
      )).catch(err => console.log(err));
      res.json(contributors);
    });
  }).catch((err: any): void => {
    console.log(err);
    res.sendStatus(500);
  });
});

ContributorRouter.get('/:owner/:repo/summary', (req: Request, res: Response, next: NextFunction): void => {
  let repo: Repository = { owner: req.params.owner, name: req.params.repo };
  let redisKey: string = `/api/contributors/${repo.owner}/${repo.name}/summary`;
  let ttl: number = 3600;
  let user: string = req['user']? req['user'].user: null;
  let reqObj: RepoRequest = { repo };
  if(user) reqObj.requestor = user;
  connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(redisKey, (err: any, summary: string): any => err? reject(err): resolve(summary))
  )).then((summary: string): any => {
    if(summary) return res.json(JSON.parse(summary));
    return new PromisePipe(getContributors, computeContributorTotal).processData(reqObj)
    .then((responseData: ContributorTotalStats[]): void => {
      connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject): any =>
        conn.setex(redisKey, ttl, JSON.stringify(responseData), (err: any): any => err? reject(err): resolve())
      )).catch(err => console.log(err));
      res.json(responseData);
    });
  }).catch((err: any): void => {
    console.log(err); res.sendStatus(500);
  });
});

ContributorRouter.get('/:owner/:repo/weekly', (req: Request, res: Response, next: NextFunction): void => {
  let repo: Repository = { owner: req.params.owner, name: req.params.repo };
  let redisKey: string = `/api/contributors/${repo.owner}/${repo.name}/weekly`;
  let ttl: number = 3600;
  let user: string = req['user']? req['user'].user: null;
  let reqObj: RepoRequest = { repo };
  if(user) reqObj.requestor = user;
  connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject): any =>
    conn.get(redisKey, (err: any, val: string): any => err? reject(err): resolve(val))
  )).then((val: string): any => {
    if(val) return res.json(JSON.parse(val));
    return new PromisePipe(getContributors, weeklyContributions).processData(reqObj)
    .then((contributors: any[]): void => {
      connectToRedisAndDo((conn:RedisClient): Promise<any> => new Promise((resolve, reject): any =>
        conn.setex(redisKey, ttl, JSON.stringify(contributors), (err: any): any => err? reject(err): resolve())
      )).catch(err => console.log(err));
      res.json(contributors);
    });
  }).catch((err: any): void => {
    console.log(err);
    res.sendStatus(500);
  });
});
