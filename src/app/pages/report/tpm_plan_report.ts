import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { forkJoin, Subject, takeUntil } from 'rxjs';

import { Dialog } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBar } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Ripple } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TreeTableModule } from 'primeng/treetable';

import { LanguageType } from '../../../constants/constants.auth';
import { GlobalsService } from '../../../globals.service';
import { ReportService } from './report.service';
@Component({
    imports: [
        CommonModule,
        Dialog,
        ProgressBar,
        ProgressSpinnerModule,
        TreeTableModule,
        TagModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        ButtonModule,
        FormsModule,
        TextareaModule,
        TableModule,
        FloatLabelModule,
        ToastModule,
        SelectModule,
        Ripple
    ],
    standalone: true,
    providers: [ReportService, MessageService],
    template: `<div class="header-title"  *ngIf="valLanguage">
            <div class="flex items-center justify-between">
                <h2 class="text-2xl mb-0 sm:text-3xl">{{ valLanguage.nameTPMPlanReport[optionLanguage] }}</h2>
                <p-button class="w-40 *:w-full" [label]="valLanguage.btn_Refresh[optionLanguage]" severity="secondary" icon="pi pi-refresh" (click)="ngOnInit()" />
            </div>
        </div>
        <div class="flex flex-wrap flex-row items-start gap-4 grid-flow-col justify-center xl:justify-between">
            @for (item of dataFactory; track item.factory) {
                <div class="card tmp_line">
                    <div class="p-3 flex flex-wrap gap-2 items-center justify-between">
                        <div>
                            <label>{{ valLanguage.txt_Corp[optionLanguage] }} : {{ getTitleName(corpFac, item.corp) }} </label>
                            <i class="pi pi-angle-right"></i>
                            <label>{{ valLanguage.txt_Factory[optionLanguage] }} : {{ getTitleName(factory, item.factory) }} </label>
                        </div>

                        <p-button icon="pi pi-address-book" class="ml-auto" (click)="showDialog(item.corp, item.factory, item.dataChart)" label="TPM Line" variant="outlined" severity="info" />
                    </div>
                    @for (itemChild of item.dataChart; track i; let i = $index) {
                        <div class="card-2">
                            <div *ngIf="i === 0" class="flex justify-between">
                                <label></label>
                                <label>100%</label>
                            </div>
                            <div class="flex justify-between">
                                <label class="w-1/3">{{ itemChild.name }}</label>
                                <p-progressbar [class]="'w w-2/3 ' + itemChild.color" [value]="itemChild.value" />
                            </div>
                        </div>
                    }
                    <!-- <div class="e_chart" [id]="item.factory"></div> -->
                </div>
            } @empty {
                <p-progress-spinner *ngIf="loading" strokeWidth="5" fill="transparent" animationDuration=".5s" [style]="{ width: '60px', height: '60px' }" class="flex justify-center w-full h-full" ariaLabel="loading" />
            }
        </div>
        <p-dialog [header]="'TMP Plan.  Corp : ' + idCorp + ', Storage : ' + idFactory" [modal]="true" [(visible)]="visible">
            <div class="flex flex-wrap flex-row items-start gap-4 grid-flow-col justify-center xl:justify-between">
                @for (dtline of dataLine; track i; let i = $index) {
                    <div class="card tmp_line_child">
                        <div class="p-3 flex justify-between">
                            <div pRipple class="box" style="border: 1px solid rgba(255, 193, 6, 0.3); --p-ripple-background: rgba(255, 193, 6, 0.3)">
                                <label class="pr-2"><i class="pi pi-chevron-right pr-3"></i> {{ valLanguage.txt_Line[optionLanguage] }} : {{ dtline.plan_grp }} </label>
                            </div>
                        </div>
                        <p-table class="overflow-auto" [value]="dtline.dataLine" [scrollable]="true" scrollHeight="290px" [tableStyle]="{ 'max-width': '100%' }">
                            <ng-template #header>
                                <tr>
                                    <th>{{ valLanguage.txt_Line[optionLanguage] }}</th>
                                    <th>{{ valLanguage.txt_PlanDate[optionLanguage] }}</th>
                                    <th>{{ valLanguage.txt_EndDate[optionLanguage] }}</th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-line>
                                <tr>
                                    <td>{{ line.value }}</td>
                                    <td>{{ global_sv.checkDate(line.plan_dt) }}</td>
                                    <td>{{ global_sv.checkDate(line.end_dt) }}</td>
                                </tr>
                            </ng-template>
                        </p-table>
                        <div class="flex justify-between p-3">
                            <label>Processing(%)</label>
                            <p-progressbar [class]="'w w-2/3 ' + dtline.color" [value]="dtline.processing" />
                        </div>
                    </div>
                } @empty {
                    <p-progress-spinner strokeWidth="5" *ngIf="flagDataLine" fill="transparent" animationDuration=".5s" [style]="{ width: '60px', height: '60px' }" class="flex justify-center w-full h-full" ariaLabel="loading" />
                }
            </div>
        </p-dialog>`,
    styles: `
        ::ng-deep {
            .tmp_line {
                width: 500px;
                @media (max-width: 991px) {
                    width: 380px;
                }
            }
            .tmp_line_child {
                width: 500px;
                height: 400px;
                // overflow: auto;
                @media (max-width: 991px) {
                    width: 380px;
                    height: 400px;
                }
            }
            table thead{
                text-wrap: nowrap;
            }
            .p-datatable-table-container {
                border-radius: 5px;
            }
            .green .p-progressbar .p-progressbar-value {
                background: var(--chart-green);
            }
            .red .p-progressbar .p-progressbar-value {
                background: var(--chart-red);
            }
            .yellow .p-progressbar .p-progressbar-value {
                background: var(--chart-yellow);
            }
            #chart-container {
            }
            .e_chart {
                position: relative;
                height: 400px;
                width: 500px;
                overflow: hidden;
            }
            .p-progressspinner-circle {
                stroke: var(--grid-stroke) !important;
            } 
            p-progressbar .p-progressbar-label {
                color: #000;
            }
            p-dialog {
                .p-dialog-content {
                    padding-top: 20px;
                    background: var(--surface-ground);
                }

                .p-dialog-title {
                    @media (max-width: 600px) {
                        font-size: 1em;
                    }
                }

                div[pfocustrap] {
                    max-height: 100%;
                    height: 100%;
                    border-radius: 0;
                    width: 100%;
                }
            }
        }
        :host {
            .box {
                padding: 0.5rem;
                border-radius: 5px;
                width: 100%;
                text-align: center;
            }
        }
    `
})
export class TPMPlanReport implements OnInit {
    //, OnDestroy
    private unsubscribe$ = new Subject<void>();
    private apiService = inject(ReportService);
    loading: boolean = false;
    flagDataLine: boolean = true;
    records!: number;
    dataFactory!: any;
    dataLine!: any;
    factory!: any;
    corpFac!: any;
    flagLoad: boolean = false;
    visible: boolean = false;
    idFactory: string = '';
    idCorp: string = '';

