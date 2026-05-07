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
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { forkJoin } from 'rxjs';

import { SortEvent } from 'primeng/api';
import { LanguageType } from '../../../../constants/constants.auth';
import { GlobalsService } from '../../../../globals.service';
import { EquipmentUNSAPReportService } from './equipment_unsap_report.service';
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
                <h2 class="text-2xl sm:text-3xl mr-auto">{{this.valLanguage.EquipmentUNSAPReport[this.optionLanguage]}}</h2>
                <div class="flex gap-2 *:w-[120px] *:*:w-full ml-auto">
                    <p-button [outlined]="true" icon="pi pi-search" class="!w-32 *:!w-32" [label]="this.valLanguage.btn_Search[this.optionLanguage]" (click)="onSearch()" severity="info" />
                    <p-button [outlined]="true" icon="pi pi-filter-slash" class="!w-32 *:!w-32" [label]="this.valLanguage.btn_Clear[this.optionLanguage]" (click)="onClearSearch()" severity="secondary" />
                </div>
            </div>
            <div class="grid *:max-w-sm *:w-full *:mx-auto grid-cols-1 md:grid-cols-2 xl:grid-cols-4 rounded gap-5 *:mt-2 box p-5 header-border-filter">
                <p-floatlabel>
                    <p-select inputId="corp_label" class="w-full" [loading]="loading" [(ngModel)]="selectedCorp" [options]="corps" [showClear]="true">
                        <ng-template let-option #item>
                            <p-tag [value]="option.label" class="w-full !py-2" [severity]="global_sv.getCorpColor(option.label)" />
                        </ng-template>
                    </p-select>
                    <label for="corp_label">{{this.valLanguage.grid_Corp[this.optionLanguage]}}</label>
                </p-floatlabel>
                <p-floatlabel>
                    <p-select inputId="parent_label" [options]="parents" [(ngModel)]="selectedParent" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                        <ng-template let-option #item>
                            <div class="flex items-center gap-2 w-full">
                                <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                            </div>
                        </ng-template>
                    </p-select>
                    <label for="parent_label">{{this.valLanguage.grid_Parent[this.optionLanguage]}}</label>
                </p-floatlabel>
                <p-floatlabel>
                    <p-select inputId="storage_label" [options]="provideDepts" [(ngModel)]="selectedStorage" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                        <ng-template let-option #item>
                            <div class="flex items-center gap-2 w-full">
                                <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                            </div>
                        </ng-template>
                    </p-select>
                    <label for="storage_label">{{this.valLanguage.grid_Storage[this.optionLanguage]}}</label>
                </p-floatlabel>
                <p-floatlabel>
                    <p-select inputId="language_label" id="include_tags" class="w-full" [(ngModel)]="gubun" [options]="languages">
                        <ng-template let-option #item>
                            <div class="flex items-center gap-2 w-full">
                                <p-tag [value]="option.label" class="w-full !py-2" severity="success" />
                            </div>
                        </ng-template>
                    </p-select>
                    <label for="language_label">{{this.valLanguage.grid_Language[this.optionLanguage]}}</label>
                </p-floatlabel>
                <p-floatlabel>
                    <p-select inputId="model_label" [options]="fModelList" [(ngModel)]="selectedMdCode" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                        <ng-template let-option #item>
                            <div class="flex items-center gap-2 w-full">
                                <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                            </div>
                        </ng-template>
                    </p-select>
                    <label for="model_label">{{this.valLanguage.grid_Model[this.optionLanguage]}}</label>
                </p-floatlabel>

            </div>

        </div>
        <section class="card-2 p-[5px] md:p-[20px] flex-1]">
            <p-table #dt1 [scrollable]="true" scrollHeight="600px" virtualScrollItemSize="600" [loading]="loadingTable" [columns]="cols"
                [value]="data" [paginator]="true" [rows]="50" [showCurrentPageReport]="true" exportFilename="Equipment UNSAP Report" [exportHeader]="'customExportHeader'"
                [tableStyle]="{ 'min-width': '50rem' }" (sortFunction)="customSort($event)" [customSort]="true" [totalRecords]="totalRecords"
                [showCurrentPageReport]="true" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" [first]="first"
                [rowsPerPageOptions]="[50, 100, 200, 500 ,1000]">
                <ng-template #caption>
                    <div class="flex justify-between *:text-nowrap overflow-x-auto gap-x-4 py-2">
                        <div class="flex gap-4">
                            <p-button class="" [label]="this.valLanguage.btn_ClearFilter[this.optionLanguage]" [outlined]="true" icon="pi pi-filter-slash" (click)="onClearTable(dt1)" />
                            <p-button [outlined]="true" [icon]="isVisible ? 'pi pi-unlock' : 'pi pi-lock-open'" class="text-nowrap" [label]="this.valLanguage.btn_ShowFilter[optionLanguage]" (click)="showFilter()"></p-button>
                            <p-button [outlined]="true" icon="pi pi-file-excel" [label]="this.valLanguage.btn_Export[this.optionLanguage]" (click)="exportToExcel()"/>
                        </div>
                        <p-button [outlined]="true" icon="pi pi-filter-slash" class="text-nowrap" label="Clear All" (click)="onClearAllSearch()" severity="warn" />
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
                            <th class="flex justify-center items-center">
                                <p-columnFilter field="corp_nm" matchMode="equals" [showMenu]="false" [showClearButton]="false">
                                    <ng-template #filter let-value let-filter="filterCallback">
                                        <p-select [(ngModel)]="corpTableFilterValue" [options]="corps" (onChange)="filter(corpTableFilterValue)" optionValue="label" filterBy="label" placeholder="Select One" [showClear]="true">
                                            <ng-template let-option #item>
                                                <p-tag [value]="option.label" [severity]="global_sv.getCorpColor(option.label)" class="w-full !py-2" />
                                            </ng-template>
                                        </p-select>
                                    </ng-template>
                                </p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="as_no" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="prt_cd" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="mt_cd" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="mt_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="factory_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="to_lct_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="md_cd" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="cost_dept_cd" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="cost_dept_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="unit" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="numeric" field="quantity" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
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
                        <td aria-describedby="list_corp_nm"><p-tag [value]="item.corp_nm" class="w-full !py-2" [severity]="global_sv.getCorpColor(item.corp_nm)" /></td>
                        <td aria-describedby="list_as_no">{{ item.as_no }}</td>
                        <td aria-describedby="list_prt_nm">{{ item.prt_nm }}</td>
                        <td aria-describedby="list_mt_cd">{{ item.mt_cd }}</td>
                        <td aria-describedby="list_mt_nm">{{ item.mt_nm }}</td>
                        <td aria-describedby="list_factory_nm" class="text-nowrap">{{ item.factory_nm }}</td>
                        <td aria-describedby="list_to_lct_nm" class="text-nowrap">{{ item.to_lct_nm }}</td>
                        <td aria-describedby="list_md_cd" class="text-nowrap">{{ item.md_cd }}</td>
                        <td aria-describedby="list_cost_dept_cd" class="text-nowrap">{{ item.cost_dept_cd }}</td>
                        <td aria-describedby="list_cost_dept_nm" class="text-nowrap">{{ item.cost_dept_nm }}</td>
                        <td aria-describedby="list_unit" class="text-nowrap">{{ item.unit }}</td>
                        <td aria-describedby="list_quantity" class="text-nowrap">{{ item.quantity }}</td>
                        <td aria-describedby="list_puchs_dt_ymd" class="text-nowrap">{{ item.puchs_dt_ymd | date: 'yyyy/MM/dd HH:mm:ss'}}</td>
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


