import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    constructor(private http: HttpClient) {}

    // Example GET Model
    getModelParam(param: string): Observable<any> {
        return this.http.get<any>('comm/getModelList/'+param);
    }

    selectLctReceivingRecords(): Observable<any> {
        return this.http.get('lctmgt/selectLctReceiving.do?div_cd=mv&_search=false');
    }

    selectLctReceiving(param: any): Observable<any> {
        return this.http.get(`lctmgt/selectLctReceiving.do?div_cd=mv&_search=false&sidx=&sord=asc&rows=${param.rows}`);
    }

    selectLctReceivingFilter(param: any): Observable<any> {
        return this.http.get(`lctmgt/selectLctReceiving.do?div_cd=mv&rows=${param.rows}&start_output_dt=${param.outputDate}&end_output_dt=${param.outputEndDate}&as_no=${param.asset}&mt_cd=${param.material}&mt_cd1=&mt_cd2=&md_cd=${param.model}&corp=${param.corp}&factory=${param.storage}&from_lct_cd=${param.departure}&to_lct_cd=${param.destination}&reason_cd=${param.reason}&sts_cd=${param.state}&prt_cd=${param.parent}&_search=false&sidx=&sord=asc`);
    }

    getLocationHistory(param: any): Observable<any> {
        return this.http.get(`lctmgt/selectLctHist.do?start_date=${param.start_date}&end_date=${param.end_date}&as_no=${param.as_no}&mt_cd=${param.mt_cd}&mt_cd1=${param.mt_cd1}&mt_cd2=${param.mt_cd2}&md_cd=${param.md_cd}&corp=${param.corp}&factory=${param.factory}&from_lct_cd=${param.from_lct_cd}&to_lct_cd=${param.to_lct_cd}&reason_cd=${param.reason_cd}&sts_cd=${param.sts_cd}&sap=${param.sap}&div_cd=${param.div_cd}&prt_cd=${param.prt_cd}&lct_sts_cd=${param.lct_sts_cd}&_search=false&nd=1752201334334&rows=${param.row}&page=1&sidx=&sord=asc`);
    }
    
    getLocationHistoryByMtCodeList(mtCodeList: string[], row: number): Observable<any> {
        const list = mtCodeList.join("@@")
        return this.http.get(`lctmgt/selectLctHist.do?div_cd=mv&mt_cd_list=${list}&_search=false&nd=1752204716084&rows=${row}&page=1&sidx=&sord=asc`);
    }

    getReasonList(): Observable<any> {
        return this.http.get(`comm/getCommCdList/020`);
    }

    updateLctHist(param: any): Observable<any> {
        return this.http.post(`lctmgt/updateLctHist`, param, { responseType: 'text' as const });
    }
    
    getLctHistOne(elno: string): Observable<any> {
        return this.http.get(`lctmgt/getLctHistOne/${elno}`);
    }
    
    getToLctCdMnFullList(): Observable<any> {
        return this.http.get(`comm/getToLctCdMnFullList/mv`);
    }

    updateEquipmentInfo(data: any) {
        const formData = new FormData();
        formData.append('emno', data.emno);
        // formData.append('gubun', 'info');         
        formData.append('sts_cd', data.sts_cd);
        formData.append('re_mark', data.re_mark);
        formData.append('reason_cd', data.reason_cd);
        formData.append('lct_cd', data.lct_cd); //factory_nm
    }

    updateLctReceivingMgt(body: any): Observable<any> {
        return this.http.post('lctmgt/updateLctReceivingMgt', body, { responseType: 'text' as const });
    }

    selectLctForwardingRecords(): Observable<any> {
        return this.http.get('lctmgt/selectLctForwarding.do?_search=false');
    }

    selectLctForwarding(param: any): Observable<any> {
        return this.http.get(`lctmgt/selectLctForwarding.do?_search=false&sidx=&sord=asc&rows=${param.rows}`);
    }

    selectLctForwardingFilter(param: any): Observable<any> {
        return this.http.get(`lctmgt/selectLctForwarding.do?rows=${param.rows}&start_output_dt=${param.outputDate}&end_output_dt=${param.outputEndDate}&as_no=${param.asset}&mt_cd=${param.material}&mt_cd1=&mt_cd2=&md_cd=${param.model}&corp=${param.corp}&factory=${param.storage}&from_lct_cd=${param.departure}&to_lct_cd=${param.destination}&reason_cd=${param.reason}&sts_cd=${param.state}&prt_cd=${param.parent}&_search=false&sidx=&sord=asc`);
    }

    updateLctForwardingMgt(body: any): Observable<any> {
        return this.http.post('lctmgt/updateLctReceivingMgt', body, { responseType: 'text' as const });
    }
}
