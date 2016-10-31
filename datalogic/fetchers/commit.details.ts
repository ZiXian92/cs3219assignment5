/**
 * datalogic/fetchers/commit.details.ts
 * Defines the components to get details of each commit in the given URL list.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import { getJson, FetchResponse } from '../../misc/fetch.wrapper';
import { RepoRequest } from '../../dataentities/repo.data.request';

export function getCommitDetails(req: RepoRequest): any {
  return Promise.all(req.data.map((url: string): Promise<any> => req.requestor? getJson(url, {Authentication: req.requestor}): getJson(url)))
  .then((responses: any[]): any[] => responses.map((res: FetchResponse): any => res.body));
}
