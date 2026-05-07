import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageType } from '../../../../../constants/constants.auth';
import { DashboardService } from '../dashboard.service';
export interface GroupedInformationType {
    label: string;
    value: string;
    redirectUrl: string;
    highLight: string;
    description: string;
    icon: string;
    bg_color: string;
    id: string;
}

@Component({
    standalone: true,
    selector: 'app-information-panel',
    imports: [CommonModule, RouterLink],
    providers: [DashboardService],
    template: `
    <div class="grid grid-cols-12 gap-4">
        <div *ngFor="let item of groupedInformation" class="col-span-6 xl:col-span-3">
            <div class="p-4 md:p-8 rounded-md mb-0 text-[#fff]" style="background-color: {{item.bg_color}};">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block font-semibold text-base md:text-xl mb-4">{{ item.label }}</span>
                        <div class="font-medium text-xl" [id]="item.id">{{ item.value }}</div>
                    </div>
                    <div [ngClass]="'border-[var(--surface-border)] flex items-center justify-center bg-[var(--surface-ground)] border-2 rounded-md rounded-border'" style="width: 2.5rem; height: 2.5rem">
                        <i [ngClass]="item.icon"></i>
                    </div>
                </div>
                <div class="flex justify-end gap-1 text-sm items-center cursor-pointer hover:translate-x-1 transition-all duration-150" routerLink="{{item.redirectUrl}}">
                    <span>{{this.valLanguage.grid_More_Info[this.optionLanguage]}}</span>
                    <i class="pi pi-chevron-right" style="font-size: 0.65rem"></i>
                </div>
            </div>
        </div>
    </div>`
})
export class InformationPanel {
    @Input() groupedInformation!: GroupedInformationType[];
    @Input() valLanguage!: any;
    @Input() optionLanguage!: LanguageType;

}
