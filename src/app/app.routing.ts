import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SetupComponent } from './setup/setup.component';

import { DashboardComponent } from './dashboard/dashboard.component';

import { AuthenticationGuard } from './services/authentication.guard';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        canActivate: [AuthenticationGuard],
        pathMatch: 'full'
    },{
        path: 'login',
        component: LoginComponent
    },{
        path: 'setup',
        component: SetupComponent
    },{
        path: 'dashboard',
        canActivate: [AuthenticationGuard],
        component: DashboardComponent
    },{ path: '**', 
        redirectTo: 'dashboard',
        canActivate: [AuthenticationGuard],
        pathMatch: 'full'
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);