/**
 * datalogic/processors/contributor.weekly.ts
 * Component to process contributor list into weekly efforts.
 * @author zixian92
 */

'use strict';
import * as moment from 'moment';

export function weeklyContributions(contributors: any[]): any[] {
  return contributors.map((c: any): any => {
    if(!c.author || !c.author.login || !Array.isArray(c.weeks)) return null;
    return {
      author: c.author.login,
      weeks: c.weeks.map((w: any): any => {
        if(!w.w) return null;
        return {
          week: moment(w.w).format(),
          additions: isNaN(w.a)? 0: parseInt(w.a),
          deletions: isNaN(w.d)? 0: parseInt(w.d),
          commits: isNaN(w.c)? 0: parseInt(w.c)
        };
      }).filter((w: any): boolean => w)
    };
  }).filter((c: any): boolean => c);
}
