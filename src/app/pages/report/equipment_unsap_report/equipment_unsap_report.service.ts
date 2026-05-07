import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipmentUNSAPReportService {

 private equipmentmgt =  'equipmentmgt';
  constructor(private http: HttpClient) {}

  getSelectLctHistReport(end_reg_dt: string): Observable<any> {
    return this.http.get<any>(this.equipmentmgt + `/selectEqUNSAPReport.do?end_reg_dt=${end_reg_dt}&_search=false&nd=1751868475573&rows=100000&page=1&sidx=&sord=asc`,  { responseType: 'json' as const });
  }

  getFilteredData( param: any ): Observable<any> {
    return this.http.get<any>(this.equipmentmgt + `/selectEqUNSAPReport.do?end_reg_dt=${param.end_reg_dt}&md_cd=${param.md_cd}&corp=${param.corp}&factory=${param.factory}&sts_cd=&div_cd=&prt_cd=${param.prt_cd}&lct_sts_cd=101&gubun=${param.gubun}&_search=false&nd=1751868475573&rows=100000&page=1&sidx=&sord=asc`,  { responseType: 'json' as const });
  }

}
