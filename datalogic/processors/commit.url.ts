/**
 * datalogic/processors/commit.url.ts
 * Defines component to get commit url from list of commit summaries
 * @author zixian92
 */

'use strict';

export function getCommitUrls(commits: any[]): string[] {
  return commits.map((c: any): string => c.url);
}
