/**
 * server/app.ts
 * The server side entrypoint bootstrapping the application.
 * @author zixian92
 */

'use strict';
import * as bodyParser from 'body-parser';
import * as express from 'express';

class Server {
  private static METHOD_GET: string = 'GET';
  private static METHOD_POST: string = 'POST';
  private static METHOD_PUT: string = 'PUT';
  private static METHOD_DELETE: string = 'DELETE';

  private app: express.Application;
  private port: number;

  constructor(port: number = 7777) {
    if(!Number.isInteger(port)) throw 'Invalid port. Port number must be positive integer up to 65535.';
    this.port = port;
    this.app = express();
  }

  /**
   * Adds a middleware that executes for each request.
   * Note that middleware should be added in the same
   * order that you want the request to be processed by.
   */
  public addMiddleware(middleware: (req: express.Request, res: express.Response, next?: express.NextFunction) => void): void {
    this.app.use(middleware);
  }

  /**
   * Adds a router to handle the given route path.
   */
  public addRoute(routePath: string, router: express.Router): void {
    this.app.use(routePath, router);
  }

  /**
   * Adds route handler for given path with given request type.
   */
  private addRouteHandler(routePath: string, method: string, handler: (req: express.Request, res: express.Response, next?: express.NextFunction) => void): void {
    switch(method){
      case Server.METHOD_GET: this.app.get(routePath, handler); break;
      case Server.METHOD_POST: this.app.post(routePath, handler); break;
      case Server.METHOD_PUT: this.app.put(routePath, handler); break;
      case Server.METHOD_DELETE: this.app.delete(routePath, handler); break;
    }
  }

  public addGetRoute(routePath: string, handler: (req: express.Request, res: express.Response, next?: express.NextFunction) => void): void {
    this.addRouteHandler(routePath, Server.METHOD_GET, handler);
  }

  public addPostRoute(routePath: string, handler: (req: express.Request, res: express.Response, next?: express.NextFunction) => void): void {
    this.addRouteHandler(routePath, Server.METHOD_POST, handler);
  }

  /**
   * Adds route handler for put request.
   */
  public addPutRoute(routePath: string, handler: (req: express.Request, res: express.Response, next?: express.NextFunction) => void): void {
    this.addRouteHandler(routePath, Server.METHOD_PUT, handler);
  }

  /**
   * Adds route handler for delete request.
   */
  public addDeleteRoute(routePath: string, handler: (req: express.Request, res: express.Response, next?: express.NextFunction) => void): void {
    this.addRouteHandler(routePath, Server.METHOD_DELETE, handler);
  }

  /**
   * Starts the server instance.
   */
  public run(): void {
    this.app.listen(this.port, () => console.log(`Express server started on port ${this.port}`));
  }
}

var app = new Server();
app.addMiddleware(express.static('./dist'));
app.addMiddleware(bodyParser.json());
// app.addGetRoute('/sayhello', (req, res, next) => res.send('Hello'));
app.run();
