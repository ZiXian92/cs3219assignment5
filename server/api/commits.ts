/**
 * Defines the commit route handler
 * @author zixian92
 */

'use strict';
import { Router, Request, Response, NextFunction } from 'express';
import * as Promise from 'bluebird';
import * as moment from 'moment';
import { RedisClient } from 'redis';
import { connectToRedisAndDo } from '../redis';
import { RepoRequest } from '../../dataentities/repo.data.request';
import { PromisePipe } from '../../datalogic/promise.pipe';
import { getCommits } from '../../datalogic/fetchers/commits';
import { getCommitUrls } from '../../datalogic/processors/commit.url';
import { createResponseWrapper } from '../../datalogic/processors/response.to.request';
import { getCommitDetails } from '../../datalogic/fetchers/commit.details';
import { processCommitDetails } from '../../datalogic/processors/commit.details';

export const CommitsRouter = Router();

CommitsRouter.get('/:owner/:repo/changes', (req: Request, res: Response, next: NextFunction): void => {
  let redisKey: string = req.originalUrl;
  let ttl: number = 3600;
  connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(redisKey, (err: any, val: string): any => err? reject(err): resolve(val))
  )).then((val: string): any => {
    if(val){
      return res.json(JSON.parse(val));
    } else{
      let requestor: string = req['user']? req['user']['name']: undefined;
      return (requestor? connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
        conn.get(requestor, (err: any, token: string): any => err? reject(err): resolve(token))
      )): Promise.resolve(requestor)).then((token: string): any => {
        let reqObj: any = {
          repo: { owner: req.params.owner, name: req.params.repo },
          requestor: token,
          data: {
            branch: req.query.branch,
            path: req.query.path,
            author: req.query.author,
            since: req.query.since,
            until: req.query.until
          }
        };
        if(!reqObj.token) delete reqObj.token;
        for(var k in reqObj.data) if(!reqObj.data[k]) delete reqObj.data[k];
        if(!!reqObj.data.since) reqObj.data.since = moment(reqObj.data.since).format();
        if(!!reqObj.data.until) reqObj.data.until = moment(reqObj.data.until).format();
        return new PromisePipe(getCommits, getCommitUrls, createResponseWrapper(reqObj), getCommitDetails, processCommitDetails)
        .processData(<RepoRequest>reqObj)
        .then((commits: any[]): any =>
          connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
            conn.setex(redisKey, ttl, JSON.stringify(commits), (err: any): any => err? reject(err): resolve())
          )).then((): any => res.json(commits))
        );
      });
    }
  }).catch((err: any): void => {
    console.log(err);
    res.status(500);
  });
});
