/**
 * datalogic/processors/commit.details.ts
 * Defines component to summarize commit details of each commit.
 * @author zixian92
 */

'use strict';
import * as moment from 'moment';

export function processCommitDetails(commits: any[]): any[] {
  return commits.map((commit: any): any => {
    if(!commit.author || !commit.commit || !commit.commit.author || !commit.stats || !Array.isArray(commit.files))
      return null;
    let res = {
      author: commit.author.login,
      email: commit.commit.author.email,
      date: moment(commit.commit.author.date).format(),
      message: commit.commit.message,
      additions: commit.stats.additions,
      deletions: commit.stats.deletions,
      files: commit.files.map((file: any): any => ({
        filename: file.filename,
        additions: file.additions,
        deletions: file.deletions,
        patch: file.patch
      }))
    };
    // if(!!!res.author || !!!res.email || !!!res.date || !!!res.message ||
    // (parseInt(Number.isInteger(res.additions))+parseInt(Number.isInteger(res.deletions))+parseInt(Number.isInteger(commit.stats.total))<2) ||
    // !!res.files.find((f: any, i: number): boolean => !!!f.filename || !!!f.patch ||
    //   (Number.isInteger(f.additions)+Number.isInteger(f.deletions)+Number.isInteger(commit.files[i].changes))))
    //   return null;
    // else{
    //   if(Number.isInteger(commit.stats.total)){
    //     if(!Number.isInteger(res.additions)) res.additions = commit.stats.total-res.deletions;
    //     if(!Number.isInteger(res.deletions)) res.deletions = commit.stats.total-res.additions;
    //   }
    //   return res;
    // }
    return res;
  }).filter((c: any): boolean => !!c);
}
