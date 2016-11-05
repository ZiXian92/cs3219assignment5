/**
 * server/api/final.ts
 *
 * @author munaw
 */

'use strict';
import { Router, Request, Response, NextFunction } from 'express';
import * as Promise from 'bluebird';
import { RedisClient } from 'redis';
import { connectToRedisAndDo } from '../redis';

export const FinalRouter = Router();

FinalRouter.get('/:owner/:repo', (req: Request, res: Response, next: NextFunction): void => {
  let redisKey: string = req.originalUrl;
  let ttl: number = 3600;
  const execFile = require('child_process').execFile;

  connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
    conn.get(redisKey, (err: any, cached: string): any => {
      if(err){
        console.log(`Failed to get cached final version contribution for ${req.params.owner}/${req.params.repo}`);
        console.log(err);
      }
      return resolve(cached);
    })
  )).then((cached: string): any => {
    if(cached) return res.json(JSON.parse(cached));
    return new Promise((resolve, reject) => {
      const child = execFile('python', ['server/api/gitinspector-master/gitinspector.py', '--format=json' , "https://github.com/" + req.params.owner + "/" + req.params.repo], (error, stdout, stderr) => {

        if (error) {
          console.log(stderr);
          return reject(error);
        }
        var json = JSON.parse(stdout)['gitinspector']['blame']['authors'];
        for(var i = 0; i < json.length; ++i) {
            delete json[i]['gravatar'];
            delete json[i]['age'];
        }

        return resolve(json);
        });
    }).then((results: any[]): void => {
      connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
        conn.setex(redisKey, ttl, JSON.stringify(results), (err: any): void => {
          if(err){
            console.log(`Failed to cache final version contribution for ${req.params.owner}/${req.params.repo}`);
            console.log(err);
          }
        })
      ));
      res.json(results);
    });
  }).catch((err: any): void => {
    console.log(err);
    res.sendStatus(500);
  });
});
