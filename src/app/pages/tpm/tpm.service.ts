import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TPMService {
    constructor(private http: HttpClient) {}

    // Example GET request
    getData(): Observable<any> {
        return this.http.get<any>('tmp');
    }

    selectTpmPlan(): Observable<any> {
        const body = { func_Id: 'serach_fn' };
        return this.http.post<any>(`tpm/selectTpmPlan`, body);
    }

    getTpmPlanLine(param: any): Observable<any> {
        const body = { corp: param.corp, factory: param.factory };
        return this.http.post<any>(`tpm/getTpmPlanLine`, body);
    }

    saveTpmPlan(param: any): Observable<any> {
        const body = { corp: param.corp, factory: param.factory, insert_flag: 'I' };
        return this.http.post(`tpm/saveTpmPlan`, body, { responseType: 'text' as const });
    }

    delTpmPlan(param: any): Observable<any> {
        const body = { corp: param.corp, factory: param.factory };
        return this.http.post<any>(`tpm/delTpmPlan`, body);
    }

    saveCreateTpmPlan_line(param: any): Observable<any> {
        const body = { ds_data: param.ds_data, factory: param.factory };
        return this.http.post(`tpm/saveTpmPlan_line`, body, { responseType: 'text' as const });
    }
}
