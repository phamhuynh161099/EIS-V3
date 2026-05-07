import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
// import { DatePicker } from 'primeng/datepicker';
import { PrimeNG } from 'primeng/config';
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

import { LanguageType } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { EquipmentService } from '../equipment.service';
import { Dialog } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

interface TManufacturer {
    code: string;
    name: string;
    phone: string;
    address: string;
    website: string;
    description: string;
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

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

function ValidateNotNull(control: AbstractControl): { [key: string]: any } | null {
    if (control.value === null && control.value === '') {
        return { valueInvalid: true };
    }
    return null;
}

@Component({
    selector: 'app-empty',
    imports: [
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
        ConfirmDialogModule,
        TooltipModule,
        ProgressSpinnerModule,
        ReactiveFormsModule,
        Dialog
    ],
    providers: [EquipmentService, MessageService, ConfirmationService],
    standalone: true,
    templateUrl: './manufacturer_information.html',
    styles: `
        ::ng-deep {
            .btn_search_global {
                .p-inputtext {
                    .p-inputtext {
                        width: 24rem;
                        @media (min-width: 991px) {
                            width: 30rem;
                        }
                    }
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
            .choose_file {
                width: 33rem !important;
            }
            .p-fileupload-header {
                padding: 0.5rem 2rem !important;
            }
            #fileInput {
                border-radius: 10px;
                background: black;
            }
        }
    `
})
export class ManufacturerInformation implements OnInit, OnDestroy {
    private refreshSubscription?: Subscription;

    dataTable: any[] = [];
    // variables for filter
    codeFilterValue!: string;
    nameFilterValue!: string;
    brandNameFilterValue!: string;

    loading: boolean = true;
    loading_full: boolean = true;
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
    addManForm!: FormGroup;
    param: any = {
        code: '',
        name: '',
        brand: '',
        rows: 0
    };
    isSorted: boolean | null = null;
    initialValue: any[] = [];

    @ViewChild('dt') dataTableComponent!: Table;
    @Input() filteredValue: any[] = [];