    constructor(public global_sv: GlobalsService) {
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
        this.dataFactory = null;
        this.loadListFilter();
    }

    showDialog(idCorp: string, idFac: string, dataChart: any) {
        this.idFactory = this.getTitleName(this.factory, idFac);
        this.idCorp = this.getTitleName(this.corpFac, idCorp);
        const param: any = { corp: idCorp, factory: idFac };
        this.getTpmPlanLine(param, dataChart);
        this.visible = true;
    }

    loadListFilter(): void {
        forkJoin({
            factory: this.global_sv.getLctFactory(),
            corp: this.global_sv.getCorp(),
            dataFactory: this.apiService.selectTpmPlan()
        })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (responses) => {
                    if (responses.factory !== null && responses.factory !== undefined) {
                        this.factory = responses.factory
                            .filter((item: any) => item.comm_nm !== '')
                            .map((item: any) => ({
                                label: item.comm_nm,
                                value: item.comm_cd
                            }));
                    }
                    if (responses.corp !== null && responses.corp !== undefined) {
                        this.corpFac = responses.corp.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    }

                    if (responses.dataFactory !== undefined && responses.dataFactory !== null) {
                        let dataChart: any = this.formatCreateDataLine(responses.dataFactory);
                        dataChart.sort(function (a: any, b: any) {
                            return a.factory.localeCompare(b.factory);
                        });
                        this.dataFactory = dataChart;
                        console.log('responses.dataFactory', this.dataFactory);
                        //  this.dataFactory = responses.dataFactory.ds_fact;
                        // this.flagLoad = true;
                        // this.getDataTpmPlan();
                    }
                },
                (error) => {
                    console.error('Error loading filter lists:', error);
                }
            );
    }

    getDataTpmPlan(): void {
        this.loading = true;
        this.apiService
            .selectTpmPlan()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (response) => {
                    // Handle response
                    if (response !== undefined && response !== null) {
                        // this.dataFactory = response.ds_fact;
                        const dataChart: any = this.formatCreateDataChart(response);
                        dataChart.forEach((ele: any) => {
                            this.getEChart(ele.factory, '', ele.dataChart);
                        });

                        this.loading = false;
                    }
                },
                (error) => {
                    this.loading = false;
                    console.error('Error loading filter lists:', error);
                }
            );
    }

    getTpmPlanLine(param: any, dataChart: any): void {
        this.flagDataLine = true;
        this.apiService
            .getTpmPlanLine(param)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (response) => {
                    // Handle response
                    if (response !== undefined && response !== null) {
                        let data: any = this.formatCreateDataLineChild(response);
                        dataChart.forEach((ele: any) => {
                            data.forEach((eleChild: any, index: number) => {
                                if (ele.name === eleChild.plan_grp) {
                                    data[index]['processing'] = ele.value;
                                    data[index]['color'] = ele.color;
                                }
                            });
                        });
                        this.dataLine = data;
                        this.flagDataLine = false;
                    }
                },
                (error) => {
                    this.flagDataLine = false;
                    console.error('Error loading filter lists:', error);
                }
            );
    }

    formatCreateDataLine(response: any): any {
        let dataChart: any = response.ds_fact;
        const ds_grp: any = response.ds_grp;

        dataChart.forEach((ele: any, index: number) => {
            let dataValue: any = [];
            ds_grp.forEach((eleChild: any) => {
                if (ele.factory === eleChild.factory) {
                    if (eleChild.plan_rt < 81 && eleChild.plan_rt > 50) {
                        dataValue.push({
                            value: eleChild.plan_rt,
                            name: eleChild.plan_grp,
                            color: 'yellow'
                        });
                    } else if (eleChild.plan_rt <= 50) {
                        dataValue.push({
                            value: eleChild.plan_rt,
                            name: eleChild.plan_grp,
                            color: 'red'
                        });
                    } else {
                        dataValue.push({
                            value: eleChild.plan_rt,
                            name: eleChild.plan_grp,
                            color: 'green'
                        });
                    }
                }
            });
            dataChart[index]['dataChart'] = dataValue;
        });
        return dataChart;
    }

    formatCreateDataLineChild(response: any): any {
        let dataLineChild: any = response.ds_group;
        const ds_grp: any = response.ds_line;

        dataLineChild.forEach((ele: any, index: number) => {
            let dataValue: any = [];
            ds_grp.forEach((eleChild: any) => {
                if (ele.plan_grp === eleChild.plan_grp) {
                    dataValue.push({
                        value: eleChild.line_cd,
                        plan_dt: eleChild.plan_dt,
                        end_dt: eleChild.end_dt
                    });
                }
            });
            dataLineChild[index]['dataLine'] = dataValue;
        });
        return dataLineChild;
    }

    formatCreateDataChart(response: any): any {
        let dataChart: any = response.ds_fact;
        const ds_grp: any = response.ds_grp;

        dataChart.forEach((ele: any, index: number) => {
            let dataName: any = [];
            let dataNull: any = [];
            let dataValue: any = [];
            ds_grp.forEach((eleChild: any) => {
                if (ele.factory === eleChild.factory) {
                    if (eleChild.plan_rt < 81 && eleChild.plan_rt > 50) {
                        dataValue.push({
                            value: eleChild.plan_rt,
                            itemStyle: { color: 'var(--chart-yellow)' }
                        });
                    } else if (eleChild.plan_rt <= 50) {
                        dataValue.push({
                            value: eleChild.plan_rt,
                            itemStyle: { color: 'var(--chart-red)' }
                        });
                    } else {
                        dataValue.push(eleChild.plan_rt);
                    }

                    if (eleChild.plan_grp.length > 14) {
                        dataName.push(eleChild.plan_grp.slice(0, 12) + '...');
                    } else {
                        dataName.push(eleChild.plan_grp);
                    }

                    dataNull.push(100 - eleChild.plan_rt);
                }
            });
            dataChart[index]['dataChart'] = {
                dataName: dataName,
                dataValue: dataValue,
                dataNull: dataNull
            };
        });
        return dataChart;
    }

    getTitleName(list: any, code: string): string {
        let name = '';
        list.forEach((ele: any) => {
            if (ele.value === code) {
                name = ele.label;
            }
        });
        return name;
    }

    getEChart(nameChart: string = 'chart-container', title: string = 'World Population', data: any): void {
        let dom = document.getElementById(nameChart);
        let myChart: any = echarts.init(dom, null, {
            renderer: 'svg',
            useDirtyRect: false
        });
        let option = {
            // title: {
            //     text: title
            // },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '6%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                splitLine: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                boundaryGap: [0, 0.01],
                max: 100
            },
            yAxis: {
                type: 'category',
                data: data.dataName
            },
            series: [
                {
                    name: 'Plan',
                    type: 'bar',
                    stack: 'total',
                    barMaxWidth: 20,
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: data.dataValue,
                    itemStyle: { color: 'var(--chart-green)' }
                },
                {
                    name: 'Null value',
                    type: 'bar',
                    stack: 'total',
                    barMaxWidth: 20,
                    label: {
                        show: false
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: data.dataNull,
                    itemStyle: { color: 'var(--chart-null-bg)' }
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
        if (dom) {
            const resizeObserver = new ResizeObserver(myChart.resize);
            resizeObserver.observe(dom);
        }
    }

    ngAfterContentChecked(): void {
        // Perform actions after the component's view and its child views have been checked
        // if (this.flagLoad) {
        //     this.flagLoad = false;
        //     this.getDataTpmPlan();
        // }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
