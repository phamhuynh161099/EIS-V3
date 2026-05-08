import { Routes } from '@angular/router';

import { Name_Role } from '../../../constants/constants.auth';
import { pp_management } from '../../../constants/constants.path';
import { RoleGuardService as RoleGuard } from '../../guard/role/role-guard.service';
import { PoCompleteDashboard } from './po-complete-dashboard/po-complete-dashboard';

export default [
    {
        path: pp_management.PoCompletionDashboard,
        component: PoCompleteDashboard,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
] as Routes;
