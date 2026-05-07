import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { MessageService, SelectItem, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Toast, ToastModule } from 'primeng/toast';

import { LanguageType } from '../../../constants/constants.auth';
import { GlobalsService } from '../../../globals.service';
import { ReportService } from './report.service';

interface City {
    name: string;
    code: string;
}
interface ExportColumn {
    title: string;
    dataKey: string;
}
interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

@Component({
    selector: 'app-equipment-status-report',
    imports: [FormsModule, FloatLabelModule, InputIconModule, IconFieldModule, InputTextModule, SelectModule, TableModule, CommonModule, ToastModule, Toast, ProgressSpinnerModule, ButtonModule, TagModule],
    providers: [ReportService, MessageService],
    standalone: true,
    template: ` <section>
        <div class="header-title">
            <div class="flex flex-col sm:flex-row justify-between items-center mb-3 xl:mb-0">
                <h2 class="text-2xl sm:text-3xl mr-auto">{{this.valLanguage.EquipmentStatusReport[this.optionLanguage]}}</h2>
                <div class="flex gap-2 *:w-[120px] *:*:w-full ml-auto">
                    <p-button severity="info" variant="outlined" icon="pi pi-search" [label]="this.valLanguage.btn_Search[this.optionLanguage]" (click)="filterChooseSearch()" />
                    <p-button [label]="this.valLanguage.btn_Refresh[optionLanguage]" severity="secondary" icon="pi pi-refresh" (click)="ngOnInit()" />
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 rounded gap-5 *:mt-2 box p-5 header-border-filter">
                <p-floatlabel>
                    <p-select class="w-full" [(ngModel)]="corpFilterValue" (onChange)="handleChangeCorp($event)" [options]="corpFac" [showClear]="true">
                        <ng-template let-option #item>
                            <p-tag [value]="option.label" class="w-full !py-2" [severity]="getCorp(option.label)" />
                        </ng-template>
                    </p-select>
                    <label for="corp">{{this.valLanguage.grid_Corp[this.optionLanguage]}}</label>
                </p-floatlabel>
                <p-floatlabel>
                    <p-select [filter]="true" filterBy="label" class="w-full" [(ngModel)]="storageFilterValue" [options]="storage" [showClear]="true">
                        <ng-template let-option #item>
                            <p-tag [value]="option.label" severity="secondary" class="w-full !py-2" />
                        </ng-template>
                    </p-select>
                    <label for="storage">{{this.valLanguage.grid_Storage[this.optionLanguage]}}</label>
                </p-floatlabel>
                <p-floatlabel>
                    <input class="w-full" pInputText [(ngModel)]="modelFilterValue" />
                    <label for="model_filter">{{this.valLanguage.grid_Model[this.optionLanguage]}}</label>
                </p-floatlabel>
                <p-floatlabel>
                    <p-select [filter]="true" filterBy="label" class="w-full" [(ngModel)]="parentFilterValue" [options]="parent" [showClear]="true">
                        <ng-template let-option #item>
                            <p-tag [value]="option.label" severity="secondary" class="w-full !py-2" />
                        </ng-template>
                    </p-select>
                    <label for="parent_filter">{{this.valLanguage.grid_Parent[this.optionLanguage]}}</label>
                </p-floatlabel>
                <!-- <div class="ml-8"></div>
            <div class="ml-8 btn_search_choose">
                <p-button severity="info" variant="outlined" icon="pi pi-search" [label]="this.valLanguage.btn_Search[this.optionLanguage]" (click)="filterChooseSearch()" />
            </div> -->
            </div>
        </div>

        <p-toast />
        <div class="card">
            <p-table
                class="rounded"
                #dtreport
                (sortFunction)="customSort($event)"
                [customSort]="true"
                [columns]="cols"
                [exportHeader]="'customExportHeader'"
                exportFilename="Equipment Status Report"
                [value]="dataTable"
                dataKey="id"
                [rows]="10"
                [rowsPerPageOptions]="[10, 25, 50]"
                [loading]="loading"
                [paginator]="true"
                showGridlines
                [globalFilterFields]="['lct_nm', 'sts_00', 'sts_01', 'sts_02', 'sts_03', 'sts_05', 'sts_06']"
                [tableStyle]="{ 'min-width': '75rem' }"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                (onFilter)="onFilter($event)"
                (sortFunction)="customSort($event)" [customSort]="true"
            >
                <ng-template #caption>
                    <div class="flex flex-col xl:flex-row gap-3">
                        <div class="flex flex-nowarp overflow-auto *:*:text-nowrap pb-2 sm:pb-0 gap-x-2 md:gap-x-3">
                            <!--  dtreport.exportCSV -->
                            <p-button class="col-start-1 col-span-2 xl:col-start-1 xl:col-span-1" [label]="this.valLanguage.btn_ClearFilter[this.optionLanguage]" [outlined]="true" icon="pi pi-filter-slash" (click)="clear(dtreport)" />
                            <p-button icon="pi pi-external-link" [label]="this.valLanguage.btn_Export[this.optionLanguage]" [outlined]="true" (onClick)="exportToExcel()" />
                        </div>
                        <p-iconfield iconPosition="left" class="flex-1">
                            <p-inputicon>
                                <i class="pi pi-search"></i>
                            </p-inputicon>
                            <input pInputText type="text" class="w-full" (input)="onGlobalFilter($event, dtreport)" placeholder="{{this.valLanguage.Search_keyword[this.optionLanguage]}}" />
                        </p-iconfield>
                    </div>
                </ng-template>
                <ng-template #header let-columns>
                    <tr>
                        <th [pSortableColumn]="col.field" *ngFor="let col of columns">
                        <div class="header-content">
                            {{ col.header }}
                            <p-sortIcon [field]="col.field" />
                        </div>
                    </th>

                    </tr>
                    <tr>
                        <th style="width:20%">
                            <p-columnFilter type="text" field="lct_nm" placeholder="Search by Factory" ariaLabel="Filter Factory"></p-columnFilter>
                        </th>
                        <th style="width:15%">
                            <p-columnFilter type="text" field="sts_00" placeholder="Search by TOTAL" ariaLabel="Filter TOTAL"></p-columnFilter>
                        </th>
                        <th style="width:15%">
                            <p-columnFilter type="text" field="sts_01" placeholder="Search by Use" ariaLabel="Filter Use"></p-columnFilter>
                        </th>
                        <th style="width:10%"></th>
                        <th style="width:10%"></th>
                        <th style="width:10%"></th>
                        <th style="width:10%"></th>
                    </tr>
                </ng-template>
                <ng-template #body let-table let-rowIndex="rowIndex">
                    <tr [ngClass]="{
                            'total-row': rowIndex === 0 && table.lct_nm === 'TOTAL',
                            'selected-row': selectedRow === rowIndex,
                            'clickable-row': true,
                            'selected-total-row': rowIndex === 0 && selectedRow === rowIndex,
                        }" (click)="onRowClick(rowIndex)">
                        <td [class]="rowIndex === 0 && table.lct_nm === 'TOTAL' ? 'total-cell' : ''" style="width:20%">
                            {{ table.lct_nm }}
                        </td>
                        <td [class]="rowIndex === 0 && table.lct_nm === 'TOTAL' ? 'total-cell' : ''" style="width:15%">
                            {{ numberWithCommas(table.sts_00) }}
                        </td>
                        <td [class]="rowIndex === 0 && table.lct_nm === 'TOTAL' ? 'total-cell' : ''" style="width:15%">
                            {{ numberWithCommas(table.sts_01) }}
                        </td>
                        <td [class]="rowIndex === 0 && table.lct_nm === 'TOTAL' ? 'total-cell' : ''" style="width:10%">
                            {{ numberWithCommas(table.sts_02) }}
                        </td>
                        <td [class]="rowIndex === 0 && table.lct_nm === 'TOTAL' ? 'total-cell' : ''" style="width:10%">
                            {{ numberWithCommas(table.sts_03) }}
                        </td>
                        <td [class]="rowIndex === 0 && table.lct_nm === 'TOTAL' ? 'total-cell' : ''" style="width:10%">
                            {{ numberWithCommas(table.sts_05) }}
                        </td>
                        <td [class]="rowIndex === 0 && table.lct_nm === 'TOTAL' ? 'total-cell' : ''" style="width:10%">
                            {{ numberWithCommas(table.sts_06) }}
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="5">No customers found.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    </section>`,
    styles: `
        ::ng-deep {
            .search-tb {
                display: flex !important;
            }
            tr > td,
            tr > th {
                text-align: center !important;
                &:nth-child(-n + 1) {
                    text-align: left !important;
                }
            }
        }
    `
})
export class EquipmentStatusReport implements OnInit {
    loading: boolean = true;
    dataTable: any[] = [];
    // variables for filter
    corpFac!: SelectItem[];
    corpFilterValue: string | null = null;
    corpTableFac!: SelectItem[];
    corpTableFilterValue: string | null = null;
    parent!: SelectItem[];
    parentFilterValue: string | null = null;
    parentTable!: SelectItem[];
    parentTableFilterValue: string | null = null;
    storage!: SelectItem[];
    storageFilterValue: string | null = null;
    storageTable!: SelectItem[];
    storageTableFilterValue: string | null = null;
    modelFilterValue!: string;

