/**
 * datalogic/processors/contributions.weekly.filter.ts
 * Component that filters weekly contributions based on specified filters.
 * @author zixian92
 */

'use strict';
import * as moment from 'moment';
import { WeeklyContribution, ContributionWeek } from '../../dataentities/weekly.contribution';

export interface WeeklyContributionFilter {
  (contributions: WeeklyContribution[]): WeeklyContribution[];
}

// Filter is not perfect is since and until are not week-aligned.
export function generateWeeklyContributionFilter({author, since, until}): WeeklyContributionFilter {
  return (contributions: WeeklyContribution[]): WeeklyContribution[] =>
    contributions.filter((c: WeeklyContribution): boolean => {
      if(author && author!==c.contributor) return false;
      if(moment(since).isValid() || moment(until).isValid()){
        let s = moment(since), e = moment(until);
        c.weeks = c.weeks.filter((w: ContributionWeek): boolean => {
          let f = moment(w.from), t = f.clone().add(7, 'days');
          if(s.isValid() && t<=s) return false;
          if(e.isValid() && f>=e) return false;
          return true;
        });
        if(c.weeks.length===0) return false;
      }
      return true;
    });
}
