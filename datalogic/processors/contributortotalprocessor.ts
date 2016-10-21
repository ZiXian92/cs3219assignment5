/**
 * datalogic/processors/contributortotalprocessor.ts
 * Defines the processing component that computes total contributions for each user.
 * @author zixian92
 */

'use strict';
import * as Promise from 'bluebird';
import { ContributorTotalStats } from '../../dataentities/contributortotalstats';
import { GitDataProcessor } from './gitdataprocessor';

export class ContributorTotalProcessor implements GitDataProcessor {
  constructor() {

  }

  public processData(data: any): Promise.Thenable<ContributorTotalStats[]> {
    return Promise.resolve([{
      commits: 300, additions: 200, deletions: 0
    }, {
      commits: 2, additions: 5, deletions: 100
    }]);
  }
}
