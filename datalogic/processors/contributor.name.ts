/**
 * datalogic/contributor.name.ts
 * Filter component to extract name of contributor from contributor list.
 * @author zixian92
 */

'use strict';

export function extractContributorName(contributors: any[]): string[] {
  if(!contributors.length) {
      return [];
  } else {
      return contributors.map((c: any): string => (c.author && c.author.login)? c.author.login: null)
      .filter((c: string): boolean => !!c);
  }
}
