/**
 * dataentities/weekly.contribution.ts
 * Defines the DTO for weekly contribution of a user.
 * @author zixian92
 */

'use strict';

export interface ContributionWeek {
  from: string;
  commits: number;
  additions: number;
  deletions: number;
}

export interface WeeklyContribution {
  contributor: string;
  weeks: ContributionWeek[];
}
