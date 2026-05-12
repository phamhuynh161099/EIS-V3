import { Routes } from '@angular/router';

import { Name_Role } from '../../../constants/constants.auth';
import { user_management } from '../../../constants/constants.path';
import { RoleGuardService as RoleGuard } from '../../guard/role/role-guard.service';
import { UserConfigPage } from './user-config/user-config';

export default [
    {
        path: user_management.UserConfig,
        component: UserConfigPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },

] as Routes;
