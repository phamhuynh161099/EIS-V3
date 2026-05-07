import { Routes } from '@angular/router';

import { Name_Role } from '../../../../constants/constants.auth';
import { equipment } from '../../../../constants/constants.path';
import { RoleGuardService as RoleGuard } from '../../../guard/role/role-guard.service';
import { Crud } from './crud';
import { Information } from './information/information';
import { ManufacturerInformation } from './manufacturer_information/manufacturer_information';
import { ModelInformation } from './model_information/model_information';
import { QR_Code_Management } from './qr_code_manage/qr_code_management';
// import { Qrscanner } from './qrscanner_bk';
import { Qrscanner } from './qrscanner/qrscanner.component';
import { SAP_New_Equipment } from './sap_new_equipment/sap_new_equipment';
import { SupplierInformation } from './supplier_information/supplier_information';

export default [
    {
        path: equipment.Crud,
        component: Crud,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator]
        }
    },
    {
        path: equipment.QR_Code_Management,
        component: QR_Code_Management,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: equipment.Qr_Scanner,
        component: Qrscanner,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: equipment.Information,
        component: Information,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: equipment.Manufacturer_Information,
        component: ManufacturerInformation,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: equipment.SAP_New_Equipment,
        component: SAP_New_Equipment,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: equipment.Supplier_Information,
        component: SupplierInformation,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    },
    {
        path: equipment.Model_Information,
        component: ModelInformation,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [Name_Role.administrator, Name_Role.subscriber]
        }
    }
] as Routes;
