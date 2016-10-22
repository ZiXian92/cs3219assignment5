/**
 * tests/datalogic/repos/processor.test.ts
 * Unit test for component that formats list of repos from Github API.
 * @author zixian92
 */

'use strict';
import { assert } from 'chai';
import { formatReposList } from '../../datalogic/processors/repos';
import { Repository } from '../../dataentities/repository';

describe('formatRepoListTest', () => {
  describe('#successTest', () => {
    let input = [{
      "id": 1296269,
      "owner": {
        "login": "octocat",
        "id": 1,
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "gravatar_id": "",
        "url": "https://api.github.com/users/octocat",
        "type": "User",
        "site_admin": false
      },
      "name": "Hello-World",
      "full_name": "octocat/Hello-World",
      "description": "This your first repo!",
      "private": false,
      "fork": false,
      "url": "https://api.github.com/repos/octocat/Hello-World",
      "html_url": "https://github.com/octocat/Hello-World"
    }, {
      "id": 1296270,
      "owner": {
        "login": "octocat",
        "id": 1,
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "gravatar_id": "",
        "url": "https://api.github.com/users/octocat",
        "type": "User",
        "site_admin": false
      },
      "name": "Hello-World2",
      "full_name": "octocat/Hello-World2",
      "description": "This your first repo!",
      "private": false,
      "fork": false,
      "url": "https://api.github.com/repos/octocat/Hello-World2",
      "html_url": "https://github.com/octocat/Hello-World2"
    }, {
      "id": 1296285,
      "owner": {
        "login": "octocat3",
        "id": 2,
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "gravatar_id": "",
        "url": "https://api.github.com/users/octocat3",
        "type": "User",
        "site_admin": false
      },
      "name": "Bye-Bye",
      "full_name": "octocat3/Bye-Bye",
      "description": "This your first repo!",
      "private": false,
      "fork": false,
      "url": "https://api.github.com/repos/octocat3/Bye-Bye",
      "html_url": "https://github.com/octocat3/Bye-Bye"
    }];
    let expected: Repository[] = [
      { owner: 'octocat', name: 'Hello-World' },
      { owner: 'octocat', name: 'Hello-World2' },
      { owner: 'octocat3', name: 'Bye-Bye' }
    ];

    it('should parse all into repos in input order', () => {
      let results: Repository[] = formatReposList(input);
      assert.equal(results.length, expected.length, 'Number of repos do not match');
      results.forEach((repo: Repository, idx: number): void => {
        assert.deepEqual(repo, expected[idx], 'Repo in output should correspond to input');
      });
    });
  });

  describe('#errorHandlingTest', () => {
    let input = [{
      "id": 1296269,
      "owner": {
        "login": "",
        "id": 1,
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "gravatar_id": "",
        "url": "https://api.github.com/users/octocat",
        "type": "User",
        "site_admin": false
      },
      "name": "Hello-World",
      "full_name": "octocat/Hello-World",
      "description": "This your first repo!",
      "private": false,
      "fork": false,
      "url": "https://api.github.com/repos/octocat/Hello-World",
      "html_url": "https://github.com/octocat/Hello-World"
    }, {
      "id": 1296270,
      "owner": {
        "login": "octocat",
        "id": 1,
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "gravatar_id": "",
        "url": "https://api.github.com/users/octocat",
        "type": "User",
        "site_admin": false
      },
      "name": "",
      "full_name": "octocat/Hello-World2",
      "description": "This your first repo!",
      "private": false,
      "fork": false,
      "url": "https://api.github.com/repos/octocat/Hello-World2",
      "html_url": "https://github.com/octocat/Hello-World2"
    }, {
      "id": 1296285,
      "owner": {
        "login": "octocat3",
        "id": 2,
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "gravatar_id": "",
        "url": "https://api.github.com/users/octocat3",
        "type": "User",
        "site_admin": false
      },
      "name": "Bye-Bye",
      "full_name": "octocat3/Bye-Bye",
      "description": "This your first repo!",
      "private": false,
      "fork": false,
      "url": "https://api.github.com/repos/octocat3/Bye-Bye",
      "html_url": "https://github.com/octocat3/Bye-Bye"
    }];
    let expected: Repository[] = [{ owner: 'octocat3', name: 'Bye-Bye' }];
    it('should only process the last repo', () => {
      let results: Repository[] = formatReposList(input);
      assert.equal(results.length, expected.length, 'Number of parsed repositories should match expected number');
      results.forEach((repo: Repository, idx: number): void => {
        assert.deepEqual(repo, expected[idx]);
      });
    });
  });
});
