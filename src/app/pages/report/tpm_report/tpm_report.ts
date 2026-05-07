import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from "primeng/floatlabel";
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { forkJoin } from 'rxjs';

import { SortEvent } from 'primeng/api';
import { LanguageType } from '../../../../constants/constants.auth';
import { GlobalsService } from '../../../../globals.service';
import { TPMReportService } from './tpm_report.service';
interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    imports: [FloatLabel, MultiSelectModule, IconFieldModule, TagModule, InputIconModule, InputTextModule, TableModule, ButtonModule, SelectModule, FormsModule, InputGroupModule, InputGroupAddonModule, DatePickerModule, RadioButtonModule, CommonModule],
    selector: 'app-location-history_report',
    template: `
        <section class="flex flex-col min-h-full w-full">
            <div class="header-title">
                <div class="flex flex-col sm:flex-row justify-between items-center mb-3 xl:mb-0">
                    <h2 class="text-2xl sm:text-3xl mr-auto">{{this.valLanguage.TPMReport[this.optionLanguage]}}</h2>
                    <div class="flex gap-2 *:w-[120px] *:*:w-full ml-auto">
                        <p-button [outlined]="true" icon="pi pi-search" class="!w-32 *:!w-32" [label]="this.valLanguage.btn_Search[this.optionLanguage]" (click)="onSearch()" severity="info" />
                        <p-button [outlined]="true" icon="pi pi-filter-slash" class="!w-32 *:!w-32" [label]="this.valLanguage.btn_ClearFilter[this.optionLanguage]" (click)="onClearSearch()" severity="secondary" />
                    </div>
                </div>
            <div class="grid grid-cols-1 md:grid-cols-3 rounded justify-around gap-5 *:space-y-7 *:mt-2 box p-5 header-border-filter">
                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <input inputId="as_no_label" type="text" pInputText [(ngModel)]="selectedAs_nos" class="w-full" />
                        <label for="as_no_label">{{this.valLanguage.grid_Asset_No[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="corp_label" class="w-full" [loading]="loading" [(ngModel)]="selectedCorp" [options]="corps" [showClear]="true">
                            <ng-template let-option #item>
                                <p-tag [value]="option.label" class="w-full !py-2" [severity]="global_sv.getCorpColor(option.label)" />
                            </ng-template>
                        </p-select>
                        <label for="corp_label">{{this.valLanguage.grid_Corp[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="manufacturer_label" [options]="manufacturers" [(ngModel)]="selectedManufacturer" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="manufacturer_label">{{this.valLanguage.grid_Manufacturer[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <input inputId="worker_label" type="text" pInputText [(ngModel)]="selectedWorker" class="w-full" />
                        <label for="worker_label">{{this.valLanguage.grid_Worker[this.optionLanguage]}}</label>
                    </p-floatlabel>
                </div>

                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <input inputId="machine_nm_label" type="text" pInputText [(ngModel)]="selectedMachine_nm" class="w-full" />
                        <label for="machine_nm_label">{{this.valLanguage.grid_Machine_Name[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="factory_label" [options]="factories" [(ngModel)]="selectedFactory" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="factory_label">{{this.valLanguage.grid_Factory[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="model_label" [options]="models" [(ngModel)]="selectedModel" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="model_label">{{this.valLanguage.grid_Model[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="pro_dev_label" [options]="workplaces" [(ngModel)]="selectedWorkplace" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="pro_dev_label">{{this.valLanguage.grid_Workplace[this.optionLanguage]}}</label>
                    </p-floatlabel>

                </div>

                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <input inputId="barcode_label" type="text" pInputText [(ngModel)]="selectedBarcode" class="w-full" />
                        <label for="barcode_label">{{this.valLanguage.grid_Barcode[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="location_label" [options]="locations" [(ngModel)]="selectedLocation" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="location_label">{{this.valLanguage.grid_Location[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="status_label" [options]="status" [(ngModel)]="selectedStatus" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" [severity]="global_sv.getStatusColor(option.label)" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="status_label">{{this.valLanguage.grid_Status[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-datepicker inputId="date_label" id="datepicker_style" [maxDate]="now" [(ngModel)]="selectedRangeDates" class="w-full date-left" (onClearClick)="onClearFilterDate()" dateFormat="yy-mm-dd" (onClose)="onCloseFilterDate()" showIcon iconDisplay="input" selectionMode="range" [showButtonBar]="true" [readonlyInput]="true" />
                        <label for="date_label">{{this.valLanguage.grid_Work_Date[this.optionLanguage]}}</label>
                    </p-floatlabel>
                </div>
            </div>

        </div>
        <section class="card-2 p-[5px] md:p-[20px] flex-1]">
            <p-table #dt1 [scrollable]="true" scrollHeight="600px" virtualScrollItemSize="600" [loading]="loadingTable" [columns]="cols"
                [value]="data" [paginator]="true" [rows]="50" [showCurrentPageReport]="true" exportFilename="TPM Report" [exportHeader]="'customExportHeader'"
                [tableStyle]="{ 'min-width': '50rem' }" (sortFunction)="customSort($event)" [customSort]="true" [totalRecords]="totalRecords"
                [showCurrentPageReport]="true" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" [first]="first"
                [rowsPerPageOptions]="[50, 100, 200, 500 ,1000]">
                <ng-template #caption>
                    <div class="flex justify-between *:text-nowrap overflow-x-auto gap-x-4 py-2">
                        <div class="flex gap-4">
                            <p-button [label]="this.valLanguage.btn_ClearFilter[this.optionLanguage]" [outlined]="true" icon="pi pi-filter-slash" (click)="onClearTable(dt1)" />
                            <p-button [outlined]="true" [icon]="isVisible ? 'pi pi-unlock' : 'pi pi-lock-open'" class="text-nowrap" [label]="this.valLanguage.btn_ShowFilter[optionLanguage]" (click)="showFilter()"></p-button>
                            <p-button [outlined]="true" icon="pi pi-file-excel" [label]="this.valLanguage.btn_Export[this.optionLanguage]" (click)="exportToExcel()"/>
                        </div>
                        <p-button [outlined]="true" icon="pi pi-filter-slash" class="text-nowrap" [label]="this.valLanguage.btn_Clear_All[this.optionLanguage]" (click)="onClearAllSearch()" severity="warn" />
                    </div>
                </ng-template>
                <ng-template #header pTemplate="header">
                    <tr>
                        <th></th>
                        <th *ngFor="let header of cols" [pSortableColumn]="header.field" class="sortable-header cursor-pointer">
                            <div class="header-content">
                                <span>{{header.header}}</span>
                                <p-sortIcon [field]="header.field" />
                            </div>
                        </th>
                    </tr>
                    <tr [hidden]="isVisible">
                            <!-- <th pFrozenColumn></th> -->
                            <th></th>
                            <th>
                                <p-columnFilter type="text" field="mt_cd" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="mt_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="from_lct_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="srl_no" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="sts_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="lct_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="lct_sts_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="mgm_dept_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="cost_dept_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="mf_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="md_cd" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="sp_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="print_yn" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th class="flex justify-center items-center">
                                <label class="w-32 opacity-55">Search By Date:</label>
                                <p-columnFilter type="date" field="puchs_dt_ymd" display="menu" [showMatchModes]="true" [showOperator]="false" [showAddButton]="true">
                                    <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                        <p-datepicker #calendar [ngModel]="value" (onSelect)="filter(calendar.value)" (onInput)="setup(calendar.value, 'puchs_dt_ymd')" [showButtonBar]="true" placeholder="Regi  stration Date" dateFormat="yy-mm-dd">
                                        </p-datepicker>
                                    </ng-template>
                                </p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="reason_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="use_yn" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="barcode" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="reg_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th class="flex justify-center items-center">
                                <label class="w-32 opacity-55">Search By Date:</label>
                                <p-columnFilter type="date" field="reg_dt_ymd" display="menu" [showMatchModes]="true" [showOperator]="false" [showAddButton]="true">
                                    <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                        <p-datepicker #calendar [ngModel]="value" (onSelect)="filter(calendar.value)" (onInput)="setup(calendar.value, 'reg_dt_ymd')" [showButtonBar]="true" placeholder="Regi  stration Date" dateFormat="yy-mm-dd">
                                        </p-datepicker>
                                    </ng-template>
                                </p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="chg_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th class="flex justify-center items-center">
                                <label class="w-32 opacity-55">Search By Date:</label>
                                <p-columnFilter type="date" field="chg_dt_ymd" display="menu" [showMatchModes]="true" [showOperator]="false" [showAddButton]="true">
                                    <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                        <p-datepicker #calendar [ngModel]="value" (onSelect)="filter(calendar.value)" (onInput)="setup(calendar.value, 'chg_dt_ymd')" [showButtonBar]="true" placeholder="Regi  stration Date" dateFormat="yy-mm-dd">
                                        </p-datepicker>
                                    </ng-template>
                                </p-columnFilter>
                            </th>
                        </tr>
                </ng-template>
                <ng-template #body let-item let-i="rowIndex" pTemplate="body">
                    <tr [ngClass]="{
                                            'even-row': i % 2 === 0,
                                            'odd-row': i % 2 === 1,
                                            'selected-row': selectedRow === i,
                                            'clickable-row': true
                                        }"
                                        (click)="onRowClick(i)">
                        <td aria-describedby="list_rn">{{ i + 1 }}</td>
                        <td aria-describedby="list_mt_cd" class="text-nowrap">{{ item.mt_cd }}</td>
                        <td aria-describedby="list_mt_nm" class="text-nowrap">{{ item.mt_nm }}</td>
                        <td aria-describedby="list_from_lct_nm" class="text-nowrap">{{ item.from_lct_nm }}</td>
                        <td aria-describedby="list_srl_no" class="text-nowrap">{{ item.srl_no }}</td>
                        <td aria-describedby="list_sts_nm" class="text-nowrap">{{ item.sts_nm }}</td>
                        <td aria-describedby="list_lct_nm" class="text-nowrap">{{ item.lct_nm }}</td>
                        <td aria-describedby="list_lct_sts_nm" class="text-nowrap">{{ item.lct_sts_nm }}</td>
                        <td aria-describedby="list_mgm_dept_nm" class="text-nowrap">{{ item.mgm_dept_nm }}</td>
                        <td aria-describedby="list_cost_dept_nm" class="text-nowrap">{{ item.cost_dept_nm }}</td>
                        <td aria-describedby="list_mf_nm" class="text-nowrap">{{ item.mf_nm }}</td>
                        <td aria-describedby="list_md_cd" class="text-nowrap">{{ item.md_cd }}</td>
                        <td aria-describedby="list_sp_nm" class="text-nowrap">{{ item.sp_nm }}</td>
                        <td aria-describedby="list_print_yn" class="text-nowrap">{{ item.print_yn }}</td>
                        <td aria-describedby="list_puchs_dt_ymd" class="text-nowrap">{{ item.puchs_dt_ymd | date: 'yyyy/MM/dd HH:mm:ss'}}</td>
                        <td aria-describedby="list_reason_nm" class="text-nowrap">{{ item.reason_nm }}</td>
                        <td aria-describedby="list_use_yn" class="text-nowrap">{{ item.use_yn }}</td>
                        <td aria-describedby="list_barcode " class="text-nowrap">{{ item.barcode }}</td>
                        <td aria-describedby="list_reg_nm" class="text-nowrap">{{ item.reg_nm }}</td>
                        <td aria-describedby="list_reg_dt_ymd" class="text-nowrap">{{ item.reg_dt_ymd | date: 'yyyy/MM/dd HH:mm:ss'}}</td>
                        <td aria-describedby="list_chg_nm" class="text-nowrap">{{ item.chg_nm }}</td>
                        <td aria-describedby="list_chg_dt_ymd" class="text-nowrap">{{ item.chg_dt_ymd | date: 'yyyy/MM/dd HH:mm:ss'}}</td>

                    </tr>
                </ng-template>
            </p-table>
        </section>
    </section>
    `,
    styles: [`
        ::ng-deep .p-datatable .p-datatable-thead > tr > th {
            font-weight: 600;
            font-size: 13px;
            padding: 12px 8px;
            vertical-align: top;
            border: 1px solid var(--surface-border, #e5e7eb);
        }

        ::ng-deep .p-select-label {
            align-self: center;
        }

        ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
            padding: 8px;
            font-size: 13px;
            border: 1px solid var(--surface-border, #e5e7eb);
        }

        ::ng-deep .p-datatable .p-datatable-thead > tr > .search_bg {
            background: var(--p-datatable-header-cell-selected-background);
        }


        :host ::ng-deep .date-left > .p-datepicker > .ng-trigger {
            right:0 !important;
            left:unset !important;
        }

        :host ::ng-deep #datepicker_style .p-datepicker{
            width: 100%;
            height: 100%;
        }

    `]
})


