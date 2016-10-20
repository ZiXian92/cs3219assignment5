/**
 * Defines the functions for redis client.
 * Note that this redis client is not the promisified one
 * as promisifying with bluebird is not supported in Typescript.
 *
 * @author zixian92
 */

'use strict';
import { createClient, RedisClient } from 'redis';
import * as Promise from 'bluebird';

const HOST = 'redis';
const PORT = 6379;

var redisClient: RedisClient = createClient(PORT, HOST);
// redisClient.on('error', (err: any) => console.log(`Redis error: ${err}`));
redisClient.on('end', () => console.log('Redis connection closed'));

function getClient(): Promise.Disposer<RedisClient> {
  return new Promise((resolve, reject) => resolve(redisClient)).disposer((conn: RedisClient, promise: Promise<any>) => {
    conn.quit();
  });
}

export function connectToRedisAndDo(job: (conn: RedisClient) => Promise<any>): Promise<any> {
  // return Promise.using(getClient(), job);
  return job(redisClient);
}
