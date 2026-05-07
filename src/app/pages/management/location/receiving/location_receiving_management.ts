import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { MessageService, SelectItem, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Toast, ToastModule } from 'primeng/toast';

import { LanguageType, Name_Token } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { LocationService } from '../location.service';

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
    selector: 'app-location-receiving-management',
    imports: [FormsModule, MultiSelectModule, DatePicker, FloatLabelModule, InputIconModule, IconFieldModule, InputTextModule, SelectModule, TableModule, CommonModule, ToastModule, Toast, ProgressSpinnerModule, ButtonModule, TagModule],
    providers: [LocationService, MessageService],
    standalone: true,
    templateUrl: './location_receiving_management.html',
    styles: `
        ::ng-deep {
            .p-datepicker-input {
                width: 14rem !important;
            }
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
            table {
                th,
                td {
                    white-space: nowrap;
                }
            }
        }
    `
})
export class LocationReceivingManagementReport implements OnInit {
    loading: boolean = true;
    dataTable: any[] = [];
    dataTableRows: number = 0;
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
    reason!: SelectItem[];
    reasonFilterValue: string | null = null;
    departure!: SelectItem[];
    departureFilterValue: string | null = null;
    destination!: SelectItem[];
    destinationFilterValue: string | null = null;
    state!: SelectItem[];
    stateFilterValue: string | null = null;
    statusTable!: SelectItem[];
    statusTableFilterValue: string | null = null;
    modelFilterValue!: string;
    assetFilterValue!: string;
    materialFilterValue!: string;
    outputDateFilterValue!: Date[] | undefined;

    cols!: Column[];
    exportColumns!: ExportColumn[];
    selectedLocation!: any;
    param: any = {
        corp: '',
        model: '',
        parent: '',
        storage: ''
    };
    receive_id: string = '';
    receive_nm: string = '';
    metaKey: boolean = true;
    isSorted: boolean | null = null;
    initialValue: any[] = [];
    // export
    @Input() filteredValue: any[] = [];
    @ViewChild('dtLocation') table!: Table;

