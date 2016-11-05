import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { MaterialModule } from '@angular/material';

import { DashboardRouting } from './dashboard.routing';

import { ContributionsComponent } from './contributions/contributions.component';
import { CommitHistoryComponent } from './commit-history/commit-history.component';
import { FileHistoryComponent } from './file-history/file-history.component';
import { FinalComponent } from './final/final.component';
import { SubscribeComponent } from './subscribe/subscribe.component';

import { MultiSelectComponent } from '../utilities/multi-select/multi-select.component';
import { FileSelectComponent } from '../utilities/file-select/file-select.component';
import { FileChangesComponent } from '../utilities/file-changes/file-changes.component';

import { GithubService } from '../services/github.service';

@NgModule({
  imports: [
    // This module is required for simple directives like NgFor to work
    BrowserModule,
    // This module is required for ng-bootstrap to work
    FormsModule,
    NgbModule,
    ChartsModule,
    MaterialModule.forRoot(),
    DashboardRouting
  ],
  declarations: [
    ContributionsComponent,
    CommitHistoryComponent,
    FileHistoryComponent,
    FinalComponent,
    SubscribeComponent,
    MultiSelectComponent,
    FileSelectComponent,
    FileChangesComponent
  ],
  providers: [
    GithubService
  ]
})
export class DashboardModule { }