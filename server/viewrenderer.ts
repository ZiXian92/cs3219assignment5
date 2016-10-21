


import { Request, Response, NextFunction } from 'express';
import { provideRoutes } from '@angular/router';
import { enableProdMode } from '@angular/core';
// import {
//   REQUEST_URL,
//   ORIGIN_URL,
//   NODE_LOCATION_PROVIDERS,
//   NODE_HTTP_PROVIDERS,
// } from 'angular2-universal';
import { AppComponent } from '../src/app/app.component';
// import { appRoutes } from '../src/app/app.routing';

if(process.env.NODE_ENV==='production') enableProdMode();

export function ViewRenderer(req: Request, res: Response, next: NextFunction): any {
  let url: string = req.originalUrl || '/';
  let baseUrl: string = '/';
  // res.render('index', {
  //   directives: [ AppComponent ],
  //   platformProviders: [
  //     { provide: ORIGIN_URL, useValue: 'http://localhost:7777' },
  //     { provide: 'BASE_URL', useValue: baseUrl }
  //   ],
  //   providers: [
  //     { provide: REQUEST_URL, useValue: url },
  //     provideRoutes(appRoutes),
  //     NODE_LOCATION_PROVIDERS,
  //     NODE_HTTP_PROVIDERS
  //   ],
  //   async: true,
  //   preboot: false
  // });
  res.render('index', {
    req, res, preboot: false, baseUrl: '/', requestUrl: req.originalUrl,
    originUrl: 'http://localhost:7777'
  });
}
