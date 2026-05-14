import { Routes } from '@angular/router';

import { Name_Role } from '../../../constants/constants.auth';
import { user_management } from '../../../constants/constants.path';
import { RoleGuardService as RoleGuard } from '../../guard/role/role-guard.service';
import { UserConfigPage } from './user-config/user-config';
import { RoleConfigPage } from './role-config/role-config';

export default [
    {
        path: user_management.UserConfig,
        component: UserConfigPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: user_management.RoleConfig,
        component: RoleConfigPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },

] as Routes;
