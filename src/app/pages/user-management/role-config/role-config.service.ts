import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoleConfigService {
    constructor(private http: HttpClient) { }

    //=== Role
    private readonly URL_ROLE = 'api/dsh/rbacRole';

    getAllRBACRole<T>(parameter: any): Observable<T> {
        const body = parameter;
        return this.http.post<T>(this.URL_ROLE + '/getAllRBACRole', body);
    }

    addRBACRole<T>(parameter: any): Observable<T> {
        const body = parameter;
        return this.http.post<T>(this.URL_ROLE + '/addRBACRole', body);
    }

    updateRBACRole<T>(parameter: any): Observable<T> {
        const body = parameter;
        return this.http.post<T>(this.URL_ROLE + '/updateRBACRole', body);
    }


    //=== Permision
    private readonly URL_PERMISSION = 'free/api/dsh/rbacPermission';

    getAllRBACPermission<T>(parameter: any): Observable<T> {
        const body = parameter;
        return this.http.post<T>(this.URL_PERMISSION + '/getAllRBACPermission', body);
    }
}
