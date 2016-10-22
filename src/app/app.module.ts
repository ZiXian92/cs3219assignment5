import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { MaterialModule } from '@angular/material';

import { DashboardModule } from './dashboard/dashboard.module';
import { routing } from './app.routing';
import { secret } from './app.secret'

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TitlebarComponent } from './dashboard/titlebar/titlebar.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';

import { UserService } from './services/user.service';
import { GithubService } from './services/github.service';
import { AuthenticationGuard } from './services/authentication.guard';

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    HttpModule,
    BrowserModule,
    FormsModule,
    DashboardModule,
    NgbModule.forRoot(),
    ChartsModule,
    MaterialModule.forRoot(),
    routing
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    TitlebarComponent,
    SidebarComponent
  ],
  providers: [
    UserService,
    GithubService,
    AuthenticationGuard,
    secret
  ]
})
export class AppModule { }