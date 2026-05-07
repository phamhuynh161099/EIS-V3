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
import { EquipmentPurchaseAndDisposalReportService } from './equipment_purchase_and_disposal_report.service';
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
    selector: 'app-equipment-purchase-and-disposal-report',
    template: `
        <section class="flex flex-col min-h-full w-full">
            <div class="header-title">
            <div class="flex flex-col sm:flex-row justify-between items-center mb-3 xl:mb-0">
                <h2 class="text-2xl sm:text-3xl mr-auto">{{this.valLanguage.EquipmentPurchaseandDisposal[this.optionLanguage]}}</h2>
                <div class="flex gap-2 *:w-[120px] *:*:w-full ml-auto">
                    <p-button [outlined]="true" icon="pi pi-search" class="!w-32 *:!w-32" [label]="this.valLanguage.btn_Search[this.optionLanguage]" (click)="onSearch()" severity="info" />
                    <p-button [outlined]="true" icon="pi pi-filter-slash" class="!w-32 *:!w-32" [label]="this.valLanguage.btn_Clear[this.optionLanguage]" (click)="onClearSearch()" severity="secondary" />
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 rounded gap-5 *:space-y-7 *:mt-2 box p-5 header-border-filter">
                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="parent_label" [options]="parents" (onChange)="onChangeParent()" [(ngModel)]="selectedParent" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="parent_label">{{this.valLanguage.grid_Parent[this.optionLanguage]}}</label>
                    </p-floatlabel>
                </div>

                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="type_label" [options]="types" (onChange)="onChangeType()" [(ngModel)]="selectedType" [loading]="loading" optionValue="value" filterBy="label" [filter]="true" [showClear]="true" [emptyMessage]="this.valLanguage.select_Parent_emptyMessage[this.optionLanguage]" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="type_label">{{this.valLanguage.grid_Type[this.optionLanguage]}}</label>
                    </p-floatlabel>
                </div>

                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="group_label" [options]="groups" [(ngModel)]="selectedGroup" [loading]="loading" optionValue="value" filterBy="label" [filter]="true" [showClear]="true" [emptyMessage]="this.valLanguage.select_Type_emptyMessage[this.optionLanguage]" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="group_label">{{this.valLanguage.grid_Group[this.optionLanguage]}}</label>
                    </p-floatlabel>
                </div>

                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-datepicker inputId="date_label" id="datepicker_style" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="selectedRangeYears" class="w-full date-left" (onClearClick)="onClearFilterDate()" view="year" dateFormat="yy" (onClose)="onCloseFilterDate()" showIcon iconDisplay="input" selectionMode="range" [showButtonBar]="true" [readonlyInput]="true" />
                        <label for="date_label">{{this.valLanguage.grid_Create_Date[this.optionLanguage]}}</label>
                    </p-floatlabel>
                </div>

                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
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

        </div>
        <section class="card-2 p-[5px] md:p-[20px] flex-1]">
            <p-table class="table_minheight" #dt1 [scrollable]="true" scrollHeight="600px" virtualScrollItemSize="600" [loading]="loadingTable" [columns]="cols"
                [value]="data" [paginator]="true" [rows]="50" [showCurrentPageReport]="true" exportFilename="Equipment Purchase And Disposal Report" [exportHeader]="'customExportHeader'"
                [tableStyle]="{ 'min-width': '50rem' }" (sortFunction)="customSort($event)" [customSort]="true" [totalRecords]="totalRecords"
                [showCurrentPageReport]="true" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" [first]="first"
                [rowsPerPageOptions]="[50, 100, 200, 500 ,1000]">
                <ng-template #caption>
                    <div class="flex justify-between *:text-nowrap overflow-x-auto gap-x-4 py-2">
                        <div class="flex gap-4">
                            <p-button [label]="this.valLanguage.btn_ClearFilter[this.optionLanguage]" [outlined]="true" icon="pi pi-filter-slash" (click)="onClearTable(dt1)" />
                            <p-button [outlined]="true" [icon]="isVisible ? 'pi pi-unlock' : 'pi pi-lock-open'" class="text-nowrap" [label]="this.valLanguage.btn_ShowFilter[optionLanguage]" (click)="showFilter()"></p-button>
                            <p-button [outlined]="true" icon="pi pi-file-excel" [label]="this.valLanguage.btn_Export[this.optionLanguage]" (click)="dt1.exportCSV()"/>
                        </div>
                        <p-button [outlined]="true" icon="pi pi-filter-slash" class="text-nowrap" label="{{this.valLanguage.btn_Clear_All[this.optionLanguage]}}" (click)="onClearAllSearch()" severity="warn" />
                    </div>
                </ng-template>
                <ng-template #header pTemplate="header">
                    <tr>
                        <th>
                        </th>
                        <th colspan="3">
                        </th>
                        <th *ngFor="let header of headerGroup" colspan="2" style="text-align: center">
                            {{header}}
                        </th>
                    </tr>
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
                                <p-columnFilter field="puchs_dt" matchMode="in" [showMenu]="false" [showClearButton]="false">
                                    <ng-template #filter let-value let-filter="filterCallback">

                                        <p-multiselect [options]="listYearFilter" variant="outlined" [showToggleAll]="true" [selectAll]="selectAllYearTable" [(ngModel)]="selectedYears" (onChange)="filter(selectedYears)" [loading]="loading" [virtualScroll]="true" [virtualScrollItemSize]="30" [filter]="true" class="multiselect-custom-virtual-scroll max-w-full min-w-56" placeholder="Select Multiple" (onSelectAllChange)="onSelectAllChangeTable($event)" [maxSelectedLabels]="2" styleClass="w-full" #ms>
                                            <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                                <i class="pi pi-check" *ngIf="allSelected"></i>
                                                <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                            </ng-template>
                                        </p-multiselect>

                                    </ng-template>
                                </p-columnFilter>
                            </th>

                            <th *ngFor="let header of filters">
                                <p-columnFilter type="numeric" [field]="header.field"  />
                            </th>
                        </tr>
                </ng-template>
                <ng-template #body let-item let-i="rowIndex" pTemplate="body">
                    <tr [ngClass]="{
                                        'total-row': item.puchs_dt === 'TOTAL',
                                        'selected-row': selectedRow === i,
                                        'selected-total-row': item.puchs_dt === 'TOTAL' && selectedRow === i,
                                    }"
                                        (click)="onRowClick(i)">
                        <td aria-describedby="list_rn" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ i + 1 }}</td>
                        <td aria-describedby="list_puchs_dt" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}" >{{ item.puchs_dt }}</td>
                        <td aria-describedby="list_puchs_lct_cd0" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.puchs_lct_cd0 }}</td>
                        <td aria-describedby="list_disps_lct_cd0" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.disps_lct_cd0 }}</td>
                        <td aria-describedby="list_puchs_lct_cd1" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.puchs_lct_cd1 }}</td>
                        <td aria-describedby="list_disps_lct_cd1" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.disps_lct_cd1 }}</td>
                        <td aria-describedby="list_puchs_lct_cd2" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.puchs_lct_cd2 }}</td>
                        <td aria-describedby="list_disps_lct_cd2" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.disps_lct_cd2 }}</td>
                        <td aria-describedby="list_puchs_lct_cd3" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.puchs_lct_cd3 }}</td>
                        <td aria-describedby="list_disps_lct_cd3" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.disps_lct_cd3 }}</td>
                        <td aria-describedby="list_puchs_lct_cd4" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.puchs_lct_cd4 }}</td>
                        <td aria-describedby="list_disps_lct_cd4" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.disps_lct_cd4 }}</td>
                        <td aria-describedby="list_puchs_lct_cd5" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.puchs_lct_cd5 }}</td>
                        <td aria-describedby="list_disps_lct_cd5" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.disps_lct_cd5 }}</td>
                        <td aria-describedby="list_puchs_lct_cd6" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.puchs_lct_cd6 }}</td>
                        <td aria-describedby="list_disps_lct_cd6" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.disps_lct_cd6 }}</td>
                        <td aria-describedby="list_puchs_lct_cd7" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.puchs_lct_cd7 }}</td>
                        <td aria-describedby="list_disps_lct_cd7" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.disps_lct_cd7 }}</td>
                        <td aria-describedby="list_puchs_lct_cd8" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.puchs_lct_cd8 }}</td>
                        <td aria-describedby="list_disps_lct_cd8" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.disps_lct_cd8 }}</td>
                        <td aria-describedby="list_puchs_lct_cd9" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.puchs_lct_cd9 }}</td>
                        <td aria-describedby="list_disps_lct_cd9" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.disps_lct_cd9 }}</td>
                        <td aria-describedby="list_puchs_lct_cd10" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.puchs_lct_cd10 }}</td>
                        <td aria-describedby="list_disps_lct_cd10" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.disps_lct_cd10 }}</td>
                        <td aria-describedby="list_puchs_lct_cd11" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.puchs_lct_cd11 }}</td>
                        <td aria-describedby="list_disps_lct_cd11" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.disps_lct_cd11 }}</td>
                        <td aria-describedby="list_puchs_lct_cd12" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.puchs_lct_cd12 }}</td>
                        <td aria-describedby="list_disps_lct_cd12" class="text-nowrap" [ngClass]="{'total-cell': item.puchs_dt === 'TOTAL'}">{{ item.disps_lct_cd12 }}</td>
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

        :host ::ng-deep #include_tags .p-select-option{
            padding:4px 0 4px 0 !important;
        }

        :host ::ng-deep #apply_btn button{
            width:100% !important;
        }

        :host ::ng-deep #multiselect p-iconfield > .p-inputtext,
        :host ::ng-deep p-columnfilterformelement
        {
            width: 100% !important;
        }


        @media (min-width: 768px) {
            :host ::ng-deep #search_dialog .p-dialog {
                height: 50rem /* 800px */;
            }
        }
        @media (max-width: 768px) {
            :host ::ng-deep #search_dialog .p-dialog {
                height: 100vh /* 800px */;
                max-height: 100% !important;
            }

        }

    `]
})


