import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PoCompleteDashboardService {
    constructor(private http: HttpClient) { }

    private readonly URL = 'api/dsh/poCompletionDashboard';

    getData(body: any): Observable<any> {
        return this.http.post<any>('api/dsh/newArt/getNewArticles', body);
    }

    getSDD<T>(parameter: any): Observable<T> {
        const body = parameter;
        return this.http.post<T>(this.URL + '/getSDD', body);
    }

    getCRD<T>(parameter: any): Observable<T> {
        const body = parameter;
        return this.http.post<T>(this.URL + '/getCRD', body);
    }

    getPOCompletionDashboard<T>(parameter: any): Observable<T> {
        const body = parameter;
        return this.http.post<T>(this.URL + '/getPOCompletionDashboard', body);
    }

    getListLineDPS<T>(parameter: any): Observable<T> {
        const body = parameter;
        return this.http.post<T>(this.URL + '/getListLineDPS', body);
    }
}
