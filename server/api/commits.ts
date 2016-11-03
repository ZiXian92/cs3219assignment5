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
  let requestor: string = req['user']? req['user'].user: undefined;

  // Basic request info processing in case we need to perform the API call
  let reqObj: RepoRequest = {
    repo: { owner: req.params.owner, name: req.params.repo },
    data: {
      branch: req.query.branch,
      path: req.query.path,
      author: req.query.author,
      since: req.query.since,
      until: req.query.until
    }
  };
  for(var k in reqObj.data) if(!reqObj.data[k]) delete reqObj.data[k];
  if(!!reqObj.data.since) reqObj.data.since = moment(reqObj.data.since).format();
  if(!!reqObj.data.until) reqObj.data.until = moment(reqObj.data.until).format();

  // Fetch cached result and user's access token
  // All redis erros are logged but does not result in reject because
  // we can fall back to uncached, unauthenticated requests.
  connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(redisKey, (err: any, val: string): any => {
      if(err){ console.log('Unable to retrieve cached result'); console.log(err); }
      if(val) return resolve({ val });
      if(requestor) conn.get(requestor, (err: any, token: string): any => {
        if(err){ console.log(`Unable to retrieve access token for ${requestor}`); console.log(err); }
        resolve({ val, token });
      });
      else return resolve({});
    })
  )).then(({val = null, token = null}): any => {
    if(val) return res.json(JSON.parse(val));
    else{
      if(token) reqObj.requestor = token;
      return new PromisePipe(getCommits, getCommitUrls, createResponseWrapper(reqObj), getCommitDetails, processCommitDetails)
      .processData(reqObj)
      .then((commits: any[]): void => {
        // Cache results asynchronously. It's ok if fails.
        connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
          conn.setex(redisKey, ttl, JSON.stringify(commits), (err: any): any => err? reject(err): resolve())
        )).then(() => console.log('Commit history cached'))
        .catch((err: any): void => { console.log('Failed to cache commit history'); console.log(err); });
        res.json(commits);
      });
    }
  }).catch((err: any): void => {
    console.log(err);
    res.sendStatus(500);
  });
});
