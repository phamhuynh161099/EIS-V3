import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EquipmentService {
    constructor(private http: HttpClient) {}

    // Example GET Model
    getModelParam(param: string): Observable<any> {
        return this.http.get<any>('comm/getModelList/' + param);
    }

    // Example POST request
    postSupplier(data: any): Observable<any> {
        return this.http.post<any>('comm/getSpCdList', data);
    }

    selectColEquipmentInfo(): Observable<any> {
        return this.http.get<any>(`system/selectCommDt.do?mt_cd=022&_search=false&rows=50&page=1&sidx=&sord=asc`, { responseType: 'json' as const });
    }

    selectEquipmentInfo(materialCodes: string[]): Observable<any> {
        // const formData = new FormData();
        // formData.append('mt_cd', data);
        const mt_cd_list = materialCodes.join('@@');
        return this.http.get(`equipmentmgt/selectEquipmentInfo.do?mt_cd_list=${mt_cd_list}&scn_qr=Y&sidx=&sord=asc&corp=&mt_cd=&sts_cd=&factory=&md_cd=&prt_cd&start_date=&end_date=&status_from_date=&status_to_date=`);
    }

    selectEquipmentInfoFilter(param: any): Observable<any> {
        const mt_cd_list = param.materialCodes.join('@@') ?? '';

        return this.http.get(
            `equipmentmgt/selectEquipmentInfo.do?mt_cd_list=${mt_cd_list}&scn_qr=Y&sidx=&sord=asc&corp=${param.corp}&mt_cd=${param.material}&sts_cd=${param.status}&factory=${param.storage}&md_cd=${param.model}&prt_cd=${param.parent}&start_date=${param.createDate}&end_date=${param.createEndDate}&status_from_date=${param.statusDate}&status_to_date=${param.statusEndDate}`,
            { responseType: 'json' as const }
        );
    }

    selectEquipmentInfo_LazyLoad(first: any, rows: any, sortField: any, sortOrder: any, filters: any, param: any): Observable<any> {
        const page = Math.floor(first / rows + 1);

        return this.http.get<any>(
            `equipmentmgt/selectEquipmentInfo.do?rows=${rows}&page=${page}&sidx=&sord=asc&corp=${param.corp}&mt_cd=${param.material}&sts_cd=${param.status}&factory=${param.storage}&md_cd=${param.model}&prt_cd=${param.parent}&start_date=${param.createDate}&end_date=${param.createEndDate}&status_from_date=${param.statusDate}&status_to_date=${param.statusEndDate}`,
            { responseType: 'json' as const }
        );
    }
    selectEquipmentInfo_50(param: any): Observable<any> {
        return this.http.get<any>(
            `equipmentmgt/selectEquipmentInfo.do?_search=false&rows=50&sidx=&sord=asc&corp=${param.corp}&mt_cd=${param.material}&sts_cd=${param.status}&factory=${param.storage}&md_cd=${param.model}&prt_cd=${param.parent}&start_date=${param.createDate}&end_date=${param.createEndDate}&status_from_date=${param.statusDate}&status_to_date=${param.statusEndDate}`,
            { responseType: 'json' as const }
        );
    }

    selectEquipmentInfo_total(param: any, total: any): Observable<any> {
        return this.http.get<any>(
            `equipmentmgt/selectEquipmentInfo.do?_search=false&rows=${total}&sidx=&sord=asc&corp=${param.corp}&mt_cd=${param.material}&sts_cd=${param.status}&factory=${param.storage}&md_cd=${param.model}&prt_cd=${param.parent}&start_date=${param.createDate}&end_date=${param.createEndDate}&status_from_date=${param.statusDate}&status_to_date=${param.statusEndDate}`,
            { responseType: 'json' as const }
        );
    }

    // importExcel(data: any): Observable<any> {
    //     return this.http.post('equipmentmgt/insert', data, { responseType: 'text' as const });
    // }

    createEquipmentInfo(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('cp_cd', data.corp);
        formData.append('lct_cd', data.storage);
        formData.append('mf_cd', data.manufac);
        formData.append('md_cd', data.model);
        formData.append('barcode', data.information.barcode);
        formData.append('mt_cd', data.information.mt_cd);
        formData.append('mt_nm', data.information.mt_nm);
        formData.append('as_no', data.information.as_no);
        formData.append('as_sno', data.information.as_sno);
        formData.append('srl_no', data.information.srl_no);
        formData.append('re_mark', data.information.re_mark);
        formData.append('mgm_dept_cd', data.manaDept);
        formData.append('print_yn', data.printed);
        formData.append('use_yn', data.usedValue);
        formData.append('dev_start_dt', data.statusDate);
        formData.append('puchs_dt', data.purchasedDate);
        formData.append('vailed_dt', data.validDate);
        formData.append('cost_dept_cd', data.costDept);
        formData.append('lct_sts_cd', data.import);
        formData.append('sp_cd', data.supplier);
        return this.http.post('equipmentmgt/insertEquipmentInfo', formData, { responseType: 'text' as const });
    }

    updateEquipmentInfo(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('emno', data.emno);
        // formData.append('gubun', 'info');
        formData.append('sts_cd', data.sts_cd);
        formData.append('re_mark', data.re_mark);
        formData.append('reason_cd', data.reason_cd);
        formData.append('lct_cd', data.lct_cd); //factory_nm

        return this.http.post('equipmentmgt/updateEquipmentInfo', formData, { responseType: 'text' as const });
    }

    updateQREquipmentInfo(data: any): Observable<any> {
        return this.http.post<any>('equipmentmgt/updateQR', data);
    }

    // service for manufacturer information
    selectManufacturerInfo(param: any): Observable<any> {
        return this.http.get<any>(`equipmentmgt/selectManufacturerInfo.do?mf_cd=${param.code}&mf_nm=${param.name}&brd_nm=${param.brand}&_search=false&rows=${param.rows}&page=1&sidx=&sord=asc`, { responseType: 'json' as const });
    }

    insertManufacturerInfo(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mf_cd', data.code);
        formData.append('mf_nm', data.name);
        formData.append('address', data.address);
        formData.append('brd_nm', data.brand);
        formData.append('phone_nb', data.phone);
        formData.append('web_site', data.website);
        formData.append('re_mark', data.description);
        // if (data.file) {
        //     const file = data.file && data.file[0]; // Get the selected file
        //     if (file) {
        //         formData.append('file', file);
        //     } else {
        //         console.log('No file selected.');
        //     }
        // }

        return this.http.post('equipmentmgt/insertManufacturerInfo', formData, { responseType: 'text' as const });
    }

    updateManufacturerInfo(data: any, binaryData: any): Observable<any> {
        // const file: File = binaryData;
        const formData = new FormData();
        formData.append('mfno', data.mfno);
        formData.append('mf_cd', data.code);
        formData.append('mf_nm', data.name);
        formData.append('address', data.address);
        formData.append('brd_nm', data.brand);
        formData.append('phone_nb', data.phone);
        formData.append('web_site', data.website);
        formData.append('re_mark', data.description);
        if (binaryData) {
            const file = binaryData.files && binaryData.files[0]; // Get the selected file
            if (file) {
                formData.append('file', file);
            } else {
                console.log('No file selected.');
            }
        }

        return this.http.post('equipmentmgt/updateManufacturerInfo', formData, {
            // headers: new HttpHeaders({
            //     enctype: 'multipart/form-data',
            //     'Cache-Control': 'no-cache',
            //     Pragma: 'no-store',
            //     dnt: '1',
            //     'upgrade-insecure-requests': '1'
            // }),
            responseType: 'text' as const
        });
    }

    deleteManufacturerInfo(mfno: number): Observable<any> {
        const formData = new FormData();
        formData.append('mfno', String(mfno));
        return this.http.post('equipmentmgt/delManufacturerInfo ', formData, {
            responseType: 'text' as const
        });
    }

    // SAP MOVE AMS
    selectColSAP_AMS(): Observable<any> {
        return this.http.get<any>(`system/selectCommDt.do?mt_cd=024&_search=false&rows=50&page=1&sidx=&sord=asc`, { responseType: 'json' as const });
    }
    selectSAPInfo(param: any): Observable<any> {
        return this.http.get<any>(
            `equipmentmgt/selectSAPInfo.do?mt_cd=${param.material}&md_cd=${param.model}&mt_cd1=&mt_cd2=&corp=${param.corp}&sts_cd=${param.status}&prt_cd=${param.parent}&reg_from_date=${param.reg_from_date}&reg_to_date=${param.reg_to_date}&chg_from_date=${param.chg_from_date}&chg_to_date=${param.chg_to_date}&sale_yn=${param.sale_yn}&transfer_yn=${param.transfer_yn}&psale_yn=${param.psale_yn}&discard_yn=${param.discard_yn}&_search=false&rows=${param.rows}&page=1&sidx=&sord=asc`,
            { responseType: 'json' as const }
        );
    }
    selectEquipmentInfoAMS(param: any): Observable<any> {
        return this.http.get<any>(
            `equipmentmgt/selectEquipmentInfo.do?mt_cd=${param.material}&md_cd=${param.model}&mt_cd1=&mt_cd2=&corp=${param.corp}&sts_cd=${param.status}&prt_cd=${param.parent}&reg_from_date=${param.reg_from_date}&reg_to_date=${param.reg_to_date}&chg_from_date=${param.chg_from_date}&chg_to_date=${param.chg_to_date}&sale_yn=${param.sale_yn}&transfer_yn=${param.transfer_yn}&psale_yn=${param.psale_yn}&discard_yn=${param.discard_yn}&_search=false&rows=${param.rows}&page=1&sidx=&sord=asc`,
            { responseType: 'json' as const }
        );
    }
    moveSAPNewEquipment(param: any): Observable<any> {
        const body = { lstIds: param }; //6224964
        return this.http.post(`equipmentmgt/moveSAPNewEquipment`, body, { responseType: 'text' as const });
    }

    // service for Supplier information
    selectSupplierInfo(param: any): Observable<any> {
        return this.http.get<any>(`equipmentmgt/selectSupplierInfo.do?sp_cd=${param.code}&sp_nm=${param.name}&_search=false&nd=1752627826251&rows=${param.rows}&page=1&sidx=&sord=asc`, { responseType: 'json' as const });
    }

    updateSupplierInfo(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('spno', data.spno);
        formData.append('sp_cd', data.code);
        formData.append('sp_nm', data.name);
        formData.append('address', data.address);
        formData.append('e_mail', data.email);
        formData.append('phone_nb', data.phone);
        formData.append('web_site', data.website);
        formData.append('re_mark', data.description);

        return this.http.post('equipmentmgt/updateSupplierInfo', formData, { responseType: 'text' as const });
    }

    insertSupplierInfo(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('spno', '1');
        formData.append('sp_cd', data.code);
        formData.append('sp_nm', data.name);
        formData.append('address', data.address);
        formData.append('e_mail', data.email);
        formData.append('phone_nb', data.phone);
        formData.append('web_site', data.website);
        formData.append('re_mark', data.description);

        return this.http.post('equipmentmgt/insertSupplierInfo', formData, { responseType: 'text' as const });
    }

    deleteSupplierInfo(spno: number): Observable<any> {
        const formData = new FormData();
        formData.append('spno', String(spno));
        return this.http.post('equipmentmgt/delSupplierInfo', formData, {
            responseType: 'text' as const
        });
    }

    // service for Model information
    getFunctionList(id: string): Observable<any> {
        return this.http.get<any>(`comm/getFuncionList/${id}`, { responseType: 'json' as const });
    }

    getGroupList(): Observable<any> {
        return this.http.get<any>(`comm/getGroupList/1`, { responseType: 'json' as const });
    }

    getEUnitList(): Observable<any> {
        return this.http.get<any>(`comm/getCommCdList/008`, { responseType: 'json' as const });
    }

    getWeightUnitList(): Observable<any> {
        return this.http.get<any>(`comm/getCommCdList/010`, { responseType: 'json' as const });
    }

    getEConsumptionUnitList(): Observable<any> {
        return this.http.get<any>(`comm/getCommCdList/009`, { responseType: 'json' as const });
    }

    selectModelInfo(param: any): Observable<any> {
        return this.http.get<any>(
            `equipmentmgt/selectModelInfo.do?md_cd=${param.code}&md_nm=${param.name}&re_mark=${param.description}&mf_cd=${param.manufacturer_cd}&group_cd=${param.group_cd}&func_cd=${param.func_cd}&_search=false&nd=1752803926967&rows=${param.rows}&page=1&sidx=&sord=asc`,
            { responseType: 'json' as const }
        );
    }

    updateModelInfo(data: any, files: any): Observable<any> {
        const formData = new FormData();
        formData.append('mdno', data.mdno);
        formData.append('md_cd', data.code);
        formData.append('md_nm', data.name);
        formData.append('group_cd', data.group);
        formData.append('mf_cd', data.manufacturer);
        formData.append('func_cd', data.function);
        formData.append('elect', data.eInput);
        formData.append('elect_unit_cd', data.eUnit);
        formData.append('e_cst', data.eConsump);
        formData.append('ecst_unit_cd', data.eConsumpUnit);
        formData.append('wgt', data.weight);
        formData.append('wgt_unit_cd', data.weightUnit);
        formData.append('dimension', data.dimension);
        formData.append('re_mark', data.description);
        if (files) {
            const file = files && files[0]; // Get the selected file
            if (file) {
                formData.append('file', file);
            } else {
                console.log('No file selected.');
            }
        }

        return this.http.post('equipmentmgt/updateModelInfo', formData, { responseType: 'text' as const });
    }

    insertModelInfo(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mdno', '1');
        formData.append('md_cd', data.code);
        formData.append('md_nm', data.name);
        formData.append('group_cd', data.group);
        formData.append('mf_cd', data.manufacturer);
        formData.append('func_cd', data.function);
        formData.append('elect', data.eInput);
        formData.append('elect_unit_cd', data.eUnit);
        formData.append('e_cst', data.eConsump);
        formData.append('ecst_unit_cd', data.eConsumpUnit);
        formData.append('wgt', data.weight);
        formData.append('wgt_unit_cd', data.weightUnit);
        formData.append('dimension', data.dimension);
        formData.append('re_mark', data.description);

        if (data.file) {
            const file = data.file && data.file[0]; // Get the selected file
            if (file) {
                formData.append('file', data.file);
            } else {
                console.log('No file selected.');
            }
        }

        return this.http.post('equipmentmgt/insertModelInfo', formData, { responseType: 'text' as const });
    }

    deleteModelInfo(mdno: number): Observable<any> {
        const formData = new FormData();
        formData.append('mdno', String(mdno));
        return this.http.post('equipmentmgt/delModelInfo', formData, {
            responseType: 'text' as const
        });
    }
    //QRScanner equipmentmgt/saveQRScannerMulti
    saveQRScannerMulti(param: any): Observable<any> {
        return this.http.post(`equipmentmgt/saveQRScannerMulti`, param, { responseType: 'text' as const });
    }

    deleteMultipleEquipments(lstEmno: any): Observable<any> {
        return this.http.post(`equipmentmgt/delete`, { lstEmno }, { responseType: 'text' as const });
    }

    //equipmentmgt/getEquipmentInfoOne/105841 || emno
    getEquipmentInfoOne(id: string): Observable<any> {
        return this.http.get<any>(`equipmentmgt/getEquipmentInfoOne/${id}`, { responseType: 'json' as const });
    }

    getEquipmentInfoOne_mdcode(param: any): Observable<any> {
        return this.http.get<any>(`equipmentmgt/selectEquipmentInfo.do?_search=false&rows=1&mt_cd=${param}`, { responseType: 'json' as const });
    }

    updateQRScanEquipmentInfo(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('emno', data.emno);
        formData.append('gubun', 'modity');
        formData.append('incoming_route', 'equipmentInfoPopup');
        formData.append('sts_cd', data.sts_cd);
        formData.append('lct_cd', data.factory);
        formData.append('factory', data.factory);

        return this.http.post('equipmentmgt/updateEquipmentInfo', formData, { responseType: 'text' as const });
    }

    importExcel(data: any): Observable<any> {
        return this.http.post(`equipmentmgt/save`, data, { responseType: 'text' as const });
    }
}
