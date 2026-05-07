import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AutoFocus } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinner } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { SelectButton } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';

import { LanguageType, Name_Remember, Name_Token, Path_before_login } from '../../../constants/constants.auth';
import { GlobalsService } from '../../../globals.service';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from './auth.service';

import { Language, Name_Language, login_Language } from '../../../constants/constants.auth';
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FloatLabelModule, SelectButton, AutoFocus, ImageModule, ProgressSpinner, ToastModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    providers: [MessageService],
    template: `
        <app-floating-configurator />
        <p-toast position="top-center" [showTransformOptions]="'translateY(100%)'" [showTransitionOptions]="'500ms'" [hideTransitionOptions]="'500ms'" [showTransformOptions]="'translateX(100%)'" />
        <div (keydown)="onKeyDown($event)" class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <p-progress-spinner *ngIf="flagSpinner" class="absolute" strokeWidth="5" fill="transparent" animationDuration=".5s" [style]="{ width: '50px', height: '50px', color: '#333' }" />
            <div class="flex flex-col items-center justify-center w-full">
                <div style="border-radius: 30px; padding: 0.3rem; width: 100%;">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-12 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <p-image src="assets/image/logo-banner-new-hsv.png" alt="Image" width="200" routerLink="/" [preview]="true" />
                            <!-- <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to AMS!</div> -->
                            <!-- <div class="text-muted-color font-medium">Role Admin: admin/admin</div>
                            <div class="text-muted-color font-medium">Role view UI component: uiprine</div>
                            <div class="text-muted-color font-medium">User view menu follow role: user</div> -->
                        </div>

                        <div class="w-[90%] mx-auto max-w-[500px]">
                            <p-floatlabel variant="on" class="mb-4">
                                <input pSize="large" pInputText id="userName1" type="text" [pAutoFocus]="true" class="w-full" [(ngModel)]="userName" />
                                <label for="on_label">{{ login_Language.userID[keyLanguage] }}</label>
                            </p-floatlabel>
                            <!-- <label for="userName1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">User ID</label>
                            <input pInputText id="userName1" type="text" placeholder="User ID" [pAutoFocus]="true" class="w-full md:w-120 mb-8" [(ngModel)]="userName" /> -->
                            <p-floatlabel variant="on" class="my-8">
                                <p-password size="large" id="password1" class="w-full md:w-120" [(ngModel)]="password" [toggleMask]="true" [fluid]="true" [feedback]="false"></p-password>
                                <label for="on_label">{{ login_Language.password[keyLanguage] }}</label>
                            </p-floatlabel>
                            <!-- <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password> -->

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">{{ login_Language.remember[keyLanguage] }}</label>
                                </div>
                                <!-- <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span> -->
                            </div>
                            <p-button [label]="login_Language.SignIn[keyLanguage]" variant="outlined" severity="info" styleClass="w-full mb-10" (click)="login()" />
                            <div class="mb-10">
                                <label class="text-black dark:text-white text-right block font-bold">{{ login_Language.titleLoginMail[keyLanguage] }}</label>
                                <p-button [label]="login_Language.MailHSV[keyLanguage]" icon="pi pi-microsoft" variant="outlined" severity="info" styleClass="w-full border-blue-300 text-blue-300 dark:text-blue-900 px-8" (click)="loginMailSSO()" />
                            </div>

                            <div class="flex items-center justify-center w-full">
                                <p-selectbutton aria-labelledby="basic" (onChange)="onSelectChange($event)" [options]="languageOptions" [(ngModel)]="keyLanguage" optionLabel="label" optionValue="value" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: `
        ::ng-deep {
            .p-togglebutton-checked .p-togglebutton-content {
                background-color: var(--login-bg) !important;
                color: var(--login-stroke) !important;
            }
            .p-progressspinner-circle {
                stroke: var(--login-stroke) !important;
            }
        }
    `
})
export class Login implements OnInit {
    userName: string = '';
    password: string = '';
    checked: boolean = false;
    userPath$: any;
    flagSpinner: boolean = false;
    languageOptions: any[] = [
        { label: 'English', value: 'LANG_EN' },
        { label: 'Việt Nam', value: 'LANG_VN' },
        { label: '한국인', value: 'LANG_KR' }
    ];
    public login_Language = login_Language;

    keyLanguage: LanguageType = 'LANG_EN';

    constructor(
        public router: Router,
        private sv: AuthService,
        private messageService: MessageService,
        private globalsService: GlobalsService
    ) {
        this.userPath$ = this.globalsService.userPath$;
        // console.log('user path', this.userPath$);
        let remember: any = localStorage.getItem(Name_Remember);
        if (remember !== null) {
            this.checked = true;
            const rememberPayload: any = JSON.parse(remember);
            this.userName = rememberPayload.name;
            this.password = rememberPayload.id;
        }

        let lang = localStorage.getItem(Name_Language);
        if (lang !== null && lang !== undefined) {
            if (lang !== 'LANG_EN' && lang !== 'LANG_VN' && lang !== 'LANG_KR') {
                lang = 'LANG_EN'; // default language
            }
            this.keyLanguage = lang as LanguageType;
        }
    }
    ngOnInit(): void { }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.login();
        }
    }

    onSelectChange(event: any) {
        console.log('Selected value changed:', event.value);
        if (event.value === null) {
            this.keyLanguage = 'LANG_EN';
        }
        if (this.keyLanguage !== undefined && this.keyLanguage !== null) {
            localStorage.setItem(Name_Language, this.keyLanguage);
        }
    }

    login(): void {
        if (this.userName === '' || this.password === '') {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter userName and password.' });
            return;
        } else {
            this.flagSpinner = true;
            this.sv.loginAuth(this.userName, this.password).subscribe(
                (response) => {
                    console.log('run login function')
                    // get language from localStorage
                    // this.globalsService.selectValLanguage().subscribe((data: any) => {
                    //     if (data !== null && data !== undefined) {
                    //         const convertJsonLanguage = {} as any;
                    //         data.forEach((obj: any) => {
                    //             convertJsonLanguage[obj.LANG_KEY] = obj[obj.LANG_KEY];
                    //         });
                    //         this.globalsService.setValLanguage(convertJsonLanguage);
                    //         console.log('val convertJsonLanguage:', convertJsonLanguage);
                    //     }
                    // });

                    // if (this.checked) {
                    //     const Remember = {
                    //         name: this.userName,
                    //         id: this.password
                    //     };
                    //     localStorage.setItem(Name_Remember, JSON.stringify(Remember));
                    // } else {
                    //     localStorage.removeItem(Name_Remember);
                    // }

                    console.log('Fetched data:', response);
                    const tokenPayload = {
                        access_token: response.access_token,
                        token_type: response.token_type,
                    };
                    this.globalsService.setUserName(response.pages || []);

                    localStorage.setItem(Name_Token, JSON.stringify(tokenPayload));
                    this.router.navigate(['/mgt/qrcodemanagement']);

                    //! Sẽ check lại sao
                    // const before_loginerror = localStorage.getItem(Path_before_login) || '';
                    // const chartIndex = before_loginerror.indexOf('login');
                    // if (before_loginerror !== '' && chartIndex === -1) {
                    //     localStorage.removeItem(Path_before_login);

                    //     let flagCheckRoleUrl = false;
                    //     response.pages.forEach((ele: any) => {
                    //         if (ele.url_link !== undefined) {
                    //             if (before_loginerror.indexOf(this.globalsService.checkTitleMenu(ele.url_link)) >= 0) {
                    //                 flagCheckRoleUrl = true;
                    //             }
                    //         }
                    //     });
                    //     if (!flagCheckRoleUrl) {
                    //         this.router.navigate(['/mgt/qrcodemanagement']);
                    //     } else {
                    //         this.router.navigate([before_loginerror]);
                    //     }
                    // } else {
                    //     localStorage.removeItem(Path_before_login);
                    //     this.router.navigate(['/mgt/qrcodemanagement']);
                    // }
                },
                (error) => {
                    console.log('error',error)
                    this.flagSpinner = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Your account or password is incorrect..' });
                }
            );
        }
    }

    private readonly ssoMidas = 'https://mail.hsvina.com/ngw/app/#/sign?mode=sso';
    private urlHostMidas = 'http://' + window.location.host + '/Windchill/midas/login/serverSideSSOLogin&scope';
    private readonly redirectUriMidas = encodeURIComponent(this.urlHostMidas);

    private readonly ssoUrl = 'http://mail.hsvina.com/ngw/index.php/sign/sso_check';
    private urlHost = 'http://' + window.location.host + '/auth/login-sso';
    private readonly redirectUri = encodeURIComponent(this.urlHost);
    private readonly scope = 'calendar,user_info,todo';
    loginMailSSO() {
        console.log('url:', window.location.host);
        // Chuyển hướng đến SSO endpoint
        window.location.href = `${this.ssoUrl}?redirect_uri=${this.redirectUri}&scope=${this.scope}`;
        // window.location.href = `${this.ssoMidas}?redirect_uri=${this.redirectUriMidas}`;
    }

    showError(string: string = ''): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: string });
    }
}
