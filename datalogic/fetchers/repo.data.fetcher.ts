/**
 * datalogic/fetchers/gitdatafetcher.ts
 * Defines the Github data fetcher interface implemented by
 * other components that fetch certain repository data from Github API.
 * @author zixian92
 */

'use strict';
import { Thenable } from 'bluebird';
import { RepoRequest } from '../../dataentities/repo.data.request';

export interface RepoDataFetcher {
  (repo: RepoRequest): Thenable<any>;
}
