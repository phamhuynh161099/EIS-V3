import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MessageService, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { forkJoin } from 'rxjs';
import { LanguageType } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { SystemService } from '../system.service';
interface Column {
    field: string;
    header: string;
    type: 'Text' | 'Date' | 'Number' | 'Option' | 'MultiSelect';
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-use-management',
    imports: [
        ToastModule,
        TextareaModule,
        FloatLabel,
        DialogModule,
        MultiSelectModule,
        IconFieldModule,
        TagModule,
        InputIconModule,
        InputTextModule,
        TableModule,
        ButtonModule,
        SelectModule,
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        DatePickerModule,
        RadioButtonModule,
        CommonModule
    ],
    providers: [SystemService, MessageService],
    standalone: true,
    templateUrl: './user_management.html',
    styles: [
        `
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
                right: 0 !important;
                left: unset !important;
            }

            :host ::ng-deep #datepicker_style .p-datepicker {
                width: 100%;
                height: 100%;
            }

            :host ::ng-deep #include_tags .p-select-option {
                padding: 4px 0 4px 0 !important;
            }
            :host ::ng-deep .p-dialog-content {
                overflow-y: unset;
            }
            :host ::ng-deep #apply_btn button {
                width: 100% !important;
            }

            :host ::ng-deep #multiselect p-iconfield > .p-inputtext,
            :host ::ng-deep p-columnfilterformelement {
                width: 100% !important;
            }

            :host ::ng-deep #grade_filter p-overlay .p-overlay {
                min-width: 200px !important;
            }

            @media (min-width: 768px) {
                :host ::ng-deep #search_dialog .p-dialog {
                    height: 50rem /* 800px */;
                }
            }
            @media (max-width: 768px) {
                :host ::ng-deep #search_dialog .p-dialog {
                    height: 100vh /* 800px */;
                    max-height: 100% !important;
                }
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
        `
    ]
})
export class UserManagementSystem implements OnInit {
    loading: boolean = false;
    loadingTable: boolean = false;
    loadingStorage: boolean = false;
    now = new Date();

    corps!: any[];
    grades!: any[];

    selectedCorp: string | null = null;
    selectedGrade: string | null = null;

    listOption!: any;

    corpTableFilterValue: string[] = [];
    gradeTableFilterValue: string[] = [];

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
    allRecords = 0;

