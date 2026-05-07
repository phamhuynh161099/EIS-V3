import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { Subscription } from 'rxjs';
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
import { TooltipModule } from 'primeng/tooltip';
import { LanguageType } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { EquipmentService } from '../equipment.service';
import { Dialog } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface City {
    name: string;
    code: string;
}
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
    selector: 'app-empty',
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
        Dialog
    ],
    providers: [EquipmentService, MessageService, ConfirmationService],
    standalone: true,
    templateUrl: './supplier_information.html',
    styles: `
        ::ng-deep {
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
export class SupplierInformation implements OnInit, OnDestroy {
    private refreshSubscription?: Subscription;

    dataTable: any[] = [];
    dataTableAll: any[] = [];
    clonedTables: { [s: string]: {} } = {};
    // variables for filter
    codeFilterValue!: string;
    nameFilterValue!: string;

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
    addSuppForm!: FormGroup;
    param: any = {
        code: '',
        name: '',
        rows: 0
    };
    totalSize: number = 0;
    totalSizePercent: number = 0;

    onRowClick(i: number) {
        this.selectedRow = i;
    }

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

    @Input() filteredValue: any[] = [];

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

    constructor(
        private sv: EquipmentService,
        private messageService: MessageService,
        public global_sv: GlobalsService,
        private fb: FormBuilder,
        private config: PrimeNG,
        private confirmationService: ConfirmationService
    ) {
        this.optionLanguage = this.global_sv.getLangue();
        this.addSuppForm = this.fb.group({
            spno: null,
            inputCode: [null, [ValidateNotNull]],
            inputName: [null, [ValidateNotNull]],
            inputDescription: [null, [ValidateNotNull]]
        });
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
        this.loadDataTableCustom({}, this.param);
        this.cols = [
            { field: 'sp_cd', header: this.valLanguage.grid_Code[this.optionLanguage], type: 'Text' },
            { field: 'sp_nm', header: this.valLanguage.grid_Name[this.optionLanguage], type: 'Text' },
            { field: 're_mark', header: this.valLanguage.grid_Description[this.optionLanguage], type: 'Text' },
            // { field: 'web_site', header: this.valLanguage.grid_Website[this.optionLanguage], type: 'Text' },
            // { field: 'phone_nb', header: this.valLanguage.grid_Phone_Number[this.optionLanguage], type: 'Text' },
            // { field: 'e_mail', header: this.valLanguage.grid_EMail[this.optionLanguage], type: 'Text' },
            // { field: 'address', header: this.valLanguage.grid_Address[this.optionLanguage], type: 'Text' },
            { field: 'reg_nm', header: this.valLanguage.grid_Create_Name[this.optionLanguage], type: 'Text' },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Create_Date[this.optionLanguage], type: 'Date' },
            { field: 'chg_nm', header: this.valLanguage.grid_Change_Name[this.optionLanguage], type: 'Text' },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Change_Date[this.optionLanguage], type: 'Date' }
        ];
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    selectedRow: number | undefined = undefined;

    ngOnDestroy(): void {
        // Cleanup subscription để tránh memory leak
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    exportToExcel() {
        let data: any[] = [];
        if (this.dt1.filteredValue && Array.isArray(this.dt1.filteredValue)) {
            this.dt1.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    Code: emp.sp_cd,
                    Name: emp.sp_nm,
                    Description: emp.re_mark,
                    Website: emp.web_site,
                    'Phone Number': emp.phone_nb,
                    'E-Mail': emp.e_mail,
                    Address: emp.address,
                    'Create Name': emp.reg_nm,
                    'Create Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        } else {
            this.dataTable.forEach((emp: any) => {
                const rowData: any = {
                    Code: emp.sp_cd,
                    Name: emp.sp_nm,
                    Description: emp.re_mark,
                    Website: emp.web_site,
                    'Phone Number': emp.phone_nb,
                    'E-Mail': emp.e_mail,
                    Address: emp.address,
                    'Create Name': emp.reg_nm,
                    'Create Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'Supplier Information', 'data');
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
        this.sv.selectSupplierInfo(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.totalRecords = response.records;
                    param.rows = this.totalRecords;
                    this.sv.selectSupplierInfo(param).subscribe(
                        (response) => {
                            if (response !== null && response !== undefined) {
                                this.initialValue = this.dataTable = response.rows;
                                this.dataTable.forEach((ele: any) => {
                                    let ele_r: any = ele;
                                    if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                                        ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                                    }
                                    if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                                        ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                                    }
                                    return ele;
                                });

                                this.loading_full = false;
                                this.loading = false;
                                this.codeList = response.rows.map((item: any) => item.sp_cd);
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
        this.codeFilterValue = '';
        this.nameFilterValue = '';
        this.param = {
            code: '',
            name: ''
        };
    }

    onRowEditInit(rowTable: any) {
        console.log(rowTable);
        this.isOpenDialog = this.isEdit = true;
        this.addSuppForm.setValue({
            spno: rowTable.spno,
            inputCode: rowTable.sp_cd,
            inputName: rowTable.sp_nm,
            inputDescription: rowTable.re_mark
        });
    }

    codeList!: any[];

    invalidCode = false;
    onChangeCode() {
        if (this.codeList.includes(this.addSuppForm.value.inputCode)) {
            this.invalidCode = true;
        } else {
            if (this.invalidCode) this.invalidCode = false;
        }
    }

    initialValue!: any;
    @ViewChild('dt1') dt1!: Table;
    isSorted: boolean | null = null;
    isOpenDialog: boolean = false;
    isEdit: boolean = false;
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
            this.dt1.reset();
        }
    }

    createSupp() {
        if (this.addSuppForm.valid) {
            if (this.addSuppForm.value.inputName === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Name !', life: 3000 });
                return;
            }
            const paramAdd = {
                code: this.addSuppForm.value.inputCode,
                name: this.addSuppForm.value.inputName,
                email: this.addSuppForm.value.inputEmail,
                address: this.addSuppForm.value.inputAddress,
                phone: this.addSuppForm.value.inputPhoneNumber,
                website: this.addSuppForm.value.inputWebsite,
                description: this.addSuppForm.value.inputDescription
            };
            this.sv.insertSupplierInfo(paramAdd).subscribe(
                (response) => {
                    if (response !== null && response !== undefined) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier Information created successfully', key: 'tl', life: 3000 });
                        this.loadDataTableCustom({}, this.param);
                        this.addSuppForm.reset();
                        this.isOpenDialog = false;
                    }
                },
                (error) => {
                    console.error('Error creating Supplier Information:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Supplier Information', key: 'tl', life: 3000 });
                }
            );
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter Title Line !', key: 'tl', life: 3000 });
        }
    }

    updateSupp() {
        const paramAdd = {
            spno: this.addSuppForm.value.spno ? this.addSuppForm.value.spno : '',
            code: this.addSuppForm.value.inputCode ? this.addSuppForm.value.inputCode : '',
            name: this.addSuppForm.value.inputName ? this.addSuppForm.value.inputName : '',
            email: this.addSuppForm.value.inputEmail ? this.addSuppForm.value.inputEmail : '',
            address: this.addSuppForm.value.inputAddress ? this.addSuppForm.value.inputAddress : '',
            phone: this.addSuppForm.value.inputPhoneNumber ? this.addSuppForm.value.inputPhoneNumber : '',
            website: this.addSuppForm.value.inputWebsite ? this.addSuppForm.value.inputWebsite : '',
            description: this.addSuppForm.value.inputDescription ? this.addSuppForm.value.inputDescription : ''
        };
        this.sv.updateSupplierInfo(paramAdd).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier Information created successfully', key: 'tl', life: 3000 });
                    this.loadDataTableCustom({}, this.param);
                    this.addSuppForm.reset();
                    this.isOpenDialog = false;
                }
            },
            (error) => {
                console.error('Error creating Supplier Information:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Supplier Information', key: 'tl', life: 3000 });
            }
        );
    }

    onRowCreateInit() {
        this.isOpenDialog = true;
        this.isEdit = false;
        this.addSuppForm.reset();
    }

    onDelete(mfno: number) {
        this.sv.deleteSupplierInfo(mfno).subscribe(
            () => {
                this.loadDataTableCustom({}, this.param);
            },
            (error) => {
                console.error('Error fetching supplier information:', error);
            }
        );
    }

    confirmDelete(event: Event, rowTable: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Do you want to delete this record? Code: ${rowTable.sp_cd}, Name: ${rowTable.sp_nm}`,
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
                this.onDelete(rowTable.spno);
            },
            reject: () => {
                this.messageService.add({ severity: 'secondary', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }
}
