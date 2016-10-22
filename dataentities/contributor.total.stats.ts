/**
 * dataentities/contributor.total.stats.ts
 * Defines the data object to represent a contributor's total contributions to the repository.
 *@author zixian92
 */

'use strict'

export interface ContributorTotalStats {
  readonly contributor: string;
  readonly commits: number;
  readonly additions: number;
  readonly deletions: number;
}
