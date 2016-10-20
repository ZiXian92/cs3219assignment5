import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class UserService {
  private loggedIn = false;

  constructor(private http: Http) {
    this.loggedIn = !!localStorage.getItem('access_token');
  }

  login(accessToken: string) {
    localStorage.setItem('access_token', accessToken);
    this.loggedIn = true;
  }
  
  logout() {
    localStorage.removeItem('access_token');
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}