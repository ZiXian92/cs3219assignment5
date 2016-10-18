/**
 * data/logic/repolinkparser.js
 * Defines the component to extract owner and repository name from
 * given Github repository URL.
 * @author zixian92
 */

export default class RepoLinkParser {

  /**
   * Extracts repo owner and repo name from given repo URL.
   * @param {string} url
   * @return {{owner: string, repo: string}}
   */
  getRepoFromURL(url:string){
    return {
      owner: 'john',
      repo: 'some_repo'
    };
  }
}