export class TPMReportPage implements OnInit {

    loading: boolean = false;
    loadingTable: boolean = false;
    now = new Date();

    corps!: any[];
    manufacturers!: any[];
    factories!: any[];
    workplaces!: any[];
    locations!: any[];
    status!: any[];
    models!: any[];

    selectedCorp: string | null = null;
    selectedAs_nos: string | null = null;
    selectedManufacturer: string | null = null;
    selectedWorker: string | null = null;
    selectedMachine_nm: string | null = null;
    selectedFactory: string | null = null;
    selectedModel: string | null = null;
    selectedWorkplace: string | null = null;
    selectedBarcode: string | null = null;
    selectedLocation: string | null = null;
    selectedStatus: string | null = null;
    selectedStartDate: string | null = null;
    selectedEndDate: string | null = null;

    selectedRangeDates: string | null = null;


    cols!: Column[];
    exportColumns!: ExportColumn[];
    data!: any;
    initialValue!: any;
    rows = 50;
    first = 0;
    page: number = 1;
    totalRecords = 0;

    constructor(private sv: TPMReportService, public global_sv: GlobalsService) {
        this.optionLanguage = this.global_sv.getLangue();
    }
    valLanguage: any;
    optionLanguage: LanguageType = "LANG_EN";
    ngOnInit(): void {
        this.valLanguage = this.global_sv.getValLanguage();

        if (this.valLanguage === null) {
            this.global_sv._valLanguage$.subscribe((data) => {
                this.valLanguage = data;
                if (this.valLanguage !== null) {
                    this.reloadPage();
                }
            });
        }else {
            this.reloadPage();
        }
    }

