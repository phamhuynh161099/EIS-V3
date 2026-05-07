import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';

import { ConfirmationService, MessageService, SelectItem, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
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

import { LanguageType } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { SystemService } from '../system.service';

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
    selector: 'app-tpm-schedule-detail',
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
    templateUrl: './tpm_schedule_detail.html',
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
            .table_minheight {
                .p-datatable-table-container {
                    min-height: 30rem;
                }
            }
        }
    `
})
export class TPMScheduleDetail implements OnInit, OnDestroy {
    @Input() selectedSchedule!: any;
    private refreshSubscription?: Subscription;
    dataTable: any[] = [];
    clonedTables: { [s: string]: {} } = {};
    loading: boolean = true;
    loading_full: boolean = true;
    activityValues: number[] = [0, 100];
    searchValue: string | undefined;
    event: any;
    tpmItem!: SelectItem[];
    tpmItemTable!: SelectItem[];
    tpmItemFilterValue: string | null = null;
    use!: SelectItem[];
    useTable!: SelectItem[];
    useFilterValue: string | null = null;

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
    addFunctionForm!: FormGroup;
    param: any = {
        tc_cd: '',
        rows: 0
    };
    totalSize: number = 0;
    totalSizePercent: number = 0;
    invalidCode = false;
    initialValue!: any;
    @ViewChild('dtTB') dtTB!: Table;
    isSorted: boolean | null = null;
    @Input() filteredValue: any[] = [];

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
        private config: PrimeNG,
        private confirmationService: ConfirmationService
    ) {
        this.addFunctionForm = this.fb.group({
            inputScheduleCode: [null, [ValidateNotNull]],
            inputTPMItem: [null, [ValidateNotNull]],
            inputUse: [null, [ValidateNotNull]],
            inputOrder: [null, [ValidateNotNull]],
            inputExplain: [null, [ValidateNotNull]]
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
        this.loadListFilter();
        this.loadDataTableCustom({}, this.param);
        this.cols = [
            { field: 'tcno', header: this.valLanguage.grid_Schedule_No[this.optionLanguage], type: 'Text' },
            { field: 'tc_cd', header: this.valLanguage.grid_Schedule_Code[this.optionLanguage], type: 'Text' },
            { field: 'tc_nm', header: this.valLanguage.grid_Schedule_Name[this.optionLanguage], type: 'Text' },
            { field: 'td_nm', header: this.valLanguage.grid_TPM_Item[this.optionLanguage], type: 'Text' },
            { field: 'order_no', header: this.valLanguage.grid_Order_No[this.optionLanguage], type: 'Text' },
            { field: 'use_yn', header: this.valLanguage.grid_UseYN[this.optionLanguage], type: 'Text' },
            { field: 're_mark', header: this.valLanguage.grid_Explain[this.optionLanguage], type: 'Text' },
            { field: 'reg_nm', header: this.valLanguage.grid_Reg_Name[this.optionLanguage], type: 'Text' },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Reg_Date[this.optionLanguage], type: 'Date' },
            { field: 'chg_nm', header: this.valLanguage.grid_Update_Name[this.optionLanguage], type: 'Text' },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Storage_Loca[this.optionLanguage], type: 'Date' }
        ];
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    ngOnDestroy(): void {
        // Cleanup subscription để tránh memory leak
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    loadListFilter(): void {
        this.use = this.useTable = [
            { label: 'Use', value: 'Y' },
            { label: 'UnUse', value: 'N' }
        ];
        forkJoin({
            tpmItem: this.global_sv.getTPMItem()
        }).subscribe(
            (responses) => {
                if (responses.tpmItem !== null && responses.tpmItem !== undefined) {
                    this.tpmItem = responses.tpmItem
                        .filter((item: any) => item.comm_nm !== '')
                        .map((item: any) => ({
                            label: item.comm_nm,
                            value: item.comm_cd
                        }));

                    this.tpmItemTable = responses.tpmItem.map((item: any) => ({
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
                    Tcno: emp.tcno,
                    'Schedule Code': emp.tc_nm,
                    'Schedule Name': emp.td_nm,
                    'TPM Item': emp.dt_vn,
                    'Order No': emp.order_no,
                    'Use Y/N': emp.use_yn,
                    Explain: emp.re_mark,
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
                    Tcno: emp.tcno,
                    'Schedule Code': emp.tc_nm,
                    'Schedule Name': emp.td_nm,
                    'TPM Item': emp.dt_vn,
                    'Order No': emp.order_no,
                    'Use Y/N': emp.use_yn,
                    Explain: emp.re_mark,
                    'Reg Name': emp.reg_nm,
                    'Reg Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Update Name': emp.chg_nm,
                    'Update Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'TPM Schedule Master', 'data');
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
        // this.param.tc_cd = this.selectedSchedule === undefined ? '' : this.selectedSchedule.tc_cd;
        this.addFunctionForm.setValue({ inputScheduleCode: param.tc_cd, inputTPMItem: null, inputUse: null, inputOrder: null, inputExplain: null });
        this.sv.getScheduleDetail(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.totalRecords = response.records;
                    param.rows = this.totalRecords;
                    this.param.rows = this.totalRecords;
                    this.sv.getScheduleDetail(param).subscribe(
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
                                        tpmItem_name: {
                                            label: ele_r.td_nm
                                        },
                                        use_name: {
                                            label: ele_r.use_yn
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

    loadDataTableReset(event: any, param: any) {
        this.loading = true;
        // this.param.tc_cd = this.selectedSchedule === undefined ? '' : this.selectedSchedule.tc_cd;
        this.addFunctionForm.setValue({ inputScheduleCode: param.tc_cd, inputTPMItem: null, inputUse: null, inputOrder: null, inputExplain: null });
        this.sv.getScheduleDetail(param).subscribe(
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
                            tpmItem_name: {
                                label: ele_r.val1_nm
                            },
                            use_name: {
                                label: ele_r.val2_nm
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

    filterChooseSearch(): void {
        this.param = {
            tc_cd: this.selectedSchedule === undefined ? '' : this.selectedSchedule.tc_cd,
            rows: this.totalRecords
        };

        let event: any = {
            first: 1, //this.first,
            rows: this.rows,
            last: '',
            rowsPerPage: '',
            filters: {}
        };
        this.sv.getFunctionSearchCategory(this.param).subscribe(
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
                            tpmItem_name: {
                                label: ele_r.val1_nm
                            },
                            use_name: {
                                label: ele_r.val2_nm
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
        this.addFunctionForm.reset();
        this.param = {
            rows: 0
        };
    }

    onGlobalFilter(event: Event, table: Table) {
        const input = event.target as HTMLInputElement;
        table.filterGlobal(input.value, 'contains');
    }

    selectedRow: number | undefined = undefined;
    onRowClick(i: number): void {
        this.selectedRow = i;
    }

    onRowEditInit(rowTable: any) {
        this.clonedTables[rowTable.mfno as string] = { ...rowTable };

        // this.parent.forEach((ele: any) => {
        //     if (ele.label === rowTable.val1_nm) {
        //         parentCode = ele.value;
        //     }
        // });
        // this.global_sv.getType(parentCode).subscribe(
        //     (response) => {
        //         if (response !== null && response !== undefined) {
        //             this.typeEdit = response.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
        //         }
        //     },
        //     (error) => {
        //         console.error('Error handleChangeParent:', error);
        //     }
        // );

        // this.groupTable.forEach((ele: any) => {
        //     if (ele.label === rowTable.val2_nm) {
        //         typeCode = ele.value;
        //     }
        // });
        // this.global_sv.getGroup(parentCode).subscribe(
        //     (response) => {
        //         if (response !== null && response !== undefined) {
        //             this.groupEdit = response.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
        //         }
        //     },
        //     (error) => {
        //         console.error('Error handleChangeParent:', error);
        //     }
        // );
    }

    onRowEditSave(rowTable: any) {
        delete this.clonedTables[rowTable.mfno as string];

        this.updateFunction(rowTable);
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

    createFunction(form: FormGroup) {
        if (form.valid) {
            if (form.value.inputTPMItem === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter TPM Item !', life: 3000 });
                return;
            }
            if (form.value.inputUse === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter User !', life: 3000 });
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
                tcno: 1,
                tc_cd: form.value.inputScheduleCode !== null ? form.value.inputScheduleCode : false,
                td_cd: form.value.inputTPMItem,
                use_yn: form.value.inputUse,
                order_no: form.value.inputOrder,
                re_mark: form.value.inputExplain
            };

            this.param.tc_cd = paramAdd.tc_cd;
            this.param.rows++;
            this.sv.insertScheduleDetail(paramAdd).subscribe(
                (response) => {
                    if (response !== null && response !== undefined) {
                        if (response.indexOf('error') >= 0 || response.indexOf('Error') >= 0) {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Parent Category', life: 3000 });
                        } else {
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Parent Category created successfully', life: 3000 });
                            this.loadDataTableReset({}, this.param);
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

    updateFunction(rowTable: any) {
        let itemCode = '';
        this.tpmItem.forEach((ele: any) => {
            if (ele.label === rowTable.td_nm) {
                itemCode = ele.value;
            }
        });

        const paramAdd = {
            tdno: rowTable.tdno,
            tc_cd: rowTable.tc_cd ? rowTable.tc_cd : '',
            td_cd: itemCode,
            use_yn: rowTable.use_yn ? rowTable.use_yn : '',
            order_no: rowTable.order_no ? rowTable.order_no : '',
            re_mark: rowTable.re_mark ? rowTable.re_mark : ''
        };
        this.param.tc_cd = paramAdd.tc_cd;
        this.param.rows++;
        this.sv.updateScheduleDetail(paramAdd).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    if (response.indexOf('error') >= 0 || response.indexOf('Error') >= 0) {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to updated Function Category', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Function Category updated successfully', life: 3000 });
                        this.loadDataTableReset({}, this.param);
                    }
                }
            },
            (error) => {
                console.error('Error update Function Category:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to updated Function Category', life: 3000 });
            }
        );
    }

    delFunctionCate(rowTable: any) {
        const paramAdd = {
            mt_cd: rowTable.mt_cd ? rowTable.mt_cd : '',
            cdid: rowTable.cdid ? rowTable.cdid : ''
        };
        this.sv.delFunctionCate(paramAdd).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    if (response.indexOf('error') >= 0 || response.indexOf('Error') >= 0) {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete Function Category', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Function Category Delete successfully', life: 3000 });
                        this.loadDataTableCustom({}, this.param);
                    }
                }
            },
            (error) => {
                console.error('Error Delete Function Category:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete Function Category', life: 3000 });
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
                this.delFunctionCate(rowTable);
                // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
            },
            reject: () => {
                this.messageService.add({ severity: 'secondary', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }
}
