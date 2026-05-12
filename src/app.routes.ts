import { Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './app/guard/auth-guard.service';
import { RoleGuardService as RoleGuard } from './app/guard/role/role-guard.service';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/publicity/dashboard/dashboard';
import { Landing } from './app/pages/publicity/landing/landing';
import { Notfound } from './app/pages/publicity/notfound/notfound';
import { Name_Role } from './constants/constants.auth';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                component: Dashboard,
                canActivate: [RoleGuard],
                data: {
                    expectedRole: [Name_Role.administrator, Name_Role.subscriber]
                }
            },
            {
                path: 'uikit',
                loadChildren: () => import('./app/pages/publicity/uikit/uikit.routes'),
                canActivate: [RoleGuard],
                data: {
                    expectedRole: [Name_Role.uiprime, Name_Role.administrator]
                }
            },
            {
                path: 'mgt', //management
                loadChildren: () => import('./app/pages/management/equipment/equipment.routes'),
                canActivate: [AuthGuard]
            },
            {
                path: 'mgt', //management
                loadChildren: () => import('./app/pages/management/location/location.routes'),
                canActivate: [AuthGuard]
            },
             {
                path: 'mgt',
                loadChildren: () => import('./app/pages/tpm/tmp.routers'),
                canActivate: [AuthGuard]
            },
            {
                path: 'mgt',
                loadChildren: () => import('./app/pages/report/report.routes'),
                canActivate: [AuthGuard]
            },
             {
                path: 'mgt',
                loadChildren: () => import('./app/pages/management/system/system.routes'),
                canActivate: [AuthGuard]
            },
            {
                path: 'pages-free',
                loadChildren: () => import('./app/pages/publicity/publicity.routes'),
                canActivate: [AuthGuard]
            },
            {
                path: 'report',
                loadChildren: () => import('./app/pages/report/report.routes'),
                canActivate: [AuthGuard]
            },
            {
                path: 'mgt',
                loadChildren: () => import('./app/pages/management/system/system.routes'),
                canActivate: [AuthGuard]
            },

            //==========
            {
                path: 'pages',
                loadChildren: () => import('./app/pages/pp-management/pp-management.route'),
                canActivate: [AuthGuard]
            },
            {
                path: 'pages',
                loadChildren: () => import('./app/pages/user-management/user-management.route'),
                canActivate: [AuthGuard]
            },
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
