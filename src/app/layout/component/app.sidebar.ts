import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app-memu/app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    template:
        `
        <div class="layout-sidebar pt-[0.5rem] px-[0.5rem] pb-[4rem] lg:pb-[0.5rem]">
            <app-menu></app-menu>
        </div>
        `
})
export class AppSidebar {
    constructor(public el: ElementRef) { }
}
