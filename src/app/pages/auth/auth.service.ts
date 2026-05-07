import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../constants/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // private apiUrl =  environment.apiBaseUrl; // Replace with your API URL

    constructor(private http: HttpClient) { }

    loginAuth(username: string, password: string): Observable<any> {
        // Khởi tạo header
        const headers = new HttpHeaders({
            'Authorization': 'Basic YW5ndWxhcmpzOjEyMzc4OQ=='
        });

        return this.http.post(
            `oauth/token?username=${username}&password=${password}&grant_type=password`,
            '', // body empty
            { headers: headers } // options
        );
    }

    // Example POST request
    loginAuthSSO(ssoToken: string): Observable<any> {
        const formData = new FormData();
        formData.append('auth_token', ssoToken);
        return this.http.post<any>('user/sign-in', formData);
    }

    getMenuGrade(grade: string) {
        return this.http.get(`system/selectAuthMenuInfo.do?at_cd=${grade}&sidx=&sord=asc&_search=false&rows=100`);
    }

    getMenuUserID(userID: string) {
        const formData = new FormData();
        formData.append('userid', userID);

        return this.http.post(`user/get-pages`, formData)
    }
}
