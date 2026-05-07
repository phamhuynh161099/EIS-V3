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

import { FloatLabel } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { LanguageType } from '../../../../../constants/constants.auth';
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
    imports: [FloatLabel, TextareaModule, MultiSelectModule, IconFieldModule, TagModule, InputIconModule, InputTextModule, TableModule, ButtonModule, SelectModule, FormsModule, InputGroupModule, InputGroupAddonModule, DatePickerModule, RadioButtonModule, CommonModule],
    providers: [SystemService, MessageService],
    standalone: true,
    templateUrl: './department_information.html',
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
export class DepartmentInformationSystem implements OnInit {
    loadingTable: boolean = false;

    visible: boolean = false;

    cols!: Column[];
    exportColumns!: ExportColumn[];
    data!: any;
    initialValue!: any;
    rows = 50;
    first = 0;
    page: number = 1;
    totalRecords = 0;
    useYNTableFilterValue: string | null = null;
    selectedDepartCd: string = '';
    selectedDepartNm: string = '';
    selectedDescription: string = '';
    selectedUseYN: string = 'Y';

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
            { field: 'depart_cd', header: this.valLanguage.grid_Department_Code[this.optionLanguage], type: 'Text' },
            { field: 'depart_nm', header: this.valLanguage.grid_Department_Name[this.optionLanguage], type: 'Text' },
            { field: 'use_yn', header: this.valLanguage.grid_UseYN[this.optionLanguage], type: 'Option' },
            { field: 're_mark', header: this.valLanguage.grid_Description[this.optionLanguage], type: 'Text' },
            { field: 'reg_nm', header: this.valLanguage.grid_Create_Name[this.optionLanguage] , type: 'Text' },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Create_Date[this.optionLanguage] , type: 'Date' },
            { field: 'chg_nm', header: this.valLanguage.grid_Change_Name[this.optionLanguage] , type: 'Text' },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Change_Date[this.optionLanguage], type: 'Date' },
        ];

        this.ysList = [
            { label: "Use", value: "Y"},
            { label: "UnUse", value: "N"},
        ]

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    clonedTables: { [s: string]: {} } = {};

    onRowEditInit(rowTable: any) {
        this.clonedTables[rowTable.depart_cd as string] = { ...rowTable };
    }

    onRowEditSave(rowTable: any) {
        delete this.clonedTables[rowTable.depart_cd as string];
        this.sv.updateDepartmentInfo(rowTable).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update successfully!' });
            }
        });
    }
    
    onRowEditCancel(rowTable: any, index: number) {
        this.data[index] = this.clonedTables[rowTable.depart_cd as string];
        delete this.clonedTables[rowTable.depart_cd as string];
    }

    onRowClick(i: number): void {
        this.selectedRow = i;
    }

    exportToExcel() {
        let data: any[] = [];
        if (this.dt1.filteredValue && Array.isArray(this.dt1.filteredValue)) {
            this.dt1.filteredValue.forEach((emp: any) => {
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
            this.global_sv.exportExcel(data, 'Department Information', 'data');
        }
    }

    private loadData(): void {
        this.loadingTable = true;

        this.sv.selectDepartmentInfo().subscribe({
            next: (data) => {
                this.data = data.rows;
                this.totalRecords = data.records;
                this.loadingTable = false;
                this.page = data.page;


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

    onRefresh(){
        this.selectedDepartCd = '';
        this.selectedDepartNm = '';
        this.selectedDescription = '';
        this.selectedUseYN = 'Y';
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

    onCreate(){
        this.loadingTable = true;
        const param = {
            dpno: '1',
            depart_cd: this.selectedDepartCd,
            depart_nm: this.selectedDepartNm,
            use_yn: this.selectedUseYN,
            re_mark: this.selectedDescription,
        }
        this.sv.insertDepartmentInfo(param).subscribe({
            next: (response) => {
                const match = response.match(/'([^']*)'/);
                if (match) {
                    const result = match[1];
                    this.sv.getDepartmentInfoOne(result).subscribe({
                        next: (newItem) => {
                            this.data = [
                                newItem,
                                ...this.data
                            ];
                            this.loadingTable = false;
                            this.selectedRow = 0;
                        }
                    });

                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Create new menu successfully!' });
                } else {
                    this.loadingTable = false;
                    console.log("No match found.");
                }
                
                this.selectedDepartNm = this.selectedDescription = this.selectedDepartCd = '';
                this.selectedUseYN = 'Y';
            }, error: () => this.loadingTable = false
        })
    }
}