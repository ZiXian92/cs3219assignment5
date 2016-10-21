/**
 * datalogic/promise.pipe.ts
 * Defines the generalized promise-based pipes and filter
 * sub-architecture.
 * @author zixian92
 */

'use strict';
import { Thenable, resolve } from 'bluebird';
import { DataTransformer } from './data.transformer';

export class PromisePipe {
  private _filters: DataTransformer[];

  /**
   * Creates a new transformation pipeline using the given list of transformations.
   * The transformations must be specified in the exact order in which data should be
   * processed.
   */
  constructor(...filters: DataTransformer[]) {
    this._filters = filters;
  }

  /**
   * Passes the data through the series of transformations
   * specified in the constructor.
   */
  public processData(data: any): Thenable<any> {
    return this._filters.reduce(
      (curPromise: Thenable<any>, nextFilter: DataTransformer) => curPromise.then(nextFilter),
      resolve(data));
  }
}
