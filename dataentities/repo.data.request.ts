/**
 * dataentities/repo.data.request.ts
 * Defines the object representing request to get a repository's
 * data. This object is to be used to pass into transformation
 * pipeline to transform into the requested data.
 * @author zixian92
 */

'use strict';
import { Repository } from './repository';

export interface RepoRequest {
  readonly repo: Repository;
  requestor?: string;
  data?: any
}