    constructor(
        private sv: SystemService,
        public global_sv: GlobalsService,
        private messageService: MessageService
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
                if (this.valLanguage !== null) {
                    this.reloadPage();
                }
            });
        } else {
            this.reloadPage();
        }
    }

    reloadPage() {
        this.loadData();

        this.cols = [
            { field: 'userid', header: this.valLanguage.grid_User_Id[this.optionLanguage], type: 'Text' },
            { field: 'uname', header: this.valLanguage.grid_User_Name[this.optionLanguage], type: 'Text' },
            { field: 'corp_nm', header: this.valLanguage.grid_Corp[this.optionLanguage], type: 'MultiSelect' },
            { field: 'grade_nm', header: this.valLanguage.grid_Grade[this.optionLanguage], type: 'MultiSelect' },
            { field: 'cell_nb', header: this.valLanguage.grid_Cell_Number[this.optionLanguage], type: 'Text' },
            { field: 'e_mail', header: this.valLanguage.grid_EMail[this.optionLanguage], type: 'Text' },
            { field: 'memo', header: this.valLanguage.grid_Memo[this.optionLanguage], type: 'Text' },
            { field: 'reg_nm', header: this.valLanguage.grid_Reg_Name[this.optionLanguage], type: 'Text' },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Reg_Date[this.optionLanguage], type: 'Date' },
            { field: 'chg_nm', header: this.valLanguage.grid_Change_Name[this.optionLanguage], type: 'Text' },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Change_Date[this.optionLanguage], type: 'Date' }
        ];

        this.listOption = {
            corp_nm: this.corps,
            grade_nm: this.grades
        };

        this.screenAlarms = [
            { label: 'Recept', value: 'Y' },
            { label: 'Non Recept', value: 'N' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    @ViewChild('ms_corp_nm') ms_corp_nm!: MultiSelect;
    @ViewChild('ms_grade_nm') ms_grade_nm!: MultiSelect;

    selectAllCorpTable: boolean = false;
    selectAllGradeTable: boolean = false;

    onSelectAllChangeTable(event: any, field: 'corp_nm' | 'grade_nm') {
        switch (field) {
            case 'corp_nm':
                this.corpTableFilterValue = event.checked ? [...this.ms_corp_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllCorpTable = event.checked;
                break;
            case 'grade_nm':
                this.gradeTableFilterValue = event.checked ? [...this.ms_grade_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllGradeTable = event.checked;
                break;
        }
    }

    onRowEditInit(rowTable: any, rowNum: number) {
        this.isShowDialog = true;
        this.selectedRow = rowNum;
        this.selectedRowTable = rowTable;

        this.setData(rowTable);
    }

    setData(rowTable: any) {
        this.selectedUserId = rowTable.userid ? rowTable.userid : '';
        this.selectedUserName = rowTable.uname ? rowTable.uname : '';
        this.selectedCorpNm = rowTable.corp ? rowTable.corp : '';
        this.selectedGradeNm = rowTable.grade ? rowTable.grade : '';
        this.selectedCelNm = rowTable.cell_nb ? rowTable.cell_nb : '';
        this.selectedMemo = rowTable.memo ? rowTable.memo : '';
        this.selectedEmail = rowTable.e_mail ? rowTable.e_mail : '';
        this.selectedScreenAlarm = rowTable.scr_yn ? rowTable.scr_yn : '';
        this.selectedMail = rowTable.mail_yn ? rowTable.mail_yn : '';
        this.selectedPwd = '';
    }

    onResetUpdate() {
        this.setData(this.selectedRowTable);
    }

    isShowDialog: boolean = false;
    rowTableEdit: any = null;
    selectedRowTable: any = null;

    onCreate() {
        this.selectedRow = undefined;
        this.isShowDialog = true;
    }

    onEditSaved() {
        this.rowTableEdit = {
            scr_yn: this.selectedScreenAlarm,
            mail_yn: this.selectedMail,
            memo: this.selectedMemo,
            userid: this.selectedUserId,
            uname: this.selectedUserName,
            upw: this.selectedPwd,
            corp: this.selectedCorpNm ? this.selectedCorpNm : '',
            grade: this.selectedGradeNm ? this.selectedGradeNm : '',
            cell_nb: this.selectedCelNm,
            e_mail: this.selectedEmail
        };

        this.sv.updateUserManagement(this.rowTableEdit).subscribe({
            next: () => {
                this.data = this.data.map((item: any) => {
                    if (item.userid == this.rowTableEdit.userid) {
                        return {
                            ...item,
                            ...this.rowTableEdit,
                            chg_dt_ymd: new Date(),
                            corp_nm: this.selectedCorpNm ? this.corps.filter((item) => item.value == this.selectedCorpNm)[0].label : null,
                            grade_nm: this.selectedGradeNm ? this.grades.filter((item) => item.value == this.selectedGradeNm)[0].label : null
                        };
                    } else {
                        return item;
                    }
                });
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update successfully!' });
                this.isShowDialog = false;
            },
            error: () => {
                this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'Update failed!' });
            }
        });
    }

    onRowClick(i: number): void {
        this.selectedRow = i;
    }

    onEditCancel() {
        this.isShowDialog = false;
        this.selectedRow = undefined;
    }

    screenAlarms: any = [];
    selectedScreenAlarm: string = '';
    selectedMail: string = '';
    selectedUserId: string = '';
    selectedUserName: string = '';
    selectedMemo: string = '';
    selectedCorpNm: string = '';
    selectedPwd: string = '';
    selectedGradeNm: string = '';
    selectedCelNm: string = '';
    selectedEmail: string = '';

    exportToExcel() {
        let data: any[] = [];
        if (this.dt1.filteredValue && Array.isArray(this.dt1.filteredValue)) {
            this.dt1.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    'User Id': emp.userid,
                    'User Name': emp.uname,
                    Corp: emp.corp_nm,
                    Grade: emp.grade_nm,
                    'Cell Number': emp.cell_nb,
                    'E-Mail': emp.e_mail,
                    Memo: emp.memo,
                    'Reg Name': emp.reg_nm,
                    'Reg Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Chage Name': emp.chg_nm,
                    'Chage Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        } else {
            this.data.forEach((emp: any) => {
                const rowData: any = {
                    'User Id': emp.userid,
                    'User Name': emp.uname,
                    Corp: emp.corp_nm,
                    Grade: emp.grade_nm,
                    'Cell Number': emp.cell_nb,
                    'E-Mail': emp.e_mail,
                    Memo: emp.memo,
                    'Reg Name': emp.reg_nm,
                    'Reg Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Chage Name': emp.chg_nm,
                    'Chage Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'User Management', 'data');
        }
    }

    private loadData(): void {
        this.loading = true;
        this.loadingTable = true;
        const now = this.global_sv.formatDateFilter(new Date());

        this.sv.getUserManagement(50, now).subscribe({
            next: (data) => {
                this.data = data.rows;
                this.totalRecords = data.records;
                this.loadingTable = false;

                forkJoin({
                    userManagementData: this.sv.getUserManagement(this.totalRecords, now),
                    corps: this.global_sv.getCorp(),
                    grades: this.global_sv.getGrade()
                }).subscribe({
                    next: (data: any) => {
                        this.data = data.userManagementData.rows;

                        this.data.forEach((ele: any) => {
                            let ele_r: any = ele;
                            if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                                ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                            }
                            if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                                ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                            }
                            return ele;
                        });
                        this.initialValue = this.data;

                        this.page = data.userManagementData.page;

                        this.totalRecords = data.userManagementData.records;
                        this.allRecords = data.userManagementData.records;

                        this.corps = this.global_sv.convertToListFilterNotIncludeNull(data.corps);
                        this.grades = this.global_sv.convertToListFilterNotIncludeNull(data.grades);

                        this.listOption = {
                            corp_nm: this.corps,
                            grade_nm: this.grades
                        };
                        this.loading = false;
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

    @ViewChild('dt1') dt1!: Table;
    isSorted: boolean | null = null;

    onClearTableFilter() {
        this.corpTableFilterValue = [];
        this.reg_date_input = '';
    }

    onClearTable(table: Table) {
        table.clear();
        this.onClearTableFilter();
        this.page = 1;
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
