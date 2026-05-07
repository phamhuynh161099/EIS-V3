import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MessageService, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { DialogModule } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { forkJoin } from 'rxjs';
import { LanguageType, Name_Token } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { SystemService } from '../system.service';
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
    selector: 'app-use-management',
    imports: [ToastModule, DialogModule, FloatLabel, TextareaModule, MultiSelectModule, IconFieldModule, TagModule, InputIconModule, InputTextModule, TableModule, ButtonModule, SelectModule, FormsModule, InputGroupModule, InputGroupAddonModule, DatePickerModule, RadioButtonModule, CommonModule],
    providers: [SystemService, MessageService],
    standalone: true,
    templateUrl: './location_management.html',
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
        :host ::ng-deep .p-dialog-content {
            overflow-y: unset;
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

        :host ::ng-deep p-columnfilterformelement,
        :host ::ng-deep p-columnfilterformelement > input {
            min-width: 175px;
            width: 100%;
        }

        :host ::ng-deep p-columnfilter.filter-option p-columnfilterformelement {
        min-width: 50px;
            width: 100%;
        }
    `]
})
export class LocationManagementSystem implements OnInit {
    loadingTable: boolean = false;

    visible: boolean = false;

    cols!: Column[];
    exportColumns!: ExportColumn[];
    data!: any;
    initialValue!: any;
    rows = 50;
    first = 0;
    totalRecords = 0;
    useYNTableFilterValue: string | null = null;
    mtYNTableFilterValue: string | null = null;
    mvYNTableFilterValue: string | null = null;
    rtYNTableFilterValue: string | null = null;

    ysList!: any;
    constructor(private sv: SystemService, public global_sv: GlobalsService, private messageService: MessageService) {
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

        this.cols = [
            { field: 'lct_cd', header: this.valLanguage.grid_Location_Code[this.optionLanguage], type: 'Text' },
            { field: 'lct_nm', header: this.valLanguage.grid_Location_Name[this.optionLanguage], type: 'Text' },
            { field: 'mn_full', header: this.valLanguage.grid_Full_Name[this.optionLanguage], type: 'Option' },
            { field: 'level_cd', header: this.valLanguage.grid_Level[this.optionLanguage], type: 'Text' },
            { field: 'mt_yn', header: this.valLanguage.grid_MaintenanceYN[this.optionLanguage], type: 'Option' },
            { field: 'mv_yn', header: this.valLanguage.grid_MovementYN[this.optionLanguage], type: 'Option' },
            { field: 'rt_yn', header: this.valLanguage.grid_RentalYN[this.optionLanguage], type: 'Option' },
            { field: 'manager_nm', header: this.valLanguage.grid_Manager_Name[this.optionLanguage], type: 'Text' },
            { field: 'use_yn', header: this.valLanguage.grid_UseYN[this.optionLanguage], type: 'Option' },
            { field: 're_mark', header: this.valLanguage.grid_Remark[this.optionLanguage], type: 'Text' },
            { field: 'reg_nm', header: this.valLanguage.grid_Reg_Name[this.optionLanguage], type: 'Text' },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Reg_Date[this.optionLanguage], type: 'Date' },
            { field: 'chg_nm', header: this.valLanguage.grid_Change_Name[this.optionLanguage], type: 'Text' },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Change_Date[this.optionLanguage], type: 'Date' },
        ];

        this.ysList = [
            { label: "Use", value: "Y" },
            { label: "UnUse", value: "N" },
        ]

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    setData(rowTable: any) {
        this.selectedLctNo = rowTable.lctno;
        this.selectedLctName = rowTable.lct_nm;
        this.selectedMtYN = rowTable.mt_yn;
        this.selectedMvYN = rowTable.mv_yn;
        this.selectedRtYN = rowTable.rt_yn;
        this.selectedUseYN = rowTable.use_yn;
        this.selectedRemark = rowTable.re_mark;
        this.selectedLctSAP = rowTable.sap_lct_cd;
        this.selectedManagerNm = rowTable.manager_nm;
        this.selectedManagerId = rowTable.manager_id;
    }

    onResetUpdate() {
        this.setData(this.selectedRowTable);
    }

    lctSAPs!: any;

    selectedLctNo: string = '';
    selectedLctName: string = '';
    selectedMtYN: string = 'N';
    selectedMvYN: string = 'N';
    selectedRtYN: string = 'N';
    selectedUseYN: string = 'Y';
    selectedRemark: string = '';
    selectedLctSAP: string = '';
    selectedManagerNm: string = '';
    selectedManagerId: string = '';
    isRoot: boolean = false;

    isShowDialog: boolean = false;
    isEdit: boolean = false;
    rowTableEdit: any = null;
    selectedRowTable: any = null;

    getBaseData(lctno: any, manager_nm: string, manager_id: string) {
        const token = localStorage.getItem(Name_Token);
        let name, id = '';
        if (token) {
            id = JSON.parse(token).id;
            name = JSON.parse(token).name;
        }
        return {
            mt_yn: 'N',
            mv_yn: 'N',
            rt_yn: 'N',
            use_yn: 'Y',
            manager_nm: token ? JSON.parse(token).name : manager_nm,
            manager_id: token ? JSON.parse(token).id : manager_id,
            lctno: lctno,
        }
    }

    openAddNew() {
        this.isShowDialog = this.isRoot = true;
        this.isEdit = false;
        this.setData(this.getBaseData(this.valLanguage.Create_Root_Location[this.optionLanguage], '', ''))
        this.selectedRowTable = this.getBaseData(this.valLanguage.Create_Root_Location[this.optionLanguage], '', '');
    }

    onRowAddInit(lctno: any, rowNum: number) {
        this.isShowDialog = true;
        this.isEdit = this.isRoot = false;
        this.selectedRow = rowNum;
        this.sv.getLocOne(lctno).subscribe({
            next: (response) => {
                this.selectedRowTable = this.getBaseData(this.valLanguage.Create_Sub_Location[this.optionLanguage] + " " + response.lctno, response.manager_nm, response.manager_id);
                this.setData(this.getBaseData(1, response.manager_nm, response.manager_id));
                this.selectedLctNo = this.valLanguage.Create_Sub_Location[this.optionLanguage] + " " + response.lctno;
            }
        })
    }

    onRowEditInit(lctno: any, rowNum: number) {
        this.isShowDialog = this.isEdit = true;
        this.isRoot = false;
        this.selectedRow = rowNum;
        this.sv.getLocOne(lctno).subscribe({
            next: (response) => {
                this.selectedRowTable = response;
                this.setData(response);
            }
        })
    }

    onEditCancel() {
        this.isShowDialog = false;
        this.selectedRow = undefined;
    }

    onSaved() {
        this.rowTableEdit = {
            lctno: this.isRoot ? '1' : this.selectedRowTable.lctno,
            lct_nm: this.selectedLctName ? this.selectedLctName : '',
            mt_yn: this.selectedMtYN ? this.selectedMtYN : '',
            mv_yn: this.selectedMvYN ? this.selectedMvYN : '',
            rt_yn: this.selectedRtYN ? this.selectedRtYN : '',
            use_yn: this.selectedUseYN ? this.selectedUseYN : '',
            re_mark: this.selectedRemark ? this.selectedRemark : '',
            sap_lct_cd: this.selectedLctSAP ? this.selectedLctSAP : '',
            manager_nm: this.selectedManagerNm ? this.selectedManagerNm : '',
            manager_id: this.selectedManagerId ? this.selectedManagerId : '',
            level_cd: this.isRoot ? '' : this.selectedRowTable.level_cd,
            up_lct_cd: this.isRoot ? '' : this.selectedRowTable.up_lct_cd,
            lct_cd: this.isRoot ? '' : this.selectedRowTable.lct_cd,
            root_yn: this.isRoot ? 'Y' : 'N',
        }

        if (this.isEdit) {
            this.sv.updateLocMgt(this.rowTableEdit).subscribe({
                next: () => {
                    this.data = this.data.map((item: any) => {
                        if (item.lctno == this.rowTableEdit.lctno) {
                            return {
                                ...item,
                                ...this.rowTableEdit,
                                chg_dt_ymd: new Date(),
                                manager_nm: this.selectedManagerId,
                                mn_full: this.selectedLctName
                            }
                        } else {
                            return item;
                        }
                    })
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update successfully!' });
                    this.isShowDialog = this.loadingTable = false;
                }, error: () => {
                    this.loadingTable = false;
                    this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'Update failed!' });
                },
            })
        } else {
            this.sv.insertLocMgt(this.rowTableEdit).subscribe({
                next: (response) => {
                    const match = response.match(/'([^']*)'/);
                    if (match) {
                        const result = match[1];
                        this.sv.getLocOne(result).subscribe({
                            next: (newItem) => {
                                this.data = [
                                    newItem,
                                    ...this.data,
                                ];

                                this.loadingTable = this.isShowDialog = false;
                                this.selectedRow = 0;
                            }, error: () => {
                                this.loadingTable = false;
                                this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'Fetch failed!' });
                            }
                        });

                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Create new menu successfully!' });
                    } else {
                        this.loadingTable = false;
                        this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'Create failed!' });
                    }

                }, error: () => {
                    this.loadingTable = false;
                    this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'Create failed!' });
                },
            })
        }
    }

    exportToExcel() {
        let data: any[] = [];
        if (this.dt1.filteredValue && Array.isArray(this.dt1.filteredValue)) {
            this.dt1.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    'Location Code': emp.lct_cd,
                    'Location Name': emp.lct_nm,
                    'Full Name': emp.mn_full,
                    'Levle NM': emp.level_cd,
                    'Maintenace': emp.mt_yn,
                    'Movement': emp.mv_yn,
                    'Rental': emp.rt_yn,
                    'Manager Name': emp.manager_nm,
                    'Use YN': emp.use_yn,
                    'Remark': emp.re_mark,
                    'Reg Name': emp.reg_nm,
                    'Reg Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd,
                };
                data.push(rowData);
            });
        } else {
            this.data.forEach((emp: any) => {
                const rowData: any = {
                    'Department Code': emp.depart_cd,
                    'Department Name': emp.depart_nm,
                    'Use Y/N': emp.use_yn,
                    'Description': emp.re_mark,
                    'Create Name': emp.reg_nm,
                    'Create Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Update Name': emp.chg_nm,
                    'Update Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd,
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'Location Management', 'data');
        }
    }

    private loadData(): void {
        this.loadingTable = true;

        this.sv.selectLocMgt(50).subscribe({
            next: (data) => {
                this.initialValue = this.data = data.rows;
                this.totalRecords = data.records;
                this.loadingTable = false;

                forkJoin({
                    fullData: this.sv.selectLocMgt(this.totalRecords),
                    lctSAPs: this.sv.getSapLoc()
                }).subscribe({
                    next: (response: any) => {
                        this.data = response.fullData.rows;

                        this.data.forEach((ele: any) => {
                            let ele_r: any = ele;
                            if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                                ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                            }
                            if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                                ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                            }
                            return ele;
                        })
                        this.initialValue = this.data;

                        this.lctSAPs = response.lctSAPs.filter((item: any) => item.sap_lct_nm !== '').map((item: any) => ({ label: item.sap_lct_nm, value: item.sap_lct_cd }));
                    }
                }
                )
            }
        })
    }

    @ViewChild('dt1') dt1!: Table;
    isSorted: boolean | null = null;

    onClearTableFilter() {
        this.reg_date_input = '';
    }

    onClearTable(table: Table) {
        table.clear();
        this.onClearTableFilter();
        // this.filterTable();
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

    isVisible: boolean = true;

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

}
