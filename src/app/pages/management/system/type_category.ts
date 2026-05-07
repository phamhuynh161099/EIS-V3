import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';

import { ConfirmationService, MessageService, SelectItem, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Toast, ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { LanguageType } from '../../../../constants/constants.auth';
import { GlobalsService } from '../../../../globals.service';
import { SystemService } from './system.service';

interface ExportColumn {
    title: string;
    dataKey: string;
}
interface Column {
    type: 'Text' | 'Date' | 'Number' | 'Option';
    field: string;
    header: string;
    customExportHeader?: string;
}

function ValidateNotNull(control: AbstractControl): { [key: string]: any } | null {
    if (control.value === null && control.value === '') {
        return { valueInvalid: true };
    }
    return null;
}

@Component({
    selector: 'app-type-category',
    imports: [
        TooltipModule,
        FormsModule,
        FloatLabel,
        TableModule,
        CommonModule,
        InputTextModule,
        TagModule,
        SelectModule,
        MultiSelectModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        SliderModule,
        ToastModule,
        Toast,
        ProgressSpinnerModule,
        ReactiveFormsModule,
        DatePickerModule,
        ConfirmDialogModule,
        InputNumber
    ],
    providers: [SystemService, MessageService, ConfirmationService],
    standalone: true,
    template: `<section>
        <p-toast />
        <div class="header-title">
            <div class="flex flex-col sm:flex-row justify-between items-center mb-3 xl:mb-0">
                <h2 class="text-2xl sm:text-3xl mr-auto">{{this.valLanguage.TypeCategory[this.optionLanguage]}}<p-progress-spinner *ngIf="loading_full" class="spinner-cl pl-3" strokeWidth="5" fill="transparent" animationDuration=".5s" [style]="{ width: '20px', height: '20px', color: '#333' }" /></h2>
                <div class="flex gap-2 *:w-[120px] *:*:w-full ml-auto">
                    <p-button severity="info" variant="outlined" icon="pi pi-search" [label]="this.valLanguage.btn_Search[this.optionLanguage]" (click)="filterChooseSearch()" />
                    <p-button [label]="this.valLanguage.btn_Refresh[optionLanguage]" severity="secondary" icon="pi pi-refresh" (click)="ngOnInit()" />
                </div>
            </div>
            <div class="rounded p-5 header-border-filter">
                <p-floatlabel class="max-w-80 mx-auto sm:mx-0 w-full">
                    <p-select [filter]="false" filterBy="label" class="w-full" [(ngModel)]="parentFilterValue" [options]="parent" [showClear]="true">
                        <ng-template let-option #item>
                            <p-tag [value]="option.label" severity="secondary" class="w-full !py-2" />
                        </ng-template>
                    </p-select>
                    <label for="parent_filter">{{this.valLanguage.grid_Parent[this.optionLanguage]}}</label>
                </p-floatlabel>
            </div>
        </div>
        <p-toast />
        <p-confirmdialog />
        <div class="card">
            <p-table
                #dtTB
                class="table_minheight"
                [value]="dataTable"
                (sortFunction)="customSort($event)"
                [customSort]="true"
                exportFilename="QR Code Management"
                dataKey="cdid"
                showGridlines
                [tableStyle]="{ 'min-width': '60rem' }"
                [columns]="cols"
                [exportHeader]="'customExportHeader'"
                [rowsPerPageOptions]="[10, 25, 50]"
                [loading]="loading"
                [paginator]="true"
                [rows]="rows"
                [first]="first"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                [globalFilterFields]="['dt_cd', 'dt_nm', 'dt_kr', 'dt_vn']"
                editMode="row"
                [scrollable]="true"
                [(selection)]="selectedTableQR"
                [totalRecords]="totalRecords"
            >
                <ng-template #caption>
                    <div class="flex flex-col xl:flex-row gap-x-3 gap-y-1">
                        <div class="flex flex-nowarp overflow-auto text-nowrap pb-2 sm:pb-0 gap-x-2 md:gap-x-3">
                            <p-button class="mr-3" [label]="this.valLanguage.btn_ClearFilter[this.optionLanguage]" [outlined]="true" [raised]="true" severity="secondary" icon="pi pi-filter-slash" (click)="clear(dtTB)" />
                            <div class="mr-3">
                                <p-button icon="pi pi-external-link" [label]="this.valLanguage.btn_Export[this.optionLanguage]" (click)="exportToExcel()" [outlined]="true" />
                            </div>
                            <div class="mr-3">
                                <p-button [outlined]="true" [icon]="isVisible ? 'pi pi-unlock' : 'pi pi-lock-open'" [label]="this.valLanguage.btn_ShowFilter[optionLanguage]" (click)="ShowFilter()"></p-button>
                            </div>
                        </div>
                        <p-iconfield iconPosition="left" class="btn_search_global flex-1 mt-3 xl:mt-0">
                            <p-inputicon>
                                <i class="pi pi-search"></i>
                            </p-inputicon>
                            <input pInputText type="text" (input)="onGlobalFilter($event, dtTB)" title="{{this.valLanguage.searchByTypeCategory[this.optionLanguage]}}" placeholder="{{this.valLanguage.searchByTypeCategory[this.optionLanguage]}}" />
                        </p-iconfield>
                    </div>
                </ng-template>
                <ng-template #header let-columns>
                    <tr>
                        <th pFrozenColumn><p-button icon="pi pi-trash" [rounded]="true" severity="danger" /></th>
                        <th pFrozenColumn><p-button icon="pi pi-file-edit" [rounded]="true" severity="info" /></th>
                        <th *ngFor="let header of cols" [pSortableColumn]="header.field" class="sortable-header cursor-pointer">
                            <div class="header-content">
                                <span>{{ header.header }}</span>
                                <p-sortIcon [field]="header.field" />
                            </div>
                        </th>
                    </tr>
                    <tr [hidden]="isVisible">
                        <th pFrozenColumn></th>
                        <th pFrozenColumn></th>
                        @for (col of columns; track $index) {
                            @if (col.field === 'val1_nm') {
                                <th>
                                    <p-columnFilter field="parent_name" matchMode="in" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                                        <ng-template #filter let-value let-filter="filterCallback">
                                            <p-multiselect [ngModel]="value" [filter]="false" [options]="parentTable" placeholder="Select Parent" (onChange)="filter($event.value, 'parent_name')" optionLabel="label" [panelStyle]="{ minWidth: '16rem' }">
                                                <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                                    <i class="pi pi-check" *ngIf="allSelected"></i>
                                                    <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                                </ng-template>
                                            </p-multiselect>
                                        </ng-template>
                                    </p-columnFilter>
                                </th>
                            } @else if (col.type == 'Text') {
                                <th>
                                    <p-columnFilter type="text" matchMode="contains" [field]="col.field" [placeholder]="'Search by ' + col.header" [ariaLabel]="'Filter ' + col.header"></p-columnFilter>
                                </th>
                            } @else if (col.type == 'Date') {
                                <th>
                                    <div class="flex justify-center item-center">
                                        <label class="w-32 opacity-55 self-center">Search By Date:</label>
                                        <p-columnFilter type="date" [field]="col.field" display="menu" [showMatchModes]="true" [showOperator]="false" [showAddButton]="true">
                                            <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                                <p-datepicker
                                                    #calendar
                                                    [ngModel]="value"
                                                    (onSelect)="filter(calendar.value)"
                                                    (onInput)="setup(calendar.value, col.field)"
                                                    [showButtonBar]="true"
                                                    [placeholder]="loading ? 'Loading...Please wait!' : 'Choose Date'"
                                                    [disabled]="loading"
                                                    dateFormat="yy-mm-dd"
                                                >
                                                </p-datepicker>
                                            </ng-template>
                                        </p-columnFilter>
                                    </div>
                                </th>
                            }
                        }
                    </tr>
                </ng-template>
                <ng-template #body let-information let-columns="columns" let-editing="editing" let-ri="rowIndex">
                    <tr [pEditableRow]="information" (click)="onRowClick(ri)" [ngClass]="{'selected-row': selectedRow === ri, 'clickable-row' : true}">
                        <td pFrozenColumn>
                            <p-button icon="pi pi-trash" [rounded]="true" [text]="true" [raised]="true" severity="danger" (click)="confirmDelete($event, information)" />
                        </td>
                        <td pFrozenColumn>
                            <div class="flex items-center justify-center gap-2">
                                <button *ngIf="!editing" pButton pRipple type="button" pInitEditableRow icon="pi pi-pencil" (click)="onRowEditInit(information)" text rounded severity="info"></button>
                                <p-button *ngIf="editing" icon="pi pi-check" [rounded]="true" [text]="true" [raised]="true" severity="success" pSaveEditableRow (click)="onRowEditSave(information)" />
                                <p-button *ngIf="editing" icon="pi pi-times" pCancelEditableRow [rounded]="true" [text]="true" [raised]="true" severity="secondary" (click)="onRowEditCancel(information, ri)" />
                            </div>
                        </td>
                        <td *ngFor="let col of columns">
                            @if (col.field === 'val1_nm') {
                                <p-cellEditor>
                                    <ng-template #input>
                                        <p-select optionValue="label" [options]="parent" appendTo="body" [(ngModel)]="information[col.field]" [style]="{ width: '100%' }">
                                            <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                                <i class="pi pi-check" *ngIf="allSelected"></i>
                                                <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                            </ng-template>                                        </p-select>
                                    </ng-template>
                                    <ng-template #output>
                                        <p-tag [value]="information[col.field]" severity="secondary" />
                                    </ng-template>
                                </p-cellEditor>
                            } @else if (col.field !== 'dt_cd' && col.field !== 'use_yn' && col.field !== 'reg_nm' && col.field !== 'chg_nm' && col.field !== 'reg_dt_ymd' && col.field !== 'chg_dt_ymd') {
                                <p-cellEditor>
                                    <ng-template #input>
                                        <input pInputText type="text" [(ngModel)]="information[col.field]" />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ information[col.field] }}
                                    </ng-template>
                                </p-cellEditor>
                            } @else {
                                @if (col.field == 'reg_dt_ymd' || col.field == 'chg_dt_ymd') {
                                    {{ information[col.field] | date: 'yyyy/MM/dd HH:mm:ss' }}
                                } @else {
                                    {{ information[col.field] }}
                                }
                            }
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="13">No customers found.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <div class="card">
            <div class="flex justify-between items-center mb-3">
                <span class="font-semibold text-lg sm:text-2xl">{{this.valLanguage.Create_Type_Category[this.optionLanguage]}}</span>
                <p-button label="{{this.valLanguage.btn_Create_Type[this.optionLanguage]}}" [disabled]="invalidCode" class="flex justify-end" variant="outlined" severity="warn" (click)="createSupp(addParentForm)" />
            </div>
            <form
                class="needs-validation rounded grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 *:w-full *:max-w-sm *:mx-auto pt-8 p-5 gap-7 bottom-border-card"
                novalidate
                [formGroup]="addParentForm"
                *ngIf="addParentForm"
                (ngSubmit)="createSupp(addParentForm)"
            >
                <p-floatlabel>
                    <input class="w-full" pInputText id="dt_cd" formControlName="inputName" autocomplete="off" />
                    <label for="dt_cd">{{this.valLanguage.grid_Name[this.optionLanguage]}}</label>
                </p-floatlabel>
                <p-floatlabel>
                    <input class="w-full" pInputText id="dt_kr" formControlName="inputKorea" autocomplete="off" />
                    <label for="dt_kr">{{this.valLanguage.grid_Korean_Name[this.optionLanguage]}}</label>
                </p-floatlabel>
                <p-floatlabel>
                    <input class="w-full" pInputText id="dt_vn" formControlName="inputVietnam" autocomplete="off" />
                    <label for="dt_vn">{{this.valLanguage.grid_Vietnam_Name[this.optionLanguage]}}</label>
                </p-floatlabel>
                <p-floatlabel>
                    <p-select class="w-full" formControlName="inputParent" [options]="parent" [showClear]="true">
                        <ng-template let-option #item>
                            <p-tag [value]="option.label" severity="secondary" class="w-full !py-2" />
                        </ng-template>
                    </p-select>
                    <label for="parent_filter">{{this.valLanguage.grid_Parent[this.optionLanguage]}}</label>
                </p-floatlabel>
                <p-floatlabel>
                    <p-inputnumber class="w-full" id="dt_order" formControlName="inputOrder" autocomplete="off" />
                    <label for="dt_order">{{this.valLanguage.grid_Order[this.optionLanguage]}}</label>
                </p-floatlabel>
                <p-floatlabel>
                    <input class="w-full" pInputText id="dt_exp" formControlName="inputExplain" autocomplete="off" />
                    <label for="dt_exp">{{this.valLanguage.grid_Explain[this.optionLanguage]}}</label>
                </p-floatlabel>
            </form>
        </div>
    </section>`,
    styles: `
        ::ng-deep {
            .btn_search_global {
                .p-inputtext {
                    width: 100%;
                }
            }
            .btn_search_choose {
                .p-button {
                    width: 100%;
                }
            }
            .style_date .p-datepicker-input {
                width: 10rem !important;
                @media (min-width: 991px) {
                    width: 14rem !important;
                }
            }
            .p-progressspinner-circle {
                stroke: var(--grid-stroke) !important;
            }
        }
    `
})
export class TypeCategory implements OnInit, OnDestroy {
    private refreshSubscription?: Subscription;
    dataTable: any[] = [];
    clonedTables: { [s: string]: {} } = {};
    loading: boolean = true;
    loading_full: boolean = true;
    activityValues: number[] = [0, 100];
    searchValue: string | undefined;
    event: any;
    parent!: SelectItem[];
    parentFilterValue: string | null = null;
    parentTable!: SelectItem[];
    parentTableFilterValue: string | null = null;
    reg_date_input: string = ''; // Default to today's date in YYYY-MM-DD format
    datetime24h: Date[] | undefined;
    exportColumns!: ExportColumn[];
    cols!: Column[];
    selectedTableQR!: any[];
    isVisible: boolean = true;
    isVisibleCheckAll: boolean = false;
    //  config lazyLoad for tbale
    first = 0;
    rows = 10;
    totalRecords: number = 0;
    totalRecordsAll: number = 0;
    //form config
    addParentForm!: FormGroup;
    param: any = {
        code: '',
        name: '',
        rows: 0
    };
    totalSize: number = 0;
    totalSizePercent: number = 0;
    invalidCode = false;
    initialValue!: any;
    @ViewChild('dtTB') dtTB!: Table;
    isSorted: boolean | null = null;
    @Input() filteredValue: any[] = [];

    setup(value: any, id: any) {
        if (value != null) {
            const filter = this.dtTB.filters[id];
            if (Array.isArray(filter)) {
                filter[0].value = value;
            } else if (filter) {
                filter.value = value;
            }
        }
        this.reg_date_input = value;
    }

    constructor(
        private sv: SystemService,
        private messageService: MessageService,
        public global_sv: GlobalsService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService
    ) {
        this.addParentForm = this.fb.group({
            inputName: [null, [ValidateNotNull]],
            inputKorea: [null, [ValidateNotNull]],
            inputVietnam: [null, [ValidateNotNull]],
            inputOrder: [null, [ValidateNotNull]],
            inputExplain: [null, [ValidateNotNull]],
            inputParent: [null, [ValidateNotNull]]
        });
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
        this.parentFilterValue = null;
        this.loadListFilter();
        this.loadDataTableCustom({}, this.param);
        this.cols = [
            { field: 'dt_cd', header: this.valLanguage.grid_Code[this.optionLanguage], type: 'Text' },
            { field: 'dt_nm', header: this.valLanguage.grid_Name[this.optionLanguage], type: 'Text' },
            { field: 'dt_kr', header: this.valLanguage.grid_Korean_Name[this.optionLanguage], type: 'Text' },
            { field: 'dt_vn', header: this.valLanguage.grid_Vietnam_Name[this.optionLanguage], type: 'Text' },
            { field: 'dt_exp', header: this.valLanguage.grid_Explain[this.optionLanguage], type: 'Text' },
            { field: 'val1_nm', header: this.valLanguage.grid_Parent[this.optionLanguage], type: 'Text' },
            { field: 'use_yn', header: this.valLanguage.grid_UseYN[this.optionLanguage], type: 'Text' },
            { field: 'dt_order', header: this.valLanguage.grid_Order_No[this.optionLanguage], type: 'Text' },
            { field: 'reg_nm', header: this.valLanguage.grid_Reg_Name[this.optionLanguage], type: 'Text' },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Reg_Date[this.optionLanguage], type: 'Date' },
            { field: 'chg_nm', header: this.valLanguage.grid_Update_Name[this.optionLanguage], type: 'Text' },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Storage_Loca[this.optionLanguage], type: 'Date' }
        ];
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onRowClick(i: number): void {
        this.selectedRow = i;
    }
    selectedRow: number | undefined = undefined;

    ngOnDestroy(): void {
        // Cleanup subscription để tránh memory leak
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    loadListFilter(): void {
        forkJoin({
            parent: this.global_sv.getParent(),
        }).subscribe(
            (responses) => {
                if (responses.parent !== null && responses.parent !== undefined) {
                    this.parent = responses.parent
                        .filter((item: any) => item.comm_nm !== '')
                        .map((item: any) => ({
                            label: item.comm_nm,
                            value: item.comm_cd
                        }));

                    this.parentTable = responses.parent.map((item: any) => ({
                        label: item.comm_nm
                    }));
                }
            },
            (error) => {
                console.error('Error loading filter lists:', error);
            }
        );
    }

    exportToExcel() {
        let data: any[] = [];
        if (this.dtTB.filteredValue && Array.isArray(this.dtTB.filteredValue)) {
            this.dtTB.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    Code: emp.dt_cd,
                    Name: emp.dt_nm,
                    'Korea Name': emp.dt_kr,
                    'VietNam Name': emp.dt_vn,
                    Explain: emp.dt_exp,
                    Parent: emp.val1_nm,
                    'Use Y/N': emp.use_yn,
                    'Order No': emp.dt_order,
                    'Reg Name': emp.reg_nm,
                    'Reg Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Update Name': emp.chg_nm,
                    'Update Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        } else {
            this.dataTable.forEach((emp: any) => {
                const rowData: any = {
                    Code: emp.dt_cd,
                    Name: emp.dt_nm,
                    'Korea Name': emp.dt_kr,
                    'VietNam Name': emp.dt_vn,
                    Explain: emp.dt_exp,
                    Parent: emp.val1_nm,
                    'Use Y/N': emp.use_yn,
                    'Order No': emp.dt_order,
                    'Reg Name': emp.reg_nm,
                    'Reg Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Update Name': emp.chg_nm,
                    'Update Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'Type Category', 'data');
        }
    }

    onTableHeaderCheckboxToggle(event: any) {
        this.selectedTableQR = [];
        if (event.checked === true) {
            let index = 0;
            for (let m of this.dataTable) {
                index++;
                if (index <= 10) {
                    /* Make your test here if the array does not contain the element*/
                    this.selectedTableQR.push(m);
                }
            }
        } else {
            this.selectedTableQR.length = 0;
        }
    }

    ShowFilter() {
        this.isVisible = !this.isVisible;
    }

    loadDataTableCustom(event: any, param: any) {
        this.loading = true;
        this.sv.getTypeCategory(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.totalRecords = response.records;
                    param.rows = this.totalRecords;
                    this.sv.getTypeCategory(param).subscribe(
                        (response) => {
                            if (response !== null && response !== undefined) {
                                // this.dataTable = response.rows;
                                let dtTableRes = response.rows;
                                this.dataTable = dtTableRes.map((ele: any) => {
                                    let ele_r: any = ele;
                                    if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                                        ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                                    }
                                    if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                                        ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                                    }
                                    ele_r = {
                                        ...ele_r,
                                        parent_name: {
                                            label: ele_r.val1_nm
                                        }
                                    };
                                    return ele_r;
                                });

                                this.initialValue = [...this.dataTable];
                                this.loading_full = false;
                                this.loading = false;
                            }
                        },
                        (error) => {
                            console.error('Error fetching equipment information:', error);
                        }
                    );
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
    }

    filterChooseSearch(): void {
        this.param = {
            rows: this.totalRecords,
            parent: this.parentFilterValue
        };

        let event: any = {
            first: 1, //this.first,
            rows: this.rows,
            last: '',
            rowsPerPage: '',
            filters: {}
        };
        this.sv.getTypeSearchCategory(this.param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    let dtTableRes = response.rows;
                    this.dataTable = dtTableRes.map((ele: any) => {
                        let ele_r: any = ele;
                        if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                            ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                        }
                        if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                            ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                        }
                        ele_r = {
                            ...ele_r,
                            parent_name: {
                                label: ele_r.val1_nm
                            }
                        };
                        return ele_r;
                    });

                    this.initialValue = [...this.dataTable];
                    this.loading_full = false;
                    this.loading = false;
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
    }

    clear(table: Table) {
        table.clear();
        this.addParentForm.reset();
        this.parentFilterValue = null;
        this.param = {
            code: '',
            name: ''
        };
    }

    onGlobalFilter(event: Event, table: Table) {
        const input = event.target as HTMLInputElement;
        table.filterGlobal(input.value, 'contains');
    }

    onRowEditInit(rowTable: any) {
        this.clonedTables[rowTable.mfno as string] = { ...rowTable };
    }

    onRowEditSave(rowTable: any) {
        delete this.clonedTables[rowTable.mfno as string];

        this.updateSupp(rowTable);
    }

    onRowEditCancel(rowTable: any, index: number) {
        this.dataTable[index] = this.clonedTables[rowTable.mfno as string];
        delete this.clonedTables[rowTable.mfno as string];
    }

    choose(event: any, callback: any) {
        callback();
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
            this.dtTB.reset();
        }
    }

    createSupp(form: FormGroup) {
        if (form.valid) {
            if (form.value.inputName === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Name !', life: 3000 });
                return;
            }
            if (form.value.inputKorea === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Korea Name !', life: 3000 });
                return;
            }
            if (form.value.inputVietnam === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Vietnam Name !', life: 3000 });
                return;
            }
            if (form.value.inputParent === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Parent !', life: 3000 });
                return;
            }
            if (form.value.inputOrder === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Order !', life: 3000 });
                return;
            }
            if (form.value.inputExplain === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Explain !', life: 3000 });
                return;
            }
            const paramAdd = {
                mt_cd: this.dataTable[0].mt_cd,
                cdid: 1,
                dt_cd: '',
                name: form.value.inputName,
                parent: form.value.inputParent,
                korea: form.value.inputKorea,
                vietnam: form.value.inputVietnam,
                order: form.value.inputOrder,
                explain: form.value.inputExplain
            };
            this.sv.insertTypeCate(paramAdd).subscribe(
                (response) => {
                    if (response !== null && response !== undefined) {
                        if (response.indexOf('error') >= 0 || response.indexOf('Error') >= 0) {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Parent Category', life: 3000 });
                        } else {
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Parent Category created successfully', life: 3000 });
                            this.loadDataTableCustom({}, this.param);
                            this.addParentForm.reset();
                        }
                    }
                },
                (error) => {
                    console.error('Error creating Supplier Information:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Parent Category', life: 3000 });
                }
            );
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Please enter Title Line !', life: 3000 });
        }
    }

    updateSupp(rowTable: any) {
        let parentCode = '';
        this.parent.forEach((ele: any) => {
            if (ele.label === rowTable.val1_nm) {
                parentCode = ele.value;
            }
        });

        const paramAdd = {
            mt_cd: rowTable.mt_cd ? rowTable.mt_cd : '',
            cdid: rowTable.cdid ? rowTable.cdid : '',
            dt_cd: rowTable.dt_cd ? rowTable.dt_cd : '',
            parent: parentCode,
            name: rowTable.dt_nm ? rowTable.dt_nm : '',
            korea: rowTable.dt_kr ? rowTable.dt_kr : '',
            vietnam: rowTable.dt_vn ? rowTable.dt_vn : '',
            order: rowTable.dt_order ? rowTable.dt_order : '',
            explain: rowTable.dt_exp ? rowTable.dt_exp : ''
        };
        this.sv.updateTypeCate(paramAdd).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    if (response.indexOf('error') >= 0 || response.indexOf('Error') >= 0) {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to updated Parent Category', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Parent Category updated successfully', life: 3000 });
                        this.loadDataTableCustom({}, this.param);
                    }
                }
            },
            (error) => {
                console.error('Error update Parent Category:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to updated Parent Category', life: 3000 });
            }
        );
    }

    delTypeCate(rowTable: any) {
        const paramAdd = {
            mt_cd: rowTable.mt_cd ? rowTable.mt_cd : '',
            cdid: rowTable.cdid ? rowTable.cdid : ''
        };
        this.sv.delTypeCate(paramAdd).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    if (response.indexOf('error') >= 0 || response.indexOf('Error') >= 0) {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete Parent Category', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Parent Category Delete successfully', life: 3000 });
                        this.loadDataTableCustom({}, this.param);
                    }
                }
            },
            (error) => {
                console.error('Error Delete Parent Category:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete Parent Category', life: 3000 });
            }
        );
    }

    confirmDelete(event: Event, rowTable: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Do you want to delete this record? Code: ${rowTable.dt_cd}, Name: ${rowTable.dt_nm}`,
            header: 'Danger Zone',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger'
            },

            accept: () => {
                this.delTypeCate(rowTable);
                // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
            },
            reject: () => {
                this.messageService.add({ severity: 'secondary', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }
}
