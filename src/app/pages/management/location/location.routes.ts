import { Routes } from '@angular/router';

import { Name_Role } from '../../../../constants/constants.auth';
import { location } from '../../../../constants/constants.path';
import { RoleGuardService as RoleGuard } from '../../../guard/role/role-guard.service';
import { LocationHistoryPage } from './history/location_history';
import { LocationReceivingManagementReport } from './receiving/location_receiving_management';
import { LocationForwardingMangementReport } from './forwarding/location_forwarding_management';

export default [
    {
        path: location.Receiving_Management,
        component: LocationReceivingManagementReport,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: location.Forwarding_Management,
        component: LocationForwardingMangementReport,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: location.History,
        component: LocationHistoryPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
] as Routes;
