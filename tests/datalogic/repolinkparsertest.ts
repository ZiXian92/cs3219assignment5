import RepoLinkParser from '../../datalogic/repolinkparser';
import {assert} from 'chai';

describe('RepoLinkParserTest', () => {
  describe('#parsetest', () => {
    var parser: RepoLinkParser = new RepoLinkParser();
    it('should only have owner name and repo name', () => {
      assert.deepEqual(parser.getRepoFromURL('https://github.com/ZiXian92/MyGitHubIssueTracker'), {owner: 'ZiXian92', repo: 'MyGithubIssueTracker'});
    })
  });
});
