import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LayoutService } from '../service/layout.service';import { TabService } from './app-tab/tab.service';

@Component({
    selector: '[app-menuitem]',
    imports: [CommonModule, RouterModule, RippleModule],
    template: `
        <ng-container>
            <!-- Parent item (có submenu) -->
            <a *ngIf="(!item.routerLink || item.items) && item.visible !== false"
               [attr.href]="item.url"
               (click)="itemClick($event)"
               [ngClass]="item.styleClass"
               [attr.target]="item.target"
               tabindex="0" pRipple>
                <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text text-black dark:text-white">{{ item.label }}</span>
                <i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
            </a>

            <!-- Leaf item — BỎ routerLink, dùng command (openTab) -->
            <a *ngIf="item.routerLink && !item.items && item.visible !== false"
               (click)="itemClick($event)"
               [ngClass]="item.styleClass"
               [class.active-route]="isActiveTab()"
               tabindex="0" pRipple>
                <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text text-black dark:text-white">{{ item.label }}</span>
            </a>

            <ul *ngIf="item.items && item.visible !== false" [@children]="submenuAnimation">
                <ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
                    <li app-menuitem [item]="child" [index]="i" [parentKey]="key" [class]="child['badgeClass']"></li>
                </ng-template>
            </ul>
        </ng-container>
    `,
    animations: [
        trigger('children', [
            state('collapsed', style({ height: '0' })),
            state('expanded', style({ height: '*' })),
            transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ],
    providers: [LayoutService]
})
export class AppMenuitem {
    @Input() item!: MenuItem;
    @Input() index!: number;
    @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;
    @Input() parentKey!: string;

    active = false;
    menuSourceSubscription: Subscription;
    menuResetSubscription: Subscription;
    key: string = '';

    constructor(
        public router: Router,
        private layoutService: LayoutService,
        private tabService: TabService
    ) {
        this.menuSourceSubscription = this.layoutService.menuSource$.subscribe((value) => {
            Promise.resolve(null).then(() => {
                if (value.routeEvent) {
                    this.active = value.key === this.key || value.key.startsWith(this.key + '-');
                } else {
                    if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
                        this.active = false;
                    }
                }
            });
        });

        this.menuResetSubscription = this.layoutService.resetSource$.subscribe(() => {
            this.active = false;
        });

        // Cập nhật active state khi tab thay đổi (thay vì lắng nghe NavigationEnd)
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            if (this.item.routerLink) {
                this.updateActiveStateFromRoute();
            }
        });
    }

    ngOnInit() {
        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);
        if (this.item.routerLink) {
            this.updateActiveStateFromRoute();
        }
    }

    updateActiveStateFromRoute() {
        const activeRoute = this.router.isActive(this.item.routerLink[0], {
            paths: 'exact',
            queryParams: 'ignored',
            matrixParams: 'ignored',
            fragment: 'ignored'
        });
        if (activeRoute) {
            this.layoutService.onMenuStateChange({ key: this.key, routeEvent: true });
        }
    }

    itemClick(event: Event) {
        if (this.item.disabled) {
            event.preventDefault();
            return;
        }

        // Leaf item có routerLink → mở tab
        if (this.item.routerLink && !this.item.items) {
            event.preventDefault();
            this.tabService.openTab(
                this.item.routerLink[0],
                this.item.label ?? '',
                this.item.icon
            );
            this.layoutService.onMenuStateChange({ key: this.key });
            return;
        }

        // Có command tùy chỉnh → gọi command
        if (this.item.command) {
            this.item.command({ originalEvent: event, item: this.item });
        }

        // Toggle submenu
        if (this.item.items) {
            this.active = !this.active;
        }

        this.layoutService.onMenuStateChange({ key: this.key });
    }

    // Highlight menu item nếu tab đang active trùng path
    isActiveTab(): boolean {
        if (!this.item.routerLink) return false;
        const activeTab = this.tabService.activeTab();
        return activeTab?.path === this.item.routerLink[0];
    }

    get submenuAnimation() {
        return this.root ? 'expanded' : this.active ? 'expanded' : 'collapsed';
    }

    @HostBinding('class.active-menuitem')
    get activeClass() {
        return this.active && !this.root;
    }

    ngOnDestroy() {
        if (this.menuSourceSubscription) this.menuSourceSubscription.unsubscribe();
        if (this.menuResetSubscription) this.menuResetSubscription.unsubscribe();
    }
}
