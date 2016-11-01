/**
 * datalogic/fetchers/commits.ts
 * The component that fetches commit list for a repository.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import { getJson, FetchResponse } from '../../misc/fetch.wrapper';
import { RepoRequest } from '../../dataentities/repo.data.request';

export function getCommits(req: RepoRequest): Promise<any[]> {
  let url: string = `https://api.github.com/repos/${req.repo.owner}/${req.repo.name}/commits?per_page=15`;
  for(var k in req.data) url+=`&${k}=${req.data[k]}`;
  return (req.requestor? getJson(url, { Authorization: req.requestor }): getJson(url))
  .then((res: FetchResponse): any[] => res.body);
}
