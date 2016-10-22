'use strict';
import { Thenable } from 'bluebird';

export interface DataTransformer {
  (data: any): any;
}
