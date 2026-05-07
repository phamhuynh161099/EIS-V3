import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { SortEvent } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { Table, TableModule } from 'primeng/table';
import { LanguageType } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { DashboardService } from '../dashboard.service';

@Component({
    standalone: true,
    selector: 'app-lct-equip-component',
    imports: [CommonModule, ChartModule, TableModule],
    providers: [DashboardService],
    template: `
        <div class="grid grid-cols-12 gap-4">
            <!-- Chart Section -->
            <div class="p-[5px] pl-[30px] md:p-[20px] w-full overflow-x-auto card-2  xl:col-span-9 col-span-12 !mb-0">
                <div class="min-w-[800px]">
                    <div class="e_chart" id="chart-container"></div>
                </div>
            </div>

            <!-- Data Table Section -->
            <div class="p-[5px] md:p-[20px] card-2 xl:col-span-3 col-span-12 !mb-0">
                <p-table
                    #dt
                    (sortFunction)="customSort($event)"
                    [customSort]="true"
                    [value]="allTableData"
                    [loading]="loading"
                    [scrollable]="true"
                    scrollHeight="350px"
                    [tableStyle]="{'min-width': '100%'}"
                    [paginator]="false"
                    [globalFilterFields]="['factory', 'count', 'rate']">

                    <ng-template pTemplate="header" *ngIf="valLanguage">
                        <tr class="font-semibold m-0">
                            <th [pSortableColumn]="'factory'">
                                <div class="header-content !uppercase">
                                    <span>{{valLanguage.grid_Factory[optionLanguage]}}</span>
                                    <p-sortIcon field="factory"></p-sortIcon>
                                </div>
                            </th>
                            <th [pSortableColumn]="'count'">
                                <div class="header-content !uppercase">
                                    <span>{{valLanguage.grid_Count[optionLanguage]}}</span>
                                    <p-sortIcon field="count"></p-sortIcon>
                                </div>
                            </th>
                            <th [pSortableColumn]="'rate'">
                                <div class="header-content !uppercase">
                                    <span>{{valLanguage.grid_Rate[optionLanguage]}}</span>
                                    <p-sortIcon field="rate"></p-sortIcon>
                                </div>
                            </th>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="body" let-item let-i="rowIndex">
                        <tr *ngIf="item.factory !== 'N/A'  && item.factory.trim() !== ''" [ngClass]="{
                            'total-row': item.isTotal,
                            'text-[var(--text-color-secondary, #9ca3af)] font-italic': !item.isTotal && item.count === 0,
                            'selected-row': selectedRow === i,
                            'selected-total-row': item.isTotal && selectedRow === i,
                            'clickable-row' : true
                        }"
                        (click)="onRowClick(i)"
                        >
                            <td [ngClass]="{'total-cell': item.isTotal}">
                                {{item.factory}}
                            </td>
                            <td [ngClass]="{'total-cell': item.isTotal}"
                                style="text-align: right; font-family: monospace;">
                                {{item.count | number}}
                            </td>
                            <td [ngClass]="{'total-cell': item.isTotal}"
                                style="text-align: right; font-family: monospace;">
                                {{item.rate}}%
                            </td>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="3" style="text-align: center; padding: 40px; color: #9ca3af;">
                                No data to display
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
    `,
    styles: [`
        .e_chart {
            position: relative;
            height: 350px;
        }
        /* PrimeNG table customization for all themes */
        ::ng-deep .p-datatable .p-datatable-thead > tr > th {
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            padding: 12px 8px;
        }

    `]
})
export class LctEquipComponent implements OnInit, OnChanges {
    @Input() rawData!: any[];
    @Input() totalData!: any;
    @Input() loading!: boolean;
    @Input() valLanguage!: any;
    @Input() optionLanguage!: LanguageType;

    chartOptions: any;
    tableData!: any[];
    allTableData!: any[];
    initialValue!: any[];
    isMobile: boolean = false;

    selectedRow: number | undefined = undefined;
    onRowClick(i: number): void {
        this.selectedRow = i;
    }

    constructor(public global_sv: GlobalsService) {
        this.checkMobileView();
    }

    dom!: any;
    myChart!: any;

    ngOnInit(): void {
        this.dom = document.getElementById('chart-container');
        this.myChart = echarts.init(this.dom, null, {
            renderer: 'svg',
            useDirtyRect: false
        });

        if (this.rawData && this.totalData) {
            this.loadChartData();
        }

        // Listen for window resize
        window.addEventListener('resize', () => {
            this.checkMobileView();
        });
        if (this.dom) {
            const resizeObserver = new ResizeObserver(this.myChart.resize);
            resizeObserver.observe(this.dom);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Theo dõi thay đổi của các input
        if ((changes['rawData'] && changes['rawData'].currentValue) ||
            (changes['totalData'] && changes['totalData'].currentValue)) {

            // Chỉ load data khi cả rawData và totalData đều có
            if (this.rawData && this.totalData) {
                this.loadChartData();
            }
        }
    }

    trackByIndex(index: number, item: any): number {
        return index;
    }

    private checkMobileView(): void {
        this.isMobile = window.innerWidth <= 768;
    }

    private loadChartData(): void {
        if (!this.rawData || !this.totalData) {
            console.warn('Data not ready:', { rawData: this.rawData, totalData: this.totalData });
            return;
        }

        const labels = this.rawData.map((item: any) => {
            // return (label.length > 10) ? label.substring(0, 8) + '...' : label;
            return item.lct_nm || 'Null';
        });

        let option = {
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
                data: labels,
                axisLabel: {
                    rotate: 50,
                    fontSize: 10,
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
                splitNumber: 2,
                // interval: 1000,
                splitLine: {
                    show: true,
                    showMinLine: false
                }
            },
            series: [
                {
                    type: 'bar',
                    data: this.rawData.map((item: any) => item.lct_cnt || 0),
                    colorBy: "data",
                    barMinHeight: 2
                },
            ]
        };

        if (option && typeof option === 'object') {
            this.myChart.setOption(option);
        }

        window.addEventListener('resize', this.myChart.resize);
        if (this.dom) {
            const resizeObserver = new ResizeObserver(this.myChart.resize);
            resizeObserver.observe(this.dom);
        }

        this.tableData = this.rawData.map((item: any) => ({
            factory: item.lct_nm || 'N/A',
            count: item.lct_cnt || 0,
            rate: item.lct_rt || 0,
            isTotal: false
        }));

        this.allTableData = [
            {
                factory: 'TOTAL',
                count: this.totalData?.sts_00 || 0,
                rate: this.totalData.lct_rt || 0,
                isTotal: true
            },
            ...this.tableData
        ];
        this.initialValue = [...this.allTableData];
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
            this.allTableData = [...this.initialValue];
            this.dt.reset();
        }
    }
}
