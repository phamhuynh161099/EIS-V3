import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

@Component({
    selector: 'app-company-logo-renderer',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    template: `
        <div :class="imgSpanLogo">
            @if (value() && value().trim() !== '' ) {
                <img [name]='prt_nm()+", "+group_nm()+", "+md_nm()' [alt]="value()" [src]="'https://ams.hsvina.com' + value()" [height]="30" :class="logo photo_file" />
            }
        </div>
        
    `,
    styles: `
        .imgSpanLogo {
            display: flex;
            height: 100%;
            width: 100%;
            align-items: center;
            justify-content: center;
        }
        .logo {
            display: block;
            width: 90px;
            height: auto;
            margin-right: 12px;
            filter: brightness(1.1);
        }
        .logo_full {
            display: block;
            width: 300px;
            height: auto;
            margin-right: 12px;
            filter: brightness(1.1);
        }
    `
})
export class LogoRenderer implements ICellRendererAngularComp {
    value = signal('');
    group_nm = signal('');
    md_nm = signal('');
    prt_nm = signal('');
    valueLowerCase = computed(() => this.value().toLowerCase());
    data: any;

     agInit(params: ICellRendererParams): void {
        this.data = params.data;
        this.refresh(params);
    }
    refresh(params: ICellRendererParams) {
        this.value.set(params.data?.photo_file ?? '');
        this.group_nm.set(params.data?.group_nm ?? '');
        this.md_nm.set(params.data?.md_nm ?? '');
        this.prt_nm.set(params.data?.prt_nm ?? '');
        return true;
    }
}
