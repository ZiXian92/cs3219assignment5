/**
 * tests/datalogic/contributor.total.test.ts
 * Unit test for contribution aggregation
 * @author zixian92
 */

'use strict';
import { assert } from 'chai';
import { ContributorTotalStats } from '../../dataentities/contributor.total.stats';
import { computeContributorTotal } from '../../datalogic/processors/contributor.total';

describe('computeContributorTotalTest', () => {
  describe('#testSuccess', () => {
    let input: any[] = [{
      "author": {
        "login": "octocat",
        "id": 1,
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "gravatar_id": "",
        "url": "https://api.github.com/users/octocat",
        "html_url": "https://github.com/octocat",
        "repos_url": "https://api.github.com/users/octocat/repos",
        "type": "User",
        "site_admin": false
      },
      "total": 270,
      "weeks": [
        {
          "w": "1367712000",
          "a": 6898,
          "d": 77,
          "c": 10
        }, {
          "w": "1367712001",
          "a": 6898,
          "d": 77,
          "c": 10
        }
      ]
    }, {
      "author": {
        "login": "octocat2",
        "id": 2,
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "gravatar_id": "",
        "url": "https://api.github.com/users/octocat2",
        "html_url": "https://github.com/octocat2",
        "repos_url": "https://api.github.com/users/octocat2/repos",
        "type": "User",
        "site_admin": false
      },
      "total": 135,
      "weeks": [
        {
          "w": "1367712000",
          "a": 6898,
          "d": 77,
          "c": 10
        }
      ]
    }];
    let expected: ContributorTotalStats[] = [
      { contributor: 'octocat', commits: 20, additions: 6898*2, deletions: 154 },
      { contributor: 'octocat2', commits: 10, additions: 6898, deletions: 77 }
    ];

    it('should give 2 contributors', () => {
      let results: ContributorTotalStats[] = computeContributorTotal(input);
      assert.equal(results.length, expected.length);
      results.forEach((contrib: ContributorTotalStats, idx: number): void => {
        assert.deepEqual(contrib, expected.find((res: ContributorTotalStats): boolean =>
          res.contributor===contrib.contributor), 'Contributor should have correct contribution values');
      });
    });
  });

  describe('#errorHandling', () => {
    let input: any[] = [{
      "author": {
        "login": "octocat",
        "id": 1,
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "gravatar_id": "",
        "url": "https://api.github.com/users/octocat",
        "html_url": "https://github.com/octocat",
        "repos_url": "https://api.github.com/users/octocat/repos",
        "type": "User",
        "site_admin": false
      },
      "total": 270,
      "weeks": [
        {
          "w": "1367712000",
          "a": 6898,
          "d": 77,
          "c": 10
        }, {
          "w": "1367712001",
          "d": 77,
          "c": 10
        }
      ]
    }, {
      "author": {
        "id": 2,
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "gravatar_id": "",
        "url": "https://api.github.com/users/octocat2",
        "html_url": "https://github.com/octocat2",
        "repos_url": "https://api.github.com/users/octocat2/repos",
        "type": "User",
        "site_admin": false
      },
      "total": 135,
      "weeks": [
        {
          "w": "1367712000",
          "a": 6898,
          "d": 77,
          "c": 10
        }
      ]
    }];
    let expected: ContributorTotalStats[] = [
      { contributor: 'octocat', commits: 20, additions: 6898, deletions: 154 },
    ];

    it('should still work with some incorrect data on erroneous inputs', () => {
      let results: ContributorTotalStats[] = computeContributorTotal(input);
      assert.equal(results.length, expected.length);
      results.forEach((contrib: ContributorTotalStats, idx: number): void => {
        assert.deepEqual(contrib, expected.find((res: ContributorTotalStats): boolean =>
          res.contributor===contrib.contributor), 'Contributor should have some incorrect values');
      });
    });
  });
});
