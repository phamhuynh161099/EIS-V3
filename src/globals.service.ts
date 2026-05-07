// src/app/globals.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { saveAs } from 'file-saver-es';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import { LanguageType, Name_Language } from './constants/constants.auth';
import { equipment, location, system, tmp } from './constants/constants.path';

@Injectable({
    providedIn: 'root'
})
export class GlobalsService {
    private _userPath = new BehaviorSubject<string>('Guest_page');
    userPath$ = this._userPath.asObservable();
    private _valLanguage = new BehaviorSubject<any>(null);
    _valLanguage$ = this._valLanguage.asObservable();

    constructor(private http: HttpClient) { }

    getLangue() {
        const lang = localStorage.getItem(Name_Language);
        return (lang !== null && lang !== undefined) ? lang as LanguageType : 'LANG_EN';
    }

    setUserName(name: string) {
        this._userPath.next(name);
    }

    setValLanguage(value: any) {
        this._valLanguage.next(value);
    }

    getValLanguage() {
        return this._valLanguage.value;
    }

    selectValLanguage(): Observable<any> {
        return this.http.get<any>(`utils/get-lang`);
    }


    checkTitleMenu(title: string) {
        switch (title) {
            case '/equipmentmgt/equipmentInfo.do':
                return equipment.Information;
            case '/equipmentmgt/qrCodeManagement.do':
                return equipment.QR_Code_Management;
            case '/equipmentmgt/manufacturerInfo.do':
                return equipment.Manufacturer_Information;
            case '/equipmentmgt/supplierInfo.do':
                return equipment.Supplier_Information;
            case '/equipmentmgt/modelInfo.do':
                return equipment.Model_Information;
            case '/equipmentmgt/qrCodeScanner.do':
                return equipment.Qr_Scanner;
            case '/equipmentmgt/sapNewEquipmentManagement.do':
                return equipment.SAP_New_Equipment;
            case '/lctmgt/lctReceivingMgt.do':
                return location.Receiving_Management;
            case '/lctmgt/lctForwardingMgt.do':
                return location.Forwarding_Management;
            case '/lctmgt/lctHist.do':
                return location.History;
            case '/tpm/tpmSchedule.do':
                return tmp.Tmp_Schedule;
            case '/tpm/tpmReport.do':
                return tmp.Tmp_Report;
            case '/tpm/tpmActivityHist.do':
                return tmp.Tmp_Activity_Hist;
            case '/tpm/tpmPlan.do':
                return tmp.Tmp_Plan;
            case '/report/lctHistReport.do':
                return equipment.Location_History_Report;
            case '/report/equipmentStatusReport.do':
                return equipment.Equipment_Status_Report;
            case '/report/equipmentAssetReport.do':
                return equipment.Equipment_Asset_Report;
            case '/report/eqAssetPurchasingVSdestroyReport.do':
                return equipment.Equipment_Purchase_And_Disposal_Report;
            case '/report/eqUNSAPReport.do':
                return equipment.Equipment_UNSAP_Report;
            case '/tpm/tpmPlanReport.do':
                return equipment.TPM_Plan_Report;
            case '/comm/memberMgt.do':
                return system.User_Management;
            case '/system/commMgt.do':
                return system.Common_Management;
            case '/system/menuMgt.do':
                return system.Menu_Management;
            case '/system/authMgt.do':
                return system.Authority_Management;
            case '/system/memberAuthMgt.do':
                return system.User_Authority_Management;
            case '/system/locMgt.do':
                return system.Location_Management;
            case '/system/parentCate.do':
                return system.Parent_Category;
            case '/system/typeCate.do':
                return system.Type_Category;
            case '/system/groupCate.do':
                return system.Group_Category;
            case '/system/functionCate.do':
                return system.Function_Category;
            case '/system/tpmScheduleMaster.do':
                return system.TPM_Schedule_Master;
            case '/system/tpmItemInfo.do':
                return system.TPM_Item_Information;
            case '/system/departmentInfo.do':
                return system.Department_Information;
            case '/system/languagecategory.do':
                return system.Language_Category;

            case '/tmp/tpm-line-of-esp':
                return tmp.Tmp_Line_Of_ESP;
            case '/tmp/tpm-engineer-of-esp':
                return tmp.Tmp_Engineer_Of_ESP;
            case '/tmp/tpm-engineer-mapper-line':
                return tmp.Tmp_Engineer_Mapper_Line;
            case '/tmp/tpm-tracking-dashboard':
                return tmp.Tmp_Tracking_Dashboard;
            case '/tmp/tpm-line-management':
                return tmp.Tmp_Line_Management;
            case '/tmp/tpm-ticket-history-dashboard':
                return tmp.Tmp_Ticket_History_Dashboard;
            case '/tmp/tpm-engineer-management':
                return tmp.Tmp_Engineer_Management;
            default:
                return 'notfound';
        }
    }

    sortTableData(event: any) {
        event.data.sort((data1: any, data2: any) => {
            let value1 = data1[event.field];
            let value2 = data2[event.field];
            let result = null;
            if (value1 == null && value2 != null) result = -1;
            else if (value1 != null && value2 == null) result = 1;
            else if (value1 == null && value2 == null) result = 0;
            else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
            else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

            return event.order * result;
        });
    }

    formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }

    getTodayDate(): string {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    isValidJsonString(str: string) {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }

    checkDate(date: string): string {
        if (date !== null && date !== undefined) {
            const parseDate = date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8);
            return parseDate;
        }

        return '';
    }

    formatDateFilter(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }

    formatDateFilter2(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    }

    formatDateSave(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();

        return `${year}${month}${day}`;
    }

    getRangeYear(range: string): string[] {
        const data: string[] = (range + '').split(',');

        const year1 = new Date(data[0]).getFullYear().toString();
        const year2 = new Date(data[1]).getFullYear().toString();
        return [year1, year2];
    }

    // Excell
    exportExcel(data: any[], filename: string, nameSheet: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: [nameSheet] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveExcelFile(excelBuffer, filename);
    }

    saveExcelFile(buffer: any, filename: string): void {
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(data, filename + '.xlsx');
    }

    getCorpColor(status: string) {
        switch (status) {
            case 'HSV':
                return 'danger';

            case 'HWK':
                return 'success';

            case 'HVC':
                return 'info';

            case 'HSOne':
                return 'warn';
            default:
                return null;
        }
    }

    getStatusColor(status: string) {
        switch (status) {
            case 'Useless':
                return 'danger';

            case 'Stock':
                return 'success';

            case 'Use':
                return 'info';

            case 'Broken':
                return 'warn';

            case 'Rental':
                return 'secondary';
            default:
                return null;
        }
    }

    getGradeColor(status: string) {
        switch (status) {
            case 'Unapproved':
                return 'danger';
            case 'General Manager':
                return 'success';
            case 'system administrator':
                return 'info';
            case 'General User':
                return 'warn';
            default:
                return 'secondary';
        }
    }

    getUseYNColor(status: string) {
        return status == 'Y' ? 'info' : 'danger';
    }

    convertToListFilterNotIncludeNull(data: any) {
        return data.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
    }

    convertToListFilterIncludeNull(data: any) {
        return data.map((item: any) => ({ label: item.comm_nm ? item.comm_nm : null, value: item.comm_cd ? item.comm_nm : null }));
    }

    // get
    // getCorp(): Observable<any> {
    //     return this.http.get<any>('comm/getLct000List/1');
    // }

    getCorp(): Observable<any> {
        return this.http.get<any>('comm/getCommCdList/021');
    }

    getLctFactory(): Observable<any> {
        return this.http.get<any>('comm/getLct001List_2/%7C');
    }

    getAllLctList(): Observable<any> {
        return this.http.get<any>('comm/getAllLctList/1');
    }

    getProvideDept(): Observable<any> {
        return this.http.get<any>(`comm/getLct001List_2/H100%7C`);
    }

    getParent(): Observable<any> {
        return this.http.get<any>('comm/getParentList/1');
    }

    getType(type: string): Observable<any> {
        return this.http.get<any>(`comm/getTypeList/${type}`);
    }

    getGroup(group: string): Observable<any> {
        return this.http.get<any>(`comm/getGroupList/${group}`);
    }

    getModel(): Observable<any> {
        return this.http.get<any>('comm/getModelList/A%20CHAU');
    }

    getModelList(param: string): Observable<any> {
        return this.http.get<any>('comm/getModelList/' + param);
    }

    getFModelList(): Observable<any> {
        return this.http.get<any>('comm/getFModelList');
    }

    getMtCdList(): Observable<any> {
        return this.http.get<any>('comm/getMtCdList');
    }

    getTPMItem(): Observable<any> {
        return this.http.get<any>('comm/getCommCdList/013');
    }

    getAlarmYesNo(): Observable<any> {
        return this.http.get<any>('comm/getCommCdList/017');
    }

    getTPMCyleUnit(): Observable<any> {
        return this.http.get<any>('comm/getCommCdList/014');
    }

    getAlarmDate(): Observable<any> {
        return this.http.get<any>('comm/getCommCdList/018');
    }

    // Example GET Parent
    getStatus(): Observable<any> {
        return this.http.get<any>('comm/getCommCdList/006');
    }

    getStorage(param: string): Observable<any> {
        if (param === '' || param === null) {
            param = 'H100';
        }
        return this.http.get<any>('comm/getLct001List_2/' + param + '%7C');
    }

    //  GET Management Dept
    getDept(): Observable<any> {
        return this.http.get<any>('comm/getDept000List/1');
    }

    //  GET Manufac
    getManufac(): Observable<any> {
        return this.http.get<any>('comm/getManufacList');
    }

    // GET Manufac
    getSupplier(): Observable<any> {
        return this.http.get<any>('comm/getSpCdList');
    }

    getReason(): Observable<any> {
        return this.http.get<any>('comm/getCommCdList/020');
    }

    getDeparture(): Observable<any> {
        return this.http.get<any>('comm/getToLctCdMnFullList/mv');
    }

    getDestination(): Observable<any> {
        return this.http.get<any>('comm/getLctCdMnFullList/mt');
    }

    getSales_Partial_Transfer_Discard(): Observable<any> {
        return this.http.get<any>('comm/getCommCdList/016');
    }

    getGrade(): Observable<any> {
        return this.http.get<any>('comm/getCommCdList/005');
    }

    onGlobalFilter(event: Event, table: Table) {
        const input = event.target as HTMLInputElement;
        table.filterGlobal(input.value, 'contains');
    }
}
