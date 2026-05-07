import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
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
    flag: true | false;
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
    selector: 'app-parent-category',
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
        ConfirmDialogModule
    ],
    providers: [SystemService, MessageService, ConfirmationService],
    standalone: true,
    template: `<section *ngIf="valLanguage">
        <p-toast />
        <div class="header-title">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl sm:text-3xl mr-auto mb-0">
                    <!-- {{ titleNamePage }} -->
                    {{ valLanguage.LanguageCategory[optionLanguage] }}
                </h2>
                <p-button class="ml-auto w-[120px] *:w-full" label="{{this.valLanguage.btn_Refresh[this.optionLanguage]}}" severity="secondary" icon="pi pi-refresh" (click)="ngOnInit()" />
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
                dataKey="LANG_NO"
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
                editMode="row"
                [globalFilterFields]="['LANG_KEY', 'LANG_VN', 'LANG_KR', 'LANG_EN']"
                editMode="row"
                [scrollable]="true"
                [(selection)]="selectedTableQR"
                [totalRecords]="totalRecords"
            >
                <ng-template #caption>
                    <div class="flex flex-col xl:flex-row gap-2">
                        <div class="flex flex-nowarp overflow-auto text-nowrap pb-2 sm:pb-0 gap-x-2 md:gap-x-3">
                            <p-button label="{{ this.valLanguage.btn_ClearFilter[this.optionLanguage] }}" [outlined]="true" [raised]="true" severity="secondary" icon="pi pi-filter-slash" (click)="clear(dtTB)" />
                            <p-button icon="pi pi-external-link" label="{{ this.valLanguage.btn_Export[this.optionLanguage] }}" (click)="exportToExcel()" [outlined]="true" />
                            <p-button [outlined]="true" [icon]="isVisible ? 'pi pi-unlock' : 'pi pi-lock-open'" label="{{ this.valLanguage.btn_ShowFilter[this.optionLanguage] }}" (click)="ShowFilter()"></p-button>
                        </div>
                        <p-iconfield iconPosition="left" class="flex-1">
                            <p-inputicon>
                                <i class="pi pi-search"></i>
                            </p-inputicon>
                            <input
                                pInputText
                                type="text"
                                class="w-full"
                                (input)="onGlobalFilter($event, dtTB)"
                                title="{{ this.valLanguage.searchByLanguageCategory[this.optionLanguage] }}"
                                placeholder="{{ this.valLanguage.searchByLanguageCategory[this.optionLanguage] }}"
                            />
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
                            <th>
                                <p-columnFilter type="text" matchMode="contains" [field]="col.field" [placeholder]="'Search by ' + col.header" [ariaLabel]="'Filter ' + col.header"></p-columnFilter>
                            </th>
                        }
                    </tr>
                </ng-template>
                <ng-template #body let-information let-columns="columns" let-editing="editing" let-ri="rowIndex">
                    <tr [pEditableRow]="information" (click)="onRowClick(ri)" [ngClass]="{ 'selected-row': selectedRow === ri, 'clickable-row': true }">
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
                            @if (col.field !== 'LANG_NO') {
                                <p-cellEditor>
                                    <ng-template #input>
                                        <input pInputText type="text" [(ngModel)]="information[col.field]" />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ information[col.field] }}
                                    </ng-template>
                                </p-cellEditor>
                            } @else {
                                {{ information[col.field] }}
                            }
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="13">{{ this.valLanguage.No_data_found[this.optionLanguage] }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
        <div class="card">
            <div class="flex flex-wrap space-y-3 justify-between items-center mb-3">
                <span class="text-2xl font-semibold">{{this.valLanguage.Create_Language_Category[this.optionLanguage]}}</span>
                <p-button class="ml-auto w-40 *:w-full" label="{{this.valLanguage.btn_Create_Language[this.optionLanguage]}}" [disabled]="invalidCode" variant="outlined" severity="warn" (click)="createSupp(addParentForm)" />
            </div>
            <form
                class="needs-validation rounded grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 *:w-full *:max-w-sm *:mx-auto *:mt-2 pt-7 p-5 gap-5 bottom-border-card"
                novalidate
                [formGroup]="addParentForm"
                *ngIf="addParentForm"
                (ngSubmit)="createSupp(addParentForm)"
            >
                <p-floatlabel>
                    <input class="w-full" pInputText id="dt_cd" formControlName="inputLangKey" autocomplete="off" />
                    <label for="dt_cd">{{this.valLanguage.grid_Language_Key[this.optionLanguage]}}</label>
                </p-floatlabel>

                <p-floatlabel>
                    <input class="w-full" pInputText id="dt_vn" formControlName="inputEnglish" autocomplete="off" />
                    <label for="dt_vn">{{ this.valLanguage.grid_English_Name[this.optionLanguage] }}</label>
                </p-floatlabel>
                <p-floatlabel>
                    <input class="w-full" pInputText id="dt_kr" formControlName="inputKorea" autocomplete="off" />
                    <label for="dt_kr">{{ this.valLanguage.grid_Korean_Name[this.optionLanguage] }}</label>
                </p-floatlabel>
                <p-floatlabel>
                    <input class="w-full" pInputText id="dt_vn" formControlName="inputVietnam" autocomplete="off" />
                    <label for="dt_vn">{{ this.valLanguage.grid_Vietnam_Name[this.optionLanguage] }}</label>
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
export class LanguageCategory implements OnInit, OnDestroy {
    private refreshSubscription?: Subscription;

    titleNamePage: string = '';
    dataTable: any[] = [];
    clonedTables: { [s: string]: {} } = {};
    loading: boolean = true;
    activityValues: number[] = [0, 100];
    searchValue: string | undefined;
    event: any;

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
    codeList!: any[];
    invalidCode = false;
    initialValue!: any;
    @ViewChild('dtTB') dtTB!: Table;
    isSorted: boolean | null = null;
    @Input() filteredValue: any[] = [];
    valLanguage: any;
    optionLanguage: LanguageType = 'LANG_EN';
    next() {
        this.first = this.first + this.rows;
    }

    prev() {
        this.first = this.first - this.rows;
    }

    pageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }

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
        this.optionLanguage = this.global_sv.getLangue();
        this.addParentForm = this.fb.group({
            inputLangKey: [null, [ValidateNotNull]],
            inputKorea: [null, [ValidateNotNull]],
            inputVietnam: [null, [ValidateNotNull]],
            inputEnglish: [null, [ValidateNotNull]]
        });
        this.sv.getNamePageParent().subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.titleNamePage = response.mn_nm;
                }
            },
            (error) => {}
        );

        this.valLanguage = this.global_sv.getValLanguage();

        if (this.valLanguage === null) {
            this.global_sv._valLanguage$.subscribe((data) => {
                this.valLanguage = data;
            });
        }
    }

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
        this.loadDataTableCustom({}, this.param);
        this.cols = [
            { field: 'LANG_NO', header: this.valLanguage.grid_No[this.optionLanguage], type: 'Text', flag: false },
            { field: 'LANG_KEY', header: this.valLanguage.grid_Language_Key[this.optionLanguage], type: 'Text', flag: false },
            { field: 'LANG_EN', header: this.valLanguage.grid_English_Name[this.optionLanguage], type: 'Text', flag: true },
            { field: 'LANG_VN', header: this.valLanguage.grid_Vietnam_Name[this.optionLanguage], type: 'Text', flag: true },
            { field: 'LANG_KR', header: this.valLanguage.grid_Korean_Name[this.optionLanguage], type: 'Text', flag: true }
        ];
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    ngOnDestroy(): void {
        // Cleanup subscription để tránh memory leak
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    exportToExcel() {
        let data: any[] = [];
        if (this.dtTB.filteredValue && Array.isArray(this.dtTB.filteredValue)) {
            this.dtTB.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    'Language No': emp.LANG_NO,
                    'Language Key': emp.LANG_KEY,
                    'English Name': emp.LANG_EN,
                    'Korea Name': emp.LANG_KR,
                    'VietNam Name': emp.LANG_VN
                };
                data.push(rowData);
            });
        } else {
            this.dataTable.forEach((emp: any) => {
                const rowData: any = {
                    'Language No': emp.LANG_NO,
                    'Language Key': emp.LANG_KEY,
                    'English Name': emp.LANG_EN,
                    'Korea Name': emp.LANG_KR,
                    'VietNam Name': emp.LANG_VN
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'Language Category', 'data');
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
        this.sv.getLanguageCategory(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.dataTable = response;
                    this.dataTable.forEach((ele: any) => {
                        let ele_r: any = ele;
                        ele_r.LANG_EN = ele_r[ele_r.LANG_KEY].LANG_EN;
                        ele_r.LANG_KR = ele_r[ele_r.LANG_KEY].LANG_KR;
                        ele_r.LANG_VN = ele_r[ele_r.LANG_KEY].LANG_VN;
                        return ele_r;
                    });
                    this.initialValue = [...this.dataTable];
                    // console.log('dataTable:', this.initialValue);
                    this.loading = false;
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
    }

    filterChooseSearch(): void {
        this.param = {
            rows: this.totalRecords
        };

        let event: any = {
            first: 1, //this.first,
            rows: this.rows,
            last: '',
            rowsPerPage: '',
            filters: {}
        };
        this.loadDataTableCustom(event, this.param);
    }

    clear(table: Table) {
        table.clear();
        this.addParentForm.reset();
        this.param = {
            code: '',
            name: ''
        };
    }

    selectedRow: number | undefined = undefined;
    onRowClick(i: number): void {
        this.selectedRow = i;
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

    onChangeCode() {
        if (this.codeList.includes(this.addParentForm.value.inputCode)) {
            this.invalidCode = true;
        } else {
            if (this.invalidCode) this.invalidCode = false;
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
            this.dataTable = [...this.initialValue];
            this.dtTB.reset();
        }
    }

    createSupp(form: FormGroup) {
        if (form.valid) {
            if (form.value.inputLangKey === null) {
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
            if (form.value.inputEnglish === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Order !', life: 3000 });
                return;
            }

            let paramAdd: any = {
                LANG_KEY: form.value.inputLangKey
            };
            paramAdd[form.value.inputLangKey] = {
                LANG_KR: form.value.inputKorea,
                LANG_VN: form.value.inputVietnam,
                LANG_EN: form.value.inputEnglish
            };
            const dataSent = [paramAdd];
            this.sv.insertLanguageCate(dataSent).subscribe(
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
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Language Category', life: 3000 });
                }
            );
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Please enter Title Line !', life: 3000 });
        }
    }

    updateSupp(rowTable: any) {
        let paramAdd: any = {
            LANG_KEY: rowTable.LANG_KEY,
            LANG_NO: rowTable.LANG_NO
        };
        paramAdd[rowTable.LANG_KEY] = {
            LANG_KR: rowTable.LANG_KR,
            LANG_VN: rowTable.LANG_VN,
            LANG_EN: rowTable.LANG_EN
        };
        const dataSent = [paramAdd];
        this.sv.updateLanguageCate(dataSent).subscribe(
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
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to updated Language Category', life: 3000 });
            }
        );
    }

    delLanguageCate(rowTable: any) {
        let paramAdd: any = {
            LANG_KEY: rowTable.LANG_KEY,
            LANG_NO: rowTable.LANG_NO
        };
        const dataSent = [paramAdd];
        this.sv.delLanguageCate(dataSent).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    if (response.indexOf('error') >= 0 || response.indexOf('Error') >= 0) {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete Language Category', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Language Category Delete successfully', life: 3000 });
                        this.loadDataTableCustom({}, this.param);
                    }
                }
            },
            (error) => {
                console.error('Error Delete Parent Category:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete Language Category', life: 3000 });
            }
        );
    }

    confirmDelete(event: Event, rowTable: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Do you want to delete this record? No: ${rowTable.LANG_NO}, Key Name: ${rowTable.LANG_KEY}`,
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
                this.delLanguageCate(rowTable);
                // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Waiting for api from backend' });
            },
            reject: () => {
                this.messageService.add({ severity: 'secondary', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }
}
