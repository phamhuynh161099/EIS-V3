import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserConfigService {
    private readonly URL = 'api/dsh/userManagement';

    constructor(private http: HttpClient) { }

    getListUser<T>(parameter: any): Observable<T> {
        const body = parameter;
        return this.http.post<T>(this.URL + '/getListUser', body);
    }

    getListRoll<T>(): Observable<T> {
        return this.http.get<T>(this.URL + '/getListRoll');
    }

    updateUser<T>(parameter: any): Observable<T> {
        const body = parameter;
        return this.http.post<T>(this.URL + '/updateUser', body);
    }

    insertUser<T>(parameter: any): Observable<T> {
        const body = parameter;
        return this.http.post<T>(this.URL + '/insertUser', body);
    }

    deleteUser<T>(parameter: any): Observable<T> {
        const body = parameter;
        return this.http.post<T>(this.URL + '/deleteUser', body);
    }

    resetPass<T>(parameter: any): Observable<T> {
        const body = parameter;
        return this.http.post<T>(this.URL + '/resetPass', body);
    }

    saveListUser<T>(parameter: any): Observable<T> {
        const body = parameter;
        return this.http.post<T>(this.URL + '/saveListUser', body);
    }
}
