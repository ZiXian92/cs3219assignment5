/**
 * server/auth/oauth.ts
 * Handles OAuth redirect.
 * @author zixian92
 */

'use strict';
import { RedisClient } from 'redis';
import * as Promise from 'bluebird';
import { generateToken } from './jwt/jwt.wrapper';
import { Request, Response, NextFunction } from 'express';
import { getJson, postGetJson, FetchResponse } from '../../misc/fetch.wrapper';
import { secret } from '../secret';
import { connectToRedisAndDo } from '../redis';

export function OAuthRedirectHandler(req: Request, res: Response, next: NextFunction){
  let s: secret = new secret();
  let code: string = req.query.code;
  let body: any = {
    client_id: s.getGithubClientId(), client_secret: s.getGithubClientSecret(),
    redirect_uri: 'http://localhost:7777/auth/oauth', code
  };
  postGetJson('https://github.com/login/oauth/access_token', JSON.stringify(body), {'Content-Type': 'application/json'})
  .then(response => {
    let tokenObj: any = response.body;
    return getJson('https://api.github.com/user', {Authorization: `token ${tokenObj.access_token}`})
    .then((resObj: FetchResponse): string => resObj.body.login)
    .then((username: string) => {
      return connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
        conn.set(username, tokenObj.access_token, (err: any): any => err? reject(err): resolve())
      )).then((): void => {
        let token: string = generateToken({ user: username });
        res.redirect(`/setup?token=${token}`);
      });
    })
  }).catch((err: any): void => {
    console.log(err);
    res.sendStatus(401);
  });
}
