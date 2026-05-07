import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { SortEvent } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { Table, TableModule } from 'primeng/table';
import { LanguageType } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { DashboardService } from '../dashboard.service';

export interface EquipmentData {
    check_cnt: number;
    input_cnt: number;
    lct_cd: string;
    lct_cd_n: string | null;
    lct_cnt: number;
    lct_nm: string;
    lct_rt: number;
    mt_cnt: number;
    mt_rt: number;
    output_cnt: number;
    puchs_y: string | null;
    reg_cnt: number;
    sts_00: number; // TOTAL
    sts_01: number; // Using
    sts_02: number; // No Use
    sts_03: number; // Repair
    sts_04: number; // Waiting
    sts_05: number; // Useless
    sts_06: number; // Rental
    sts_07: number; // Not in ERP
    sts_08: number; // Additional status
    total_cnt: number;
    total_cnt_cma: string | null;
}

export interface TableRow {
    factory: string;
    lct_cd: string;
    total: number;
    using: number;
    noUse: number;
    repair: number;
    waiting: number;
    useless: number;
    rental: number;
    notInERP: number;
}

@Component({
    standalone: true,
    selector: 'app-equipment-dashboard',
    imports: [CommonModule, ChartModule, TableModule],
    providers: [DashboardService],
    template: `
        <div class="col-span-12">
            <div class="grid grid-cols-12 gap-6">
                <!-- Pie Chart Section -->
                <div class="col-span-4 card-2 p-[5px] md:p-[20px] !mb-0 pb-10 ">
                    <div class="chart-card h-full">
                        <div class="chart-header">
                            <h3 class="text-2xl pt-5 pl-4 md:p-0 font-semibold text-[var(--text-color, #374151)] m-0">{{ selectedFactoryName }}</h3>
                        </div>
                        <div class="flex pie-chart justify-evenly items-center h-full">
                            <div class="e_chart" id="pie-chart-container"></div>
                            <!-- Legend -->
                            <div class="legend-container" *ngIf="legendData">
                                <div class="legend-item" *ngFor="let item of legendData">
                                    <div class="legend-color" [style.background-color]="item.color"></div>
                                    <span class="legend-label text-base md:text-[11px]">{{ item.label }} ({{ item.percentage }}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Data Table Section -->
                <div class="col-span-8 p-[5px] md:p-[20px] card-2">
                    <div class="table-card">
                        <p-table
                            #dt
                            (sortFunction)="customSort($event)"
                            [customSort]="true"
                            [value]="tableData"
                            [loading]="loading"
                            [scrollable]="true"
                            scrollHeight="400px"
                            [tableStyle]="{ 'min-width': '100%' }"
                            [paginator]="false"
                            [globalFilterFields]="['factory', 'total', 'using', 'noUse', 'repair', 'waiting', 'useless', 'rental', 'notInERP']"
                        >
                            <ng-template pTemplate="header">
                                <tr>
                                    <th *ngFor="let header of tableHeader" [pSortableColumn]="header.field" class="sortable-header">
                                        <div class="header-content !uppercase">
                                            <span>{{ header.header }}</span>
                                            <p-sortIcon [field]="header.field"></p-sortIcon>
                                        </div>
                                    </th>
                                </tr>
                            </ng-template>

                            <ng-template pTemplate="body" let-item let-i="rowIndex">
                                <tr
                                    *ngIf="item.factory !== 'N/A' && item.factory.trim() !== ''"
                                    [ngClass]="{
                                        'total-row': item.factory === 'TOTAL',
                                        'even-row': item.factory !== 'TOTAL' && i % 2 === 0,
                                        'odd-row': item.factory !== 'TOTAL' && i % 2 === 1,
                                        'selected-row': selectedLctCd === item.lct_cd,
                                        'selected-total-row': item.factory === 'TOTAL' && selectedLctCd === item.lct_cd,
                                        'clickable-row': true
                                    }"
                                    (click)="onRowClick(item)"
                                    style="cursor: pointer;"
                                >
                                    <td class="factory-cell text-nowrap" [ngClass]="{ 'total-cell': item.factory === 'TOTAL' }">
                                        {{ item.factory }}
                                    </td>
                                    <td class="number-cell total-count" [style.color]="item.factory === 'TOTAL' ? '#374151 !important' : ''" [ngClass]="{ 'total-cell': item.factory === 'TOTAL' }">
                                        {{ item.total | number }}
                                    </td>
                                    <td class="number-cell using-cell">{{ item.using | number }}</td>
                                    <td class="number-cell no-use-cell">{{ item.noUse | number }}</td>
                                    <td class="number-cell repair-cell">{{ item.repair | number }}</td>
                                    <td class="number-cell waiting-cell">{{ item.waiting | number }}</td>
                                    <td class="number-cell useless-cell">{{ item.useless | number }}</td>
                                    <td class="number-cell rental-cell">{{ item.rental | number }}</td>
                                    <td class="number-cell not-erp-cell">{{ item.notInERP | number }}</td>
                                </tr>
                            </ng-template>

                            <ng-template pTemplate="emptymessage">
                                <tr>
                                    <td colspan="9" style="text-align: center; padding: 40px;">No data available</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            ::ng-deep {
                .e_chart {
                    position: relative;
                    min-width: 350px;
                    height: 350px;
                    margin-left: -4rem;

                    @media (max-width: 420px) {
                        min-width: 250px !important;
                    }
                }

                .legend-container {
                    margin-left: -3rem;
                }
            }

            .chart-content {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 200px;
                padding-block: 20px;
            }

            .loading-message,
            .no-data-message {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
                color: var(--text-color-secondary, #6b7280);
            }

            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }

            /* Legend Styles */
            .legend-container {
                margin-top: 20px;
                display: flex;
                flex-direction: column;
                gap: 0px;
            }

            .legend-item {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 13px;
            }

            .legend-color {
                width: 10px;
                height: 10px;
                border-radius: 3px;
                flex-shrink: 0;
            }

            .legend-label {
                color: var(--text-color, #374151);
            }

            /* Table Card Styles */
            .table-card {
                padding: 0;
            }

            /* PrimeNG Table Customization */

            ::ng-deep {
                .p-datatable .p-datatable-tbody > tr > td {
                    padding: 8px;
                    text-align: center;
                    font-size: 13px;
                    border: 1px solid var(--surface-border, #e5e7eb);
                }
            }

            /* Cell Styling */
            .factory-cell {
                text-align: left !important;
                font-weight: 500;
                padding-left: 12px !important;
            }

            .number-cell {
                font-family: 'Courier New', monospace;
                text-align: right !important;
                padding-right: 12px !important;
            }

            .total-count {
                font-weight: 600;
                color: var(--text-color, #374151);
            }

            /* Status-specific colors */
            .using-cell {
                color: #059669;
            }

            .no-use-cell {
                color: #dc2626;
            }

            .repair-cell {
                color: #ea580c;
            }

            .waiting-cell {
                color: #7c3aed;
            }

            .useless-cell {
                color: #6b7280;
            }

            .rental-cell {
                color: #0891b2;
            }

            .not-erp-cell {
                color: #be123c;
            }

            /* Responsive */
            @media (max-width: 1200px) {
                .grid {
                    grid-template-columns: 1fr;
                }

                .col-span-4,
                .col-span-8 {
                    grid-column: span 12;
                }
            }

            @media (max-width: 1200px) {
                .pie-chart {
                    flex-direction: row !important;
                }
            }

            @media (max-width: 1500px) {
                .pie-chart {
                    flex-direction: column;
                }
            }

            @media (min-width: 1500px) {
                .pie-chart {
                    flex-direction: row;
                }
            }
        `
    ]
})
export class EquipmentDashboard implements OnInit, OnChanges {
    @Input() loading!: boolean;
    @Input() selectEquipmentStatusReport!: any[];
    @Input() valLanguage!: any;
    @Input() optionLanguage!: LanguageType;

