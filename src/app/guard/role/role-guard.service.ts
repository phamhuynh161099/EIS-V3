// src/app/auth/role-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { jwtDecode as decode } from 'jwt-decode';
import { MenuItem, MessageService } from 'primeng/api';
import { Name_Token, expectedRole } from '../../../constants/constants.auth';
import { GlobalsService } from '../../../globals.service';
import { lastValueFrom } from 'rxjs';
import { equipment } from '../../../constants/constants.path';

@Injectable()
export class RoleGuardService implements CanActivate {
    menuApi: MenuItem[] = [];
    userPath$: any;
    constructor(
        public auth: AuthService,
        public router: Router,
        public global: GlobalsService
    ) {
        // this.userPath$ = this.global.userPath$;
        // this.userPath$.forEach((val: any) => {
        //     if (val !== 'Guest_page') this.menuApi = val;
        // });
        // if (this.menuApi !== undefined && this.menuApi !== null && this.menuApi.length > 0) {
        //     // console.log('role login path:', this.menuApi);
        // } else {
        //     let token = localStorage.getItem(Name_Token);
        //     if (token !== null) {
        //         let valLanguage = this.global.getValLanguage();
        //         if (valLanguage === null) {
        //             this.global.selectValLanguage().subscribe((data: any) => {
        //                 if (data !== null && data !== undefined) {
        //                     const convertJsonLanguage = {} as any;
        //                     data.forEach((obj: any) => {
        //                         convertJsonLanguage[obj.LANG_KEY] = obj[obj.LANG_KEY];
        //                     });
        //                     this.global.setValLanguage(convertJsonLanguage);

        //                     valLanguage = this.global.getValLanguage();
        //                     const tokenPayload: any = JSON.parse(token);
        //                     this.fetchData(tokenPayload.id);
        //                 }
        //             });
        //         }

        //         // this.auth.getMenuGrade(tokenPayload.grade).subscribe(
        //         //     (response: any) => {
        //         //         this.menuApi = response.rows;
        //         //         this.global.setUserName(response.rows);
        //         //     },
        //         //     (error) => {}
        //         // );
        //     }
        // }
    }

    async fetchData(id: string): Promise<any> {
        try {
            const data: any = await lastValueFrom(this.auth.getMenuUserID(id));
            // Code here will execute only after the API call completes and data is received
            this.global.setUserName(data);

            let flagCheckRoleUrl = false;
            data.forEach((ele: any) => {
                if (ele.url_link !== undefined) {
                    let nowLocation = window.location.pathname;
                    if (nowLocation.indexOf(this.global.checkTitleMenu(ele.url_link)) >= 0) {
                        flagCheckRoleUrl = true;
                    }
                }
            });
            if (!flagCheckRoleUrl) {
                this.router.navigate(['/']);
            }
            // Perform further operations with the received data
        } catch (error) {
            console.error('API error:', error);
        }
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        // this will be passed from the route config
        const exp_Role = route.data[expectedRole];
        const token = localStorage.getItem(Name_Token);
        if (!token) {
            this.router.navigate(['auth/login']);
            return false;
        }
        // const tokenPayload: any = decode(token);
        const tokenPayload: any = JSON.parse(token);
         return true;
        if (!this.auth.isAuthenticated() || !exp_Role.find((role: any) => role == tokenPayload.role)) {
            alert('You are not authorized to access this page !');
            this.router.navigate(['auth/login']);
            return false;
        }
        return true;
    }
}
