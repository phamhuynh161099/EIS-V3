import { Routes } from '@angular/router';

import { Name_Role } from '../../../constants/constants.auth';
import { tmp } from '../../../constants/constants.path';
import { RoleGuardService as RoleGuard } from '../../guard/role/role-guard.service';
import { TMPPlan } from './tmp_plan';
import { TPMActivityHistPage } from './tpm_activity_hist/tpm_activity_hist';
import { TPMSchedulePage } from './tpm_schedule/tpm_schedule';
import { TpmLineEspPage } from './tpm_line_esp/tpm_line_esp';
import { TpmEngineerEspPage } from './tpm_engineer_esp/tpm_engineer_esp';
import { TpmEngineerLinePage } from './tpm_engineer_line/tpm_engineer_line';
import { TpmTrackingDashboardPage } from './tpm_tracking_dashboard/tpm_tracking_dashboard';
import { TpmLineManagementPage } from './tpm_line_management/tpm_line_management';
import { TpmTicketHistoryDashboardPage } from './tpm_ticket_history_dashboard/tpm_ticket_history_dashboard';
import { TpmEngineerManagementPage } from './tpm_engineer_management/tpm_engineer_management';


export default [
    {
        path: tmp.Tmp_Line_Of_ESP,
        component: TpmLineEspPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: tmp.Tmp_Engineer_Of_ESP,
        component: TpmEngineerEspPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: tmp.Tmp_Engineer_Mapper_Line,
        component: TpmEngineerLinePage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: tmp.Tmp_Tracking_Dashboard,
        component: TpmTrackingDashboardPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: tmp.Tmp_Line_Management,
        component: TpmLineManagementPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: tmp.Tmp_Ticket_History_Dashboard,
        component: TpmTicketHistoryDashboardPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
     {
        path: tmp.Tmp_Engineer_Management,
        component: TpmEngineerManagementPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: tmp.Tmp_Plan,
        component: TMPPlan,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: tmp.Tmp_Activity_Hist,
        component: TPMActivityHistPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: tmp.Tmp_Schedule,
        component: TPMSchedulePage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },

] as Routes;
