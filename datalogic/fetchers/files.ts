/**
 * datalogic/fetchers/files.ts
 * Defines the component to fetch file tree of the given repository.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import { RepoRequest } from '../../dataentities/repo.data.request';
import { getJson, FetchResponse } from '../../misc/fetch.wrapper';

export function getFiles(req: RepoRequest): any {
  return getJson(`https://api.github.com/repos/${req.repo.owner}/${req.repo.name}/git/trees/${req.data['branch']}?recursive=1`)
  .then((res: FetchResponse): any => {
    console.log(`Truncated: ${res.body.truncated}`); return res.body;
  });
}
