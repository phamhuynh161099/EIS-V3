import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { Popover, PopoverModule } from 'primeng/popover';
import { StyleClassModule } from 'primeng/styleclass';
import { Name_ThemeLayout, Name_Token, Path_before_login } from '../../../../constants/constants.auth';
import { LayoutService } from '../../service/layout.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, ImageModule, PopoverModule, ButtonModule],
    templateUrl: './app-topbar.html',
    styleUrls: ['./app-topbar.css']
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
