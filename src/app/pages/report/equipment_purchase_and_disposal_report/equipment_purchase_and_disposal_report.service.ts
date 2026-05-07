import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipmentPurchaseAndDisposalReportService {

 private apiComm = 'comm'; 
 private apiEqupment =  'equipmentmgt';
  constructor(private http: HttpClient) {}

  getParentList(): Observable<any> {
    return this.http.get<any>(this.apiComm + `/getParentList/1`,  { responseType: 'json' as const });
  }

  getLct000List(): Observable<any> {
    return this.http.get<any>(this.apiComm + `/getLct000List/1`,  { responseType: 'json' as const });
  }

  getFModelList(): Observable<any> {
    return this.http.get<any>(this.apiComm + '/getFModelList',  { responseType: 'json' as const });
  }

  getFilteredData( param: any ): Observable<any> {
    return this.http.get<any>(this.apiEqupment + `/selectEqAssetPurchasingVSdestroyReport.do?start_pur_dis_yyyy=${param.startYear}&end_pur_dis_yyyy=${param.endYear}&md_cd=${param.md_cd}&corp=&prt_cd=${param.prt_cd}&tp_cd=${param.type_cd}&group_cd=${param.group_cd}&_search=false&nd=1751525490232&rows=100000&page=1&sidx=&sord=asc`,  { responseType: 'json' as const });
  }

  getFullData(){
    return this.http.get<any>(this.apiEqupment + `/selectEqAssetPurchasingVSdestroyReport.do?end_pur_dis_yyyy=2025&_search=false&nd=1751510600408&rows=100000&page=1&sidx=&sord=asc`,  { responseType: 'json' as const });
  }

  getTypeList(id: string){
    return this.http.get<any>(this.apiComm + `/getTypeList/${id}`,  { responseType: 'json' as const });
  }
  
  getGroupList(id: string){
    return this.http.get<any>(this.apiComm + `/getGroupList/${id}`,  { responseType: 'json' as const });
  }

}