    constructor(
        private sv: LocationService,
        private messageService: MessageService,
        private global_sv: GlobalsService
    ) {
        const token = localStorage.getItem(Name_Token);
        if (token !== null) {
            const tokenPayload: any = JSON.parse(token);
            this.receive_id = tokenPayload.id;
            this.receive_nm = tokenPayload.name;
        }
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
        this.loadDataTableCustomRecords();

        this.cols = [
            { field: 'corp_nm', header: this.valLanguage.grid_Corp[this.optionLanguage], customExportHeader: 'Factory' },
            { field: 'as_no', header: this.valLanguage.grid_Asset_No[this.optionLanguage] },
            { field: 'prt_nm', header: this.valLanguage.grid_Parent[this.optionLanguage] },
            { field: 'receive_nm', header: this.valLanguage.grid_Receiver[this.optionLanguage] },
            { field: 'reason_nm', header: this.valLanguage.grid_Reason[this.optionLanguage] },
            { field: 'mt_cd', header: this.valLanguage.grid_Material_Code[this.optionLanguage] },
            { field: 'mt_nm', header: this.valLanguage.grid_Material_Des[this.optionLanguage] },
            { field: 'factory_nm', header: this.valLanguage.grid_Storage_Loca[this.optionLanguage] },
            { field: 'to_lct_nm', header: this.valLanguage.grid_Des_of_Storage_Loca[this.optionLanguage] },
            { field: 'cost_dept_nm', header: this.valLanguage.grid_Cost_Center_Name[this.optionLanguage] },
            { field: 'unit', header: this.valLanguage.grid_Unit[this.optionLanguage] },
            { field: 'quantity', header: this.valLanguage.grid_Quantity[this.optionLanguage] },
            { field: 'puchs_dt_ymd', header: this.valLanguage.grid_Buying_Date[this.optionLanguage] },
            { field: 'md_cd', header: this.valLanguage.grid_Model[this.optionLanguage] },
            { field: 'maker', header: this.valLanguage.grid_Maker[this.optionLanguage] },
            { field: 'from_lct_nm', header: this.valLanguage.grid_Des_of_Storage_Loca[this.optionLanguage] },
            { field: 'lct_sts_nm', header: this.valLanguage.grid_Location_State[this.optionLanguage] },
            { field: 'sts_nm', header: this.valLanguage.grid_State[this.optionLanguage] },
            { field: 'charge_nm', header: this.valLanguage.grid_Requester[this.optionLanguage] },
            { field: 're_mark', header: this.valLanguage.grid_Remark[this.optionLanguage] },
            { field: 'output_dt_ymd', header: this.valLanguage.grid_Output_Date[this.optionLanguage] },
            { field: 'input_dt_ymd', header: this.valLanguage.grid_Input_Date[this.optionLanguage] },
            { field: 'reg_nm', header: this.valLanguage.grid_Create_Name[this.optionLanguage] },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Create_Date[this.optionLanguage] },
            { field: 'chg_nm', header: this.valLanguage.grid_Change_Name[this.optionLanguage] },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Change_Date[this.optionLanguage] }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    setup(value: any, id: any) {
        if (value != null) {
            const filter = this.dataTableComponent.filters[id];
            if (Array.isArray(filter)) {
                filter[0].value = value;
            } else if (filter) {
                filter.value = value;
            }
        }
        // this.reg_date_input = value;
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

    onFilter(event: any) {
        this.filteredValue = event.filteredValue;
    }

    onRowSelect(table: any) {
        console.log('Selected row:', table);
    }

    saveReceive(): void {
        if (this.receive_id === '' || this.receive_nm === '') {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter Receive ID and Name.' });
            return;
        }

        if (this.selectedLocation !== null && this.selectedLocation !== undefined) {
            this.selectedLocation.forEach((item: any) => {
                const param = {
                    to_lct_cd: item.to_lct_cd,
                    receive_id: item.receive_id === '' ? this.receive_id : item.receive_id,
                    receive_nm: item.receive_nm === '' ? this.receive_nm : item.receive_nm,
                    lct_sts_cd: item.lct_sts_cd,
                    barcode: item.barcode,
                    as_no: item.as_no,
                    input_dt: this.global_sv.getTodayDate(),
                    sts_cd: item.lct_sts_cd,
                    incoming_route: 'lctReceivingMgt'
                };

                this.sv.updateLctReceivingMgt(param).subscribe(
                    (response) => {
                        if (response !== null && response !== undefined) {
                            if (response.indexOf('OK') !== -1) {
                                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Receive saved successfully.' });
                            } else {
                                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save receive.' });
                            }
                        }
                    },
                    (error) => {
                        // console.error('Error saving receive:', error);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save receive.' });
                    }
                );
            });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select table line before saving.' });
            return;
        }
    }

    exportToExcel() {
        let data: any[] = [];
        if (this.table.filteredValue && Array.isArray(this.table.filteredValue)) {
            this.table.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    Corp: emp.corp_nm,
                    'Asset No': emp.corp_nm,
                    Parent: emp.prt_nm,
                    'Material Code': emp.mt_cd,
                    'Material Description': emp.mt_nm,
                    'Storage Loca': emp.factory_nm,
                    'Des. of Storage Loca': emp.to_lct_nm,
                    'Cost Center Name': emp.cost_dept_nm,
                    Unit: emp.unit,
                    Quantity: emp.quantity,
                    'Buying Date': emp.puchs_dt_ymd,
                    Model: emp.md_cd,
                    Maker: emp.maker,
                    'Dep. of Storage Loca': emp.from_lct_nm,
                    'Location State': emp.lct_sts_nm,
                    State: emp.sts_nm,
                    Reason: emp.reason_nm,
                    Requester: emp.charge_nm,
                    Receiver: emp.receive_nm,
                    'Re Mark': emp.re_mark,
                    'Output Date': emp.output_dt_ymd,
                    'Input Date': emp.input_dt_ymd,
                    'Create Name': emp.reg_nm,
                    'Create Date': emp.reg_dt_ymd,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        } else {
            this.dataTable.forEach((emp: any) => {
                const rowData: any = {
                    Corp: emp.corp_nm,
                    'Asset No': emp.corp_nm,
                    Parent: emp.prt_nm,
                    'Material Code': emp.mt_cd,
                    'Material Description': emp.mt_nm,
                    'Storage Loca': emp.factory_nm,
                    'Des. of Storage Loca': emp.to_lct_nm,
                    'Cost Center Name': emp.cost_dept_nm,
                    Unit: emp.unit,
                    Quantity: emp.quantity,
                    'Buying Date': emp.puchs_dt_ymd,
                    Model: emp.md_cd,
                    Maker: emp.maker,
                    'Dep. of Storage Loca': emp.from_lct_nm,
                    'Location State': emp.lct_sts_nm,
                    State: emp.sts_nm,
                    Reason: emp.reason_nm,
                    Requester: emp.charge_nm,
                    Receiver: emp.receive_nm,
                    'Re Mark': emp.re_mark,
                    'Output Date': emp.output_dt_ymd,
                    'Input Date': emp.input_dt_ymd,
                    'Create Name': emp.reg_nm,
                    'Create Date': emp.reg_dt_ymd,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'Location Receiving Management', 'data');
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
            storage: this.global_sv.getStorage(''),
            reason: this.global_sv.getReason(),
            state: this.global_sv.getStatus(),
            departure: this.global_sv.getDeparture(),
            destination: this.global_sv.getDestination()
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
                if (responses.storage !== null && responses.storage !== undefined) {
                    this.storage = responses.storage.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    this.storageTable = responses.storage.map((item: any) => ({ label: item.comm_nm }));
                }
                if (responses.reason !== null && responses.reason !== undefined) {
                    this.reason = responses.reason.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                }
                if (responses.state !== null && responses.state !== undefined) {
                    this.state = responses.state.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    this.statusTable = responses.state.map((item: any) => ({ label: item.comm_nm }));
                }
                if (responses.departure !== null && responses.departure !== undefined) {
                    this.departure = responses.departure.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                }
                if (responses.destination !== null && responses.destination !== undefined) {
                    this.destination = responses.destination.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
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
        let outputDate = '';
        let outputEndDate = '';
        if (this.outputDateFilterValue !== null && this.outputDateFilterValue !== undefined) {
            outputDate = this.global_sv.formatDateFilter(new Date(<Date>this.outputDateFilterValue[0]));
            outputEndDate = this.global_sv.formatDateFilter(new Date(<Date>this.outputDateFilterValue[1]));
        }
        this.param = {
            corp: this.corpFilterValue !== null && this.corpFilterValue !== undefined ? this.corpFilterValue : '',
            model: this.modelFilterValue !== null && this.modelFilterValue !== undefined ? this.modelFilterValue : '',
            parent: this.parentFilterValue !== null && this.parentFilterValue !== undefined ? this.parentFilterValue : '',
            storage: this.storageFilterValue !== null && this.storageFilterValue !== undefined ? this.storageFilterValue : '',
            reason: this.reasonFilterValue !== null && this.reasonFilterValue !== undefined ? this.reasonFilterValue : '',
            departure: this.departureFilterValue !== null && this.departureFilterValue !== undefined ? this.departureFilterValue : '',
            destination: this.destinationFilterValue !== null && this.destinationFilterValue !== undefined ? this.destinationFilterValue : '',
            state: this.stateFilterValue !== null && this.stateFilterValue !== undefined ? this.stateFilterValue : '',
            asset: this.assetFilterValue !== null && this.assetFilterValue !== undefined ? this.assetFilterValue : '',
            material: this.materialFilterValue !== null && this.materialFilterValue !== undefined ? this.materialFilterValue : '',
            outputDate: outputDate !== '' ? outputDate : '',
            outputEndDate: outputEndDate !== '' ? outputEndDate : '',
            rows: this.dataTableRows
        };
        // console.log('Filter parameters:', this.param);

        this.loadDataTableCustomFilter(this.param);
    }

    loadDataTableCustomRecords() {
        this.loading = true;
        this.sv.selectLctReceivingRecords().subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.dataTableRows = response.records;
                    const param = {
                        rows: this.dataTableRows
                    };
                    this.loadDataTable(param);
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
        // }
    }

    loadDataTable(param: any) {
        this.sv.selectLctReceiving(param).subscribe(
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
                        if (ele_r.output_dt_ymd !== null || ele_r.output_dt_ymd === undefined) {
                            ele_r.output_dt_ymd = new Date(<Date>ele.output_dt_ymd);
                        }
                        if (ele_r.input_dt_ymd !== null || ele_r.input_dt_ymd === undefined) {
                            ele_r.input_dt_ymd = new Date(<Date>ele.input_dt_ymd);
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

                    this.loading = false;
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
        // }
    }

    loadDataTableCustomFilter(param: any) {
        this.loading = true;
        this.sv.selectLctReceivingFilter(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    // this.dataTable = response.rows;
                    // this.initialValue = [...response.rows];
                    let dtTableRes = response.rows;
                    this.dataTable = dtTableRes.map((ele: any) => {
                        let ele_r: any = ele;
                        if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                            ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                        }
                        if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                            ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                        }
                        if (ele_r.output_dt_ymd !== null || ele_r.output_dt_ymd === undefined) {
                            ele_r.output_dt_ymd = new Date(<Date>ele.output_dt_ymd);
                        }
                        if (ele_r.input_dt_ymd !== null || ele_r.input_dt_ymd === undefined) {
                            ele_r.input_dt_ymd = new Date(<Date>ele.input_dt_ymd);
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
                    this.loading = false;
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
        // }
    }

    @ViewChild('dt') dataTableComponent!: Table;
}
