/**
 * server/api/repository.ts
 * Defines the route handler for handling requests to get repository listing
 * or basic data.
 * @autohor zixian92
 */

'use strict';
import { Router, Request, Response, NextFunction } from 'express';
import * as Promise from 'bluebird';
import { RedisClient } from 'redis';
import { PromisePipe } from '../../datalogic/promise.pipe';
import { getRepos } from '../../datalogic/fetchers/repos.fetcher';
import { formatReposList } from '../../datalogic/processors/repos';
import { Repository } from '../../dataentities/repository';
import { connectToRedisAndDo } from '../redis';

export const RepoRouter: Router = Router();

RepoRouter.get('/:owner', (req: Request, res: Response, next: NextFunction): void => {
  let owner: string = req.params.owner;
  let redisKey: string = `/api/repos/${owner}`;
  let user: string = req['user']? req['user'].user: undefined;
  let ttl: number = 3600;
  let reqObj: any = { owner };

  connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(redisKey, (err: any, cached: string): any => {
      if(err){ console.log(`Failed to get cached repositories of ${owner}`); console.log(err); }
      if(cached) return resolve(cached);
      if(user) conn.get(user, (err: any, token: string): any => {
        if(err){ console.log(`Failed to get access token for ${user}`); console.log(err); }
        return resolve({ token });
      });
      else return resolve({});
    })
  )).then(({ cached = null, token = null }): any => {
    if(cached) return res.json(JSON.parse(cached));
    if(token) reqObj.requestor = token;
    return new PromisePipe(getRepos, formatReposList).processData(reqObj)
    .then((repos: Repository[]): void => {
      connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
        conn.setex(redisKey, ttl, JSON.stringify(repos), (err: any): void => {
          if(err){ console.log(`Failed to cache repositories of ${owner}`); console.log(err); }
          resolve();
        })
      ));
      res.json(repos);
    });
  }).catch((err: any): void => {
    console.log(err); res.sendStatus(500);
  });
});