    totalData!: EquipmentData;

    pieLoading: boolean = false;
    pieChartData: any = null;
    pieChartOptions: any;
    tableData: TableRow[] = [];
    initialValue!: TableRow[];
    legendData: any[] = [];
    selectedLctCd: string = 'TOTAL';
    selectedFactoryName: string = 'TOTAL';
    tableHeader: any[] = [];
    isMobile: boolean = false;

    constructor(
        private sv: DashboardService,
        public global_sv: GlobalsService
    ) {
        this.checkMobileView();
    }

    ngOnInit(): void {
        this.chartDom = document.getElementById('pie-chart-container');

        this.myChart = echarts.init(this.chartDom, null, {
            renderer: 'svg',
            useDirtyRect: false
        });

        if (this.valLanguage) {
            this.tableHeader = [
                { field: 'factory', header: this.valLanguage.grid_Factory[this.optionLanguage] },
                { field: 'total', header: this.valLanguage.grid_Total[this.optionLanguage] },
                { field: 'using', header: this.valLanguage.grid_Using[this.optionLanguage] },
                { field: 'noUse', header: this.valLanguage.grid_No_Use[this.optionLanguage] },
                { field: 'repair', header: this.valLanguage.grid_Repair[this.optionLanguage] },
                { field: 'waiting', header: this.valLanguage.grid_Waiting[this.optionLanguage] },
                { field: 'useless', header: this.valLanguage.grid_Useless[this.optionLanguage] },
                { field: 'rental', header: this.valLanguage.grid_Rental[this.optionLanguage] },
                { field: 'notInERP', header: this.valLanguage.grid_Not_In_ERP[this.optionLanguage] }
            ];
        }

        window.addEventListener('resize', () => {
            this.checkMobileView();
        });
        if (this.chartDom && this.myChart != null) {
            const resizeObserver = new ResizeObserver(this.myChart.resize);
            resizeObserver.observe(this.chartDom);
        }
    }

