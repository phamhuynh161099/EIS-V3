// app.tabbar.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabService } from './tab.service';

@Component({
  selector: 'app-tabbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (tabService.tabs().length > 0) {
      <div class="tab-bar">
        @for (tab of tabService.tabs(); track tab.id) {
          <div
            class="tab-item"
            [class.active]="tab.id === tabService.activeTabId()"
            (click)="tabService.setActive(tab.id)"
          >
            @if (tab.icon) {
              <i class="pi {{ tab.icon }}" style="font-size:13px"></i>
            }
            <span class="tab-title">{{ tab.title }}</span>
            <button
              class="tab-close"
              (click)="tabService.closeTab(tab.id, $event)"
              aria-label="Đóng tab"
            >
              <i class="pi pi-times" style="font-size:10px"></i>
            </button>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .tab-bar {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      padding: 0 12px;
      background: var(--surface-ground);
      border-bottom: 1px solid var(--surface-border);
      overflow-x: auto;
      scrollbar-width: none;
      min-height: 36px;
      position: absolute;
      bottom: 0;
      z-index: 10;
    }

    .tab-bar::-webkit-scrollbar { display: none; }

    .tab-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px 6px 12px;
      min-width: 80px;
      max-width: 180px;
      height: 34px;
      background: var(--surface-card);
      border: 1px solid var(--surface-border);
      border-bottom: none;
      border-radius: 6px 6px 0 0;
      cursor: pointer;
      font-size: 12px;
      color: var(--text-color-secondary);
      transition: background 0.15s, color 0.15s;
      user-select: none;
      white-space: nowrap;
    }

    .tab-item:hover {
      background: var(--surface-hover);
      color: var(--text-color);
    }

    .tab-item.active {
      background: var(--surface-overlay);
      color: var(--text-color);
      border-color: var(--surface-border);
      position: relative;
    }

    /* Che border-bottom của tab active */
    .tab-item.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--surface-overlay);
    }

    .tab-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tab-close {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      border-radius: 3px;
      cursor: pointer;
      color: var(--text-color-secondary);
      padding: 0;
      opacity: 0;
      transition: opacity 0.15s, background 0.15s;
    }

    .tab-item:hover .tab-close,
    .tab-item.active .tab-close {
      opacity: 1;
    }

    .tab-close:hover {
      background: var(--surface-border);
      color: var(--text-color);
    }
  `]
})
export class AppTabbar {
  tabService = inject(TabService);
}
