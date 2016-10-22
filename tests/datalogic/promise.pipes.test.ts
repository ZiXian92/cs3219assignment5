/**
 * tests/datalogic/promise.pipe.test.ts
 * Unit test for PromisePipe class.
 * @author zixian92
 */

'use strict';
import { assert, expect } from 'chai';
import { PromisePipe } from '../../datalogic/promise.pipe';
import { DataTransformer } from '../../datalogic/data.transformer';

describe('PromisePipeTest', () => {
  describe('#successFlow', () => {
    let expectedResult: string[] = [
      'Filter A', 'Filter B', 'Filter C', 'Filter D'
    ];
    let results: string[] = [];
    let pipe: PromisePipe = new PromisePipe(
      (data: number): number => { results.push('Filter A'); return data+1; },
      (data: number): string => { results.push('Filter B'); return `${data} little`; },
      (data: string): string => { results.push('Filter C'); return `The ${data}`; },
      (data: string): string => { results.push('Filter D'); return `${data} lambs`; }
    );
    it('should be the correct transformed data', () => {
      pipe.processData(1).then((res: string) => {
        assert.equal(res, 'The 2 little lambs', 'Output should be The 2 lambs');
        assert.equal(results.length, expectedResult.length);
        results.forEach((r: string, i: number): void => assert.strictEqual(r, expectedResult[i]));
      });
    })
  });

  describe('#failFlow', () => {
    let expectedResult = ['Filter A'];
    let results: string[] = [];
    let pipe: PromisePipe = new PromisePipe(
      (data: number): number => { results.push('Filter A'); console.log(results.length); return data+1; },
      (data: number): string => { throw 'Fail at B'; },
      (data: string): string => { results.push('Filter C'); console.log(results.length); return `The ${data}`; },
      (data: string): string => { results.push('Filter D'); console.log(results.length); return `${data} lambs`; }
    );

    it('only 1st filter should be executed', () => {
      pipe.processData(1).then(() => assert.fail(), (err: string) => {
        assert.equal(err, 'Fail at B');
        assert.equal(results.length, expectedResult.length);
        results.forEach((r: string, i: number): void => assert.strictEqual(r, expectedResult[i]));
      });
    });
  });
});
