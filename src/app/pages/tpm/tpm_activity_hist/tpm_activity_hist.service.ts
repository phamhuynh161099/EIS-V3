import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TPMActivityHistService {

 private apiTmp =  'tpm';
  constructor(private http: HttpClient) {}

  getFullData(){
    return this.http.get<any>(this.apiTmp + `/selectTpmReport.do?fnsh_yn=N&_search=false&nd=1751872805072&rows=50&page=1&sidx=&sord=asc`,  { responseType: 'json' as const });
  }
}
