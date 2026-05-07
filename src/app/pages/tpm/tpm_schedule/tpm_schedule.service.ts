import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TPMScheduleService {

 private apiEqMgt =  'equipmentmgt';
 private tpm =  'tpm';
  constructor(private http: HttpClient) {}

  getData(row: number, page: number){
    return this.http.get<any>(this.apiEqMgt + `/selectEquipmentInfo.do?_search=false&nd=1751949554781&rows=${row}&page=${page}&sidx=&sord=asc`);
  }

  getDataByAsNo(row: number, as_no: string){
    return this.http.get<any>(this.tpm + `/selectTpmSchedule.do?as_no=${as_no}&_search=false&nd=1752035181845&rows=${row}&page=1&sidx=&sord=asc`);
  }

  getFilteredData(param: any){
    return this.http.get<any>(this.apiEqMgt + `/selectEquipmentInfo.do?&as_no=${param.as_no}&mt_cd=${param.mt_cd}&mt_cd1=${param.mt_cd1}&mt_cd2=${param.mt_cd2}&barcode=${param.barcode}&corp=${param.corp}&factory=${param.factory}&mf_cd=${param.mf_cd}&md_cd=${param.md_cd}&sts_cd=${param.sts_cd}&_search=false&nd=1751964751270&rows=${param.row}&page=1&sidx=&sord=asc`);
  }
}