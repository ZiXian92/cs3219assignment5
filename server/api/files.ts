/**
 * server/api/files.ts
 * Repository files-related endpoint handler.
 * @author zixian92
 */

'use strict';
import { Router, Request, Response, NextFunction } from 'express';
import { Repository } from '../../dataentities/repository';
import { RepoRequest } from '../../dataentities/repo.data.request';
import { PromisePipe } from '../../datalogic/promise.pipe';
import { getFiles } from '../../datalogic/fetchers/files';
import { extractFilePaths } from '../../datalogic/processors/file.list';

export const FilesRouter = Router();

FilesRouter.get('/:owner/:repo', (req: Request, res: Response, next: NextFunction): void => {
  console.log("Handling file list request");
  let reqData: RepoRequest = {
    repo: { owner: req.params.owner, name: req.params.repo },
    branch: req.query.branch || 'master'
  };
  new PromisePipe(getFiles, extractFilePaths).processData(reqData)
  .then((filePaths: string[]): any => res.json(filePaths))
  .catch(err => console.log(err));
});
