import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutService } from './app/layout/service/layout.service';
import { Name_ThemeLayout } from './constants/constants.auth';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    tokenThemeLayout = localStorage.getItem(Name_ThemeLayout);
    constructor(public layoutService: LayoutService) {}

    ngOnInit() {
        if (this.tokenThemeLayout !== null) {
            if (this.tokenThemeLayout === 'dark') {
                this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
            }
        }
    }
}
