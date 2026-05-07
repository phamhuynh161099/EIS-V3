import { Routes } from '@angular/router';
import { Name_Role } from '../../../constants/constants.auth';
import { equipment, tmp } from '../../../constants/constants.path';
import { RoleGuardService as RoleGuard } from '../../guard/role/role-guard.service';

import { EquipmentAssetReport_bk } from './equipment_asset_report/equipment_asset_report_bk';
import { EquipmentPurchaseAndDisposalReportPage } from './equipment_purchase_and_disposal_report/equipment_purchase_and_disposal_report';
import { EquipmentStatusReport } from './equipment_status_report';
import { EquipmentUNSAPReportPage } from './equipment_unsap_report/equipment_unsap_report';
import { LocationHistoryReportPage } from './location_history_report/location_history_report';
import { TPMPlanReport } from './tpm_plan_report';
import { TPMReportPage } from './tpm_report/tpm_report';

export default [
    {
        path: equipment.Location_History_Report,
        component: LocationHistoryReportPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: equipment.Equipment_Status_Report,
        component: EquipmentStatusReport,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: equipment.Equipment_Asset_Report,
        // component: EquipmentAssetReport,
        component: EquipmentAssetReport_bk,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: equipment.Equipment_Purchase_And_Disposal_Report,
        component: EquipmentPurchaseAndDisposalReportPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: equipment.Equipment_UNSAP_Report,
        component: EquipmentUNSAPReportPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: equipment.TPM_Plan_Report,
        component: TPMPlanReport,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: tmp.Tmp_Report,
        component: TPMReportPage,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },

] as Routes;
