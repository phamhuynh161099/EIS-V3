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
import { Dialog } from 'primeng/dialog';
import { LanguageType } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { LocationService } from '../location.service';
interface Column {
    field: string;
    header: string;
    type: 'Text' | "Date" | "Number" | "Option" | "MultiSelect";
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    imports: [FloatLabel, Dialog, MultiSelectModule, IconFieldModule, TagModule, InputIconModule, InputTextModule, TableModule, ButtonModule, SelectModule, FormsModule, InputGroupModule, InputGroupAddonModule, DatePickerModule, RadioButtonModule, CommonModule],
    selector: 'app-location-history_report',
    templateUrl: './location_history.html',
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

        ::ng-deep .even-row:hover, ::ng-deep .odd-row:hover {
            background: var(--surface-hover, #f3f4f6) !important;
        }

        :host ::ng-deep .date-left > .p-datepicker > .ng-trigger {
            right: 0 !important;
            left: unset !important;
        }

        :host ::ng-deep #datepicker_style .p-datepicker {
            width: 100%;
            height: 100%;
        }

        :host ::ng-deep p-columnfilterformelement,
        :host ::ng-deep p-columnfilterformelement > input {
            min-width: 175px;
            width: 100%;
        }

        :host ::ng-deep p-columnfilter.filter-option p-columnfilterformelement {
            min-width: 50px;
            width: 100%;
        }

