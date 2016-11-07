/**
 * tests/datalogic/commit.details.test.ts
 * Unit test for commit details extractor.
 * @author zixian92
 */

'use strict';
import { assert } from 'chai';
import * as moment from 'moment';
import { processCommitDetails } from '../../datalogic/processors/commit.details';

describe('commitDetailsExtractorTest', () => {
  describe('#normalTest', () => {
    let input: any[] = [{
      commit: {
        author: { name: "Monalisa Octocat", email: "support@github.com", date: "2011-04-14T16:00:49Z" },
        committer: { name: "Monalisa Octocat", email: "support@github.com", date: "2011-04-14T16:00:49Z" },
        message: "Fix all the bugs"
      },
      author: { login: 'octocat' }, committer: { login: 'octocat' },
      stats: { additions: 104, deletions: 4, total: 108 },
      files: [{
        filename: "file1.txt", additions: 10, deletions: 2, changes: 12, status: "modified",
        raw_url: "https://github.com/octocat/Hello-World/raw/7ca483543807a51b6079e54ac4cc392bc29ae284/file1.txt",
        blob_url: "https://github.com/octocat/Hello-World/blob/7ca483543807a51b6079e54ac4cc392bc29ae284/file1.txt",
        patch: "@@ -29,7 +29,7 @@\n....."
      }]
    }, {
      commit: {
        author: { name: "Monalisa Octocat", email: "support@github.com", date: "2011-04-14T16:00:49Z" },
        committer: { name: "Monalisa Octocat", email: "support@github.com", date: "2011-04-14T16:00:49Z" },
        message: "Add enhancements"
      },
      author: { login: 'octocat' }, committer: { login: 'octocat' },
      stats: { additions: 104, deletions: 4, total: 108 },
      files: [{
        filename: "file2.txt", additions: 10, deletions: 2, changes: 12, status: "modified",
        raw_url: "https://github.com/octocat/Hello-World/raw/7ca483543807a51b6079e54ac4cc392bc29ae284/file1.txt",
        blob_url: "https://github.com/octocat/Hello-World/blob/7ca483543807a51b6079e54ac4cc392bc29ae284/file1.txt",
        patch: "@@ -29,7 +29,7 @@\n....."
      }]
    }, {
      commit: {
        author: { name: "Monalisa Octocat", email: "support@github.com", date: "2011-04-14T16:00:49Z" },
        committer: { name: "Monalisa Octocat", email: "support@github.com", date: "2011-04-14T16:00:49Z" },
        message: "Prepare for deployment"
      },
      author: { login: 'octocat' }, committer: { login: 'octocat' },
      stats: { additions: 104, deletions: 4, total: 108 },
      files: [{
        filename: "dir/file3.txt", additions: 10, deletions: 2, changes: 12, status: "modified",
        raw_url: "https://github.com/octocat/Hello-World/raw/7ca483543807a51b6079e54ac4cc392bc29ae284/file1.txt",
        blob_url: "https://github.com/octocat/Hello-World/blob/7ca483543807a51b6079e54ac4cc392bc29ae284/file1.txt",
        patch: "@@ -29,7 +29,7 @@\n....."
      }]
    }];
    let expected: any[] = [{
      author: 'octocat',
      email: 'support@github.com',
      date: moment('2011-04-14T16:00:49Z').format(),
      message: 'Fix all the bugs',
      additions: 104,
      deletions: 4,
      files: [{
        filename: 'file1.txt', additions: 10, deletions: 2,
        patch: '@@ -29,7 +29,7 @@\n.....'
      }]
    }, {
      author: 'octocat',
      email: 'support@github.com',
      date: moment('2011-04-14T16:00:49Z').format(),
      message: 'Add enhancements',
      additions: 104,
      deletions: 4,
      files: [{
        filename: 'file2.txt', additions: 10, deletions: 2,
        patch: '@@ -29,7 +29,7 @@\n.....'
      }]
    }, {
      author: 'octocat',
      email: 'support@github.com',
      date: moment('2011-04-14T16:00:49Z').format(),
      message: 'Prepare for deployment',
      additions: 104,
      deletions: 4,
      files: [{
        filename: 'dir/file3.txt', additions: 10, deletions: 2,
        patch: '@@ -29,7 +29,7 @@\n.....'
      }]
    }];

    it('should match expected output', () => {
      let actual: any[] = processCommitDetails(input);
      assert.equal(actual.length, expected.length);

      // This part should be updated with a better version to be robust
      // against the case when the processor implementation returns scrambled sequence.
      expected.forEach((r: any, idx: number): any =>
        assert.deepEqual(actual[idx], r)
      );
    });
  });

  describe('#errorHandling', () => {
    let input: any[] = [{
      commit: {
        committer: { name: "Monalisa Octocat", email: "support@github.com", date: "2011-04-14T16:00:49Z" },
        message: "Fix all the bugs"
      },
      author: { login: 'octocat' }, committer: { login: 'octocat' },
      stats: { additions: 104, deletions: 4, total: 108 },
      files: [{
        filename: "file1.txt", additions: 10, deletions: 2, changes: 12, status: "modified",
        raw_url: "https://github.com/octocat/Hello-World/raw/7ca483543807a51b6079e54ac4cc392bc29ae284/file1.txt",
        blob_url: "https://github.com/octocat/Hello-World/blob/7ca483543807a51b6079e54ac4cc392bc29ae284/file1.txt",
        patch: "@@ -29,7 +29,7 @@\n....."
      }]
    }, {
      commit: {
        author: { name: "Monalisa Octocat", email: "support@github.com", date: "2011-04-14T16:00:49Z" },
        committer: { name: "Monalisa Octocat", email: "support@github.com", date: "2011-04-14T16:00:49Z" },
        message: "Add enhancements"
      },
      author: { login: 'octocat' }, committer: { login: 'octocat' },
      stats: { additions: 104, total: 108 },
      files: [{
        filename: "file2.txt", deletions: 2, changes: 12, status: "modified",
        raw_url: "https://github.com/octocat/Hello-World/raw/7ca483543807a51b6079e54ac4cc392bc29ae284/file1.txt",
        blob_url: "https://github.com/octocat/Hello-World/blob/7ca483543807a51b6079e54ac4cc392bc29ae284/file1.txt",
        patch: "@@ -29,7 +29,7 @@\n....."
      }]
    }, {
      commit: {
        author: { name: "Monalisa Octocat", email: "support@github.com", date: "2011-04-14T16:00:49Z" },
        committer: { name: "Monalisa Octocat", email: "support@github.com", date: "2011-04-14T16:00:49Z" },
        message: "Prepare for deployment"
      },
      author: { login: 'octocat' }, committer: { login: 'octocat' },
      stats: { additions: 104, total: 108 },
      files: [{
        filename: "dir/file3.txt", additions: 10, deletions: 2, changes: 12, status: "modified",
        raw_url: "https://github.com/octocat/Hello-World/raw/7ca483543807a51b6079e54ac4cc392bc29ae284/file1.txt",
        blob_url: "https://github.com/octocat/Hello-World/blob/7ca483543807a51b6079e54ac4cc392bc29ae284/file1.txt"
      }]
    }];
    let expected: any[] = [{
      author: 'octocat',
      email: 'support@github.com',
      date: moment('2011-04-14T16:00:49Z').format(),
      message: 'Add enhancements',
      additions: 104,
      deletions: 4,
      files: [{
        filename: 'file2.txt', additions: 0, deletions: 2,
        patch: '@@ -29,7 +29,7 @@\n.....'
      }]
    }];

    // it('should make good default guesses for or ignore missing data', () => {
    //   let actual: any[] = processCommitDetails(input);
    //   assert.equal(actual.length, expected.length);
    //   expected.forEach((r: any, idx: number): any =>
    //     assert.deepEqual(actual[idx], r)
    //   );
    // });
  });
});