    private checkMobileView(): void {
        this.isMobile = window.innerWidth <= 768;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectEquipmentStatusReport'] && changes['selectEquipmentStatusReport'].currentValue) {
            if (this.selectEquipmentStatusReport) {
                this.processData();
            }
        }
    }

    chartDom!: any;
    myChart!: any;

    private processData(): void {
        this.processTableData();
        this.totalData = this.selectEquipmentStatusReport[0];
        // console.log(this.totalData);
        this.loadPieChartData(this.selectedLctCd || 'TOTAL');
    }

    private processTableData(): void {
        if (!this.selectEquipmentStatusReport) {
            return;
        }

        this.tableData = [...this.selectEquipmentStatusReport].map((item: any) => ({
            factory: item.lct_nm || item.lct_cd || 'N/A',
            lct_cd: item.lct_cd,
            total: item.sts_00,
            using: item.sts_01,
            noUse: item.sts_02,
            repair: item.sts_03,
            waiting: item.sts_04,
            useless: item.sts_05,
            rental: item.sts_06,
            notInERP: item.sts_07
        }));
        this.initialValue = [...this.tableData];
    }

    onRowClick(item: TableRow): void {
        this.selectedLctCd = item.lct_cd;
        this.selectedFactoryName = item.factory;
        this.loadPieChartData(item.lct_cd);
    }

    private loadPieChartData(lct_cd: string): void {
        if (lct_cd === 'TOTAL') {
            // Use totalData for TOTAL
            this.processPieChartData(this.totalData);
        } else {
            // Call API for specific location
            this.pieLoading = true;
            this.sv.getLctEquipInfoOne(lct_cd).subscribe({
                next: (data: EquipmentData) => {
                    if (data) {
                        this.processPieChartData(data);
                    } else {
                        console.warn('No data received for lct_cd:', lct_cd);
                    }
                    this.pieLoading = false;
                },
                error: (error) => {
                    console.error('Error loading equipment detail:', error);
                    this.pieLoading = false;
                }
            });
        }
    }

    private processPieChartData(data: EquipmentData): void {
        if (!data) return;

        var option: echarts.EChartsOption;

        const formattedData = [
            { name: this.valLanguage.grid_Using[this.optionLanguage], value: data.sts_01, color: '#5676cd' },
            { name: this.valLanguage.grid_No_Use[this.optionLanguage], value: data.sts_02, color: '#91cb74' },
            { name: this.valLanguage.grid_Repair[this.optionLanguage], value: data.sts_03, color: '#fac859' },
            { name: this.valLanguage.grid_Waiting[this.optionLanguage], value: data.sts_04, color: '#ee6666' },
            { name: this.valLanguage.grid_Useless[this.optionLanguage], value: data.sts_05, color: '#73c0de' },
            { name: this.valLanguage.grid_Rental[this.optionLanguage], value: data.sts_06, color: '#3ba372' },
            { name: this.valLanguage.grid_Not_In_ERP[this.optionLanguage], value: data.sts_07, color: '#fc8452' }
        ];
        const total = formattedData.reduce((sum, item) => sum + item.value, 0);

        if (total === 0) {
            this.pieChartData = null;
            this.legendData = [];
            return;
        }

        option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} ({d}%)'
            },
            grid: {
                left: '0',
                right: '0',
                bottom: '0',
                top: '0',
                containLabel: true,
                show: false
            },
            series: [
                {
                    type: 'pie',
                    radius: ['20%', '70%'],
                    center: ['50%', '50%'],
                    label: {
                        show: false
                    },
                    data: formattedData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        if (this.myChart != null && option && typeof option === 'object') {
            this.myChart.setOption(option);
        }

        window.addEventListener('resize', this.myChart.resize);
        if (this.chartDom) {
            const resizeObserver = new ResizeObserver(this.myChart.resize);
            resizeObserver.observe(this.chartDom);
        }

        // Create legend data with percentages
        const legend = formattedData.map((item) => ({
            label: item.name,
            color: item.color,
            percentage: ((item.value / total) * 100).toFixed(1),
            value: item.value
        }));
        this.legendData = legend;
    }

    @ViewChild('dt') dt!: Table;
    isSorted: boolean | null = null;

    customSort(event: SortEvent) {
        if (this.isSorted == null || this.isSorted === undefined) {
            this.isSorted = true;
            this.global_sv.sortTableData(event);
        } else if (this.isSorted == true) {
            this.isSorted = false;
            this.global_sv.sortTableData(event);
        } else if (this.isSorted == false) {
            this.isSorted = null;
            this.tableData = [...this.initialValue];
            this.dt.reset();
        }
    }
}
