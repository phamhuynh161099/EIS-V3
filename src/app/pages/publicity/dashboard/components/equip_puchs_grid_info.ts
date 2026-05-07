import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { LanguageType } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { DashboardService } from '../dashboard.service';

@Component({
    standalone: true,
    selector: 'app-equip-puchs-grid-info',
    imports: [CommonModule, ChartModule, TableModule, ButtonModule, InputTextModule],
    providers: [DashboardService],
    template: `
        <div class="grid grid-cols-12 gap-4">
            <!-- Chart Section -->
            <div class="p-[5px] pl-[50px] md:p-[20px] w-full card-2 xl:col-span-9 col-span-12 !mb-0">
                <div class="e_chart" id="chart-container-3"></div>
            </div>

            <!-- Data Table Section -->
            <div class="p-[5px] md:p-[20px] card-2 xl:col-span-3 col-span-12 !mb-0">
                <p-table 
                    #dt
                    (sortFunction)="customSort($event)"
                    [customSort]="true"
                    [value]="totalData" 
                    [loading]="loading"
                    [scrollable]="true" 
                    scrollHeight="350px"
                    [tableStyle]="{'min-width': '100%'}"
                    [paginator]="false"
                    [globalFilterFields]="['puchs_y', 'mt_cnt', 'mt_rt']">
                    
                    <ng-template pTemplate="header" *ngIf="valLanguage">
                        <tr class="font-semibold m-0 ">
                            <th [pSortableColumn]="'puchs_y'">
                                <div class="header-content !uppercase">
                                    <span>{{valLanguage.grid_Year[this.optionLanguage]}}</span>
                                    <p-sortIcon field="puchs_y"></p-sortIcon>
                                </div>
                            </th>
                            <th [pSortableColumn]="'mt_cnt'">
                                <div class="header-content !uppercase">
                                    <span>{{valLanguage.grid_Asset_Count[this.optionLanguage]}}</span>
                                    <p-sortIcon field="mt_cnt"></p-sortIcon>
                                </div>
                            </th>
                            <th [pSortableColumn]="'mt_rt'">
                                <div class="header-content !uppercase">
                                    <span>{{valLanguage.grid_Rate[this.optionLanguage]}}</span>
                                    <p-sortIcon field="mt_rt"></p-sortIcon>
                                </div>
                            </th>
                        </tr>
                    </ng-template>
                    
                    <ng-template pTemplate="body" let-item let-i="rowIndex">
                        <tr [ngClass]="{
                            'total-row': item.puchs_y === 'TOTAL',
                            'selected-row': selectedRow === i,
                            'selected-total-row': item.puchs_y == 'TOTAL' && selectedRow === i,

                        }" (click)="onRowClick(i)">
                            <td [ngClass]="{'total-cell': item.puchs_y === 'TOTAL'}"
                                style="text-align: left; font-family: monospace;">
                                {{item.puchs_y}}
                            </td>
                            <td [ngClass]="{'total-cell': item.puchs_y === 'TOTAL'}" 
                                style="text-align: right; font-family: monospace;">
                                {{item.mt_cnt | number}}
                            </td>
                            <td [ngClass]="{'total-cell': item.puchs_y === 'TOTAL'}" 
                                style="text-align: right; font-family: monospace;">
                                {{item.mt_rt}}%
                            </td>
                        </tr>
                    </ng-template>
                    
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="3" style="text-align: center; padding: 40px; color: #9ca3af;">
                                <div class="text-center text-[var(--text-color-secondary, #6b7280)]">
                                    <i class="pi pi-search" style="font-size: 2rem; margin-bottom: 10px; display: block; color: var(--text-color-secondary, #9ca3af)"></i>
                                    <p>No matching records found</p>
                                    <p style="font-size: 0.8rem;">Try adjusting your search criteria</p>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
    `,
    styles: [`
        
        /* PrimeNG table customization for all themes */
        ::ng-deep .p-datatable .p-datatable-thead > tr > th {
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            padding: 12px 8px;
            vertical-align: top;
            border: 1px solid var(--surface-border, #e5e7eb);
        }

        ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
            padding: 8px;
            text-align: center;
            font-size: 13px;
            border: 1px solid var(--surface-border, #e5e7eb);
        }
            
        ::ng-deep .p-datatable .p-datatable-scrollable-body {
            border: 1px solid var(--surface-border, #e5e7eb);
        }

        /* Responsive */
        @media (max-width: 768px) {
           
            .search-container {
                justify-content: center;
            }

            .search-input {
                width: 100% !important;
                max-width: 200px;
            }
        }

        .e_chart {
            position: relative;
            height: 350px;
        }
    `]
})
export class EquipPuchsGridInfo implements OnInit, OnChanges {
    initialValue!: any[];
    isMobile: boolean = false;

    @Input() totalData!: any[];
    @Input() loading!: boolean;
    @Input() valLanguage!: any;
    @Input() optionLanguage!: LanguageType;
    constructor(public global_sv: GlobalsService) {
        this.checkMobileView();
    }

    dom!: any;
    myChart: any = null;

    onRowClick(i: number): void {
        this.selectedRow = i;
    }
    selectedRow: number | undefined = undefined;

    ngOnInit(): void {
        this.dom = document.getElementById('chart-container-3');
        this.myChart = echarts.init(this.dom, null, {
            renderer: 'svg',
            useDirtyRect: false
        });

        if (this.totalData) this.loadChartData();

        window.addEventListener('resize', () => {
            this.checkMobileView();
        });
    }

    private checkMobileView(): void {
        this.isMobile = window.innerWidth <= 768;
    }

    trackByIndex(index: number, item: any): number {
        return index;
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Theo dõi thay đổi của các input
        if ((changes['totalData'] && changes['totalData'].currentValue)) {

            // Chỉ load data khi cả rawData và totalData đều có
            if (this.totalData) {
                this.loadChartData();
            }
        }
    }

    private loadChartData(): void {
        if (!this.totalData) {
            console.warn('Data not ready:', { totalData: this.totalData });
            return;
        }


        let option: echarts.EChartsOption =
        {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '4%',
                right: '2%',
                bottom: '3%',
                top: '6%',
                containLabel: true,
                show: false,
            },
            xAxis: {
                type: 'category',
                data: this.totalData.map((item: any) => item.puchs_y || 'Null').filter((item: any) => item !== 'TOTAL'),
                axisLabel: {
                    rotate: this.isMobile ? 50 : 0,
                    fontSize: this.isMobile ? 10 : 15,
                    fontWeight: "bold"
                },
                axisLine: {
                    show: false,
                    onZero: true,
                    symbol: "none"
                },
                axisTick: {
                    show: false
                },
                // splitLine: {
                //     show: true,
                //     showMinLine: true
                // }
            },
            yAxis: {
                type: 'value',
                // splitNumber: 2,
                interval: 500,
                splitLine: {
                    show: true,
                    showMinLine: false
                }
            },
            series: [
                {
                    type: 'bar',
                    data: this.totalData.filter((item: any) => item.puchs_y !== 'TOTAL').map((item: any) => item.mt_cnt || 0),
                    colorBy: "data",
                    barMinHeight: 2
                },
            ],
        };
        this.initialValue = [...this.totalData];

        if (this.myChart != null && option && typeof option === 'object') {
            this.myChart.setOption(option);
        }

        if (this.dom && this.myChart != null) {
            window.addEventListener('resize', this.myChart.resize);
            const resizeObserver = new ResizeObserver(this.myChart.resize);
            resizeObserver.observe(this.dom);
        }
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
            this.totalData = [...this.initialValue];
            this.dt.reset();
        }
    }
}