/**
 * misc/fetch.wrapper.ts
 * Defines the wrapper functions for isomorphic-fetch module.
 * This module can help to abstract away the network and authentication related
 * complexities from the main application logic should there be a need to make
 * authenticated requests.
 * @author zixian92
 */

'use strict';
import { reject, Thenable } from 'bluebird';
import * as fetch from 'isomorphic-fetch';

/**
 * Defines the header object definition for the wrapper API.
 */
export interface RequestHeaders {
  [headerName: string]: string;
}

export interface FetchResponse {
  headers: IHeaders,
  body: any
}

/**
 * Sends a GET request to receive text data.
 * GET requests only has at most some headers.
 */
export function get(url: string, headers?: RequestHeaders): Thenable<any> {
  return fetch(url, {
    method: 'GET',
    headers,
    mode: 'cors',
    cache: 'default'
  }).then((res: IResponse): Thenable<any> => res.ok? res.text().then((body: any): FetchResponse => ({
    headers: res.headers,
    body
  })): reject(res));
}

/**
 * Sends a GET request to receive JSON data.
 * GET requests only has at most some headers.
 */
export function getJson(url: string, headers?: RequestHeaders): Thenable<any> {
  headers = headers || {};
  headers['Accept'] = 'application/json';
  return fetch(url, {
    method: 'GET',
    headers,
    mode: 'cors',
    cache: 'default'
  }).then((res: IResponse): Thenable<any> => res.ok? res.json().then((body: any): FetchResponse => ({
    headers: res.headers,
    body
  })): reject(res));
}
