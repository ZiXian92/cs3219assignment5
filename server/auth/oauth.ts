/**
 * server/auth/oauth.ts
 * Handles OAuth redirect.
 * @author zixian92
 */

'use strict';
import { Request, Response, NextFunction } from 'express';
import { postGetJson } from '../../misc/fetch.wrapper';
import { secret } from '../../src/app/app.secret';

export function OAuthRedirectHandler(req: Request, res: Response, next: NextFunction){
  let code: string = req.query.code;
  let state: string = req.query.state;
  let s: secret = new secret();
  let body: string = `client_id=${s.getGithubClientId}&client_secret=${s.getGithubClientSecret}&code=${code}&state=${state}&redirect_uri=http://localhost/auth/oauth`;
  postGetJson('https://github.com/login/oauth/access_token', encodeURIComponent(body))
  .then(tokenObj => {
    console.log(tokenObj);
    res.redirect('/');
  });
  // res.status(404).send('Not implemented');
}
