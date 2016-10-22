/**
 * datalogic/processors/repos.ts
 * Defines the component to extract and format repository list
 * from Github API result.
 * @author zixian92
 */

'use strict';
import { Repository } from '../../dataentities/repository';

export function formatReposList(repoList: any[]): Repository[] {
  return repoList.map((repo: any): Repository => ({
    owner: repo.owner.login,
    name: repo.name
  })).filter((repo: Repository): boolean =>
    !!(repo.owner && repo.name)
  );
}
