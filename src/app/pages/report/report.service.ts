import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    constructor(private http: HttpClient) {}

    getType(param: string): Observable<any> {
        if (param === '' || param === null) {
            param = '1';
        }
        return this.http.get<any>('comm/getTypeList/' + param);
    }

    getGroup(): Observable<any> {
        return this.http.get<any>('comm/getGroupList/1');
    }

    selectEquipmentReportSearch(param: any): Observable<any> {
        return this.http.get(`equipmentmgt/selectEquipmentStatusReport.do?scn_qr=Y&sidx=&sord=asc&corp=${param.corp}&factory=${param.storage}&md_cd=${param.model}&prt_cd=${param.parent}`, { responseType: 'json' as const });
    }

    selectEquipmentReport(param: any): Observable<any> {
        return this.http.get(`equipmentmgt/selectEquipmentStatusReport.do?_search=false&scn_qr=Y&sidx=&sord=asc`, { responseType: 'json' as const });
    }

    //Equiment Asset Page
    selectEquipmentAsset(param: any): Observable<any> {
        return this.http.get(`equipmentmgt/selectEquipmentAssetReport.do?_search=false&rows=${param.rows}&page=${param.page}&sidx=&sord=asc`, { responseType: 'json' as const });
    }

    selectEquipmentAssetAll(): Observable<any> {
        return this.http.get(`equipmentmgt/selectEquipmentAssetReport.do?_search=false&sidx=&sord=asc`, { responseType: 'json' as const });
    }
    
    selectEquiAssetTitleHeader(): Observable<any> {
        return this.http.get(`system/selectCommDt.do?mt_cd=023`, { responseType: 'json' as const });
    }

    selectEquipmentAssetFilterNumber(param: any): Observable<any> {
        return this.http.get(`equipmentmgt/selectEquipmentAssetReport.do?rows=0&page=0&sidx=&sord=asc&corp=${param.corp}&prt_cd=${param.parent}&tp_cd=${param.type}&group_cd=${param.group}&md_cd=${param.model}&gubun=${param.language}&erp=${param.erp}&start_reg_dt=${param.startdate}&end_reg_dt=${param.enddate}`, { responseType: 'json' as const });
    }

    selectEquipmentAssetFilterAll(param: any): Observable<any> {
        return this.http.get(`equipmentmgt/selectEquipmentAssetReport.do?rows=${param.rows}&page=1&sidx=&sord=asc&corp=${param.corp}&prt_cd=${param.parent}&tp_cd=${param.type}&group_cd=${param.group}&md_cd=${param.model}&gubun=${param.language}&erp=${param.erp}&start_reg_dt=${param.startdate}&end_reg_dt=${param.enddate}`, { responseType: 'json' as const });
    }

    selectTpmPlan(): Observable<any> {
        const body = {func_Id: "serach_fn"};
        return this.http.post<any>(`tpm/selectTpmPlan`,body);
    }

    getTpmPlanLine(param: any): Observable<any> {
        const body = {corp: param.corp,factory: param.factory};
        return this.http.post<any>(`tpm/getTpmPlanLine`,body);
    }
    
}
