/**
 * datalogic/fetcher/repos.fetcher.ts
 * Defines the component to fetch list of repositories.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import { RedisClient } from 'redis';
import { getJson, FetchResponse } from '../../misc/fetch.wrapper';
import { connectToRedisAndDo } from '../../server/redis';

export function getRepos(req: any): Promise<any> {
  let url: string = `https://api.github.com/users/${req.owner}/repos`;
  let ttl: number = 3600;
  return connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(url, (err: any, cached: string): any => {
      if(err){ console.log(`Failed to get cached result for ${url}`); console.log(err); }
      return resolve(cached);
    })
  )).then((cached: string): any => {
    if(cached) return JSON.parse(cached);
    return getJson(url, req.requestor? {Authorization: `token ${req.requestor}`}: {})
    .then((res: FetchResponse): any[] => {
      connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
        conn.setex(url, ttl, JSON.stringify(res.body), (err: any): void => {
          if(err){ console.log(`Failed to cache repositories of ${req.owner}`); console.log(err); }
          resolve();
        })
      ));
      return res.body;
    });
  });
}
