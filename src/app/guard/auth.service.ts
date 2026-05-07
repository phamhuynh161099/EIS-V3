// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Name_Token } from '../../constants/constants.auth';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class AuthService {
    constructor(public jwtHelper: JwtHelperService, private http: HttpClient) { }
    // ...
    public isAuthenticated(): boolean {
        const token = localStorage.getItem(Name_Token);
        // Check whether the token is expired and return
        // true or false
        if (token === null || token === undefined || token === '') {
            return false;
        }
        // return !this.jwtHelper.isTokenExpired(token);
        return true;
    }

    public getMenuGrade(grade: string) {
        return this.http.get(`system/selectAuthMenuInfo.do?at_cd=${grade}&sidx=&sord=asc&_search=false&rows=100`);
    }

    public getMenuUserID(userID: string) {
        const formData = new FormData();
        formData.append('userid', userID);

        return this.http.post(`user/get-pages`, formData)
    }
}
