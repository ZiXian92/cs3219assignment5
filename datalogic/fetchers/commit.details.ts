/**
 * datalogic/fetchers/commit.details.ts
 * Defines the components to get details of each commit in the given URL list.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import { RedisClient } from 'redis';
import { getJson, FetchResponse } from '../../misc/fetch.wrapper';
import { connectToRedisAndDo } from '../../server/redis';
import { RepoRequest } from '../../dataentities/repo.data.request';

export function getCommitDetails(req: RepoRequest): Promise<any> {
  let ttl: number = 3600;

  // Get as many cached result as we can
  return connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) => {
    // This Promise.all wil never reject
    resolve(Promise.all(req.data.map((url: string): Promise<any> => new Promise((r1, r2) =>
      conn.get(url, (err: any, val: string): any => {
        if(err){
          console.log(`Unable to get cached result for ${url}`); console.log(err);
          r1();
        } else r1(val);
      }))
    )));
  })).then((cachedResults: any[]): Promise<any> =>
    // For cached results, parse to JSON and use.
    // For those not in cache, fetch and cache.
    // Rejects only if some API calls fail.
    Promise.map(cachedResults, (r: string, i: number): any => {
      if(r) return JSON.parse(r);
      return getJson(req.data[i], req.requestor? {Authorization: `token ${req.requestor}`}: {})
      .then((response: FetchResponse): any => {
        // Asynchronously cache result. It's ok to fail.
        connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
          conn.setex(req.data[i], ttl, JSON.stringify(response.body), (err: any): void => {
            if(err){ console.log(`Unable to cache result for ${req.data[i]}`); console.log(err); }
            else console.log(`Result for ${req.data[i]} cached`);
            resolve();
          })
        ));
        return response.body;
      });
    })
  );
}
