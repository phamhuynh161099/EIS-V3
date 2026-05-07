import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, interval, Subscription } from 'rxjs';
import { LanguageType } from '../../../../constants/constants.auth';
import { GlobalsService } from '../../../../globals.service';
import { EquipPuchsGridInfo } from './components/equip_puchs_grid_info';
import { GroupedInformationType, InformationPanel } from './components/information_panel';
import { LctEquipComponent } from './components/lct_equip_component';
import { EquipmentDashboard } from './components/total_component';
import { DashboardService } from './dashboard.service';

@Component({
    selector: 'app-dashboard',
    imports: [InformationPanel, LctEquipComponent, EquipmentDashboard, EquipPuchsGridInfo],
    template: `
        <div class="grid grid-cols-1 gap-8">
            <app-information-panel class="contents" [groupedInformation]="groupedInformation" [optionLanguage]="optionLanguage" [valLanguage]="valLanguage" />

            <!-- Chỉ hiển thị component khi đã load xong data -->
            <app-lct-equip-component [rawData]="rawData" [totalData]="totalData" [loading]="loading" [optionLanguage]="optionLanguage" [valLanguage]="valLanguage" />

            <app-equipment-dashboard [selectEquipmentStatusReport]="selectEquipmentStatusReport" [loading]="loading" [optionLanguage]="optionLanguage" [valLanguage]="valLanguage" />

            <app-equip-puchs-grid-info [totalData]="equipPuchsGridInfo" [loading]="loading" [optionLanguage]="optionLanguage" [valLanguage]="valLanguage" />
        </div>
    `
})
export class Dashboard implements OnInit, OnDestroy {
    groupedInformation: GroupedInformationType[] = [];
    rawData: any[] = [];
    totalData!: any;
    loading: boolean = true;
    selectEquipmentStatusReport: any[] = [];
    equipPuchsGridInfo: any[] = [];

    private refreshSubscription?: Subscription;
    private readonly REFRESH_INTERVAL = 60000; // 1 phút = 60000ms

    constructor(
        private sv: DashboardService,
        public global_sv: GlobalsService
    ) {
        this.optionLanguage = this.global_sv.getLangue();
    }
    valLanguage: any;
    optionLanguage: LanguageType = 'LANG_EN';
    ngOnInit(): void {
        this.valLanguage = this.global_sv.getValLanguage();

        if (this.valLanguage === null) {
            this.global_sv._valLanguage$.subscribe((data) => {
                this.valLanguage = data;
                if (this.valLanguage !== null) {
                    this.reloadPage();
                }
            });
        } else {
            this.reloadPage();
        }
    }

    reloadPage() {
        this.loadData();
        this.startAutoRefresh();
        this.groupedInformation = [
            {
                label: this.valLanguage.grid_Total_Assets[this.optionLanguage],
                value: '0',
                redirectUrl: '/mgt/qrcodemanagement',
                highLight: '24 new',
                description: 'since last visit',
                icon: 'pi pi-dollar text-[#dd4b39] text-xl!',
                bg_color: '#dd4b39',
                id: 'total_cnt_cma'
            },
            {
                label: this.valLanguage.grid_Factory_Out[this.optionLanguage],
                value: '0',
                redirectUrl: '/mgt/qrcodemanagement',
                description: 'since last week',
                highLight: '52%',
                icon: 'pi pi-arrow-up-right-and-arrow-down-left-from-center text-[#00c0ef] text-xl!',
                bg_color: '#00c0ef',
                id: 'output_cnt'
            },
            {
                label: this.valLanguage.grid_Factory_In[this.optionLanguage],
                value: '0',
                redirectUrl: '/mgt/qrcodemanagement',
                description: 'since last week',
                highLight: '520',
                icon: 'pi pi-arrow-down-left-and-arrow-up-right-to-center text-[#f39c12] text-xl!',
                bg_color: '#f39c12',
                id: 'input_cnt'
            },
            {
                label: this.valLanguage.grid_New_Assets[this.optionLanguage],
                value: '0',
                redirectUrl: '/mgt/qrscanner',
                description: 'responded',
                highLight: '85',
                icon: 'pi pi-sparkles text-[#00a65a] text-xl!',
                bg_color: '#00a65a',
                id: 'reg_cnt'
            }
        ];
    }

    ngOnDestroy(): void {
        // Cleanup subscription để tránh memory leak
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    private startAutoRefresh(): void {
        // Tạo timer để reload data sau mỗi 1 phút
        this.refreshSubscription = interval(this.REFRESH_INTERVAL).subscribe(() => {
            this.loadData();
        });
    }

    private loadData(): void {
        this.loading = true;

        forkJoin({
            lctEquipInfo: this.sv.getLctEquipInfo(),
            totalData: this.sv.getTotal(),
            selectEquipmentStatusReport: this.sv.getSelectEquipmentStatusReport(),
            toDayInfo: this.sv.getToDayInfo(),
            eqPuchsGridInfo: this.sv.getEquipPuchsGridInfo()
        }).subscribe({
            next: (data) => {
                if (data.lctEquipInfo && Array.isArray(data.lctEquipInfo) && data.lctEquipInfo.length > 0) this.rawData = data.lctEquipInfo;
                if (data.totalData) this.totalData = data.totalData;
                if (data.selectEquipmentStatusReport) this.selectEquipmentStatusReport = data.selectEquipmentStatusReport.rows;
                if (data.eqPuchsGridInfo) this.equipPuchsGridInfo = data.eqPuchsGridInfo;

                if (data.toDayInfo) {
                    this.groupedInformation[0].value = data.toDayInfo[this.groupedInformation[0].id];
                    this.groupedInformation[1].value = data.toDayInfo[this.groupedInformation[1].id];
                    this.groupedInformation[2].value = data.toDayInfo[this.groupedInformation[2].id];
                    this.groupedInformation[3].value = data.toDayInfo[this.groupedInformation[3].id];
                }

                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading data:', error);
                this.loading = false;
            }
        });
    }
}
