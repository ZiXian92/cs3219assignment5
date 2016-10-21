/**
 * datalogic/fetchers/contributorfetcher.ts
 * Defines the component to fetch contributor data for a given repository.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import * as fetch from 'isomorphic-fetch';
import Repository from '../../dataentities/repository';
import { GitDataFetcher } from './gitdatafetcher';

export class ContributorFetcher implements GitDataFetcher {
  constructor() {

  }

  public get(repo: Repository): Promise.Thenable<any> {
    return fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}/stats/contributors`)
    .then((res: IResponse): any => res.ok? res.json(): Promise.reject({ status: res.status, statusText: res.statusText }));
  }
}
