/**
 * server/api/subscribe.ts
 * Endpoint router for subscribing user to interval email reminder.
 * @author munaw
 */

'use strict';
import { Router, Request, Response, NextFunction } from 'express';
import { secret } from '../secret';

export const SubscribeRouter = Router();

SubscribeRouter.post('/:owner/:repo', (req: Request, res: Response, next: NextFunction): void => {
  var AWS = require('aws-sdk');
  let s: secret = new secret();
  AWS.config.update({
  	accessKeyId: s.getAWSAccessID(), 
  	secretAccessKey: s.getAWSSecret(), 
  	region:'ap-southeast-1'
  });

  var lambda = new AWS.Lambda();
  var params = {
    FunctionName: 'updateEmailList', 
    Payload: JSON.stringify({ email: req.body.email, url: "https://github.com/" + req.params.owner + "/" + req.params.repo})
	// Payload: "[\"email\": \"jasontanma@hotmail.com\"]"
  };
  console.log(params);
  lambda.invoke(params, function(err, data) {
	if(data['FunctionError']) {
	  return res.sendStatus(400);
	      
	} else {
	  return res.sendStatus(201);
  	}
  });
  
});


/** Original Express code without type script

var AWS = require('aws-sdk');
  console.log("HERE");
  AWS.config.update({
  	accessKeyId: s.getAWSAccessID(), 
  	secretAccessKey: s.getAWSSecret(), 
  region:'ap-southeast-1'});

  var lambda = new AWS.Lambda();
  var params = {
    FunctionName: 'updateEmailList', 
    Payload: JSON.stringify({ email: req.body.email })
  };
  lambda.invoke(params, function(err, data) {
    if(data['FunctionError']) {
      return res.sendStatus(400);
      
    } else {
      return res.sendStatus(201);
    }
  });

*/