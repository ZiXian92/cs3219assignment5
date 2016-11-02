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
  return connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(url, (err: any, res: string): any => err? reject(err): resolve(res))
  )).then((val: string): any => val? JSON.parse(val): getJson(url).then((res: FetchResponse): any[] => {
    connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
      conn.setex(url, ttl, JSON.stringify(res.body), (err: any): any => err? reject(err): resolve())
    ))
    return res.body;
  }));
}
