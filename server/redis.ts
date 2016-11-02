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
const useCache: boolean = true;

// var redisClient: RedisClient = createClient(PORT, HOST);
// redisClient.on('error', (err: any) => console.log(`Redis error: ${err}`));
// redisClient.on('end', () => console.log('Redis connection closed'));

function getClient(): Promise.Disposer<RedisClient> {
  return new Promise((resolve, reject) => {
    var client = createClient(PORT, HOST);
    client.on('error', (err: any) => console.log(`Redis error: ${err}`));
    client.on('end', () => console.log('Redis connection closed'));
    resolve(client);
  }).disposer((conn: RedisClient, promise: Promise<any>) => {
    conn.quit();
    console.log('Connection closed');
  });
}

export function connectToRedisAndDo(job: (conn: RedisClient) => Promise<any>): Promise<any> {
  return useCache? Promise.using(getClient(), job): Promise.resolve();
  // return job(redisClient);
}
