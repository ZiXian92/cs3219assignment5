'use strict';
import * as Promise from 'bluebird';

export interface GitDataProcessor {
  processData(data: any): Promise.Thenable<any>;
}
