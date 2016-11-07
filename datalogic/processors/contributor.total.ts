/**
 * datalogic/processors/contributortotalprocessor.ts
 * Defines the processing component that computes total contributions for each user.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import { ContributorTotalStats } from '../../dataentities/contributor.total.stats';

export function computeContributorTotal(contributorData: any[]): ContributorTotalStats[] {
  if(!Array.isArray(contributorData)){
    console.log('Contributor data is not array. Truncating...');
    return [];
  }
  return contributorData.map((c: any) => {
    if(!c.author || !c.author.login || !c.total || !Array.isArray(c.weeks)) return null;
    let summary = c.weeks.reduce((res: any, w: any): any => {
      let commit: number = parseInt(w.c);
      let addition: number = parseInt(w.a);
      let deletion: number = parseInt(w.d);
      res.commits+=isNaN(commit)? 0: commit;
      res.additions+=isNaN(addition)? 0: addition;
      res.deletions+=isNaN(deletion)? 0: deletion;
      return res;
    }, {
      commits: 0, additions: 0, deletions: 0
    });
    summary.contributor = c.author.login;
    return summary;
  }).filter((c: ContributorTotalStats): boolean => !!c);
}
