/**
 * datalogic/processors/file.list.ts
 * Defines the component to extract file paths from Git Tree API response.
 * @author zixian92
 */

'use strict';

export function extractFilePaths(tree: any): string[] {
  return tree.tree? tree.tree.map((t: any): string => (t.path && t.type && t.type!=='tree')? t.path: null).filter((path: string): boolean => !!path): [];
}
