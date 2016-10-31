/**
 * datalogic/processors/response.to.request.ts
 * Defines component to wrap response from previous operations into
 * request for subsequent operation.
 * @author zixian92
 */

'use strict';
import { RepoRequest } from '../../dataentities/repo.data.request';
import { Repository } from '../../dataentities/repository';

export interface ResponseToRequest {
  (res: any): RepoRequest;
}

export function createResponseWrapper(baseReqObj: RepoRequest): ResponseToRequest {
  return (data: any): RepoRequest => Object.assign({}, baseReqObj, { data });
}
