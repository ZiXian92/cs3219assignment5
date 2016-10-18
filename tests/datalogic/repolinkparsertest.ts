import RepoLinkParser from '../../datalogic/repolinkparser';
import Repository from '../../dataentities/repository';
import {assert} from 'chai';

describe('RepoLinkParserTest', () => {
  describe('#parsetest', () => {
    var parser: RepoLinkParser = new RepoLinkParser();
    it('should only have owner name and repo name', () => {
      assert.deepEqual(new Repository('ZiXian92', 'MyGitHubIssueTracker'), parser.getRepoFromURL('https://github.com/ZiXian92/MyGitHubIssueTracker'));
    });

    it('should be null for invalid Github repo URL', () => {
      assert.isNull(parser.getRepoFromURL('http://github.com/zixian92/mygithubissuetracker'));
      assert.isNull(parser.getRepoFromURL('https://github.com/zixian92'));
      assert.isNull(parser.getRepoFromURL('http://github.com/zixian92/mygithubissuetracker'));
    })
  });
});
