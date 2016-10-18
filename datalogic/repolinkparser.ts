/**
 * data/logic/repolinkparser.js
 * Defines the component to extract owner and repository name from
 * given Github repository URL.
 * @author zixian92
 */

import Repository from '../dataentities/repository';

export default class RepoLinkParser {
  private static prefix: string = 'https://github.com/';
  private static format: string = 'https://github.com/<owner>/<repo>';

  /**
   * Extracts repo owner and repo name from given repo URL.
   * @param {string} url of the format https:/github.com/<owner>/<repo>
   * @return Repository? returns null if error occurred
   */
  getRepoFromURL(url:string): Repository {
    if(!url.startsWith(RepoLinkParser.prefix)){
      console.log(`URL should be of the format: ${RepoLinkParser.format}`);
      return null;
    }
    var parts = url.replace(RepoLinkParser.prefix, '').split('/');
    if(parts.length<2){
      console.log(`URL should be of the format: ${RepoLinkParser.format}`);
      return null;
    }
    return new Repository(parts[0], parts[1]);
  }
}
