/**
 * tests/datalogic/file.list.test.ts
 * Unit test for file paths extractor component.
 * @author zixian92
 */

'use strict';
import { assert } from 'chai';
import { extractFilePaths } from '../../datalogic/processors/file.list';

describe('extractFilePathsTest', () => {
  describe('#successFlow', () => {
    let input: any = {
      "sha": "eedb6ce77468adee6817258eebb81ccd93d6a5ea",
      "url": "https://api.github.com/repos/tungnk1993/scrapy/git/trees/eedb6ce77468adee6817258eebb81ccd93d6a5ea",
      "tree": [
        {
          "path": "docs/topics",
          "mode": "040000",
          "type": "tree",
          "sha": "a1a022782846c1acd984d219366a6bafb41bd8e1",
          "url": "https://api.github.com/repos/tungnk1993/scrapy/git/trees/a1a022782846c1acd984d219366a6bafb41bd8e1"
        },
        {
          "path": "docs/contributing.rst",
          "mode": "100644",
          "type": "blob",
          "sha": "b0a435ad2d09fdf14af567427ee18aef32103d0c",
          "size": 7621,
          "url": "https://api.github.com/repos/tungnk1993/scrapy/git/blobs/b0a435ad2d09fdf14af567427ee18aef32103d0c"
        },
        {
          "path": ".gitignore",
          "mode": "100644",
          "type": "blob",
          "sha": "b116640b4f2a78affe444c855ee084057774439e",
          "size": 142,
          "url": "https://api.github.com/repos/tungnk1993/scrapy/git/blobs/b116640b4f2a78affe444c855ee084057774439e"
        }
      ]
    };
    let expected: string[] = [ "docs/contributing.rst", ".gitignore" ].sort();

    it('should only process files and not directories', () => {
      let actual: string[] = extractFilePaths(input).sort();
      assert.equal(actual.length, expected.length);
      actual.forEach((a: string, idx: number): any => assert.strictEqual(a, expected[idx]));
    });
  });

  describe('#errorHandling', () => {
    let input: any = {
      "sha": "eedb6ce77468adee6817258eebb81ccd93d6a5ea",
      "url": "https://api.github.com/repos/tungnk1993/scrapy/git/trees/eedb6ce77468adee6817258eebb81ccd93d6a5ea",
      "tree": [
        {
          "path": "docs/topics",
          "mode": "040000",
          "sha": "a1a022782846c1acd984d219366a6bafb41bd8e1",
          "url": "https://api.github.com/repos/tungnk1993/scrapy/git/trees/a1a022782846c1acd984d219366a6bafb41bd8e1"
        },
        {
          "mode": "100644",
          "type": "blob",
          "sha": "b0a435ad2d09fdf14af567427ee18aef32103d0c",
          "size": 7621,
          "url": "https://api.github.com/repos/tungnk1993/scrapy/git/blobs/b0a435ad2d09fdf14af567427ee18aef32103d0c"
        },
        {
          "path": ".gitignore",
          "mode": "100644",
          "type": "blob",
          "sha": "b116640b4f2a78affe444c855ee084057774439e",
          "size": 142,
          "url": "https://api.github.com/repos/tungnk1993/scrapy/git/blobs/b116640b4f2a78affe444c855ee084057774439e"
        }
      ]
    };
    let expected: string[] = [".gitignore"];
    it("should ignore empty path and type", () => {
      let actual: string[] = extractFilePaths(input).sort();
      assert.equal(actual.length, expected.length);
      actual.forEach((a: string, idx: number): any => assert.strictEqual(a, expected[idx]));
    });

    it("should return empty list when data has no tree", () => {
      delete input.tree;
      let actual: string[] = extractFilePaths(input).sort();
      assert.equal(actual.length, 0);
    });
  });
});
