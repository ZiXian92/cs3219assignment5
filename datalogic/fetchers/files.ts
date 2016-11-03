/**
 * datalogic/fetchers/files.ts
 * Defines the component to fetch file tree of the given repository.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import { RedisClient } from 'redis';
import { RepoRequest } from '../../dataentities/repo.data.request';
import { getJson, FetchResponse } from '../../misc/fetch.wrapper';
import { connectToRedisAndDo } from '../../server/redis';

export function getFiles(req: RepoRequest): Promise<any> {
  let url: string = `https://api.github.com/repos/${req.repo.owner}/${req.repo.name}/git/trees/${req.data['branch']}?recursive=1`;
  let ttl: number = 3600;

  return connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(url, (err: any, cached: string): any => {
      if(err){ console.log(`Failed to get cached result for ${url}`); console.log(err); }
      resolve(cached);
    })
  )).then((cached: string): any => {
    if(cached) return JSON.parse(cached);
    return getJson(url, req.requestor? {Authorization: `token ${req.requestor}`}: {})
    .then((res: FetchResponse): any => {
      console.log(`Truncated: ${res.body.truncated}`);
      connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
        conn.setex(url, ttl, JSON.stringify(res.body), (err: any): void => {
          if(err){ console.log(`Failed to cache result for ${url}`); console.log(err); }
          resolve();
        })
      ));
      return res.body;
    });
  });
}
