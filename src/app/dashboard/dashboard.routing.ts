import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { ContributionsComponent } from './contributions/contributions.component';
import { CommitHistoryComponent } from './commit-history/commit-history.component';
import { FileHistoryComponent } from './file-history/file-history.component';
import { FinalComponent } from './final/final.component';
import { SubscribeComponent } from './subscribe/subscribe.component';

import { AuthenticationGuard } from '../services/authentication.guard';

const dashboardRoutes: Routes = [
    {
        path: "dashboard",
        component: DashboardComponent,
        children: [{
            path: '',
            canActivate: [AuthenticationGuard],
            redirectTo: 'contributions'
        }, {
            path: 'contributions',
            canActivate: [AuthenticationGuard],
            component: ContributionsComponent
        }, {
            path: 'commit-history',
            canActivate: [AuthenticationGuard],
            component: CommitHistoryComponent
        }, {
            path: 'file-history',
            canActivate: [AuthenticationGuard],
            component: FileHistoryComponent
        }, {
            path: 'final',
            canActivate: [AuthenticationGuard],
            component: FinalComponent
        }, {
            path: 'subscribe',
            canActivate: [AuthenticationGuard],
            component: SubscribeComponent
        }]
    }
];

export const DashboardRouting: ModuleWithProviders 
        = RouterModule.forChild(dashboardRoutes);