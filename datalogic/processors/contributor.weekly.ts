/**
 * datalogic/processors/contributor.weekly.ts
 * Component to process contributor list into weekly efforts.
 * @author zixian92
 */

'use strict';
import * as moment from 'moment';
import { WeeklyContribution, ContributionWeek } from '../../dataentities/weekly.contribution';

export function weeklyContributions(contributors: any[]): WeeklyContribution[] {
  return contributors.map((c: any): WeeklyContribution => {
    if(!c.author || !c.author.login || !Array.isArray(c.weeks)) return null;
    return {
      contributor: c.author.login,
      weeks: c.weeks.map((w: any): ContributionWeek => {
        if(!w.w) return null;
        return {
          from: moment.unix(w.w).format(),
          additions: isNaN(w.a)? 0: parseInt(w.a),
          deletions: isNaN(w.d)? 0: parseInt(w.d),
          commits: isNaN(w.c)? 0: parseInt(w.c)
        };
      }).filter((w: ContributionWeek): boolean => !!w)
    };
  }).filter((c: WeeklyContribution): boolean => !!c);
}
