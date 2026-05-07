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
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { forkJoin } from 'rxjs';
import { LanguageType } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { SystemService } from '../system.service';
interface Column {
    field: string;
    header: string;
    type: 'Text' | "Date" | "Number" | "Option" | "MultiSelect" | 'Null';
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-use-management',
    imports: [TabsModule, FloatLabel, TextareaModule, MultiSelectModule, IconFieldModule, TagModule, InputIconModule, InputTextModule, TableModule, ButtonModule, SelectModule, FormsModule, InputGroupModule, InputGroupAddonModule, DatePickerModule, RadioButtonModule, CommonModule],
    providers: [SystemService, MessageService],
    standalone: true,
    templateUrl: './tpm_item_information.html',
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
export class TPMItemInformationSystem implements OnInit {
    loadingTable: boolean = false;

    visible: boolean = false;

    cols!: Column[];
    exportColumns!: ExportColumn[];
    dataItem!: any;
    dataStatus!: any;
    initialValueItem!: any;
    initialValueStatus!: any;
    rows = 50;
    first = 0;
    useYNTableFilterValue: string | null = null;
    selectedName: string = '';
    selectedOrder: number = 1;
    selectedExplain: string = '';
    selectedUseYN: string = 'Y';
    valueStatus: 'Item' | 'Status' = 'Item';

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
            { field: 'dt_cd', header: this.valLanguage.grid_Code[this.optionLanguage], type: 'Text' },
            { field: 'dt_nm', header: this.valLanguage.grid_Name[this.optionLanguage], type: 'Text' },
            { field: 'dt_exp', header: this.valLanguage.grid_Explain[this.optionLanguage], type: 'Text' },
            { field: 'use_yn', header: this.valLanguage.grid_UseYN[this.optionLanguage], type: 'Option' },
            { field: 'dt_order', header: this.valLanguage.grid_Order_Number[this.optionLanguage], type: 'Text' },
            { field: 'reg_nm', header: this.valLanguage.grid_Reg_Name[this.optionLanguage], type: 'Text' },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Reg_Date[this.optionLanguage], type: 'Date' },
            { field: 'chg_nm', header: this.valLanguage.grid_Update_Name[this.optionLanguage], type: 'Null' },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Storage_Loca[this.optionLanguage], type: 'Null' },
        ];

        this.ysList = [
            { label: "Use", value: "Y" },
            { label: "UnUse", value: "N" },
        ]

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    clonedTables: { [s: string]: {} } = {};

    onRowEditInit(rowTable: any) {
        this.clonedTables[rowTable.cdid as string] = { ...rowTable };
    }

    onRowEditSave(rowTable: any) {
        delete this.clonedTables[rowTable.cdid as string];

        this.sv.updateParentCate_TPMItemInformation(rowTable).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update successfully!' });
            }
        });
    }

    onRowEditCancel(rowTable: any, index: number) {
        if (this.valueStatus = 'Item') {
            this.dataItem[index] = this.clonedTables[rowTable.cdid as string];
        } else {
            this.dataStatus[index] = this.clonedTables[rowTable.cdid as string];
        }
        delete this.clonedTables[rowTable.cdid as string];
    }

    onRowClick(i: number): void {
        this.selectedRow = i;
    }

    exportToExcel() {
        let data: any[] = [];
        if (this.dt1.filteredValue && Array.isArray(this.dt1.filteredValue)) {
            this.dt1.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    'Menu Name': emp.mn_nm,
                    'Full Name': emp.mn_full,
                    'URL': emp.url_link,
                    'USE YN': emp.use_yn,
                    'Order No': emp.order_no,
                    'Reg Name': emp.reg_nm,
                    'Reg Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Chage Name': emp.chg_nm,
                    'Chage Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd,
                };
                data.push(rowData);
            });
        } else {
            if (this.valueStatus == 'Item') {
                this.dataItem.forEach((emp: any) => {
                    const rowData: any = {
                        'Menu Name': emp.mn_nm,
                        'Full Name': emp.mn_full,
                        'URL': emp.url_link,
                        'USE YN': emp.use_yn,
                        'Order No': emp.order_no,
                        'Reg Name': emp.reg_nm,
                        'Reg Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                        'Chage Name': emp.chg_nm,
                        'Chage Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd,
                    };
                    data.push(rowData);
                });
            } else {
                this.dataStatus.forEach((emp: any) => {
                    const rowData: any = {
                        'Menu Name': emp.mn_nm,
                        'Full Name': emp.mn_full,
                        'URL': emp.url_link,
                        'USE YN': emp.use_yn,
                        'Order No': emp.order_no,
                        'Reg Name': emp.reg_nm,
                        'Reg Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                        'Chage Name': emp.chg_nm,
                        'Chage Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd,
                    };
                    data.push(rowData);
                });
            }
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'Menu Management', 'data');
        }
    }

    private loadData(): void {
        this.loadingTable = true;

        forkJoin({
            dataItem: this.sv.selectParentCate('013'),
            dataStatus: this.sv.selectParentCate('015'),
        }).subscribe({
            next: (response: any) => {
                this.dataItem = response.dataItem.rows;
                this.dataStatus = response.dataStatus.rows;

                this.dataItem.forEach((ele: any) => {
                    let ele_r: any = ele;
                    if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                        ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                    }
                    return ele;
                })
                this.dataStatus.forEach((ele: any) => {
                    let ele_r: any = ele;
                    if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                        ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                    }
                    return ele;
                })

                // this.totalRecords1 = response.dataItem.records;
                // this.totalRecords2 = response.dataStatus.records;
                this.loadingTable = false;
                this.initialValueItem = this.dataItem;
                this.initialValueStatus = this.dataStatus;
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
            this.valueStatus == 'Item' ? this.dataItem = [...this.initialValueItem] : this.dataStatus = [...this.initialValueStatus];
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

    onRefresh() {
        this.selectedName = '';
        this.selectedExplain = '';
        this.selectedUseYN = 'Y';
        this.selectedOrder = 1;
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

    onCreate() {
        this.loadingTable = true;

        const param = {
            mt_cd: this.valueStatus == 'Item' ? '013' : '015',
            cdid: '1',
            dt_cd: '',
            name: this.selectedName,
            use_yn: this.selectedUseYN,
            dt_order: String(this.selectedOrder),
            explain: this.selectedExplain,
        };

        this.sv.insertParentCate_TPMItemInformation(param).subscribe({
            next: (response) => {
                const match = response.match(/'([^']*)'/);
                if (match) {
                    const result = match[1];
                    this.sv.getParentCateOne(result).subscribe({
                        next: (newItem) => {
                            if (this.valueStatus == 'Item') {
                                this.dataItem = [
                                    newItem,
                                    ...this.dataItem,
                                ];
                            } else {
                                this.dataStatus = [
                                    newItem,
                                    ...this.dataStatus,
                                ];
                            }
                            this.loadingTable = false;
                            this.selectedRow = 0;
                        }
                    });

                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Create new menu successfully!' });
                } else {
                    this.loadingTable = false;
                    console.log("No match found.");
                }

                this.onRefresh();
            }, error: () => this.loadingTable = false
        })
    }
}