    constructor(
        private sv: EquipmentService,
        private messageService: MessageService,
        public global_sv: GlobalsService,
        private fb: FormBuilder,
        private config: PrimeNG,
        private confirmationService: ConfirmationService
    ) {
        this.addManForm = this.fb.group({
            mfno: null,
            inputCode: [null, [ValidateNotNull]],
            inputName: [null, [ValidateNotNull]],
            inputBrandName: [null, [ValidateNotNull]],
            inputDescription: [null, [ValidateNotNull]]
        });
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

    onDelete(mfno: number) {
        this.sv.deleteManufacturerInfo(mfno).subscribe(
            () => {
                this.loadDataTableCustom({}, this.param);
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
    }

    reloadPage() {
        this.loadDataTableCustom({}, this.param);
        this.cols = [
            { field: 'mf_cd', header: this.valLanguage.grid_Code[this.optionLanguage] },
            { field: 'mf_nm', header: this.valLanguage.grid_Name[this.optionLanguage] },
            { field: 'brd_nm', header: this.valLanguage.grid_Brand_Name[this.optionLanguage] },
            { field: 're_mark', header: this.valLanguage.grid_Description[this.optionLanguage] },
            // { field: 'logo', header: this.valLanguage.grid_Logo[this.optionLanguage] },
            // { field: 'web_site', header: this.valLanguage.grid_Website[this.optionLanguage] },
            // { field: 'phone_nb', header: this.valLanguage.grid_Phone_Number[this.optionLanguage] },
            // { field: 'address', header: this.valLanguage.grid_Address[this.optionLanguage] },
            { field: 'reg_nm', header: this.valLanguage.grid_Create_Name[this.optionLanguage] },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Create_Date[this.optionLanguage] },
            { field: 'chg_nm', header: this.valLanguage.grid_Change_Name[this.optionLanguage] },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Change_Date[this.optionLanguage] }
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
        if (this.dataTableComponent.filteredValue && Array.isArray(this.dataTableComponent.filteredValue)) {
            this.dataTableComponent.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    Corp: emp.corp_nm,
                    'Asset No': emp.as_no,
                    Parent: emp.prt_nm,
                    'Material code': emp.mt_cd,
                    'Material description': emp.mt_nm,
                    'Storage Loca': emp.factory_nm,
                    Model: emp.md_cd,
                    'Create(QR) Date': emp.reg_qr_date instanceof Date ? this.global_sv.formatDate(emp.reg_qr_date) : emp.reg_qr_date,
                    Status: emp.sts_nm,
                    'Status Date': emp.status_date instanceof Date ? this.global_sv.formatDate(emp.status_date) : emp.status_date
                };
                data.push(rowData);
            });
        } else {
            this.dataTable.forEach((emp: any) => {
                const rowData: any = {
                    Corp: emp.corp_nm,
                    'Asset No': emp.as_no,
                    Parent: emp.prt_nm,
                    'Material code': emp.mt_cd,
                    'Material description': emp.mt_nm,
                    'Storage Loca': emp.factory_nm,
                    Model: emp.md_cd,
                    'Create(QR) Date': emp.reg_qr_date instanceof Date ? this.global_sv.formatDate(emp.reg_qr_date) : emp.reg_qr_date,
                    Status: emp.sts_nm,
                    'Status Date': emp.status_date instanceof Date ? this.global_sv.formatDate(emp.status_date) : emp.status_date
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'QR Code Management', 'data');
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
            this.dataTableComponent.reset();
        }
    }

    ShowFilter() {
        this.isVisible = !this.isVisible;
    }

    loadDataTableCustom(event: any, param: any) {
        this.loading = true;
        this.sv.selectManufacturerInfo(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.totalRecords = response.records;
                    param.rows = this.totalRecords;
                    this.sv.selectManufacturerInfo(param).subscribe(
                        (response) => {
                            if (response !== null && response !== undefined) {
                                this.dataTable = response.rows;
                                this.initialValue = [...response.rows];
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
            code: this.codeFilterValue !== null && this.codeFilterValue !== undefined ? this.codeFilterValue : '',
            name: this.nameFilterValue !== null && this.nameFilterValue !== undefined ? this.nameFilterValue : '',
            brand: this.brandNameFilterValue !== null && this.brandNameFilterValue !== undefined ? this.brandNameFilterValue : '',
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
        this.dataTable = [...this.initialValue];
        this.codeFilterValue = '';
        this.nameFilterValue = '';
        this.brandNameFilterValue = '';
        this.param = {
            code: '',
            name: '',
            brand: ''
        };
    }

    onGlobalFilter(event: Event, table: Table) {
        const input = event.target as HTMLInputElement;
        table.filterGlobal(input.value, 'contains');
    }

    isOpenDialog: boolean = false;
    isEdit: boolean = false;
    onRowEditInit(rowTable: any) {
        this.isOpenDialog = this.isEdit = true;
        this.addManForm.setValue({
            mfno: rowTable.mfno,
            inputCode: rowTable.mf_cd,
            inputName: rowTable.mf_nm,
            inputBrandName: rowTable.brd_nm,
            inputDescription: rowTable.re_mark
        });
    }

    onRowCreateInit() {
        this.isOpenDialog = true;
        this.isEdit = false;
        this.addManForm.reset();
    }

    createManuFac(form: FormGroup) {
        if (form.valid) {
            if (form.value.inputName === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Name !', life: 3000 });
                return;
            }
            if (form.value.inputBrandName === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Brand Name !', life: 3000 });
                return;
            }
            if (form.value.inputPhoneNumber === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Phone Number !', life: 3000 });
                return;
            }
            if (form.value.inputAddress === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Address !', life: 3000 });
                return;
            }
            if (form.value.inputWebsite === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Website !', life: 3000 });
                return;
            }

            const paramAdd = {
                code: form.value.inputCode,
                name: form.value.inputName,
                brand: form.value.inputBrandName,
                description: form.value.inputDescription,
                // file: null
            };
            this.sv.insertManufacturerInfo(paramAdd).subscribe(
                (response) => {
                    if (response !== null && response !== undefined) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Manufacturer information created successfully', key: 'tl', life: 3000 });
                        this.loadDataTableCustom({}, this.param);
                        this.isOpenDialog = false;
                        this.addManForm.reset();
                    }
                },
                (error) => {
                    console.error('Error creating manufacturer information:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create manufacturer information', key: 'tl', life: 3000 });
                }
            );
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter Title Line !', key: 'tl', life: 3000 });
        }
    }

    updateManuFac(form: FormGroup) {
        const binaryData = document.getElementById('fileInput') as HTMLInputElement | null;

        if (form.value.mf_nm === null && form.value.mf_nm === '') {
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Name !', life: 3000 });
            return;
        }
        if (form.value.brd_nm === null && form.value.brd_nm === '') {
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Brand Name !', life: 3000 });
            return;
        }
        if (form.value.phone_nb === null && form.value.phone_nb === '') {
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Phone Number !', life: 3000 });
            return;
        }
        if (form.value.address === null && form.value.address === '') {
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Address !', life: 3000 });
            return;
        }
        if (form.value.mfno === null && form.value.mfno === '') {
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter mfno !', life: 3000 });
            return;
        }
        const paramAdd = {
            mfno: form.value.mfno,
            code: form.value.inputCode !== null ? form.value.inputCode : '',
            name: form.value.inputName !== null ? form.value.inputName : '',
            brand: form.value.inputBrandName !== null ? form.value.inputBrandName : '',
            address: form.value.inputAddress !== null ? form.value.inputAddress : '',
            phone: form.value.inputPhoneNumber !== null ? form.value.inputPhoneNumber : '',
            website: form.value.inputWebsite !== null ? form.value.inputWebsite : '',
            description: form.value.inputDescription !== null ? form.value.inputDescription : '',
            file: binaryData
        };
        const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;

        this.sv.updateManufacturerInfo(paramAdd, fileInput).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    if (response.indexOf('errors') === -1) {
                        this.loadDataTableCustom({}, this.param);
                        this.isOpenDialog = false;
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Manufacturer information update successfully', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update manufacturer information', life: 3000 });
                    }
                }
            },
            (error) => {
                console.error('Error creating manufacturer information:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create manufacturer information', life: 3000 });
            }
        );
    }

    confirmDelete(event: Event, rowTable: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Do you want to delete this record? Code: ${rowTable.mf_cd}, Name: ${rowTable.mf_nm}`,
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
                this.onDelete(rowTable.mfno);
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
            },
            reject: () => {
                this.messageService.add({ severity: 'secondary', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }
}
