import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationHistoryReportService {

 private apiComm = 'comm'; 
 private apiLctmgt =  'lctmgt';
  constructor(private http: HttpClient) {}

  getSelectLctHistReport(page: number, rows: number): Observable<any> {
    return this.http.get<any>(this.apiLctmgt + `/selectLctHistReport.do?div_cd=&lct_sts_cd=101&start_date=&end_date=2025-06-25&_search=false&nd=1750813561214&rows=${rows}&page=${page}&sidx=&sord=asc`,  { responseType: 'json' as const });
  }

  getSelectLctHistReportCodeList(page: number, rows: number, mtCodeList: string[]): Observable<any> {
    const list = mtCodeList.join("@@")
    return this.http.get<any>(this.apiLctmgt + `/selectLctHistReport.do?lct_sts_cd=101&mt_cd_list=${list}@@&_search=false&nd=1750839941075&rows=${rows}&page=${page}&sidx=&sord=asc`,  { responseType: 'json' as const });
  }

  getFilteredData( param: any ): Observable<any> {
    return this.http.get<any>(this.apiLctmgt + `/selectLctHistReport.do?start_date=${param.start_dt}&end_date=${param.end_dt}&mt_cd=&mt_cd1=&mt_cd2=&md_cd=${param.md_cd}&corp=${param.corp}&factory=${param.factory}&from_lct_cd=${param.pro_dept}&to_lct_cd=${param.req_dept}&sts_cd=&div_cd=&prt_cd=${param.prt_cd}&lct_sts_cd=101&gubun=${param.gubun}&mt_cd_list=${param.mt_cd}&_search=false&nd=1750904253822&rows=${param.rows}&page=${param.page}&sidx=&sord=asc`,  { responseType: 'json' as const });
  }

  getFullData(language: string, rows: number){
    return this.http.get<any>(this.apiLctmgt + `/selectLctHistReport.do?&gubun=${language}&_search=false&nd=1750904253822&rows=${rows}&page=1&sidx=&sord=asc`,  { responseType: 'json' as const });
  }

}