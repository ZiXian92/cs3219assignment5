/**
 * datalogic/processors/commit.details.ts
 * Defines component to summarize commit details of each commit.
 * @author zixian92
 */

'use strict';

export function processCommitDetails(commits: any[]): any[] {
  return commits.map((commit: any): any => ({
    author: commit.author.login,
    email: commit.commit.author.email,
    date: commit.commit.author.date,
    message: commit.commit.message,
    additions: commit.stats.additions,
    deletions: commit.stats.deletions,
    files: commit.files.map((file: any): any => ({
      filename: file.filename,
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch
    }))
  }));
}
