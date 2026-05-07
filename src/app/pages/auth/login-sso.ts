import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';
import { environment } from '../../../constants/environment';
import { GlobalsService } from '../../../globals.service';
import { AuthService } from './auth.service';
import { LanguageType, Name_Remember, Name_Token, Path_before_login } from '../../../constants/constants.auth';

@Component({
    selector: 'app-loginsso',
    imports: [ProgressSpinner],
    template: `<div class="m-auto text-center mt-40">
        <p class="text-xl">Logging in with Mail ...!</p>
        <p-progress-spinner
            styleClass="custom-spinner"
            class="absolute"
            strokeWidth="5"
            fill="transparent"
            animationDuration=".5s"
            [style]="{ width: '100px', height: '100px' }"
        />
    </div>`,
    standalone: true,
    providers: [],
    styles: `
        :host ::ng-deep .p-progressspinner-circle {
            stroke: red !important; /* Green - matches your text-green */
        }
    `
})
export class LoginMailSSO implements OnInit {
    userPath$: any;

    constructor(
        private routers: Router,
        private globalsService: GlobalsService,
        private sv: AuthService
    ) {
        this.userPath$ = this.globalsService.userPath$;
    }

    ngOnInit(): void {
        console.log('url:', window.location.host);
        const params = new URLSearchParams(window.location.search);
        const ssoToken = params.get('auth_token');

        if (ssoToken) {
            this.handleSsoCallbackWithCode(ssoToken);
        } else {
            this.routers.navigateByUrl('auth/login');
        }
    }

    // http://eis.hsvina.com:8088/api/oauth/token?password=123&username=admin&grant_type=password

    handleSsoCallbackWithCode(ssoToken: any): void {
        this.sv.loginAuthSSO(ssoToken).subscribe(
            (response) => {
                // get language from localStorage
                this.globalsService.selectValLanguage().subscribe((data: any) => {
                    if (data !== null && data !== undefined) {
                        const convertJsonLanguage = {} as any;
                        data.forEach((obj: any) => {
                            convertJsonLanguage[obj.LANG_KEY] = obj[obj.LANG_KEY];
                        });
                        this.globalsService.setValLanguage(convertJsonLanguage);

                        console.log('val convertJsonLanguage:', convertJsonLanguage);
                    }
                });
                // console.log('Fetched data:', response);
                const tokenPayload = {
                    name: response.uname,
                    id: response.userid,
                    userName: response.e_mail,
                    role: response.role,
                    idcookie: response.cookie,
                    grade: response.grade
                };
                this.globalsService.setUserName(response.pages);

                localStorage.setItem(Name_Token, JSON.stringify(tokenPayload));

                const before_loginerror = localStorage.getItem(Path_before_login) || '';
                const chartIndex = before_loginerror.indexOf('login');

                if (before_loginerror !== '' && chartIndex === -1) {
                    localStorage.removeItem(Path_before_login);

                    let flagCheckRoleUrl = false;
                    response.pages.forEach((ele: any) => {
                        if (ele.url_link !== undefined) {
                            if (before_loginerror.indexOf(this.globalsService.checkTitleMenu(ele.url_link)) >= 0) {
                                flagCheckRoleUrl = true;
                            }
                        }
                    });
                    if (!flagCheckRoleUrl) {
                        this.routers.navigate(['/mgt/qrcodemanagement']);
                    } else {
                        this.routers.navigate([before_loginerror]);
                    }
                } else {
                    localStorage.removeItem(Path_before_login);
                    this.routers.navigate(['/mgt/qrcodemanagement']);
                }
            },
            (error) => {
                // this.showError('Invalid userName or password !. Please re-enter');
                // this.flagSpinner = false;
                // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Your account or password is incorrect..' });
            }
        );
    }
}
