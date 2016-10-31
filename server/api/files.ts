/**
 * server/api/files.ts
 * Repository files-related endpoint handler.
 * @author zixian92
 */

'use strict';
import { RedisClient } from 'redis';
import * as Promise from 'bluebird';
import { Router, Request, Response, NextFunction } from 'express';
import { Repository } from '../../dataentities/repository';
import { RepoRequest } from '../../dataentities/repo.data.request';
import { PromisePipe } from '../../datalogic/promise.pipe';
import { getFiles } from '../../datalogic/fetchers/files';
import { extractFilePaths } from '../../datalogic/processors/file.list';
import { connectToRedisAndDo } from '../redis';

export const FilesRouter = Router();

FilesRouter.get('/:owner/:repo', (req: Request, res: Response, next: NextFunction): void => {
  let reqData: RepoRequest = {
    repo: { owner: req.params.owner, name: req.params.repo },
    data: {
      branch: req.query.branch || 'master'
    }
  };
  let redisKey: string = `/api/trees/${reqData.repo.owner}/${reqData.repo.name}?breanch=${reqData['branch']}`;
  let ttl: number = 3600;
  connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(redisKey, (err: any, tree: string): any => err? reject(err): resolve(tree))
  )).then((treeStr: string): any => {
    if(treeStr){
      return res.json(JSON.parse(treeStr));
    } else{
      return new PromisePipe(getFiles, extractFilePaths).processData(reqData)
      .then((filePaths: string[]): Promise<any> =>
        connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
          conn.setex(redisKey, ttl, JSON.stringify(filePaths), (err: any): any => err? reject(err): resolve())
        )).then((): any => res.json(filePaths))
      );
    }
  }).catch((err: any): void => {
    console.log(err); res.status(500);
  });
});