        @media (max-width: 600px){
::ng-deep .p-dialog {
                max-height: 100%;
                height: 100vh;
            }

        }
    `]
})


export class LocationHistoryPage implements OnInit {

    loading: boolean = false;
    loadingUpdate: boolean = false;
    loadingTable: boolean = false;
    now = new Date();

    corps!: any[];
    corpsFilter!: any[];
    states!: any[];
    departures!: any[];
    destinations!: any[];
    factories!: any[];
    status!: any[];
    models!: any[];
    loc_sts_cds!: any[];
    saps!: any[];
    lastYNs!: any[];
    reasons!: any[];
    parents!: any[];

    loadingStorage: boolean = false;
    storages!: any[];
    lct_sts_nmTableFilterValue: string | null = null;
    intf_result_nmTableFilterValue: string | null = null;
    last_ynTableFilterValue: string | null = null;

    selectedMtCode: string | null = null;
    selectedStorage: string | null = null;
    selectedState: string | null = null;
    selectedDeparture: string | null = null;
    selectedDestination: string | null = null;
    selectedLoc_sts_cd: string | null = null;
    selectedSap: string | null = null;
    selectedReason: string | null = null;
    selectedCorp: string | null = null;
    selectedAs_nos: string | null = null;
    selectedManufacturer: string | null = null;
    selectedFactory: string | null = null;
    selectedModel: string | null = null;
    selectedStartDate: string | null = null;
    selectedEndDate: string | null = null;
    selectedParent: string | null = null;

    selectedRangeDates: string | null = null;

    visible: boolean = false;
    showDialog() {
        this.visible = true;
    }

    cols!: Column[];
    exportColumns!: ExportColumn[];
    data!: any;
    initialValue!: any;
    rows = 50;
    first = 0;
    page: number = 1;
    totalRecords = 0;

    constructor(private sv: LocationService, public global_sv: GlobalsService) {
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

        this.loc_sts_cds = [
            { label: "Import", value: "101" },
            { label: "Export", value: "201" },
            { label: "Export Only", value: "301" },
        ]

        this.lastYNs = [
            { label: "Y", value: "y" },
            { label: "N", value: "n" },
        ]

        this.saps = [
            { label: "Send", value: "1" },
            { label: "Apply", value: "2" },
        ]

        this.cols = [
            { field: 'corp_nm', header: this.valLanguage.grid_Corp[this.optionLanguage], type: 'MultiSelect' },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Date[this.optionLanguage], type: 'Date' },
            { field: 'mt_cd', header: this.valLanguage.grid_Material_Code[this.optionLanguage], type: 'MultiSelect' },
            { field: 'mt_nm', header: this.valLanguage.grid_Material_Des[this.optionLanguage], type: 'Text' },
            { field: 'md_nm', header: this.valLanguage.grid_Model[this.optionLanguage], type: 'MultiSelect' },
            { field: 'from_lct_nm', header: this.valLanguage.grid_Departure[this.optionLanguage], type: 'MultiSelect' },
            { field: 'to_lct_nm', header: this.valLanguage.grid_Destination[this.optionLanguage], type: 'MultiSelect' },
            { field: 'puchs_dt_ymd', header: this.valLanguage.grid_Buying_Date[this.optionLanguage], type: 'Date' },
            { field: 'lct_sts_nm', header: this.valLanguage.grid_Location_State[this.optionLanguage], type: 'Option' },
            { field: 'intf_result_nm', header: 'Sap', type: 'Option' },
            { field: 're_mark', header: this.valLanguage.grid_Remark[this.optionLanguage], type: 'Text' },
            { field: 'factory_nm', header: this.valLanguage.grid_Storage[this.optionLanguage], type: 'Text' },
            { field: 'as_no', header: this.valLanguage.grid_Asset_No[this.optionLanguage], type: 'Text' },
            { field: 'prt_nm', header: this.valLanguage.grid_Parent[this.optionLanguage], type: 'Text' },
            { field: 'barcode', header: this.valLanguage.grid_Barcode[this.optionLanguage], type: 'Text' },
            { field: 'cost_dept_nm', header: this.valLanguage.grid_Cost_Center_Name[this.optionLanguage], type: 'Text' },
            { field: 'unit', header: this.valLanguage.grid_Unit[this.optionLanguage], type: 'Text' },
            { field: 'quantity', header: this.valLanguage.grid_Quantity[this.optionLanguage], type: 'Number' },
            { field: 'maker', header: this.valLanguage.grid_Maker[this.optionLanguage], type: 'Text' },
            { field: 'sts_nm', header: this.valLanguage.grid_State[this.optionLanguage], type: 'Text' },
            { field: 'reason_nm', header: this.valLanguage.grid_Reason[this.optionLanguage], type: 'Text' },
            { field: 'charge_nm', header: this.valLanguage.grid_Requester[this.optionLanguage], type: 'Text' },
            { field: 'receive_nm', header: this.valLanguage.grid_Receiver[this.optionLanguage], type: 'Text' },
            { field: 'mf_cd', header: 'mf_cd', type: 'Text' },
            { field: 'sp_cd', header: 'sp_cd', type: 'Text' },
            { field: 'output_dt_ymd', header: this.valLanguage.grid_Output_Date[this.optionLanguage], type: 'Date' },
            { field: 'input_dt_ymd', header: this.valLanguage.grid_Input_Date[this.optionLanguage], type: 'Date' },
            { field: 'last_yn', header: this.valLanguage.grid_LastYN[this.optionLanguage], type: 'Option' },
            { field: 'reg_nm', header: this.valLanguage.grid_Create_Name[this.optionLanguage], type: 'Text' },
            { field: 'chg_nm', header: this.valLanguage.grid_Change_Name[this.optionLanguage], type: 'Text' },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Change_Date[this.optionLanguage], type: 'Date' },
            { field: 'div_cd', header: 'div_cd', type: 'Text' },
        ];

        this.listOption = {
            'corp_nm': this.corps,
            'lct_sts_nm': this.loc_sts_cds,
            'intf_result_nm': this.saps,
            'last_yn': this.lastYNs,
            'md_nm': this.models,
            'mt_cd': this.listMtl,
            'from_lct_nm': this.factories,
            'to_lct_nm': this.factories
        }

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    listOption!: any;

    getLct_sts_nmColor(status: string) {
        switch (status) {
            case "Import":
                return 'info';
            case "Export":
                return 'warn';
            case "Export Only":
                return 'secondary';
            default:
                return 'success';
        }
    }

    getLastYNColor(status: string) {
        switch (status) {
            case "Y":
                return 'info';
            case "N":
                return 'warn';
            default:
                return 'success';
        }
    }

    getIntf_result_nmColor(status: string) {
        switch (status) {
            case "Send":
                return 'warn';
            case "Apply":
                return 'info';
            default:
                return 'success';
        }
    }

    filterTable() {
        const param = {
            start_date: this.selectedStartDate ? this.selectedStartDate : '',
            end_date: this.selectedEndDate ? this.selectedEndDate : '',
            as_no: this.selectedAs_nos ? this.selectedAs_nos : '',
            mt_cd: this.selectedMtCode ? this.selectedMtCode : '',
            mt_cd1: '',
            mt_cd2: '',
            md_cd: this.selectedModel ? this.selectedModel : '',
            corp: this.selectedCorp ? this.selectedCorp : '',
            factory: this.selectedFactory ? this.selectedFactory : '',
            from_lct_cd: this.selectedDeparture ? this.selectedDeparture : '',
            to_lct_cd: this.selectedDestination ? this.selectedDestination : '',
            reason_cd: this.selectedReason ? this.selectedReason : '',
            sts_cd: this.selectedState ? this.selectedState : '',
            sap: this.selectedSap ? this.selectedSap : '',
            div_cd: 'mv',
            prt_cd: this.selectedParent ? this.selectedParent : '',
            lct_sts_cd: this.selectedLoc_sts_cd ? this.selectedLoc_sts_cd : '',
            row: this.totalRecords ? this.totalRecords : '50',
        }

        this.loadingTable = true;
        this.sv.getLocationHistory(param).subscribe({
            next: (data: any) => {
                this.loadingTable = false;
                this.initialValue = this.data = data.rows;
            }
        });
    }

    exportToExcel() {
        let data: any[] = [];
        if (this.dt1.filteredValue && Array.isArray(this.dt1.filteredValue)) {
            this.dt1.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    'Corp': emp.corp_nm,
                    'Date': emp.reg_dt_ymd,
                    'Material Code': emp.mt_cd,
                    'Material Description': emp.mt_nm,
                    'Model': emp.md_nm,
                    'Departure': emp.from_lct_nm,
                    'Destination': emp.to_lct_nm,
                    'Buying Date': emp.puchs_dt_ymd,
                    'Location State': emp.lct_sts_nm,
                    'Sap': emp.intf_result_nm,
                    'Remark': emp.re_mark,
                    'Storage': emp.factory_nm,
                    'Asset No': emp.as_no,
                    'Parent': emp.prt_nm,
                    'Barcode': emp.barcode,
                    'Cost Center Name': emp.cost_dept_nm,
                    'Unit': emp.unit,
                    'Quantity': emp.quantity,
                    'Maker': emp.maker,
                    'State': emp.sts_nm,
                    'Reason': emp.reason_nm,
                    'Requester': emp.charge_nm,
                    'Receiver': emp.receive_nm,
                    'mf_cd': emp.mf_cd,
                    'sp_cd': emp.sp_cd,
                    'Output Date': emp.output_dt_ymd,
                    'Input Date': emp.input_dt_ymd,
                    'Last YN': emp.last_yn,
                    'Create Name': emp.reg_nm,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd,
                    'div_cd': emp.div_cd,
                };
                data.push(rowData);
            });
        } else {
            this.data.forEach((emp: any) => {
                const rowData: any = {
                    'Corp': emp.corp_nm,
                    'Date': emp.reg_dt_ymd,
                    'Material Code': emp.mt_cd,
                    'Material Description': emp.mt_nm,
                    'Model': emp.md_nm,
                    'Departure': emp.from_lct_nm,
                    'Destination': emp.to_lct_nm,
                    'Buying Date': emp.puchs_dt_ymd,
                    'Location State': emp.lct_sts_nm,
                    'Sap': emp.intf_result_nm,
                    'Remark': emp.re_mark,
                    'Storage': emp.factory_nm,
                    'Asset No': emp.as_no,
                    'Parent': emp.prt_nm,
                    'Barcode': emp.barcode,
                    'Cost Center Name': emp.cost_dept_nm,
                    'Unit': emp.unit,
                    'Quantity': emp.quantity,
                    'Maker': emp.maker,
                    'State': emp.sts_nm,
                    'Reason': emp.reason_nm,
                    'Requester': emp.charge_nm,
                    'Receiver': emp.receive_nm,
                    'mf_cd': emp.mf_cd,
                    'sp_cd': emp.sp_cd,
                    'Output Date': emp.output_dt_ymd,
                    'Input Date': emp.input_dt_ymd,
                    'Last YN': emp.last_yn,
                    'Create Name': emp.reg_nm,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd,
                    'div_cd': emp.div_cd,
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'Location History', 'data');
        }
    }

    private loadData(): void {
        this.loading = true;
        this.loadingTable = true;

        const param = {
            start_date: this.selectedStartDate ? this.selectedStartDate : '',
            end_date: this.selectedEndDate ? this.selectedEndDate : '',
            as_no: this.selectedAs_nos ? this.selectedAs_nos : '',
            mt_cd: this.selectedMtCode ? this.selectedMtCode : '',
            mt_cd1: '',
            mt_cd2: '',
            md_cd: this.selectedModel ? this.selectedModel : '',
            corp: this.selectedCorp ? this.selectedCorp : '',
            factory: this.selectedFactory ? this.selectedFactory : '',
            from_lct_cd: this.selectedDeparture ? this.selectedDeparture : '',
            to_lct_cd: this.selectedDestination ? this.selectedDestination : '',
            reason_cd: this.selectedReason ? this.selectedReason : '',
            sts_cd: this.selectedState ? this.selectedState : '',
            sap: this.selectedSap ? this.selectedSap : '',
            div_cd: 'mv',
            prt_cd: this.selectedParent ? this.selectedParent : '',
            lct_sts_cd: this.selectedLoc_sts_cd ? this.selectedLoc_sts_cd : '',
            row: this.totalRecords ? this.totalRecords : '50',
        }

        this.sv.getLocationHistory(param).subscribe({
            next: (data: any) => {
                this.initialValue = this.data = data.rows;
                this.loadingTable = false;
                this.totalRecords = param.row = data.records;

                forkJoin({
                    selectLctHistReport: this.sv.getLocationHistory(param),
                    corps: this.global_sv.getCorp(),
                    fModelList: this.global_sv.getFModelList(),
                    factories: this.global_sv.getLctFactory(),
                    commCdList: this.global_sv.getStatus(),
                    status: this.global_sv.getStatus(),
                    mtCdList: this.global_sv.getMtCdList(),
                    parentList: this.global_sv.getParent(),
                    reasons: this.sv.getReasonList(),
                    departures: this.sv.getToLctCdMnFullList(),
                }).subscribe({
                    next: (data: any) => {
                        this.data = data.selectLctHistReport.rows
                        this.data.forEach((ele: any) => {
                            let ele_r: any = ele;
                            if (ele_r.reg_dt_ymd !== null && ele_r.reg_dt_ymd.trim() != '' && ele_r.reg_dt_ymd != undefined) {
                                ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                            }
                            if (ele_r.puchs_dt_ymd !== null && ele_r.puchs_dt_ymd.trim() != '' && ele_r.puchs_dt_ymd != undefined) {
                                ele_r.puchs_dt_ymd = new Date(<Date>ele.puchs_dt_ymd);
                            }
                            if (ele_r.output_dt_ymd !== null && ele_r.output_dt_ymd.trim() != '' && ele_r.output_dt_ymd != undefined) {
                                ele_r.output_dt_ymd = new Date(<Date>ele.output_dt_ymd);
                            }
                            if (ele_r.input_dt_ymd !== null && ele_r.input_dt_ymd.trim() != '' && ele_r.input_dt_ymd != undefined) {
                                ele_r.input_dt_ymd = new Date(<Date>ele.input_dt_ymd);
                            }
                            if (ele_r.chg_dt_ymd !== null && ele_r.chg_dt_ymd.trim() != '' && ele_r.chg_dt_ymd != undefined) {
                                ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                            }
                            return ele;
                        })

                        this.initialValue = this.data;

                        this.page = data.selectLctHistReport.page;

                        this.totalRecords = data.selectLctHistReport.records;

                        this.loading = false;

                        this.parents = data.parentList.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.listMtl = data.mtCdList.filter((item: any) => item.comm_cd !== '' && !item.comm_cd.toLowerCase().includes('test')).map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.states = data.commCdList.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.departures = this.destinations = data.departures.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.reasons = data.reasons.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.corpsFilter = data.corps.map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.corps = data.corps.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));                        this.models = data.fModelList.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.factories = data.factories.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.status = data.status.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));

                        this.listOption = {
                            'corp_nm': this.corps,
                            'lct_sts_nm': this.loc_sts_cds,
                            'intf_result_nm': this.saps,
                            'last_yn': this.lastYNs,
                            'md_nm': this.models,
                            'mt_cd': this.listMtl,
                            'from_lct_nm': this.factories,
                            'to_lct_nm': this.factories
                        }
                    },
                    error: (error) => {
                        console.error('Error loading data:', error);
                        this.loading = false;
                        this.loadingTable = false;
                    }
                });
            }
        });

    }

    onChangeCorp() {
        if (this.selectedCorp) {
            this.loadingStorage = true;
            this.global_sv.getStorage(this.selectedCorp).subscribe({
                next: (response) => {
                    this.storages = response.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    this.loadingStorage = false;
                }
            })
        } else {
            this.selectedStorage = null;
            this.storages = [];
        }
    }

    @ViewChild('dt1') dt1!: Table;
    isSorted: boolean | null = null;

    onSearch() {
        this.filterTable();
    }

    onClearTableFilter() {
        this.reg_date_input = '';
        this.corpTableFilterValue = [];
        this.lct_sts_nmTableFilterValue = null;
        this.intf_result_nmTableFilterValue = null;
        this.last_ynTableFilterValue = null;
    }

    onClearSearch() {
        this.selectedCorp = null;
        this.searchMtCodeList = [];
        this.selectedMtCode = null;
        this.selectedReason = null;
        this.selectedAs_nos = null;
        this.selectedManufacturer = null;
        this.selectedFactory = null;
        this.selectedDeparture = null;
        this.selectedDestination = null;
        this.selectedState = null;
        this.selectedSap = null;
        this.selectedLoc_sts_cd = null;
        this.selectedParent = null;
        this.selectedModel = null;
        this.selectedStartDate = null;
        this.selectedEndDate = null;
        this.selectedRangeDates = null;
    }

    getLocationStateColor(status: string) {
        switch (status) {
            case 'Export Only':
                return 'success';
            case 'Import':
                return 'info';

            case 'Export':
                return 'warn';
            default:
                return null;
        }
    }

    getIntfResultNameColor(status: string) {
        switch (status) {
            case 'apply':
                return 'info';
            case 'send':
                return 'warn';
            default:
                return null;
        }
    }

    onClearTable(table: Table) {
        table.clear();
        this.onClearTableFilter();
        this.page = 1;
        // this.filterTable();
    }

    onClearAllSearch() {
        this.onClearSearch()
        this.onClearTableFilter();
        this.onClearTable(this.dt1)
        this.filterTable();
    }

    handleApplySearch() {
        this.loadingTable = true;
        this.sv.getLocationHistoryByMtCodeList(this.searchMtCodeList, this.totalRecords).subscribe({
            next: (data: any) => {
                this.loadingTable = false;
                this.initialValue = this.data = data.rows;
            }
        });
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

    isVisible: boolean = true;

    elno: string | undefined = undefined;
    description: string = '';

    onRowClick(elno: string, re_mark: string): void {
        this.elno = elno;
        this.description = re_mark;
    }

    onSave() {

        if (this.elno != undefined) {
            const param = {
                elno: this.elno,
                re_mark: this.description
            }

            this.loadingTable = true;
            this.sv.updateLctHist(param).subscribe({
                next: () => {
                    this.sv.getLctHistOne(this.elno!).subscribe({
                        next: (data: any) => {
                            this.initialValue = this.data = this.data.map((item: any) => String(item.elno) == String(data.elno) ? data : item)
                            this.loadingTable = false;
                        }
                    });
                }
            });
        }
    }

    showFilter() {
        if (this.isVisible === true) {
            this.isVisible = false;
        } else {
            this.isVisible = true;
        }
    }

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

    reg_date_input: string = ''; // Default to today's date in YYYY-MM-DD format

    onClearFilterDate() {
        this.selectedStartDate = this.selectedEndDate = '';
    }

    listMtl!: any;
    searchMtCodeList: any[] = [];

    delFromSearchList(searchText: any): void {
        this.searchMtCodeList = this.searchMtCodeList.filter((item) => searchText != item);
    }

    handleClearSearch() {
        this.searchMtCodeList = [];
    }

    onCloseFilterDate() {
        if (this.selectedRangeDates != undefined && this.selectedRangeDates != null) {
            const data: string[] = (this.selectedRangeDates + '').split(",");

            const start = this.global_sv.formatDateFilter(new Date(data[0]));
            const end = this.global_sv.formatDateFilter(new Date(data[1]));

            this.selectedStartDate = start;
            this.selectedEndDate = end;
        }
    }
    @ViewChild('ms_mt_cd') ms_mt_cd!: MultiSelect;
    @ViewChild('ms_corp_nm') ms_corp_nm!: MultiSelect;
    @ViewChild('ms_md_nm') ms_md_nm!: MultiSelect;
    @ViewChild('ms_lct_nm') ms_lct_nm!: MultiSelect;
    @ViewChild('ms_from_lct_nm') ms_from_lct_nm!: MultiSelect;
    @ViewChild('ms_to_lct_nm') ms_to_lct_nm!: MultiSelect;

    mtCodeTableFilterValue: string[] = [];
    corpTableFilterValue: string[] = [];
    mdNmTableFilterValue: string[] = [];
    lctNmTableFilterValue: string[] = [];
    departureTableFilterValue: string[] = [];
    destinationTableFilterValue: string[] = [];

    selectAllMtCodeTable: boolean = false;
    selectAllCorpTable: boolean = false;
    selectAllMdNmTable: boolean = false;
    selectAllLctNmTable: boolean = false;
    selectAllFromLctNmTable: boolean = false;
    selectAllToLctNmTable: boolean = false;

    onSelectAllChangeTable(event: any, field: 'mt_cd' | 'md_nm' | 'corp_nm' | 'from_lct_nm' | 'lct_nm' | 'to_lct_nm') {
        switch (field) {
            case 'mt_cd':
                this.mtCodeTableFilterValue = event.checked ? [...this.ms_mt_cd.visibleOptions().map((item: any) => item.value)] : [];
                this.selectAllMtCodeTable = event.checked;
                break;
            case 'md_nm':
                this.mdNmTableFilterValue = event.checked ? [...this.ms_md_nm.visibleOptions().map((item: any) => item.value)] : [];
                this.selectAllMdNmTable = event.checked;
                break;
            case 'corp_nm':
                this.corpTableFilterValue = event.checked ? [...this.ms_corp_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllCorpTable = event.checked;
                break;
            case 'lct_nm':
                this.lctNmTableFilterValue = event.checked ? [...this.ms_lct_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllLctNmTable = event.checked;
                break;
            case 'from_lct_nm':
                this.departureTableFilterValue = event.checked ? [...this.ms_from_lct_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllFromLctNmTable = event.checked;
                break;
            case 'to_lct_nm':
                this.destinationTableFilterValue = event.checked ? [...this.ms_to_lct_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllToLctNmTable = event.checked;
                break;
        }

    }
}
