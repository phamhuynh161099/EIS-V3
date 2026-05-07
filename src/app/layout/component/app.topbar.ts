import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { Popover, PopoverModule } from 'primeng/popover';
import { StyleClassModule } from 'primeng/styleclass';
import { Name_ThemeLayout, Name_Token, Path_before_login } from '../../../constants/constants.auth';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, ImageModule, PopoverModule, ButtonModule],
    template: ` <div class="layout-topbar flex-col sm:flex-row min-h-[4rem] h-auto shadow">
        <div class="flex md:items-center justify-between w-full flex-col md:flex-row space-x-2 mt-5 sm:mt-0">
            <a class="layout-topbar-logo sm:hidden flex" routerLink="/">
                <p-image src="assets/image/logo-banner-new-hsv.png" alt="Image" width="70" [preview]="true" />
                <div class="text-md font-sans">
                    <div class="leading-[6px]">
                        <span class="dark:text-[#e7bc5c] text-[#d6ab4e] italic font-bold text-[0.9em]">Smart</span>
                        <span class="text-[1.2em] tracking-tighter ml-0.5 font-semibold">AMS</span>
                    </div>
                    <span class="text-xs font-bold text-[#969696] dark:text-[#838383]">Asset Management Solution</span>
                </div>
            </a>    
            <div class="flex-1 flex justify-between items-center border-t mt-2 sm:mt-0 sm:border-t-0">
                <div class="flex gap-2">
                    <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                        <i class="pi pi-bars"></i>
                    </button>
                    <a class="layout-topbar-logo hidden sm:flex" routerLink="/">
                        <p-image src="assets/image/logo-banner-new-hsv.png" alt="Image" width="70" [preview]="true" />
                        <div class="text-md font-sans -mb-1">
                            <div class="leading-[6px]">
                                <span class="dark:text-[#e7bc5c] text-[#d6ab4e] italic font-bold text-[0.9em]">Smart</span>
                                <span class="text-[1.2em] tracking-tighter ml-0.5 font-semibold">AMS</span>
                            </div>
                            <span class="text-xs font-bold text-[#969696] dark:text-[#838383]">Asset Management Solution</span>
                        </div>
                    </a>
                </div>
                

                <div>
                    <div class="layout-topbar-actions">
                        <div class="layout-config-menu">
                            <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                                <i [ngClass]="{ 'pi ': true, 'pi-sun': !layoutService.isDarkTheme(), 'pi-moon': layoutService.isDarkTheme() }"></i>
                            </button>
                        </div>
                        <div class="layout-topbar-menu  ">
                            <div class="layout-topbar-menu-content">
                                <button type="button" class="layout-topbar-action" (click)="toggle($event)">
                                    <i class="pi pi-user"></i>
                                    <span>Profile</span>
                                </button>

                                <p-popover #op>
                                    <div class="flex flex-col gap-4">
                                        <div>
                                            <ul class="list-none p-0 m-0 flex flex-col">
                                                <li *ngFor="let member of members" class="flex items-center gap-2 px-2 py-3 hover:bg-emphasis cursor-pointer rounded-border" (click)="selectMember(member)">
                                                    <img src="assets/image/user-icon.png" style="width: 32px" />
                                                    <div>
                                                        <span class="font-medium">{{ member.name }}</span>
                                                        <div class="text-sm text-surface-500 dark:text-surface-400">{{ member.email }}</div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </p-popover>
                                <button type="button" class="layout-topbar-action" (click)="logout()">
                                    <i [title]="token !== null ? 'Logout' : 'Login'" [class]="token !== null ? 'pi pi-sign-out' : 'pi pi-sign-in'"></i>
                                    <span>Log Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar implements OnInit {
    items!: MenuItem[];
    @ViewChild('op') op!: Popover;
    token = localStorage.getItem(Name_Token);
    tokenThemeLayout = localStorage.getItem(Name_ThemeLayout);
    members = [{ name: 'NotLogin', image: 'amyelsner.png', email: 'null', role: 'Owner' }];
    selectedMember: (typeof this.members)[number] | null = null;

    toggle(event: any) {
        this.op.toggle(event);
    }

    selectMember(member: (typeof this.members)[number]) {
        this.selectedMember = member;
        this.op.hide();
    }

    constructor(
        public layoutService: LayoutService,
        public router: Router
    ) { }

    ngOnInit() {
        if (this.token !== null) {
            // const tokenPayload: any = decode(token || '');
            const tokenPayload: any = JSON.parse(this.token);
            this.members = [{ name: tokenPayload.name, image: 'amyelsner.png', email: tokenPayload.email, role: tokenPayload.role }];
        }
    }

    toggleDarkMode() {
        if (this.tokenThemeLayout !== null) {
            if (this.tokenThemeLayout === 'light') {
                localStorage.setItem(Name_ThemeLayout, 'dark');
            } else {
                localStorage.setItem(Name_ThemeLayout, 'light');
            }
        } else {
            localStorage.setItem(Name_ThemeLayout, 'dark');
        }
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    logout() {
        // Implement logout logic here
        console.log('User logged out');
        localStorage.removeItem(Name_Token);
        localStorage.removeItem(Path_before_login);
        // Redirect to login page or perform any other action
        this.router.navigate(['/auth/login']);
    }
}