export class EquipmentPurchaseAndDisposalReportPage implements OnInit {

    loading: boolean = false;
    loadingTable: boolean = false;

    parents!: any[];
    fModelList!: any[];
    types!: any[];
    groups!: any[];

    selectedParent: string | null = null;
    selectedType: string | null = null;
    selectedGroup: string | null = null;
    selectedMdCode: string | null = null;
    selectedStartYear: string | null = null;
    selectedEndYear: string | null = null;

    selectedRangeYears: string | null = null;

    filters!: any[];
    visible: boolean = false;
    showDialog() {
        this.visible = true;
    }

    headerGroup!: string[];

    cols!: Column[];
    exportColumns!: ExportColumn[];
    data!: any;
    initialValue!: any;
    rows = 50;
    first = 0;
    page: number = 1;
    totalRecords = 0;


    constructor(private sv: EquipmentPurchaseAndDisposalReportService, private global_sv: GlobalsService) {
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

        this.headerGroup = ['FAC1', 'FAC2', 'FAC3', 'FAC5', 'LT', 'FVT', 'FCC1', 'FCC2', 'CC W/H', 'HWG', 'QSM W/H', 'MAIN W/H'];
        this.filters = [
            { field: 'puchs_lct_cd0', header: this.valLanguage.grid_Purchase[this.optionLanguage] },
            { field: 'disps_lct_cd0', header: this.valLanguage.grid_Disposal[this.optionLanguage] },
            { field: 'puchs_lct_cd1', header: this.valLanguage.grid_Purchase[this.optionLanguage] },
            { field: 'disps_lct_cd1', header: this.valLanguage.grid_Disposal[this.optionLanguage] },
            { field: 'puchs_lct_cd2', header: this.valLanguage.grid_Purchase[this.optionLanguage] },
            { field: 'disps_lct_cd2', header: this.valLanguage.grid_Disposal[this.optionLanguage] },
            { field: 'puchs_lct_cd3', header: this.valLanguage.grid_Purchase[this.optionLanguage] },
            { field: 'disps_lct_cd3', header: this.valLanguage.grid_Disposal[this.optionLanguage] },
            { field: 'puchs_lct_cd4', header: this.valLanguage.grid_Purchase[this.optionLanguage] },
            { field: 'disps_lct_cd4', header: this.valLanguage.grid_Disposal[this.optionLanguage] },
            { field: 'puchs_lct_cd5', header: this.valLanguage.grid_Purchase[this.optionLanguage] },
            { field: 'disps_lct_cd5', header: this.valLanguage.grid_Disposal[this.optionLanguage] },
            { field: 'puchs_lct_cd6', header: this.valLanguage.grid_Purchase[this.optionLanguage] },
            { field: 'disps_lct_cd6', header: this.valLanguage.grid_Disposal[this.optionLanguage] },
            { field: 'puchs_lct_cd7', header: this.valLanguage.grid_Purchase[this.optionLanguage] },
            { field: 'disps_lct_cd7', header: this.valLanguage.grid_Disposal[this.optionLanguage] },
            { field: 'puchs_lct_cd8', header: this.valLanguage.grid_Purchase[this.optionLanguage] },
            { field: 'disps_lct_cd8', header: this.valLanguage.grid_Disposal[this.optionLanguage] },
            { field: 'puchs_lct_cd9', header: this.valLanguage.grid_Purchase[this.optionLanguage] },
            { field: 'disps_lct_cd9', header: this.valLanguage.grid_Disposal[this.optionLanguage] },
            { field: 'puchs_lct_cd10', header: this.valLanguage.grid_Purchase[this.optionLanguage] },
            { field: 'disps_lct_cd10', header: this.valLanguage.grid_Disposal[this.optionLanguage] },
            { field: 'puchs_lct_cd11', header: this.valLanguage.grid_Purchase[this.optionLanguage] },
            { field: 'disps_lct_cd11', header: this.valLanguage.grid_Disposal[this.optionLanguage] },
            { field: 'puchs_lct_cd12', header: this.valLanguage.grid_Purchase[this.optionLanguage] },
            { field: 'disps_lct_cd12', header: this.valLanguage.grid_Disposal[this.optionLanguage] },
        ]

        this.cols = [
            { field: 'puchs_dt', header: this.valLanguage.grid_Year[this.optionLanguage] },
            ...this.filters
        ];
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    filterTable() {
        const param = {
            page: 1,
            startYear: this.selectedStartYear == null ? '' : this.selectedStartYear,
            endYear: this.selectedEndYear == null ? '' : this.selectedEndYear,
            md_cd: this.selectedMdCode == null ? '' : this.selectedMdCode,
            prt_cd: this.selectedParent == null ? '' : this.selectedParent,
            type_cd: this.selectedType == null ? '' : this.selectedType,
            group_cd: this.selectedGroup == null ? '' : this.selectedGroup
        }
        this.loadingTable = true;
        this.sv.getFilteredData(param).subscribe({
            next: (data: any) => {
                this.totalRecords = data.records;
                this.loadingTable = false
                console.log(data)
                this.data = this.initialValue = this.convertData(data.rows);
                this.loadYearsAndMinMaxYear(data.rows)
            }
        });
    }

    years!: number[];
    listYearFilter!: any[];
    minDate!: Date;
    maxDate!: Date;

    private loadData(): void {
        this.loading = true;
        this.loadingTable = true;

        forkJoin({
            lsFullData: this.sv.getFullData(),
            parentList: this.sv.getParentList(),
            lct000List: this.sv.getLct000List(),
            fModelList: this.sv.getFModelList(),
        }).subscribe({
            next: (data: any) => {
                this.data = this.initialValue = this.convertData(data.lsFullData.rows);

                this.page = data.lsFullData.page;

                this.totalRecords = data.lsFullData.records;

                this.loading = false;
                this.loadingTable = false;

                this.loadYearsAndMinMaxYear(data.lsFullData.rows);

                this.fModelList = data.fModelList.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
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

    convertData(rows: any[]) {
        return rows.map((item) => {
            return {
                puchs_dt: item.puchs_dt == 'TOTAL' ? item.puchs_dt : Number(item.puchs_dt),
                puchs_lct_cd0: Number(item.puchs_lct_cd0),
                disps_lct_cd0: Number(item.disps_lct_cd0),
                puchs_lct_cd1: Number(item.puchs_lct_cd1),
                disps_lct_cd1: Number(item.disps_lct_cd1),
                puchs_lct_cd2: Number(item.puchs_lct_cd2),
                disps_lct_cd2: Number(item.disps_lct_cd2),
                puchs_lct_cd3: Number(item.puchs_lct_cd3),
                disps_lct_cd3: Number(item.disps_lct_cd3),
                puchs_lct_cd4: Number(item.puchs_lct_cd4),
                disps_lct_cd4: Number(item.disps_lct_cd4),
                puchs_lct_cd5: Number(item.puchs_lct_cd5),
                disps_lct_cd5: Number(item.disps_lct_cd5),
                puchs_lct_cd6: Number(item.puchs_lct_cd6),
                disps_lct_cd6: Number(item.disps_lct_cd6),
                puchs_lct_cd7: Number(item.puchs_lct_cd7),
                disps_lct_cd7: Number(item.disps_lct_cd7),
                puchs_lct_cd8: Number(item.puchs_lct_cd8),
                disps_lct_cd8: Number(item.disps_lct_cd8),
                puchs_lct_cd9: Number(item.puchs_lct_cd9),
                disps_lct_cd9: Number(item.disps_lct_cd9),
                puchs_lct_cd10: Number(item.puchs_lct_cd10),
                disps_lct_cd10: Number(item.disps_lct_cd10),
                puchs_lct_cd11: Number(item.puchs_lct_cd11),
                disps_lct_cd11: Number(item.disps_lct_cd11),
                puchs_lct_cd12: Number(item.puchs_lct_cd12),
                disps_lct_cd12: Number(item.disps_lct_cd12),
            }
        })
    }

    loadYearsAndMinMaxYear(rows: any[]) {
        const setYear = new Set<number>();

        for (let item of rows) {
            if (item.puchs_dt != 'TOTAL') setYear.add(Number(item.puchs_dt))
        }

        this.years = [...setYear]
        this.minDate = new Date(`${Math.min(...this.years)}-1-1`);
        this.maxDate = new Date(`${Math.max(...this.years)}-1-1`);
        this.listYearFilter = ['TOTAL', ...this.years]
    }

    onClearSearch() {
        this.selectedParent = null;
        this.selectedMdCode = null;
        this.selectedRangeYears = null;
        this.selectedStartYear = null;
        this.selectedEndYear = null;
        this.selectedType = null;
        this.selectedGroup = null;
    }

    onClearTable(table: Table) {
        table.clear();
        this.page = 1;
        this.selectedYears = [];
    }

    onClearAllSearch() {
        this.onClearSearch()
        this.onClearTable(this.dt1)
    }

    handleApplySearch() {
        this.filterTable();
    }

    onChangeParent() {
        if (this.selectedParent) {
            this.sv.getTypeList(this.selectedParent).subscribe({
                next: (response) => {
                    this.types = response.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    this.groups = [];
                }
            })
        } else {
            this.selectedGroup = this.selectedType = null;
            this.types = this.groups = [];
        }
    }

    onChangeType() {
        if (this.selectedType) {
            this.sv.getGroupList(this.selectedType).subscribe({
                next: (response) => {
                    this.groups = response.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                }
            })
        } else {
            this.selectedGroup = null;
            this.groups = [];
        }
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

    onClearFilterDate() {
        this.selectedStartYear = this.selectedEndYear = '';
    }

    onCloseFilterDate() {
        if (this.selectedRangeYears != undefined && this.selectedRangeYears != null) {
            [this.selectedStartYear, this.selectedEndYear] = this.global_sv.getRangeYear(this.selectedRangeYears);
        }
    }

    selectedYears: string[] = [];
    selectAllYearTable: boolean = false;
    @ViewChild('ms') ms!: MultiSelect;

    onSelectAllChangeTable(event: any) {
        this.selectedYears = event.checked ? [...this.ms.visibleOptions()] : [];
        this.selectAllYearTable = event.checked;
    }
}
