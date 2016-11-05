/**
 * server/api/final.ts
 * 
 * @author munaw
 */

'use strict';
import { Router, Request, Response, NextFunction } from 'express';

export const FinalRouter = Router();

FinalRouter.get('/:owner/:repo', (req: Request, res: Response, next: NextFunction): void => {

  const execFile = require('child_process').execFile;

  const child = execFile('python', ['server/api/gitinspector-master/gitinspector.py', '--format=json' , "https://github.com/" + req.params.owner + "/" + req.params.repo], (error, stdout, stderr) => {
    
    if (error) {
      console.log(stderr);
      return res.status(500).send(error);
    }
    var json = JSON.parse(stdout)['gitinspector']['blame']['authors'];
    for(var i = 0; i < json.length; ++i) {
        delete json[i]['gravatar'];
        delete json[i]['age'];
    }

    return res.status(200).send(json);
    });
});

