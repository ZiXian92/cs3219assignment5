/**
 * server/auth/oauth.ts
 * Handles OAuth redirect.
 * @author zixian92
 */

'use strict';
import { RedisClient } from 'redis';
import * as Promise from 'bluebird';
import { Request, Response, NextFunction } from 'express';
import { getJson, postGetJson } from '../../misc/fetch.wrapper';
import { secret } from '../../src/app/app.secret';
import { connectToRedisAndDo } from '../redis';

export function OAuthRedirectHandler(req: Request, res: Response, next: NextFunction){
  let code: string = req.query.code;
  let state: string = req.query.state;
  let s: secret = new secret();
  let body: string = `client_id=${s.getGithubClientId}&client_secret=${s.getGithubClientSecret}&code=${code}&state=${state}&redirect_uri=http://localhost/auth/oauth`;
  postGetJson('https://github.com/login/oauth/access_token', encodeURIComponent(body))
  .then(tokenObj =>
    getJson('https://api.github.com/user', {Authorization: `token ${tokenObj.accessToken}`})
    .then((userObj: any): string => userObj.login)
    .then((username: string) => {
      req.session['name'] = username;
      return connectToRedisAndDo((conn: RedisClient): Promise<any> => new Promise((resolve, reject) =>
        conn.set(username, tokenObj.accessToken, (err: any): any => err? reject(err): resolve())
      ))
    }).then((): any => res.redirect('/'))
  ).catch((err: any): void => {
    console.log(err);
    res.status(401);
  });
  // res.status(404).send('Not implemented');
}
