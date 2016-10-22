/**
 * datalogic/fetcher/repos.fetcher.ts
 * Defines the component to fetch list of repositories.
 * @author zixian92
 */

'use strict';
import { Thenable } from 'bluebird';
import { get } from '../../misc/fetch.wrapper';

export function getRepos(): Thenable<any> {
  return get('https://api.github.com/repositories');
}
