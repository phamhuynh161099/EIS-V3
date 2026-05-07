import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { EquipmentService } from '../equipment.service';

import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePicker } from 'primeng/datepicker';
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
        ConfirmDialog,
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
        DatePicker
    ],
    providers: [EquipmentService, MessageService, ConfirmationService],
    standalone: true,
    templateUrl: './sap_new_equipment.html',
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
            .card-sap,
            .card-ams {
                button {
                    width: 100%;
                    margin-bottom: 1rem;
                }
            }
            .btn-move {
                button {
                    width: 9rem;
                    margin-bottom: 1rem;
                }
            }
            table {
                th,
                td {
                    white-space: nowrap;
                }
            }
        }
    `
})
export class SAP_New_Equipment implements OnInit, OnDestroy {
    private refreshSubscription?: Subscription;

    dataTable: any[] = [];
    selectedTableSAP!: any[];
    dataTableSap: any[] = [];
    clonedTables: { [s: string]: {} } = {};
    // variables for filter
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
    sales!: SelectItem[];
    salesFilterValue: string | null = null;
    transfer!: SelectItem[];
    transferFilterValue: string | null = null;
    partialSales!: SelectItem[];
    partialSalesFilterValue: string | null = null;
    discard!: SelectItem[];
    discardFilterValue: string | null = null;

    materialFilterValue!: string;
    modelFilterValue!: string;
    createDateFilterValue!: Date[] | undefined;
    changeDateFilterValue!: Date[] | undefined;

    loading: boolean = true;
    loading_full: boolean = true;
    isVisible: boolean = true;
    loadingSAP: boolean = true;
    loading_fullSAP: boolean = true;
    isVisibleSAP: boolean = true;
    activityValues: number[] = [0, 100];
    searchValue: string | undefined;
    event: any;
    dateCreateLabelFilter: string = '';
    reg_date_input: string = ''; // Default to today's date in YYYY-MM-DD format
    datetime24h: Date[] | undefined;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    isVisibleCheckAll: boolean = false;
    //  config lazyLoad for tbale
    first = 0;
    rows = 10;
    totalRecords: number = 50;
    totalRecordsSAP: number = 50;
    isSortedAms: boolean | null = null;
    initialValueAms: any[] = [];
    isSortedSap: boolean | null = null;
    initialValueSap: any[] = [];
    @ViewChild('dtsap') dtTableSAP!: Table;
    @ViewChild('dtams') dtTableAMS!: Table;
    @Input() filteredValue: any[] = [];

    param: any = {
        corp: '',
        material: '',
        model: '',
        mt_cd_list: '',
        storage: '',
        status: '',
        parent: '',
        reg_from_date: '',
        reg_to_date: '',
        chg_from_date: '',
        chg_to_date: '',
        sale_yn: '',
        transfer_yn: '',
        psale_yn: '',
        discard_yn: '',
        rows: this.totalRecords
    };

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
            const filter = this.dtTableAMS.filters[id];
            if (Array.isArray(filter)) {
                filter[0].value = value;
            } else if (filter) {
                filter.value = value;
            }
        }
        this.reg_date_input = value;
    }

    constructor(
        public sv: EquipmentService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public global_sv: GlobalsService
    ) {
        this.optionLanguage = this.global_sv.getLangue();
    }
    valLanguage: any;
    optionLanguage: LanguageType = 'LANG_EN';
    ngOnInit(): void {
        this.valLanguage = this.global_sv.getValLanguage();

        if (this.valLanguage === null) {
            this.global_sv._valLanguage$.subscribe((data) => {
                this.valLanguage = data;

                this.reloadPage();
            });
        } else {
            this.reloadPage();
        }
    }

    reloadPage() {
        this.loadListFilter();
        this.sv.selectColSAP_AMS().subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.cols = response.rows
                        .filter((item: any) => item.dt_cd !== '' && item.dt_cd !== 'emno' && item.dt_cd !== 'intf_seq' && item.dt_cd !== 'corp')
                        .map((item: any) => ({ field: item.dt_cd, header: this.getTitleNameGridHeader(item.dt_cd) }));
                    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
                    this.param.rows = 50;
                    this.loadSAPTableStart_50(this.param);
                    this.loadTableStart_50(this.param);
                }
            },
            (error) => {
                console.error('Error handleChangeCorp:', error);
            }
        );
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
            case 'to_lct_nm':
                result = this.valLanguage.grid_Des_of_Storage_Loca[this.optionLanguage];
                break;
            case 'cost_dept_nm':
                result = this.valLanguage.grid_Cost_Center_Name[this.optionLanguage];
                break;
            case 'unit':
                result = this.valLanguage.grid_Unit[this.optionLanguage];
                break;
            case 'quantity':
                result = this.valLanguage.grid_Quantity[this.optionLanguage];
                break;
            case 'puchs_dt_ymd':
                result = this.valLanguage.grid_Buying_Date[this.optionLanguage];
                break;
            case 'md_cd':
                result = this.valLanguage.grid_Model[this.optionLanguage];
                break;
            case 'maker':
                result = this.valLanguage.grid_Maker[this.optionLanguage];
                break;
            case 'from_lct_nm':
                result = this.valLanguage.grid_Des_of_Storage_Loca[this.optionLanguage];
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
            case 'charge_nm':
                result = this.valLanguage.grid_Requester[this.optionLanguage];
                break;
            case 'receive_nm':
                result = this.valLanguage.grid_Receiver[this.optionLanguage];
                break;
            case 'output_dt_ymd':
                result = this.valLanguage.grid_Output_Date[this.optionLanguage];
                break;
            case 'input_dt_ymd':
                result = this.valLanguage.grid_Input_Date[this.optionLanguage];
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
            case 'fsale':
                result = this.valLanguage.grid_Sales[this.optionLanguage];
                break;
            case 'fpsale':
                result = this.valLanguage.grid_Partial_Sales[this.optionLanguage];
                break;
            case 'ftrans':
                result = this.valLanguage.grid_Transfer[this.optionLanguage];
                break;
            case 'fdisc':
                result = this.valLanguage.grid_Discard[this.optionLanguage];
                break;
        }
        return result;
    }

    ngOnDestroy(): void {
        // Cleanup subscription để tránh memory leak
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    confirm1(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to move AMS?',
            header: 'Confirmation',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-save',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Move',
                severity: 'danger',
                outlined: true
            },
            accept: () => {
                this.moveSapAms();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    life: 3000
                });
            }
        });
    }

    customSortAms(event: SortEvent) {
        if (this.isSortedAms == null || this.isSortedAms === undefined) {
            this.isSortedAms = true;
            this.global_sv.sortTableData(event);
        } else if (this.isSortedAms == true) {
            this.isSortedAms = false;
            this.global_sv.sortTableData(event);
        } else if (this.isSortedAms == false) {
            this.isSortedAms = null;
            this.dataTable = [...this.initialValueAms];
            this.dtTableAMS.reset();
        }
    }

    customSortSap(event: SortEvent) {
        if (this.isSortedSap == null || this.isSortedSap === undefined) {
            this.isSortedSap = true;
            this.global_sv.sortTableData(event);
        } else if (this.isSortedSap == true) {
            this.isSortedSap = false;
            this.global_sv.sortTableData(event);
        } else if (this.isSortedSap == false) {
            this.isSortedSap = null;
            this.dataTableSap = [...this.initialValueSap];
            this.dtTableSAP.reset();
        }
    }

    exportToExcel() {
        let data: any[] = [];
        if (this.dtTableAMS.filteredValue && Array.isArray(this.dtTableAMS.filteredValue)) {
            this.dtTableAMS.filteredValue.forEach((emp: any) => {
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

    sortTableData(event: any) {
        event.data.sort((data1: any, data2: any) => {
            let value1 = data1[event.field];
            let value2 = data2[event.field];
            let result = null;
            if (value1 == null && value2 != null) result = -1;
            else if (value1 != null && value2 == null) result = 1;
            else if (value1 == null && value2 == null) result = 0;
            else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
            else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

            return event.order * result;
        });
    }

    onDateSelect(value: any) {
        this.dateCreateLabelFilter = this.global_sv.formatDate(new Date(<Date>value));
    }

    onTableHeaderCheckboxToggle(event: any) {
        this.selectedTableSAP = [];
        if (event.checked === true) {
            let index = 0;
            for (let m of this.dataTable) {
                index++;
                if (index <= 10) {
                    /* Make your test here if the array does not contain the element*/
                    this.selectedTableSAP.push(m);
                }
            }
        } else {
            this.selectedTableSAP.length = 0;
        }
    }

    moveSapAms(): void {
        if (this.selectedTableSAP !== undefined && this.selectedTableSAP !== null && this.selectedTableSAP.length > 0) {
            let arrayParams: any[] = [];
            this.selectedTableSAP.forEach((item: any) => {
                arrayParams.push(item.intf_seq);
            });
            console.log('arrayParams', arrayParams);
            this.sv.moveSAPNewEquipment(arrayParams).subscribe(
                (response) => {
                    if (response !== null && response !== undefined) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data moved successfully' });
                        this.selectedTableSAP = [];
                        this.param.rows = 50;
                        this.loadSAPTableStart_50(this.param);
                        this.loadTableStart_50(this.param);
                    }
                },
                (error) => {
                    console.error('Error moving data from SAP to AMS:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to move data' });
                }
            );
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select at least one record to move' });
        }
    }

    ShowFilter() {
        this.isVisible = !this.isVisible;
    }

    handleChangeCorp(event: any): void {
        console.log('event', event.value);
        // this.global_sv.getStorage(event.value).subscribe(
        //     (response) => {
        //         if (response !== null && response !== undefined) {
        //             this.storage = response.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
        //             console.log('Equipment start page:', this.storage);
        //         }
        //     },
        //     (error) => {
        //         console.error('Error handleChangeCorp:', error);
        //     }
        // );
    }

    loadListFilter(): void {
        forkJoin({
            parent: this.global_sv.getParent(),
            corp: this.global_sv.getCorp(),
            status: this.global_sv.getStatus(),
            storage: this.global_sv.getStorage(''),
            Sales_Partial_Transfer_Discard: this.global_sv.getSales_Partial_Transfer_Discard()
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
                    // console.log('Parent:', responses.parent);
                }
                if (responses.corp !== null && responses.corp !== undefined) {
                    this.corpFac = responses.corp.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    this.corpTableFac = responses.corp.map((item: any) => ({ label: item.comm_nm }));
                }
                if (responses.status !== null && responses.status !== undefined) {
                    this.status = responses.status.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    this.statusTable = responses.status.map((item: any) => ({ label: item.comm_nm }));
                }

                if (responses.Sales_Partial_Transfer_Discard !== null && responses.Sales_Partial_Transfer_Discard !== undefined) {
                    const listData = responses.Sales_Partial_Transfer_Discard.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_nm }));
                    this.sales = listData;
                    this.partialSales = listData;
                    this.transfer = listData;
                    this.discard = listData;
                }
            },
            (error) => {
                console.error('Error loading filter lists:', error);
            }
        );
    }

    loadTableStart_50(param: any): void {
        this.loading = true;
        this.sv.selectEquipmentInfoAMS(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.totalRecords = response.records;
                    this.param.rows = this.totalRecords;

                    let dtTableRes = response.rows;

                    if (this.dataTable.length <= 50) this.isVisibleCheckAll = true;
                    else this.isVisibleCheckAll = false;
                    this.loading = false;

                    this.dataTable = dtTableRes.map((ele: any) => {
                        let ele_r: any = ele;
                        if (ele_r.reg_qr_date !== null || ele_r.reg_qr_date === undefined) {
                            ele_r.reg_qr_date = new Date(<Date>ele.reg_qr_date);
                        }
                        if (ele_r.status_date !== null || ele_r.status_date === undefined) {
                            ele_r.status_date = new Date(<Date>ele.status_date);
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
                            }
                        };
                        return ele_r;
                    });
                    this.initialValueAms = [...this.dataTable];
                    this.loadDataTableCustom({}, this.param);
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
    }

    loadDataTableCustom(event: any, param: any) {
        this.loading_full = true;
        this.sv.selectEquipmentInfoAMS(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    let dtTableRes = response.rows;
                    if (dtTableRes.length <= 50) this.isVisibleCheckAll = true;
                    else this.isVisibleCheckAll = false;

                    this.dataTable = dtTableRes.map((ele: any) => {
                        let ele_r: any = ele;
                        if (ele_r.reg_qr_date !== null || ele_r.reg_qr_date === undefined) {
                            ele_r.reg_qr_date = new Date(<Date>ele.reg_qr_date);
                        }
                        if (ele_r.status_date !== null || ele_r.status_date === undefined) {
                            ele_r.status_date = new Date(<Date>ele.status_date);
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
                            }
                        };
                        return ele_r;
                    });
                    this.loading_full = false;
                    this.initialValueAms = [...this.dataTable];
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
        // }
    }

    loadSAPTableStart_50(param: any): void {
        this.loadingSAP = true;
        this.sv.selectSAPInfo(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.totalRecordsSAP = response.records;
                    this.param.rows = this.totalRecordsSAP;

                    this.dataTableSap = response.rows;
                    if (this.dataTableSap.length <= 50) this.isVisibleCheckAll = true;
                    else this.isVisibleCheckAll = false;

                    this.loadingSAP = false;
                    this.dataTableSap.forEach((ele) => {
                        let ele_r: any = ele;
                        if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                            ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                        }
                        if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                            ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                        }
                        return ele;
                    });
                    this.initialValueSap = [...this.dataTableSap];
                    this.loadSAPDataTableCustom({}, this.param);
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
    }

    loadSAPDataTableCustom(event: any, param: any) {
        this.loading_fullSAP = true;
        this.sv.selectSAPInfo(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.dataTableSap = response.rows;
                    if (this.dataTableSap.length <= 50) this.isVisibleCheckAll = true;
                    else this.isVisibleCheckAll = false;

                    this.dataTableSap.forEach((ele) => {
                        let ele_r: any = ele;
                        if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                            ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                        }
                        if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                            ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                        }

                        return ele;
                    });
                    this.initialValueSap = this.dataTableSap;
                    this.loading_fullSAP = false;
                    this.initialValueSap = [...this.dataTableSap];
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
        // }
    }

    filterChooseSearch(): void {
        let createDate = '';
        let createEndDate = '';
        let changeDate = '';
        let changeEndDate = '';

        if (this.createDateFilterValue !== null && this.createDateFilterValue !== undefined) {
            createDate = this.global_sv.formatDateFilter(new Date(<Date>this.createDateFilterValue[0]));
            createEndDate = this.global_sv.formatDateFilter(new Date(<Date>this.createDateFilterValue[1]));
        }
        if (this.changeDateFilterValue !== null && this.changeDateFilterValue !== undefined) {
            changeDate = this.global_sv.formatDateFilter(new Date(<Date>this.changeDateFilterValue[0]));
            changeEndDate = this.global_sv.formatDateFilter(new Date(<Date>this.changeDateFilterValue[1]));
        }

        this.param = {
            corp: this.corpFilterValue !== null && this.corpFilterValue !== undefined ? this.corpFilterValue : '',
            material: this.materialFilterValue !== null && this.materialFilterValue !== undefined ? this.materialFilterValue : '',
            model: this.modelFilterValue !== null && this.modelFilterValue !== undefined ? this.modelFilterValue : '',
            status: this.statusFilterValue !== null && this.statusFilterValue !== undefined ? this.statusFilterValue : '',
            parent: this.parentFilterValue !== null && this.parentFilterValue !== undefined ? this.parentFilterValue : '',
            sale_yn: this.salesFilterValue !== null && this.salesFilterValue !== undefined ? this.salesFilterValue : '',
            transfer_yn: this.partialSalesFilterValue !== null && this.partialSalesFilterValue !== undefined ? this.partialSalesFilterValue : '',
            psale_yn: this.transferFilterValue !== null && this.transferFilterValue !== undefined ? this.transferFilterValue : '',
            discard_yn: this.discardFilterValue !== null && this.discardFilterValue !== undefined ? this.discardFilterValue : '',
            chg_from_date: changeDate,
            chg_to_date: changeEndDate,
            reg_from_date: createDate,
            reg_to_date: createEndDate,
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
        this.param.rows = this.totalRecordsSAP;
        this.loadSAPDataTableCustom(event, this.param);
    }

    clear(table: Table) {
        table.clear();
        this.dataTable = [...this.initialValueAms];
    }

    clearSAP(table: Table) {
        table.clear();
        this.selectedTableSAP = [];
        this.dataTableSap = [...this.initialValueSap];
    }

    clearSearch(table: Table, table1: Table) {
        table.clear();
        table1.clear();
        this.searchValue = '';
        this.parentFilterValue = null;
        this.corpFilterValue = null;
        this.materialFilterValue = '';
        this.modelFilterValue = '';
        this.statusFilterValue = null;
        this.salesFilterValue = null;
        this.partialSalesFilterValue = null;
        this.transferFilterValue = null;
        this.discardFilterValue = null;
        this.createDateFilterValue = undefined;
        this.changeDateFilterValue = undefined;
        this.param = {
            corp: '',
            material: '',
            model: '',
            mt_cd_list: '',
            storage: '',
            status: '',
            parent: '',
            reg_from_date: '',
            reg_to_date: '',
            chg_from_date: '',
            chg_to_date: '',
            sale_yn: '',
            transfer_yn: '',
            psale_yn: '',
            discard_yn: '',
            rows: 50
        };
    }

    onGlobalFilter(event: Event, table: Table) {
        const input = event.target as HTMLInputElement;
        table.filterGlobal(input.value, 'contains');
    }

    onRowEditInit(rowTable: any) {
        this.clonedTables[rowTable.rnum as string] = { ...rowTable };
    }

    onRowEditSave(rowTable: any) {
        delete this.clonedTables[rowTable.rnum as string];
        // console.log('rowTable updated:', rowTable);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    }

    onRowEditCancel(rowTable: any, index: number) {
        this.dataTable[index] = this.clonedTables[index];
        delete this.clonedTables[index];
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
}
