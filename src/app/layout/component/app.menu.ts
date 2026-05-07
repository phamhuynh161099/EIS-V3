import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { LanguageType, Name_Language, Name_Token } from '../../../constants/constants.auth';
import { GlobalsService } from '../../../globals.service';
import { AuthService } from '../../pages/auth/auth.service';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, ButtonModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of menuPath; let i = index">
            <li *ngIf="!item.separator">
                <div *ngIf="item.visible !== false" (click)="itemMenuClick($event)" [class]="'layout-child' + i + ' menu-bar-parent flex justify-between'">
                    {{ item.label }}
                    <i [id]="'down-layout-child' + i" [class]="'layout-child' + i + ' pi pi-fw pi-caret-down layout-submenu-toggler'"></i>
                    <i [id]="'up-layout-child' + i" [class]="'layout-child' + i + ' pi pi-fw pi-caret-up layout-submenu-toggler hiddenMenu'"></i>
                </div>
                <div [id]="'layout-child' + i" app-menuitem *ngIf="!item.separator && isButtonVisible" [item]="item" [index]="i" [root]="true"></div>
            </li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `,
    styles: `
        .menu-bar-parent {
            cursor: pointer;
            padding: 1rem 0.6rem;
            border-radius: 1rem;
            &:hover {
                background: var(--surface-hover);
            }
        }
        .layout-sidebar {
            padding: 0.5rem 0.5rem;
        }
        .hiddenMenu {
            display: none;
        }
    `
})
export class AppMenu {
    model: MenuItem[] = [];
    menuPath: MenuItem[] = [];
    menuApi: MenuItem[] = [];
    userPath$: any;
    valLanguage: any;
    isButtonVisible = true;
    optionLanguage: LanguageType = 'LANG_EN';

    constructor(
        private globalsService: GlobalsService,
        private menuService: AuthService
    ) {
        const lang = localStorage.getItem(Name_Language);
        if (lang !== null && lang !== undefined) {
            this.optionLanguage = lang as LanguageType;
        }
        this.userPath$ = this.globalsService.userPath$;
        this.userPath$.forEach((val: any) => {
            if (val !== 'Guest_page') this.menuApi = val;
        });
    }

    ngOnInit() {
        this.valLanguage = this.globalsService.getValLanguage();
        if (this.valLanguage === null) {
            this.globalsService._valLanguage$.subscribe((data) => {
                this.valLanguage = data;
                this.reloadMenu();
            });
        } else {
            this.reloadMenu();
        }
    }

    reloadMenu() {
        // Add guard to ensure valLanguage is loaded
        if (!this.valLanguage) {
            console.warn('Waiting for valLanguage to load...');
            return;
        }

        let token = localStorage.getItem(Name_Token);
        if (token !== null) {
            // const tokenPayload: any = decode(localStorage.getItem(Name_Token) || '');
            const tokenPayload: any = JSON.parse(token);

            if (this.menuApi !== undefined && this.menuApi !== null && this.menuApi.length > 0) {
                this.menuPath = this.funcConvertMenuLogin(this.menuApi);
            } else {
                this.menuService.getMenuUserID(tokenPayload.id).subscribe(
                    (response: any) => {
                        this.menuApi = response;
                        this.menuPath = this.funcConvertMenuLogin(this.menuApi);
                        this.globalsService.setUserName(response);
                    },
                    (error) => {}
                );
            }
        } else {
            this.model = [
                {
                    label: 'Home',
                    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
                }
            ];
        }
    }

    itemMenuClick(event: Event) {
        const target: any = event.target as HTMLElement;
        let className = '';
        target.classList.forEach((name: any) => {
            if (name.indexOf('layout-child') >= 0) {
                className = name;
            }
        });
        // const className = target.classList.find((name:any) => name.indexOf('layout-child')>=0);
        const element = document.getElementById(className);
        if (element) {
            if (element.classList.contains('hiddenMenu')) {
                element.classList.remove('hiddenMenu');
            } else {
                element.classList.add('hiddenMenu');
            }
        }

        const iconDown = document.getElementById('down-' + className);
        if (iconDown) {
            if (iconDown.classList.contains('hiddenMenu')) {
                iconDown.classList.remove('hiddenMenu');
            } else {
                iconDown.classList.add('hiddenMenu');
            }
        }
        const iconUp = document.getElementById('up-' + className);
        if (iconUp) {
            if (iconUp.classList.contains('hiddenMenu')) {
                iconUp.classList.remove('hiddenMenu');
            } else {
                iconUp.classList.add('hiddenMenu');
            }
        }
    }

    funcConvertMenuLogin(menu: any) {
        let result: any = [];
        let indexResult: number = 0;
        menu.forEach((val: any, index: number) => {
            if (val.level_cd === '000') {
                let valueReplace = this.valLanguage[val.mn_nm.replace(/\s/g, '')] === undefined ? val.mn_nm : this.valLanguage[val.mn_nm.replace(/\s/g, '')][this.optionLanguage];
                result.push({
                    label: valueReplace,
                    items: [{ label: this.valLanguage['Dashboard'][this.optionLanguage], icon: 'pi pi-fw pi-home', routerLink: [val.url_link] }]
                });
                indexResult++;
            } else if (val.level_cd == '001' && val.mn_nm !== '') {
                let valueReplace = this.valLanguage[val.mn_nm.replace(/\s/g, '')] === undefined ? val.mn_nm : this.valLanguage[val.mn_nm.replace(/\s/g, '')][this.optionLanguage];
                if (val.url_link !== undefined && val.url_link !== null && val.url_link !== '') {
                    const link_url = this.globalsService.checkTitleMenu(val.url_link);
                    if (link_url !== 'danger') {
                        result.push({
                            label: valueReplace,
                            items: [{ label: valueReplace, icon: 'pi pi-language', routerLink: ['/mgt/' + link_url] }]
                        });
                    }
                } else {
                    result.push({
                        label: valueReplace,
                        items: []
                    });
                    indexResult++;
                }
            } else if (val.level_cd == '002' && val.mn_nm !== '') {
                let valueReplace = this.valLanguage[val.mn_nm.replace(/\s/g, '')] === undefined ? val.mn_nm : this.valLanguage[val.mn_nm.replace(/\s/g, '')][this.optionLanguage];

                const link_url = this.globalsService.checkTitleMenu(val.url_link);
                if (link_url !== 'danger') {
                    result[indexResult - 1].items.push({
                        label: valueReplace,
                        icon: 'pi pi-fw pi-stop',
                        routerLink: ['/mgt/' + link_url]
                    });
                }
            }
        });

        return result;
    }
}
