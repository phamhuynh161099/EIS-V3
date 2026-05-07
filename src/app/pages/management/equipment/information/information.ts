import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { ConfirmationService, MessageService, SelectItem, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule, TableRowSelectEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { LanguageType } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { EquipmentService } from '../equipment.service';
import { DialogCreateInformationComponent } from './dialog_create_information';
import { Dialog } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { OrderList } from 'primeng/orderlist';
import { Textarea } from 'primeng/textarea';

// import { CookieService } from 'ngx-cookie-service';

export type SearchOptionValue = 'mt_cd' | 'mt_nm' | 'factory_nm' | 'md_cd';
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
    selector: 'app-empty',
    imports: [
        FormsModule,
        ProgressSpinnerModule,
        DialogCreateInformationComponent,
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
        DatePicker,
        Dialog,
        ConfirmPopupModule,
        Textarea
    ],
    providers: [EquipmentService, MessageService, ConfirmationService],
    standalone: true,
    templateUrl: './information.html',
    styleUrls: ['./information.scss']
})
export class Information implements OnInit {
    [x: string]: any;
    dataTable: any[] = [];
    dataFull: any[] = [];
    listMtCd: string[] = [];
    selectedRows: any = [];
    selectedUpdateRows: any = [];
    clonedTables: { [s: string]: {} } = {};

    corpFac!: SelectItem[];
    corpFilterValue: string | null = null;
    corpTableFac!: SelectItem[];
    corpTableFilterValue: string | null = null;
    parent!: SelectItem[];
    parentFilterValue: string | null = null;
    parentTable!: SelectItem[];
    parentTableFilterValue: string | null = null;
    status!: SelectItem[];
    statusFilterValue: string | null = null;
    statusTable!: SelectItem[];
    statusTableFilterValue: string | null = null;
    storage!: SelectItem[];
    models!: SelectItem[];
    storageFilterValue: string | null = null;
    storageTable!: SelectItem[];
    materialFilterValue: string = '';
    modelFilterValue!: string;
    createDateFilterValue!: Date[] | undefined;
    statusDateFilterValue!: Date[] | undefined;
    param: any = {
        corp: '',
        material: '',
        model: '',
        statusDate: '',
        status: '',
        parent: '',
        storage: '',
        createDate: '',
        materialCodes: []
    };

    loading: boolean = true;
    loading_full: boolean = true;
    activityValues: number[] = [0, 100];
    searchValue: string | undefined;
    event: any;
    reg_date_input: string = ''; // Default to today's date in YYYY-MM-DD format
    datetime24h: Date[] | undefined;
    exportColumns!: ExportColumn[];
    cols!: Column[];
    cookieValue!: any;
    isVisible: boolean = true;
    // dialog
    informationCreateDialog: boolean = false;
    submitted: boolean = false;
    //  config lazyLoad for tbale
    first = 0;
    rows = 15;
    totalRecords: number = 0;
    // totalRecordsAll: number = 0;
    isSorted: boolean | null = null;
    initialValue: any[] = [];

    @ViewChild('dtInformation') dataTableComponent!: Table;
    @ViewChild('equipmentUpdTable') equipmentUpdTable!: Table;
    @Input() filteredValue: any[] = [];
    valLanguage: any;
    optionLanguage: LanguageType = 'LANG_EN';

    setup(value: any, id: any) {
        if (value != null) {
            const filter = this.dataTableComponent.filters[id];
            if (Array.isArray(filter)) {
                filter[0].value = value;
            } else if (filter) {
                filter.value = value;
            }
        }
        this.reg_date_input = value;
    }

    pageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }

    constructor(
        private sv: EquipmentService,
        private messageService: MessageService,
        public global_sv: GlobalsService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef
    ) {
        // You can call any service method here if needed
        // For example, this.equipmentService.getEquipmentList();
        this.optionLanguage = this.global_sv.getLangue();
    }

    clearSearch() {
        this.materialFilterValue = '';
        this.materialCodesForSearching = '';
        this.corpFilterValue = null;
        this.statusFilterValue = null;
        this.storageFilterValue = null;
        this.createDateFilterValue = undefined;
        this.modelFilterValue = '';
        this.statusDateFilterValue = undefined;
        this.parentFilterValue = null;

        this.fetchData();
    }

    isValidDate(value: any): boolean {
        if (!value || value === '' || value === 'null' || value === null || value === undefined) {
            return false;
        }

        // Kiểm tra format lỗi (có -- hoặc kết thúc bằng -)
        const strValue = String(value);
        if (strValue.includes('--') || strValue.endsWith('-')) {
            return false;
        }

        // Thử parse date
        const date = new Date(value);
        return !isNaN(date.getTime());
    }

    isOpenUpdateDialog = false;

    safeFormatDate(value: any, format: string = 'yyyy/MM/dd HH:mm:ss'): string {
        if (!this.isValidDate(value)) {
            return '-';
        }

        try {
            const date = new Date(value);
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(date, format) || '-';
        } catch (error) {
            console.warn('Invalid date format:', value);
            return '-';
        }
    }

    ngOnInit(): void {
        // Debounce filter 300ms cho update dialog
        this.filterSubject.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((keyword) => {
            this.equipmentUpdTable?.filterGlobal(keyword, 'contains');
        });

        // Debounce 500ms cho material search — sau khi ngừng gõ mới gọi API

        // this.materialSubject.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(() => {
        //     this.filterChooseSearch();
        // });

        this.valLanguage = this.global_sv.getValLanguage();
        if (this.valLanguage === null) {
            this.global_sv._valLanguage$.subscribe((data) => {
                this.valLanguage = data;
                if (this.valLanguage !== null) this.reloadPage();
            });
        } else {
            this.reloadPage();
        }
    }

    reloadPage() {
        // this.cols = [
        //     { field: 'corp_nm', header: 'Corp' },
        //     { field: 'prt_nm', header: 'Parent' },
        //     { field: 'as_no', header: 'Asset No' },
        //     { field: 'mt_cd', header: 'Material code' },
        //     { field: 'mt_nm', header: 'Material description' },
        //     { field: 'factory_nm', header: 'Storage Loca' },
        //     { field: 'to_lct_nm', header: 'Des. of Storage Loca' },
        //     { field: 'cost_dept_nm', header: 'Cost Center Name' },
        //     { field: 'unit', header: 'Unit' },
        //     { field: 'quantity', header: 'Quantity' },
        //     { field: 'puchs_dt_ymd', header: 'Buying Date' },
        //     { field: 'md_cd', header: 'Model' },
        //     { field: 'maker', header: 'Maker' },
        //     { field: 'from_lct_nm', header: 'Dep. of Storage Loca' },
        //     { field: 'lct_sts_nm', header: 'Location State' },
        //     { field: 'sts_nm', header: 'State' },
        //     { field: 're_mark', header: 'Re Mark' },
        //     { field: 'reason_nm', header: 'Reason' },
        //     { field: 'charge_nm', header: 'Requester' },
        //     { field: 'receive_nm', header: 'Receiver' },
        //     { field: 'output_dt_ymd', header: 'Output Date' },
        //     { field: 'input_dt_ymd', header: 'Input Date' },
        //     { field: 'input_yn', header: 'Activity' },
        //     { field: 'reg_nm', header: 'Verified' },
        //     { field: 'reg_dt_ymd', header: 'Date' },
        //     { field: 'chg_nm', header: 'Balance' },
        //     { field: 'chg_dt_ymd', header: 'Status' }
        // ];
        this.loadListFilter();

        this.sv.selectColEquipmentInfo().subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    // console.log('colTable', response.rows);
                    this.cols = response.rows
                        .filter(
                            (item: any) =>
                                item.dt_cd !== '' &&
                                item.dt_cd !== 'emno' &&
                                item.dt_cd !== 'intf_seq' &&
                                item.dt_cd !== 'corp' &&
                                item.dt_cd !== 'to_lct_nm' &&
                                item.dt_cd !== 'unit' &&
                                item.dt_cd !== 'maker' &&
                                item.dt_cd !== 'from_lct_nm' &&
                                item.dt_cd !== 'quantity' &&
                                item.dt_cd !== 'charge_nm' &&
                                item.dt_cd !== 'receive_nm' &&
                                item.dt_cd !== 'output_dt_ymd' &&
                                item.dt_cd !== 'input_dt_ymd'
                        )
                        .map((item: any) => ({ field: item.dt_cd, header: this.getTitleNameGridHeader(item.dt_cd) })); //item.dt_nm
                    console.log(this.cols);

                    this.fetchData();
                    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
                    this.loadTableStart_50(this.param);
                }
            },
            (error) => {
                console.error('Error selectColEquipmentInfo:', error);
            }
        );

        // this.loading = false;
        // Register custom filter for date
        // this.filterService.register('custom-equals', (value:any, filter:any): boolean => {
        //     if (filter === undefined || filter === null || filter.trim() === '') {
        //         return true;
        //     }
        //     if (value === undefined || value === null) {
        //         return false;
        //     }
        //     return value.toString().toLowerCase().includes(filter.toString().toLowerCase());
        // });
    }

    getTitleNameGridHeader(code: string): string {
        let result: string = '';

        switch (code) {
            case 'corp_nm':
                result = this.valLanguage.grid_Corp[this.optionLanguage];
                break;
            case 'prt_nm':
                result = this.valLanguage.grid_Parent[this.optionLanguage];
                break;
            case 'as_no':
                result = this.valLanguage.grid_Asset_No[this.optionLanguage];
                break;
            case 'mt_cd':
                result = this.valLanguage.grid_Material_Code[this.optionLanguage];
                break;
            case 'mt_nm':
                result = this.valLanguage.grid_Material_Des[this.optionLanguage];
                break;
            case 'factory_nm':
                result = this.valLanguage.grid_Storage_Loca[this.optionLanguage];
                break;
            case 'cost_dept_nm':
                result = this.valLanguage.grid_Cost_Center_Name[this.optionLanguage];
                break;
            case 'puchs_dt_ymd':
                result = this.valLanguage.grid_Buying_Date[this.optionLanguage];
                break;
            case 'md_cd':
                result = this.valLanguage.grid_Model[this.optionLanguage];
                break;
            case 'lct_sts_nm':
                result = this.valLanguage.grid_Location_State[this.optionLanguage];
                break;
            case 'sts_nm':
                result = this.valLanguage.grid_State[this.optionLanguage];
                break;
            case 're_mark':
                result = this.valLanguage.grid_Remark[this.optionLanguage];
                break;
            case 'reason_nm':
                result = this.valLanguage.grid_Reason[this.optionLanguage];
                break;
            case 'input_yn':
                result = this.valLanguage.grid_Input[this.optionLanguage];
                break;
            case 'reg_nm':
                result = this.valLanguage.grid_Create_Name[this.optionLanguage];
                break;
            case 'reg_dt_ymd':
                result = this.valLanguage.grid_Create_Date[this.optionLanguage];
                break;
            case 'chg_nm':
                result = this.valLanguage.grid_Reg_Name[this.optionLanguage];
                break;
            case 'chg_dt_ymd':
                result = this.valLanguage.grid_Change_Date[this.optionLanguage];
                break;
        }
        return result;
    }

    getCookie(name: any) {
        const match = document.cookie.match(new RegExp(`(^|;\\s*)` + name + `=([^;]*)`));
        return match ? match[2] : null;
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

    exportToExcel() {
        let data: any[] = [];
        if (this.dataTableComponent.filteredValue && Array.isArray(this.dataTableComponent.filteredValue)) {
            this.dataTableComponent.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    Corp: emp.corp_nm,
                    Parent: emp.prt_nm,
                    'Material code': emp.mt_cd,
                    'Material description': emp.mt_nm,
                    State: emp.sts_nm,
                    'Re Mark': emp.re_mark,
                    Reason: emp.reason_nm,
                    'Storage Loca': emp.factory_nm,
                    Model: emp.md_cd,
                    'Asset No': emp.as_no,
                    'Des. of Storage Loca': emp.to_lct_nm,
                    'Cost Center Name': emp.cost_dept_nm,
                    Unit: emp.unit,
                    Quantity: emp.quantity,
                    'Create Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Buying Date': emp.puchs_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.puchs_dt_ymd) : emp.puchs_dt_ymd,
                    Maker: emp.maker,
                    'Dep. of Storage Loca': emp.from_lct_nm,
                    'Location State': emp.lct_sts_nm,
                    Requester: emp.charge_nm,
                    Receiver: emp.receive_nm,
                    'Output Date': emp.output_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.output_dt_ymd) : emp.output_dt_ymd,
                    'Input Date': emp.input_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.input_dt_ymd) : emp.input_dt_ymd,
                    Activity: emp.input_yn,
                    Verified: emp.reg_nm,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        } else {
            this.dataTable.forEach((emp: any) => {
                const rowData: any = {
                    Corp: emp.corp_nm,
                    Parent: emp.prt_nm,
                    'Material code': emp.mt_cd,
                    'Material description': emp.mt_nm,
                    State: emp.sts_nm,
                    'Re Mark': emp.re_mark,
                    Reason: emp.reason_nm,
                    'Storage Loca': emp.factory_nm,
                    Model: emp.md_cd,
                    'Asset No': emp.as_no,
                    'Des. of Storage Loca': emp.to_lct_nm,
                    'Cost Center Name': emp.cost_dept_nm,
                    Unit: emp.unit,
                    Quantity: emp.quantity,
                    'Create Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Buying Date': emp.puchs_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.puchs_dt_ymd) : emp.puchs_dt_ymd,
                    Maker: emp.maker,
                    'Dep. of Storage Loca': emp.from_lct_nm,
                    'Location State': emp.lct_sts_nm,
                    Requester: emp.charge_nm,
                    Receiver: emp.receive_nm,
                    'Output Date': emp.output_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.output_dt_ymd) : emp.output_dt_ymd,
                    'Input Date': emp.input_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.input_dt_ymd) : emp.input_dt_ymd,
                    Activity: emp.input_yn,
                    Verified: emp.reg_nm,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'Equipment Status Report', 'data');
        }
    }

    excelData: any;
    importExcelFile(event: any) {
        if (event.target.files) {
            this.loading = this.loading_full = true;
            let file = event.target.files[0];
            let fileReader = new FileReader();
            fileReader.readAsBinaryString(file);

            fileReader.onloadend = () => {
                const workBook = XLSX.read(fileReader.result, { type: 'binary' });
                const sheetNames = workBook.SheetNames;
                this.excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
                const importData: any[] = [];
                this.excelData.forEach((emp: any) => {
                    importData.push({
                        corp_nm: emp['Corp'],
                        lct_nm: emp['Storage'],
                        mf_cd: emp['Manufacture'],
                        md_cd: emp['Model'],
                        mt_cd: emp['Material'],
                        mt_nm: emp['Material Name'],
                        cost_dept_nm: emp['Cost Dept'],
                        lct_sts_nm: emp['Storage Status'],
                        sp_nm: emp['Supplier'],
                        mgm_dept_nm: emp['Management Dept'],
                        as_no: emp['Asset Number'],
                        as_sno: emp['Asset Serial'],
                        srl_no: emp['Serial Number'],
                        re_mark: emp['Re Mark'],
                        dev_start_dt: this.global_sv.formatDateSave(new Date(emp['Start Date'])),
                        puchs_dt: this.global_sv.formatDateSave(new Date(emp['Purchased Date'])),
                        vailed_dt: this.global_sv.formatDateSave(new Date(emp['Valid Date']))
                    });
                });

                this.sv.importExcel({ equipments: importData }).subscribe(
                    () => this.fetchData(),
                    (error) => (this.loading = this.loading_full = false)
                );
                this.loading = this.loading_full = false;
            };
        }
    }

    ShowFilter() {
        this.isVisible = !this.isVisible;
    }

    loadTableStart_50(param: any): void {
        this.loading = true;
        this.sv.selectEquipmentInfo_50(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.totalRecords = response.records;
                    let dtTableRes = response.rows;
                    this.loading = false;
                    this.dataTable = dtTableRes.map((ele: any) => {
                        let ele_r: any = ele;
                        if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                            ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                        }
                        if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                            ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                        }
                        if (ele_r.output_dt_ymd !== null || ele_r.output_dt_ymd === undefined) {
                            ele_r.output_dt_ymd = new Date(<Date>ele.output_dt_ymd);
                        }
                        if (ele_r.input_dt_ymd !== null || ele_r.input_dt_ymd === undefined) {
                            ele_r.input_dt_ymd = new Date(<Date>ele.input_dt_ymd);
                        }
                        if (ele_r.chg_dt_ymd !== null || ele_r.output_dt_ymd === undefined) {
                            ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                        }
                        ele_r = {
                            ...ele_r,
                            parent_name: {
                                label: ele_r.prt_nm
                            },
                            state_name: {
                                label: ele_r.sts_nm
                            },
                            factory_name: {
                                label: ele_r.factory_nm
                            },
                            corn_name: {
                                label: ele_r.corp_nm
                            },
                            des_storage: {
                                label: ele_r.to_lct_nm
                            }
                        };
                        return ele_r;
                    });

                    this.cdr.detectChanges();
                    this.initialValue = [...this.dataTable];
                }
            },
            (error) => {
                this.cdr.detectChanges();
                this.loading = false;
                console.error('Error fetching equipment information:', error);
            }
        );
    }

    fetchData() {
        this.loading = true;
        this.loading_full = true;
        // this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Calling data from back end, lots of data, please wait a few seconds.', life: 3000 });
        this.sv.selectEquipmentInfo(this.materialCodesForSearching.split('\n')).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.totalRecords = response.records;
                    this.dataFull = response.rows;
                    this.listMtCd = response.rows.map((t: any) => t.mt_cd);

                    console.log(response.rows);
                    let dtTableRes = response.rows;
                    this.dataTable = dtTableRes.map((ele: any) => {
                        let ele_r: any = ele;
                        if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                            ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                        }
                        if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                            ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                        }
                        if (ele_r.output_dt_ymd !== null || ele_r.output_dt_ymd === undefined) {
                            ele_r.output_dt_ymd = new Date(<Date>ele.output_dt_ymd);
                        }
                        if (ele_r.input_dt_ymd !== null || ele_r.input_dt_ymd === undefined) {
                            ele_r.input_dt_ymd = new Date(<Date>ele.input_dt_ymd);
                        }
                        if (ele_r.chg_dt_ymd !== null || ele_r.output_dt_ymd === undefined) {
                            ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                        }
                        ele_r = {
                            ...ele_r,
                            parent_name: {
                                label: ele_r.prt_nm
                            },
                            state_name: {
                                label: ele_r.sts_nm
                            },
                            factory_name: {
                                label: ele_r.factory_nm
                            },
                            corn_name: {
                                label: ele_r.corp_nm
                            },
                            des_storage: {
                                label: ele_r.to_lct_nm
                            }
                        };
                        return ele_r;
                    });

                    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Fetching ${this.dataFull.length} equipment${this.dataFull.length > 1 && 's'}`, life: 3000 });

                    this.initialValue = [...this.dataTable];
                    this.selectedRows = [];
                    // console.log(response.rows.map((e: any) => e.to_lct_nm));

                    this.loading = false;
                    this.loading_full = false;
                    this.cdr.detectChanges();
                    this.initialValue = [...this.dataTable];
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
    }

    changeHideDialog(isDialog: boolean) {
        this.informationCreateDialog = isDialog;
    }

    CreateRow() {
        // this.product = {};
        this.submitted = false;
        this.informationCreateDialog = true;
        // this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Create row generation feature is not implemented yet.', life: 3000 });
    }

    clear(table: Table) {
        table.clear();
        this.dataTable = [...this.initialValue];
        this.searchValue = '';
        this.parentFilterValue = null;
        this.corpFilterValue = null;
        this.materialFilterValue = '';
        this.modelFilterValue = '';
        this.statusFilterValue = null;
        this.storageFilterValue = null;
        this.createDateFilterValue = undefined;
        this.statusDateFilterValue = undefined;
    }

    onGlobalFilter(event: Event, table: Table) {
        const input = event.target as HTMLInputElement;
        table.filterGlobal(input.value, 'contains');
    }

    statusUpdateMultiple: undefined | string = undefined;
    remarkUpdateMultiple: string = '';
    storageUpdateMultiple: undefined | string = undefined;
    onRowUpdateSave() {
        if (!this.statusUpdateMultiple && !this.storageUpdateMultiple) {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select Status or Storage for updating multiple data', life: 3000 });
            return;
        }

        let lsMtCd = this.selectedRows.map((ele: any) => ele.mt_cd);

        const param = {
            ds_data: lsMtCd.map((materialCode: any) => ({
                factory: this.storageUpdateMultiple ?? '',
                sts_cd: this.statusUpdateMultiple ?? '',
                re_mark: this.remarkUpdateMultiple ?? '',
                mt_cd: materialCode
            })),
            factory: this.storageUpdateMultiple ?? '',
            lstMtcd: lsMtCd
        };

        this.sv.saveQRScannerMulti(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    if (response.indexOf('errors') === -1) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Equipment update successfully', life: 3000 });
                        this.clear(this.dataTableComponent);
                        this.fetchData();
                        this.isOpenUpdateDialog = false;
                        this.statusUpdateMultiple = this.storageUpdateMultiple = undefined;
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Equipment', life: 3000 });
                    }
                }
            },
            (error) => {
                console.error('Error update:', error);
            }
        );
    }
    onRowDeleteSave() {
        let lstEmno = this.selectedRows.map((ele: any) => ele.emno);

        this.sv.deleteMultipleEquipments(lstEmno).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    if (response.indexOf('errors') === -1) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Equipment deleted successfully', life: 3000 });
                        this.fetchData();
                        this.isOpenUpdateDialog = false;
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Equipment', life: 3000 });
                    }
                }
            },
            (error) => {
                console.error('Error delete:', error);
            }
        );
    }

    confirmDelete(event: Event) {
        this.confirmationService.confirm({
            target: event.currentTarget as EventTarget,
            message: this.valLanguage.doYouWantToDelete[this.optionLanguage] + ' ' + this.selectedRows.length + (this.selectedRows.length > 1 ? ' equipments ?' : ' equipment ?'),
            icon: 'pi pi-info-circle',
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
                this.onRowDeleteSave();
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }

    loadListFilter(): void {
        forkJoin({
            parent: this.global_sv.getParent(),
            corp: this.global_sv.getCorp(),
            status: this.global_sv.getStatus(),
            storage: this.global_sv.getStorage(''),
            model: this.global_sv.getModel()
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
                if (responses.corp !== null && responses.corp !== undefined) {
                    this.corpFac = responses.corp.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    this.corpTableFac = responses.corp.map((item: any) => ({ label: item.comm_nm }));
                }
                if (responses.status !== null && responses.status !== undefined) {
                    this.status = responses.status.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    this.statusTable = responses.status.map((item: any) => ({ label: item.comm_nm }));
                }
                if (responses.storage !== null && responses.storage !== undefined) {
                    this.storage = responses.storage.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    this.storageTable = responses.storage.map((item: any) => ({ label: item.comm_nm }));
                }
            },
            (error) => {
                console.error('Error loading filter lists:', error);
            }
        );
    }

    handleChangeCorp(event: any): void {
        this.global_sv.getStorage(event.value).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.storage = response.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                }
            },
            (error) => {
                console.error('Error handleChangeCorp:', error);
            }
        );
    }

    filterChooseSearch(): void {
        let createDate = '';
        let createEndDate = '';
        let statusDate = '';
        let statusEndDate = '';
        if (this.statusDateFilterValue !== null && this.statusDateFilterValue !== undefined) {
            statusDate = this.global_sv.formatDateFilter(new Date(<Date>this.statusDateFilterValue[0]));
            statusEndDate = this.global_sv.formatDateFilter(new Date(<Date>this.statusDateFilterValue[1]));
        }
        if (this.createDateFilterValue !== null && this.createDateFilterValue !== undefined) {
            createDate = this.global_sv.formatDateFilter(new Date(<Date>this.createDateFilterValue[0]));
            createEndDate = this.global_sv.formatDateFilter(new Date(<Date>this.createDateFilterValue[1]));
        }

        this.param = {
            corp: this.corpFilterValue !== null && this.corpFilterValue !== undefined ? this.corpFilterValue : '',
            material: this.materialFilterValue !== null && this.materialFilterValue !== undefined ? this.materialFilterValue : '',
            model: this.modelFilterValue !== null && this.modelFilterValue !== undefined ? this.modelFilterValue : '',
            statusDate: statusDate,
            statusEndDate: statusEndDate,
            status: this.statusFilterValue !== null && this.statusFilterValue !== undefined ? this.statusFilterValue : '',
            parent: this.parentFilterValue !== null && this.parentFilterValue !== undefined ? this.parentFilterValue : '',
            storage: this.storageFilterValue !== null && this.storageFilterValue !== undefined ? this.storageFilterValue : '',
            createDate: createDate,
            createEndDate: createEndDate
        };

        let event: any = {
            first: 1, //this.first,
            rows: this.rows,
            last: '',
            rowsPerPage: '',
            filters: {}
        };
        this.param.materialCodes = this.materialCodesForSearching.split('\n');
        this.loadData(event, this.param);
    }

    loadData(event: any, param: any) {
        // Ensure event.rows is never null event.first, event.rows, event.sortField, event.sortOrder, event.filters
        this.loading = true;
        this.sv.selectEquipmentInfoFilter(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    let dtTableRes = response.rows;
                    this.loading = false;
                    this.dataTable = dtTableRes.map((ele: any) => {
                        let ele_r: any = ele;
                        if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                            ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                        }
                        if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                            ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                        }
                        if (ele_r.output_dt_ymd !== null || ele_r.output_dt_ymd === undefined) {
                            ele_r.output_dt_ymd = new Date(<Date>ele.output_dt_ymd);
                        }
                        if (ele_r.input_dt_ymd !== null || ele_r.input_dt_ymd === undefined) {
                            ele_r.input_dt_ymd = new Date(<Date>ele.input_dt_ymd);
                        }
                        if (ele_r.chg_dt_ymd !== null || ele_r.output_dt_ymd === undefined) {
                            ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                        }
                        ele_r = {
                            ...ele_r,
                            parent_name: {
                                label: ele_r.prt_nm
                            },
                            state_name: {
                                label: ele_r.sts_nm
                            },
                            factory_name: {
                                label: ele_r.factory_nm
                            },
                            corn_name: {
                                label: ele_r.corp_nm
                            },
                            des_storage: {
                                label: ele_r.to_lct_nm
                            }
                        };
                        return ele_r;
                    });

                    this.initialValue = [...this.dataTable];
                    this.selectedRows = [];
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
    }

    getSeverity(status: string) {
        switch (status.toLowerCase()) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
            default:
                return null;
        }
    }

    removeSelectedRow(emno: any) {
        this.selectedRows = this.selectedRows.filter((elem: any) => elem.emno !== emno);
        this.selectedUpdateRows = this.selectedUpdateRows.filter((elem: any) => elem.emno !== emno);

        this.equipmentUpdTable.filterGlobal(this.updateDialogMtCodeFilter ?? '', 'contains');
    }

    onFilterChange(keyword: string) {
        this.filterSubject.next(keyword ?? '');
    }

    // Cleanup tránh memory leak
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onOpenUpdateDialog() {
        this.isOpenUpdateDialog = true;
        this.updateDialogMtCodeFilter = '';
        this.selectedUpdateRows = [...this.selectedRows];
        // Reset filter khi mở dialog
        this.filterSubject.next('');
    }

    updateDialogMtCodeFilter: string = '';
    private filterSubject = new Subject<string>();
    private destroy$ = new Subject<void>();
    isOpenImportListMaterialCodeForSearchingDialog: boolean = false;

    onMaterialFilterInput(value: string): void {
        this.materialFilterValue = value;
    }

    materialCodesForSearching: string = '';

    searchingOptions: { label: string; value: SearchOptionValue }[] = [
        { label: 'Material Code', value: 'mt_cd' },
        { label: 'Material Name', value: 'mt_nm' },
        { label: 'Storage', value: 'factory_nm' },
        { label: 'Model Code', value: 'md_cd' }
    ];
    searchingType: 'mt_cd' = 'mt_cd';

    onClearSearchByMaterialCodes() {
        this.materialCodesForSearching = '';
        this.selectedRows = [];
        this.fetchData();
    }

    onSelectSearchByType() {
        const selectedList = this.materialCodesForSearching.split('\n');
        this.selectedRows = this.dataTable.filter((elem) => selectedList.includes(elem[this.searchingType]));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Selected ${this.selectedRows.length} equipment${this.selectedRows.length > 1 && 's'}`, life: 3000 });
    }

    onSaveSearchByMaterialCodes() {
        this.fetchData();
    }
}
