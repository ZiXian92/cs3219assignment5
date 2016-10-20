import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { routing } from './app.routing';

import { secret } from './app.secret'

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { DashboardComponent } from './dashboard/dashboard.component';

import { UserService } from './services/user.service';
import { GithubService } from './services/github.service';
import { AuthenticationGuard } from './services/authentication.guard';

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    HttpModule,
    BrowserModule,
    FormsModule,
    routing
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent
  ],
  providers: [
    UserService,
    GithubService,
    AuthenticationGuard,
    secret
  ]
})
export class AppModule { }