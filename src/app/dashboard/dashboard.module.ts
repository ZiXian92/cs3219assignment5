import { NgModule } from '@angular/core';
import { DashboardRouting } from './dashboard.routing';

import { ContributionsComponent } from './contributions/contributions.component';
import { CommitHistoryComponent } from './commit-history/commit-history.component';
import { FileHistoryComponent } from './file-history/file-history.component';
import { SubscribeComponent } from './subscribe/subscribe.component';

import { GithubService } from '../services/github.service';

@NgModule({
  imports: [
    DashboardRouting
  ],
  declarations: [
    ContributionsComponent,
    CommitHistoryComponent,
    FileHistoryComponent,
    SubscribeComponent
  ],
  providers: [
    GithubService
  ]
})
export class DashboardModule { }