    reloadPage() {
        this.loadData();

        this.cols = [
            { field: 'mt_cd', header: this.valLanguage.grid_Machine_Code[this.optionLanguage] },
            { field: 'mt_nm', header: this.valLanguage.grid_Machine_Name[this.optionLanguage] },
            { field: 'from_lct_nm', header: this.valLanguage.grid_Equipment_Name[this.optionLanguage] },
            { field: 'srl_no', header: this.valLanguage.grid_Serial_No[this.optionLanguage] },
            { field: 'sts_nm', header: this.valLanguage.grid_State_Name[this.optionLanguage] },
            { field: 'lct_nm', header: this.valLanguage.grid_Location_Name[this.optionLanguage] },
            { field: 'lct_sts_nm', header: this.valLanguage.grid_Location_State_Name[this.optionLanguage] },
            { field: 'mgm_dept_nm', header: 'Mgm Depart' },
            { field: 'cost_dept_nm', header: 'cost_dept_nm' },
            { field: 'mf_nm', header: this.valLanguage.grid_Manufacturer[this.optionLanguage] },
            { field: 'md_cd', header: this.valLanguage.grid_Model_Code[this.optionLanguage] },
            { field: 'sp_nm', header: this.valLanguage.grid_Supplier[this.optionLanguage] },
            { field: 'print_yn', header: this.valLanguage.grid_PrintYN[this.optionLanguage] },
            { field: 'puchs_dt_ymd', header: this.valLanguage.grid_Purchased_Date[this.optionLanguage] },
            { field: 'reason_nm', header: this.valLanguage.grid_Remark[this.optionLanguage] },
            { field: 'use_yn', header: this.valLanguage.grid_UseYN[this.optionLanguage] },
            { field: 'barcode', header: this.valLanguage.grid_Barcode[this.optionLanguage] },
            { field: 'reg_nm', header: this.valLanguage.grid_Reg_Name[this.optionLanguage] },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Reg_Date[this.optionLanguage] },
            { field: 'chg_nm', header: this.valLanguage.grid_Change_Name[this.optionLanguage] },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Change_Date[this.optionLanguage] },
        ];
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    filterTable() {
        const param = {
        }

        this.loadingTable = true;
        this.sv.getFullData().subscribe({
            next: (data: any) => {
                this.totalRecords = data.records;
                this.loadingTable = false
                this.data = data.rows;

                this.data.forEach((ele: any) => {
                    let ele_r: any = ele;
                    if (ele_r.puchs_dt_ymd !== null || ele_r.puchs_dt_ymd === undefined) {
                        ele_r.puchs_dt_ymd = new Date(<Date>ele.puchs_dt_ymd);
                    }
                    if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                        ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                    }
                    if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                        ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                    }
                    return ele;
                })
                this.initialValue = this.data;
            }
        });
    }

    exportToExcel() {
        let data: any[] = [];
        if (this.dt1.filteredValue && Array.isArray(this.dt1.filteredValue)) {
            this.dt1.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    'Machine Code': emp.mt_cd,
                    'Machine Name': emp.mt_nm,
                    'Equipment Name': emp.from_lct_nm,
                    'Serial No': emp.srl_no,
                    'State Name': emp.sts_nm,
                    'Location Name': emp.lct_nm,
                    'Location State Name': emp.lct_sts_nm,
                    'Mgm Depart': emp.mgm_dept_nm,
                    'cost_dept_nm': emp.cost_dept_nm,
                    'Manufacturer Name': emp.mf_nm,
                    'Model Name': emp.md_cd,
                    'Supplier Name': emp.sp_nm,
                    'Print YN': emp.print_yn,
                    'Puchs Date': emp.puchs_dt_ymd,
                    'Re Mark': emp.reason_nm,
                    'Use Y/N': emp.use_yn,
                    'barcode': emp.barcode,
                    'Reg Name': emp.reg_nm,
                    'Reg Date': emp.reg_dt_ymd,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd,
                };
                data.push(rowData);
            });
        } else {
            this.data.forEach((emp: any) => {
                const rowData: any = {
                    'Machine Code': emp.mt_cd,
                    'Machine Name': emp.mt_nm,
                    'Equipment Name': emp.from_lct_nm,
                    'Serial No': emp.srl_no,
                    'State Name': emp.sts_nm,
                    'Location Name': emp.lct_nm,
                    'Location State Name': emp.lct_sts_nm,
                    'Mgm Depart': emp.mgm_dept_nm,
                    'cost_dept_nm': emp.cost_dept_nm,
                    'Manufacturer Name': emp.mf_nm,
                    'Model Name': emp.md_cd,
                    'Supplier Name': emp.sp_nm,
                    'Print YN': emp.print_yn,
                    'Puchs Date': emp.puchs_dt_ymd,
                    'Re Mark': emp.reason_nm,
                    'Use Y/N': emp.use_yn,
                    'barcode': emp.barcode,
                    'Reg Name': emp.reg_nm,
                    'Reg Date': emp.reg_dt_ymd,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd,
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'TPM Report','data');
        }
    }

    private loadData(): void {
        this.loading = true;
        this.loadingTable = true;


        forkJoin({
            selectLctHistReport: this.sv.getFullData(),
            corps: this.global_sv.getCorp(),
            fModelList: this.global_sv.getFModelList(),
            manufacturers: this.global_sv.getManufac(),
            factories: this.global_sv.getLctFactory(),
            status: this.global_sv.getStatus(),
        }).subscribe({
            next: (data: any) => {
                this.data = data.selectLctHistReport.rows;

                this.data.forEach((ele: any) => {
                    let ele_r: any = ele;
                    if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                        ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                    }
                    if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                        ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                    }
                    if (ele_r.puchs_dt_ymd !== null || ele_r.puchs_dt_ymd === undefined) {
                        ele_r.puchs_dt_ymd = new Date(<Date>ele.puchs_dt_ymd);
                    }
                    return ele;
                })
                this.initialValue = this.data;

                this.page = data.selectLctHistReport.page;

                this.totalRecords = data.selectLctHistReport.records;

                this.loading = false;
                this.loadingTable = false;

                this.corps = data.corps.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                this.models = data.fModelList.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                this.manufacturers = data.manufacturers.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                this.factories = data.factories.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                this.status = data.status.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                this.workplaces = this.locations = [];
            },
            error: (error) => {
                console.error('Error loading data:', error);
                this.loading = false;
                this.loadingTable = false;
            }
        });
    }

    @ViewChild('dt1') dt1!: Table;
    isSorted: boolean | null = null;

    onSearch() {
        this.filterTable();
    }

    onClearTableFilter() {
        this.reg_date_input = '';
    }

    onClearSearch() {
        this.selectedCorp = null;
        this.selectedAs_nos = null;
        this.selectedManufacturer = null;
        this.selectedWorker = null;
        this.selectedMachine_nm = null;
        this.selectedFactory = null;
        this.selectedModel = null;
        this.selectedWorkplace = null;
        this.selectedBarcode = null;
        this.selectedLocation = null;
        this.selectedStatus = null;
        this.selectedStartDate = null;
        this.selectedEndDate = null;
        this.selectedRangeDates = null;
        this.selectedStartDate = null;
        this.selectedEndDate = null;
        this.selectedRangeDates = null;
    }

    onClearTable(table: Table) {
        table.clear();
        this.onClearTableFilter();
        this.page = 1;
        // this.filterTable();
    }

    onClearAllSearch() {
        this.onClearSearch()
        this.onClearTableFilter();
        this.onClearTable(this.dt1)
        this.filterTable();
    }

    handleApplySearch() {
        this.filterTable();
    }

    customSort(event: SortEvent) {
        if (this.isSorted == null || this.isSorted === undefined) {
            this.isSorted = true;
            this.global_sv.sortTableData(event);
        } else if (this.isSorted == true) {
            this.isSorted = false;
            this.global_sv.sortTableData(event);
        } else if (this.isSorted == false) {
            this.isSorted = null;
            this.data = [...this.initialValue];
            this.dt1.reset();
        }
    }

    selectedRow: number | undefined = undefined;

    isVisible: boolean = false;

    onRowClick(i: number): void {
        this.selectedRow = i;
    }

    showFilter() {
        if (this.isVisible === true) {
            this.isVisible = false;
        } else {
            this.isVisible = true;
        }
    }

    setup(value: any, id: any) {
        if (value != null) {
            const filter = this.dt1.filters[id];
            if (Array.isArray(filter)) {
                filter[0].value = value;
            } else if (filter) {
                filter.value = value;
            }
        }
        this.reg_date_input = value;
    }

    reg_date_input: string = ''; // Default to today's date in YYYY-MM-DD format

    onClearFilterDate() {
        this.selectedStartDate = this.selectedEndDate = '';
    }

    onCloseFilterDate() {
        if (this.selectedRangeDates != undefined && this.selectedRangeDates != null) {
            const data: string[] = (this.selectedRangeDates + '').split(",");

            const start = this.global_sv.formatDateFilter(new Date(data[0]));
            const end = this.global_sv.formatDateFilter(new Date(data[1]));

            this.selectedStartDate = start;
            this.selectedEndDate = end;
        }
    }
}
