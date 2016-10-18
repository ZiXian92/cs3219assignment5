/**
 * data/logic/repolinkparser.js
 * Defines the component to extract owner and repository name from
 * given Github repository URL.
 * @author zixian92
 */
"use strict";
var RepoLinkParser = (function () {
    function RepoLinkParser() {
    }
    /**
     * Extracts repo owner and repo name from given repo URL.
     * @param {string} url
     * @return {{owner: string, repo: string}}
     */
    RepoLinkParser.prototype.getRepoFromURL = function (url) {
        return {
            owner: 'john',
            repo: 'some_repo'
        };
    };
    return RepoLinkParser;
}());
exports.__esModule = true;
exports["default"] = RepoLinkParser;
