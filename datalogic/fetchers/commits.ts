/**
 * datalogic/fetchers/commits.ts
 * The component that fetches commit list for a repository.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import { RedisClient } from 'redis';
import { getJson, FetchResponse } from '../../misc/fetch.wrapper';
import { connectToRedisAndDo } from '../../server/redis';
import { RepoRequest } from '../../dataentities/repo.data.request';

export function getCommits(req: RepoRequest): Promise<any> {
  let url: string = `https://api.github.com/repos/${req.repo.owner}/${req.repo.name}/commits?per_page=15`;
  let ttl: number = 3600;
  for(var k in req.data) url+=`&${k}=${req.data[k]}`;

  // Try getting from cache. If fails, revert to using API call.
  return connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(url, (err: any, val: string): void => {
      if(err){ console.log('Unable to get cached Github API request result'); console.log(err); }
      resolve(val);
    })
  )).then((cached: string): any => {
    if(cached) return JSON.parse(cached);
    return getJson(url, req.requestor? {Authorization: `token ${req.requestor}`}: {})
    .then((res: FetchResponse): any[] => {
      // Cache result asynchronously. It's ok if it fails.
      connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
        conn.setex(url, ttl, JSON.stringify(res.body), (err: any) => {
          if(err){
            console.log('Unable to cache fetched result');
            console.log(err);
          }
          resolve();
        })
      ));
      return res.body;
    });
  });
}
