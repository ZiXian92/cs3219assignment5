/**
 * datalogic/fetchers/contributorfetcher.ts
 * Defines the component to fetch contributor data for a given repository.
 * @author zixian92
 */

'use strict';
import { Thenable } from 'bluebird';
import { get } from '../../misc/fetch.wrapper';
import { RepoRequest } from '../../dataentities/repo.data.request';
import { RepoDataFetcher } from './repo.data.fetcher';

export function getContributors(reqData: RepoRequest): Thenable<any> {
  let url = `https://api.github.com/repos/${reqData.repo.owner}/${reqData.repo.name}/stats/contributors`;
  return get(url);
}
