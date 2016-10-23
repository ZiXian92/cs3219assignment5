/**
 * datalogic/processors/users.ts
 * Defines the component that processes user list response from GitHub API.
 *@author zixian92
 */

'use strict';

export function formatUsersList(users: any[]): string[] {
  return users.map((user: any): string => user.login);
}
