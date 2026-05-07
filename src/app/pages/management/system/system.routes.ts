import { Routes } from '@angular/router';

import { Name_Role } from '../../../../constants/constants.auth';
import { system } from '../../../../constants/constants.path';
import { RoleGuardService as RoleGuard } from '../../../guard/role/role-guard.service';
import { AuthorityManagementSystem } from './authority_management/authority_management';
import { CommonManagementSystem } from './common_management/common_management';
import { DepartmentInformationSystem } from './department_information/department_information';
import { FunctionCategory } from './function_category';
import { GroupCategory } from './group_category';
import { LocationManagementSystem } from './location_management/location_management';
import { MenuManagementSystem } from './menu_management/menu_management';
import { ParentCategory } from './parent_category';
import { TPMItemInformationSystem } from './tpm_item_information/tpm_item_information';
import { TypeCategory } from './type_category';
import { UserAuthoritySystem } from './user_authority/user_authority';
import { UserManagementSystem } from './user_management/user_management';
import { TPMScheduleMaster } from './tpm_schedule_master/tpm_schedule_master';
import { LanguageCategory } from './language_category';

export default [
    {
        path: system.User_Management,
        component: UserManagementSystem,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: system.Menu_Management,
        component: MenuManagementSystem,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: system.Common_Management,
        component: CommonManagementSystem,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: system.User_Authority_Management,
        component: UserAuthoritySystem,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: system.Parent_Category,
        component: ParentCategory,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: system.Type_Category,
        component: TypeCategory,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: system.Group_Category,
        component: GroupCategory,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: system.Function_Category,
        component: FunctionCategory,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: system.TPM_Item_Information,
        component: TPMItemInformationSystem,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: system.Department_Information,
        component: DepartmentInformationSystem,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: system.Location_Management,
        component: LocationManagementSystem,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: system.TPM_Schedule_Master,
        component: TPMScheduleMaster,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: system.Authority_Management,
        component: AuthorityManagementSystem,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: system.Language_Category,
        component: LanguageCategory,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
] as Routes;
