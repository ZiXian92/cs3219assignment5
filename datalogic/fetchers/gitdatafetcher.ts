/**
 * datalogic/fetchers/gitdatafetcher.ts
 * Defines the Github data fetcher interface implemented by
 * other components that fetch certain repository data from Github API.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import Repository from '../../dataentities/repository';

export interface GitDataFetcher {
  get(repo: Repository): Promise.Thenable<any>;
}
