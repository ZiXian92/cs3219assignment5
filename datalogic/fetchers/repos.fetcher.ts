/**
 * datalogic/fetcher/repos.fetcher.ts
 * Defines the component to fetch list of repositories.
 * @author zixian92
 */

'use strict';
import { Thenable } from 'bluebird';
import { getJson, FetchResponse } from '../../misc/fetch.wrapper';

export function getRepos(): Thenable<any> {
  return getJson('https://api.github.com/repositories')
    .then((res: FetchResponse): any => {
      console.log(res.headers);
      return res.body;
    });
}
