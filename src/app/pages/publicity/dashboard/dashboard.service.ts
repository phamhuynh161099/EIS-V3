import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

 private apiComm = 'comm'; 
 private apiEquipmentmgt =  'equipmentmgt';
  constructor(private http: HttpClient) {}

  // Example GET request
  getData(): Observable<any> {
    return this.http.get<any>(this.apiComm);
  }

  // Example POST request
  postData(data: any): Observable<any> {
    return this.http.post<any>(this.apiComm, data);
  }

  getToDayInfo(): Observable<any> {
    return this.http.get<any>(this.apiComm + '/getToDayInfo.do',  { responseType: 'json' as const });
  }

  getLctEquipInfo(): Observable<any> {
    return this.http.get<any>(this.apiComm + '/getLctEquipInfo.do',  { responseType: 'json' as const });
  }

  getTotal(): Observable<any> {
    return this.http.get<any>(this.apiComm + '/getLctEquipInfoOne/TOTAL',  { responseType: 'json' as const });
  }

  getLctEquipInfoOne(lct_cd: string): Observable<any> {
    return this.http.get<any>(this.apiComm + '/getLctEquipInfoOne/' + lct_cd,  { responseType: 'json' as const });
  }

  getEquipPuchsGridInfo(): Observable<any> {
    return this.http.get<any>(this.apiComm + '/getEquipPuchsGridInfo.do?_search=false&nd=1749611054330&rows=50&page=1&sidx=&sord=asc',  { responseType: 'json' as const });
  }

  getSelectEquipmentStatusReport(): Observable<any> {
    return this.http.get<any>(this.apiEquipmentmgt + '/selectEquipmentStatusReport.do',  { responseType: 'json' as const });
  }

}
