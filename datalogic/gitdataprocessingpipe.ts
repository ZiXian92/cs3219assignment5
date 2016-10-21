/**
 * datalogic/gitdataprocessingpipe.ts
 * Defines the pipeline processing component of data.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import { GitDataFetcher } from './fetchers/gitdatafetcher';
import { GitDataProcessor } from './processors/gitdataprocessor';

export class GitDataProcessingPipe {
  private _filters: GitDataProcessor[];
  constructor(...filters: GitDataProcessor[]) {
    this._filters = filters;
  }
  public processData(datasource: Promise.Thenable<any>): Promise.Thenable<any> {
    return this._filters.reduce((curRes: Promise.Thenable<any>, curFilter: GitDataProcessor): Promise.Thenable<any> => curRes.then(curFilter.processData), datasource);
  }
}
