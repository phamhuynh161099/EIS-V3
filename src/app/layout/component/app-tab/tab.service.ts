// tab.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Router, RouteReuseStrategy } from '@angular/router';
import { AppTab } from './tab.model';
import { CustomReuseStrategy } from '../../../strategy/custom-reuse-strategy';

@Injectable({ providedIn: 'root' })
export class TabService {
    LIMIT_TAB_ACTIVE = 4;

    private _tabs = signal<AppTab[]>([]);
    private _activeTabId = signal<string | null>(null);

    tabs = this._tabs.asReadonly();
    activeTabId = this._activeTabId.asReadonly();

    activeTab = computed(() =>
        this._tabs().find(t => t.id === this._activeTabId()) ?? null
    );

    constructor(
        private router: Router,
        private reuseStrategy: RouteReuseStrategy
    ) { }

    openTab(path: string, title: string, icon?: string): void {
        console.log(`[openTab] path="${path}"`);
        // Nếu tab đã tồn tại → chỉ activate
        const existing = this._tabs().find(t => t.path === path);
        if (existing) {
            console.log('tồn tại tab rồi')
            this.setActive(existing.id);
            return;
        }
        console.log('new tabs')
        // Giới hạn tối đa 4 tab
        if (this._tabs().length >= this.LIMIT_TAB_ACTIVE) {
            // Đóng tab cũ nhất (tab đầu tiên trong mảng)
            const oldest = this._tabs()[0];
            (this.reuseStrategy as CustomReuseStrategy).deleteRoute(oldest.path);
            this._tabs.update(tabs => tabs.filter(t => t.id !== oldest.id));
        }

        const id = crypto.randomUUID();
        const newTab: AppTab = { id, title, path, icon };
        this._tabs.update(tabs => [...tabs, newTab]);
        this.setActive(id);
    }

    setActive(id: string): void {
        this._activeTabId.set(id);
        const tab = this._tabs().find(t => t.id === id);
        if (tab) this.router.navigate([tab.path]);
    }

    closeTab(id: string, event?: MouseEvent): void {
        event?.stopPropagation();
        const tabs = this._tabs();
        const idx = tabs.findIndex(t => t.id === id);
        if (idx === -1) return;

        const tab = tabs[idx];
        console.log(`[closeTab] deleteRoute path="${tab.path}"`);

        // ✅ Xóa cache trước khi update signal
        (this.reuseStrategy as CustomReuseStrategy).deleteRoute(tab.path);

        const newTabs = tabs.filter(t => t.id !== id);
        this._tabs.set(newTabs);

        if (this._activeTabId() === id) {
            const nextTab = newTabs[Math.min(idx, newTabs.length - 1)];
            if (nextTab) {
                this.setActive(nextTab.id);
            } else {
                this._activeTabId.set(null);
                this.router.navigate(['/']);
            }
        }
    }

    closeAll(): void {
        this._tabs.set([]);
        this._activeTabId.set(null);
        this.router.navigate(['/']);
    }
}