    cols!: Column[];
    exportColumns!: ExportColumn[];
    param: any = {
        corp: '',
        model: '',
        parent: '',
        storage: ''
    };
    isSorted: boolean | null = null;
    initialValue: any[] = [];
    // export
    @Input() filteredValue: any[] = [];
    @ViewChild('dtreport') table!: Table;

    constructor(
        private sv: ReportService,
        private messageService: MessageService,
        private global_sv: GlobalsService
    ) { this.optionLanguage = this.global_sv.getLangue();
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
        this.loadListFilter();
        this.filterChooseSearch();

        this.cols = [
            { field: 'lct_nm', header: this.valLanguage.grid_Factory[this.optionLanguage], customExportHeader: this.valLanguage.grid_Factory[this.optionLanguage] },
            { field: 'sts_00', header: this.valLanguage.grid_TOTAL[this.optionLanguage] },
            { field: 'sts_01', header: this.valLanguage.grid_Use[this.optionLanguage] },
            { field: 'sts_02', header: this.valLanguage.grid_Stock[this.optionLanguage] },
            { field: 'sts_03', header: this.valLanguage.grid_Broken[this.optionLanguage] },
            { field: 'sts_05', header: this.valLanguage.grid_Useless[this.optionLanguage] },
            { field: 'sts_06', header: this.valLanguage.grid_Rental[this.optionLanguage] }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }
    selectedRow: number | undefined = undefined;
    onRowClick(i: number): void {
        this.selectedRow = i;
    }

    onGlobalFilter(event: Event, table: Table) {
        const input = event.target as HTMLInputElement;
        table.filterGlobal(input.value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.dataTable = [...this.initialValue];
        this.parentFilterValue = null;
        this.corpFilterValue = null;
        this.modelFilterValue = '';
        this.storageFilterValue = null;
    }

    onFilter(event: any) {
        this.filteredValue = event.filteredValue;
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
                this.dataTable = [...this.initialValue];
                this.table.reset();
            }
        }

    exportToExcel() {
        let data: any[] = [];
        if (this.table.filteredValue && Array.isArray(this.table.filteredValue)) {
            this.table.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    Factory: emp.lct_nm,
                    TOTAL: emp.sts_00,
                    Use: emp.sts_01,
                    Stock: emp.sts_02,
                    Broken: emp.sts_03,
                    Useless: emp.sts_05,
                    Rental: emp.sts_06
                };
                data.push(rowData);
            });
        } else {
            this.dataTable.forEach((emp: any) => {
                const rowData: any = {
                    Factory: emp.lct_nm,
                    TOTAL: emp.sts_00,
                    Use: emp.sts_01,
                    Stock: emp.sts_02,
                    Broken: emp.sts_03,
                    Useless: emp.sts_05,
                    Rental: emp.sts_06
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'Equipment Status Report', 'data');
        }
    }

    numberWithCommas(x: number): string {
        if (x === undefined || x === null) {
            return '';
        }
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    }

    handleChangeCorp(event: any): void {
        this.global_sv.getStorage(event.value).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.storage = response.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    // console.log('Equipment start page:', this.storage);
                }
            },
            (error) => {
                console.error('Error handleChangeCorp:', error);
            }
        );
    }

    loadListFilter(): void {
        forkJoin({
            parent: this.global_sv.getParent(),
            corp: this.global_sv.getCorp(),
            storage: this.global_sv.getStorage('')
        }).subscribe(
            (responses) => {
                if (responses.parent !== null && responses.parent !== undefined) {
                    this.parent = responses.parent
                        .filter((item: any) => item.comm_nm !== '')
                        .map((item: any) => ({
                            label: item.comm_nm,
                            value: item.comm_cd
                        }));
                    this.parentTable = responses.parent
                        .filter((item: any) => item.comm_nm !== '')
                        .map((item: any) => ({
                            label: item.comm_nm,
                            value: item.comm_nm
                        }));
                }
                if (responses.corp !== null && responses.corp !== undefined) {
                    this.corpFac = responses.corp.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    this.corpTableFac = responses.corp.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_nm }));
                }
                if (responses.storage !== null && responses.storage !== undefined) {
                    this.storage = responses.storage.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    this.storageTable = responses.storage.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_nm }));
                }
            },
            (error) => {
                console.error('Error loading filter lists:', error);
            }
        );
    }

    getCorp(status: string) {
        switch (status) {
            case 'HSV':
                return 'danger';

            case 'HWK':
                return 'success';

            case 'HVC':
                return 'info';

            case 'HSOne':
                return 'warn';
            default:
                return null;
        }
    }

    filterChooseSearch(): void {
        this.param = {
            corp: this.corpFilterValue !== null && this.corpFilterValue !== undefined ? this.corpFilterValue : '',
            model: this.modelFilterValue !== null && this.modelFilterValue !== undefined ? this.modelFilterValue : '',
            parent: this.parentFilterValue !== null && this.parentFilterValue !== undefined ? this.parentFilterValue : '',
            storage: this.storageFilterValue !== null && this.storageFilterValue !== undefined ? this.storageFilterValue : ''
        };
        // console.log('Filter parameters:', this.param);

        this.loadDataTableCustom(this.param);
    }

    loadDataTableCustom(param: any) {
        this.loading = true;
        this.sv.selectEquipmentReportSearch(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.dataTable = response.rows;
                    this.initialValue = [...response.rows];
                    // console.log('Filter parameters:', this.dataTable);
                    this.loading = false;
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
        // }
    }

}
