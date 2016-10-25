/**
 * datalogic/fetcher/repos.fetcher.ts
 * Defines the component to fetch list of repositories.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import { getJson, FetchResponse } from '../../misc/fetch.wrapper';

export function getRepos(owner: string): Promise<any> {
  return getJson(`https://api.github.com/users/${owner}/repos`).then((res: FetchResponse): any[] => res.body);
}
