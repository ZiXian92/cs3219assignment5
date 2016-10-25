/**
 * datalogic/fetchers/users.fetcher.ts
 * Defines the component to fetch list of GitHub users.
 * @author zixian92
 */

'use strict';
import { getJson, FetchResponse } from '../../misc/fetch.wrapper';
import * as Promise from 'bluebird';

export function getUsers(): Promise<any> {
  let users: any[] = [];
  function handleResponse(res: FetchResponse): any {
    // users = users.concat(res.body);
    // console.log(users);
    // let links: string[] = res.headers.get('link').replace(/[<>]*/g, '').split(',');
    // console.log(links);
    // if(links.length<=1 || !links[0].endsWith('rel="next"'))
    //   return users;
    // let link: string = links[0].split(';')[0];
    // console.log(link);
    // return getJson(link).then(handleResponse);
    return res.body;
  }
  return getJson('https://api.github.com/users').then(handleResponse);
}
