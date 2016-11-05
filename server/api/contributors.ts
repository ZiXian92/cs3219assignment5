/**
 * server/api/contributors.ts
 * Contributors API route handler.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import * as moment from 'moment';
import { RedisClient } from 'redis';
import { Router, Request, Response, NextFunction } from 'express';
import { Repository } from '../../dataentities/repository';
import { RepoRequest } from '../../dataentities/repo.data.request';
import { ContributorTotalStats } from '../../dataentities/contributor.total.stats';
import { WeeklyContribution } from '../../dataentities/weekly.contribution';
import { getContributors } from '../../datalogic/fetchers/contributor.fetcher';
import { computeContributorTotal } from '../../datalogic/processors/contributor.total';
import { extractContributorName } from '../../datalogic/processors/contributor.name';
import { weeklyContributions } from '../../datalogic/processors/contributor.weekly';
import { generateWeeklyContributionFilter, WeeklyContributionFilter } from '../../datalogic/processors/contributions.weekly.filter';
import { PromisePipe } from '../../datalogic/promise.pipe';
import { connectToRedisAndDo } from '../redis';
import { createResponseWrapper } from '../../datalogic/processors/response.to.request';

export const ContributorRouter = Router();

// Get list of contributor names only.
ContributorRouter.get('/:owner/:repo', (req: Request, res: Response, next: NextFunction): void => {
  let repo: Repository = { owner: req.params.owner, name: req.params.repo };
  let redisKey: string = `/api/contributors/${repo.owner}/${repo.name}`;
  let ttl: number = 3600;
  let user: string = req['user']? req['user'].user: null;
  let reqObj: RepoRequest = { repo };

  // Get cached result. Fall back to API call if fails.
  connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(redisKey, (err: any, contributors: string) => {
      if(err){ console.log('Unable to get cached result'); console.log(err); }
      if(contributors) return resolve({ contributors });
      if(user) conn.get(user, (err: any, token: string): any => {
        if(err){ console.log(`Unable to get access token for ${user}`); console.log(err); }
        return resolve({ contributors, token });
      });
      else return resolve({});
    })
  )).then(({contributors = null, token = null}): any => {
    if(contributors){ return res.json(JSON.parse(contributors)); }
    if(token) reqObj.requestor = token;
    return new PromisePipe(getContributors, extractContributorName).processData(reqObj)
    .then((contributors: string[]): void => {
      // Asynchronously cache result. It's ok if it fails.
      connectToRedisAndDo((conn: RedisClient) => new Promise((resolve, reject): any =>
        conn.setex(redisKey, ttl, JSON.stringify(contributors), (err: any): void => {
          if(err){
            console.log(`Failed to cache contributors of ${repo.owner}/${repo.name}`);
            console.log(err);
          }
          resolve();
        })
      ));
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

  connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(redisKey, (err: any, summary: string): any => {
      if(err){ console.log(`Failed to get cached contribution summary for ${repo.owner}/${repo.name}`); console.log(err); }
      if(summary) return resolve({ summary });
      if(user) conn.get(user, (err: any, token: string): any => {
        if(err){ console.log(`Failed to get access token for ${user}`); console.log(err); }
        return resolve({ summary, token });
      });
      else return resolve({});
    })
  )).then(({ summary = null, token = null }): any => {
    if(summary) return res.json(JSON.parse(summary));
    if(token) reqObj.requestor = token;
    return new PromisePipe(getContributors, computeContributorTotal).processData(reqObj)
    .then((responseData: ContributorTotalStats[]): void => {
      connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject): any =>
        conn.setex(redisKey, ttl, JSON.stringify(responseData), (err: any): any => {
          if(err){ console.log(`Failed to cache contribution summary for ${repo.owner}/${repo.name}`); console.log(err); }
          resolve();
        })
      ));
      res.json(responseData);
    });
  }).catch((err: any): void => {
    console.log(err); res.sendStatus(500);
  });
});

ContributorRouter.get('/:owner/:repo/weekly', (req: Request, res: Response, next: NextFunction): void => {
  let repo: Repository = { owner: req.params.owner, name: req.params.repo };
  let author: string = req.query.author;
  let since = moment(req.query.since);
  let until = moment(req.query.until);
  let redisKey: string = req.originalUrl;
  let ttl: number = 3600;
  let user: string = req['user']? req['user'].user: null;
  let reqObj: RepoRequest = { repo };
  let weeklyFilter: WeeklyContributionFilter = generateWeeklyContributionFilter({
    author, since: since.isValid()? since: null, until: until.isValid()? until: null
  });

  connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject): any =>
    conn.get(redisKey, (err: any, val: string): any => {
      if(err){ console.log(`Failed to get cached weekly contributions for ${repo.owner}/${repo.name}`); console.log(err); }
      if(val) return resolve({ val });
      if(user) conn.get(user, (err: any, token: string): any => {
        if(err){ console.log(`Failed to get access token for ${user}`); console.log(err); }
        return resolve({ val, token });
      });
      else return resolve({});
    })
  )).then(({ val = null, token = null }): any => {
    if(val) return res.json(JSON.parse(val));
    if(token) reqObj.requestor = token;
    return new PromisePipe(getContributors, weeklyContributions, weeklyFilter).processData(reqObj)
    .then((contributors: WeeklyContribution[]): void => {
      connectToRedisAndDo((conn:RedisClient): Promise<any> => new Promise((resolve, reject): any =>
        conn.setex(redisKey, ttl, JSON.stringify(contributors), (err: any): any => {
          if(err){ console.log(`Failed to cache weekly contributions for ${repo.owner}/${repo.name}`); console.log(err); }
          resolve();
        })
      ));
      res.json(contributors);
    });
  }).catch((err: any): void => {
    console.log(err);
    res.sendStatus(500);
  });
});