export class EquipmentUNSAPReportPage implements OnInit {

    loading: boolean = false;
    loadingTable: boolean = false;
    now = new Date();

    corps!: any[];
    provideDepts!: any[];
    parents!: any[];
    fModelList!: any[];

    gubun: string = 'korean';
    selectedCorp: string | null = null;
    selectedState: string | null = null;
    selectedStorage: string | null = null;
    selectedParent: string | null = null;
    selectedProvideDept: string | null = null;
    selectedMdCode: string | null = null;


    corpTableFilterValue: string | null = null;
    provideDeptTableFilterValue: string | null = null;
    storageTableFilterValue: string | null = null;
    parentTableFilterValue: string | null = null;
    mdCodeTableFilterValue: string | null = null;


    @ViewChild('ms') ms!: MultiSelect;
    listMtl!: any;
    languages!: any[];

    cols!: Column[];
    exportColumns!: ExportColumn[];
    data!: any;
    initialValue!: any;
    rows = 50;
    first = 0;
    page: number = 1;
    totalRecords = 0;


    constructor(private sv: EquipmentUNSAPReportService, public global_sv: GlobalsService) {
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
        } else {
            this.reloadPage();
        }
    }

    reloadPage() {
        this.loadData();
        this.languages = [
            {
                label: 'English',
                value: 'english'
            },
            {
                label: 'Korean',
                value: 'korean'
            },
            {
                label: 'Vietnam',
                value: 'vietnam'
            }
        ]
        this.cols = [
            { field: 'corp_nm', header: this.valLanguage.grid_Corp[this.optionLanguage] },
            { field: 'as_no', header: this.valLanguage.grid_Asset_No[this.optionLanguage] },
            { field: 'prt_nm', header: this.valLanguage.grid_Parent[this.optionLanguage] },
            { field: 'mt_cd', header: this.valLanguage.grid_Material_Code[this.optionLanguage] },
            { field: 'mt_nm', header: this.valLanguage.grid_Material_Des[this.optionLanguage] },
            { field: 'factory_nm', header: this.valLanguage.grid_Storage_Loca[this.optionLanguage] },
            { field: 'to_lct_nm', header: 'Des. of Storage Loca' },
            { field: 'md_cd', header: this.valLanguage.grid_Model_Code[this.optionLanguage] },
            { field: 'cost_dept_cd', header: this.valLanguage.grid_Reason[this.optionLanguage] },
            { field: 'cost_dept_nm', header: this.valLanguage.grid_Cost_Center_Name[this.optionLanguage] },
            { field: 'unit', header: this.valLanguage.grid_Unit[this.optionLanguage] },
            { field: 'quantity', header: this.valLanguage.grid_Quantity[this.optionLanguage] },
            { field: 'puchs_dt_ymd', header: this.valLanguage.grid_Buying_Date[this.optionLanguage] },
        ];
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    filterTable() {
        const param = {
            end_reg_dt: this.global_sv.formatDateFilter(new Date()),
            corp: this.selectedCorp == null ? '' : this.selectedCorp,
            md_cd: this.selectedMdCode == null ? '' : this.selectedMdCode,
            prt_cd: this.selectedParent == null ? '' : this.selectedParent,
            factory: this.selectedStorage == null ? '' : this.selectedStorage,
            gubun: this.gubun == null ? '' : this.gubun,
        }
        this.loadingTable = true;
        this.sv.getFilteredData(param).subscribe({
            next: (data: any) => {
                this.totalRecords = data.records;
                this.loadingTable = false
                this.data = data.rows;

                this.data.forEach((ele: any) => {
                    let ele_r: any = ele;
                    if (ele_r.puchs_dt_ymd !== null || ele_r.puchs_dt_ymd === undefined) {
                        ele_r.puchs_dt_ymd = new Date(<Date>ele.puchs_dt_ymd);
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
                    'Corp': emp.corp_nm,
                    'Asset No': emp.as_no,
                    'Parent': emp.prt_nm,
                    'Material code': emp.mt_cd,
                    'Material description': emp.mt_nm,
                    'Storage Loca ': emp.factory_nm,
                    'Des. of Storage Loca': emp.to_lct_nm,
                    'Model': emp.md_cd,
                    'Reason': emp.cost_dept_cd,
                    'Cost Center Name': emp.cost_dept_nm,
                    'Unit': emp.unit,
                    'Quantity': emp.quantity,
                    'Buying Date': emp.puchs_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.puchs_dt_ymd) : emp.puchs_dt_ymd,
                };
                data.push(rowData);
            });
        } else {
            this.data.forEach((emp: any) => {
                const rowData: any = {
                    'Corp': emp.corp_nm,
                    'Asset No': emp.as_no,
                    'Parent': emp.prt_nm,
                    'Material code': emp.mt_cd,
                    'Material description': emp.mt_nm,
                    'Storage Loca ': emp.factory_nm,
                    'Des. of Storage Loca': emp.to_lct_nm,
                    'Model': emp.md_cd,
                    'Reason': emp.cost_dept_cd,
                    'Cost Center Name': emp.cost_dept_nm,
                    'Unit': emp.unit,
                    'Quantity': emp.quantity,
                    'Buying Date': emp.puchs_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.puchs_dt_ymd) : emp.puchs_dt_ymd,
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'Equipment UNSAP Report', 'data');
        }
    }

    private loadData(): void {
        this.loading = true;
        this.loadingTable = true;

        forkJoin({
            selectLctHistReport: this.sv.getSelectLctHistReport(this.global_sv.formatDateFilter(new Date())),
            lct001List_2: this.global_sv.getProvideDept(),
            parentList: this.global_sv.getParent(),
            corps: this.global_sv.getCorp(),
            fModelList: this.global_sv.getFModelList(),
            mtCdList: this.global_sv.getMtCdList(),
        }).subscribe({
            next: (data: any) => {
                // this.data = data.selectLctHistReport.rows;

                // this.data.forEach((ele: any) => {
                //     let ele_r: any = ele;
                //     if (ele_r.puchs_dt_ymd !== null || ele_r.puchs_dt_ymd === undefined) {
                //         ele_r.puchs_dt_ymd = new Date(<Date>ele.puchs_dt_ymd);
                //     }
                //     return ele;
                // })
                this.initialValue = this.data = data.selectLctHistReport.rows;

                this.page = data.selectLctHistReport.page;

                this.totalRecords = data.selectLctHistReport.records;

                this.loading = false;
                this.loadingTable = false;

                this.corps = data.corps.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                this.provideDepts = data.lct001List_2.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                this.fModelList = data.fModelList.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                // this.listMtl = data.mtCdList.filter((item: any) => item.comm_cd !== '' && !item.comm_cd.toLowerCase().includes('test')).map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                this.listMtl = data.mtCdList.filter((item: any) => item.comm_cd !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                this.parents = data.parentList.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
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
        this.corpTableFilterValue = null;
        this.provideDeptTableFilterValue = null;
        this.storageTableFilterValue = null;
        this.parentTableFilterValue = null;
        this.mdCodeTableFilterValue = null;
        this.reg_date_input = '';
    }

    onClearSearch() {
        this.selectedCorp = null;
        this.selectedProvideDept = null;
        this.selectedStorage = null;
        this.selectedParent = null;
        this.selectedMdCode = null;
        this.selectedState = null;
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
}
