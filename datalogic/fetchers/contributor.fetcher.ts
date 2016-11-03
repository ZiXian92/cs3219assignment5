/**
 * datalogic/fetchers/contributorfetcher.ts
 * Defines the component to fetch contributor data for a given repository.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import { RedisClient } from 'redis';
import { getJson, FetchResponse } from '../../misc/fetch.wrapper';
import { RepoRequest } from '../../dataentities/repo.data.request';
import { connectToRedisAndDo } from '../../server/redis';

export function getContributors(reqData: RepoRequest): Promise<any> {
  let ttl: number = 3600;
  let url = `https://api.github.com/repos/${reqData.repo.owner}/${reqData.repo.name}/stats/contributors`;

  // Gets cached result. Falls back to API call if fail.
  return connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(url, (err: any, res: string): void => {
      if(err){ console.log(`Unable to get cached result for ${url}`); console.log(err); }
      resolve(res);
    })
  )).then((val: string): any => {
    if(val) return JSON.parse(val);
    return getJson(url, reqData.requestor? {Authorization: `token ${reqData.requestor}`}: {})
    .then((res: FetchResponse): any[] => {
      // Asynchronously cache result. It's ok if it fails.
      connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
        conn.setex(url, ttl, JSON.stringify(res.body), (err: any): void => {
          if(err){ console.log(`Unable to cache result for ${url}`); console.log(err); }
          resolve();
        })
      ));
      return res.body;
    })
  });
}
