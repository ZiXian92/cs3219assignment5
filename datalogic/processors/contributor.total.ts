/**
 * datalogic/processors/contributortotalprocessor.ts
 * Defines the processing component that computes total contributions for each user.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import { ContributorTotalStats } from '../../dataentities/contributor.total.stats';

export function computeContributorTotal(contributorData: any): ContributorTotalStats[] {
  return [{
    contributor: 'octocat', commits: 300, additions: 200, deletions: 0
  }, {
    contributor: 'cutedog', commits: 2, additions: 5, deletions: 100
  }]
}
