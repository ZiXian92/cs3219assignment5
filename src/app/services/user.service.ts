import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class UserService {
  private loggedIn = false;

  constructor(private http: Http) {
    this.loggedIn = !!localStorage.getItem('token');
  }

  login(accessToken: string) {
    localStorage.setItem('token', accessToken);
    this.loggedIn = true;
  }

  getToken() {
    return localStorage["token"];
  }
   
  logout() {
    localStorage.removeItem('token');
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}