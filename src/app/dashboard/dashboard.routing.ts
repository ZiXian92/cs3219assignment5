import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { ContributionsComponent } from './contributions/contributions.component';
import { CommitHistoryComponent } from './commit-history/commit-history.component';
import { FileHistoryComponent } from './file-history/file-history.component';
import { FinalComponent } from './final/final.component';
import { SubscribeComponent } from './subscribe/subscribe.component';


const dashboardRoutes: Routes = [
    {
        path: "dashboard",
        component: DashboardComponent,
        children: [{
            path: '',
            redirectTo: 'contributions'
        }, {
            path: 'contributions',
            component: ContributionsComponent
        }, {
            path: 'commit-history',
            component: CommitHistoryComponent
        }, {
            path: 'file-history',
            component: FileHistoryComponent
        }, {
            path: 'final',
            component: FinalComponent
        }, {
            path: 'subscribe',
            component: SubscribeComponent
        }]
    }
];

export const DashboardRouting: ModuleWithProviders 
        = RouterModule.forChild(dashboardRoutes);