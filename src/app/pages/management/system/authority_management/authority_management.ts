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
import { ToastModule } from 'primeng/toast';
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
    imports: [ToastModule, TabsModule, FloatLabel, TextareaModule, MultiSelectModule, IconFieldModule, TagModule, InputIconModule, InputTextModule, TableModule, ButtonModule, SelectModule, FormsModule, InputGroupModule, InputGroupAddonModule, DatePickerModule, RadioButtonModule, CommonModule],
    providers: [SystemService, MessageService],
    standalone: true,
    templateUrl: './authority_management.html',
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
            padding: 2px 8px 2px 8px;
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
export class AuthorityManagementSystem implements OnInit {
    loadingTable: boolean = false;
    loadingTable1: boolean = false;
    loadingTable2: boolean = false;

    visible: boolean = false;

    cols!: Column[];
    cols1!: Column[];
    cols2!: Column[];
    selectAll1 = false;
    selectAll2 = false;
    exportColumns!: ExportColumn[];
    data!: any;
    data1!: any;
    data2!: any;
    initialValue!: any;
    initialValue1!: any;
    initialValue2!: any;
    rows = 50;
    rows1 = 50;
    rows2 = 50;
    first = 0;
    first1 = 0;
    first2 = 0;
    totalRecords = 0;
    totalRecords1 = 0;
    totalRecords2 = 0;
    useYNTableFilterValue: string | null = null;
    selectedAtno: number = 0;
    selectedAtCd: string = '';
    selectedAtNm: string = '';
    selectedRemark: string = '';
    selectedUseYN: string = 'Y';

    selectedRowTb1: any[] = [];
    selectedRowTb2: any[] = [];
    checkListRowTb2: any[] = [];

    ysList!: any;
    check_ysList!: any;
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
            { field: 'at_cd', header: this.valLanguage.grid_Authority_Code[this.optionLanguage], type: 'Text' },
            { field: 'at_nm', header: this.valLanguage.grid_Authority_Name[this.optionLanguage], type: 'Text' },
            { field: 're_mark', header: this.valLanguage.grid_Remark[this.optionLanguage], type: 'Option' },
            { field: 'use_yn', header: this.valLanguage.grid_UseYN[this.optionLanguage], type: 'Text' },
            { field: 'reg_nm', header: this.valLanguage.grid_Reg_Name[this.optionLanguage], type: 'Text' },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Reg_Date[this.optionLanguage], type: 'Date' },
            { field: 'chg_nm', header: this.valLanguage.grid_Change_Name[this.optionLanguage], type: 'Text' },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Change_Date[this.optionLanguage], type: 'Date' },
        ];

        this.cols1 = [
            { field: 'rnum', header: '', type: 'Null' },
            { field: 'check_yn', header: '', type: 'Null' },
            { field: 'userid', header: this.valLanguage.grid_User_Id[this.optionLanguage], type: 'Text' },
            { field: 'uname', header: this.valLanguage.grid_User_Name[this.optionLanguage], type: 'Text' },
            { field: 're_mark', header: this.valLanguage.grid_Nickname[this.optionLanguage], type: 'Text' },
            { field: 'nick_name', header: this.valLanguage.grid_Reg_Name[this.optionLanguage], type: 'Text' },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Reg_Date[this.optionLanguage], type: 'Date' },
            { field: 'chg_nm', header: this.valLanguage.grid_Change_Name[this.optionLanguage], type: 'Text' },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Change_Date[this.optionLanguage], type: 'Date' },
        ];

        this.cols2 = [
            { field: 'rnum', header: '', type: 'Null' },
            { field: 'check_yn', header: '', type: 'Null' },
            { field: 'mn_nm', header: this.valLanguage.grid_Menu_Name[this.optionLanguage], type: 'Text' },
            { field: 'mn_full', header: this.valLanguage.grid_Full_Name[this.optionLanguage], type: 'Text' },
            { field: 'ct_yn', header: this.valLanguage.grid_RegisterYN[this.optionLanguage], type: 'Option' },
            { field: 'mt_yn', header: this.valLanguage.grid_ModifyYN[this.optionLanguage], type: 'Option' },
            { field: 'del_yn', header: this.valLanguage.grid_DeleteYN[this.optionLanguage], type: 'Option' },
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

        this.check_ysList = [
            { label: "Check", value: "Y" },
            { label: "UnCheck", value: "N" },
        ]

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    checkYNTable1FilterValue: string | null = null;
    checkYNTable2FilterValue: string | null = null;
    ctYNTableFilterValue: string | null = null;
    mtYNTableFilterValue: string | null = null;
    delYNTableFilterValue: string | null = null;

    pageChange1(event: any) {
        this.first1 = event.first;
        this.rows1 = event.rows;
        this.selectAll1 = false;
    }

    pageChange2(event: any) {
        this.first2 = event.first;
        this.rows2 = event.rows;
        this.selectAll2 = false;
    }

    onSave() {
        this.loading();
        const param = {
            atno: String(this.selectedAtno),
            at_cd: this.selectedAtCd,
            at_nm: this.selectedAtNm,
            use_yn: this.selectedUseYN,
            re_mark: this.selectedRemark,
        }
        if (this.valueStatus == 'cre') {
            this.sv.insertAuthMgt(param).subscribe({
                next: (response) => {
                    const match = response.match(/'([^']*)'/);
                    if (match) {
                        const result = match[1];
                        this.sv.getAuthMgt(result).subscribe({
                            next: (newItem) => {
                                this.data = [
                                    {
                                        ...newItem,
                                        chg_dt_ymd: new Date(<Date>newItem.chg_dt_ymd),
                                        reg_dt_ymd: new Date(<Date>newItem.reg_dt_ymd),
                                    },
                                    ...this.data
                                ];
                                this.unloading();
                                this.selectedRowAtCd = newItem.at_cd;
                                this.onCreate();
                            }
                        });

                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Create successfully!' });
                    } else {
                        this.unloading();
                        console.log("No match found.");
                    }

                    this.onRefresh();
                }, error: () => this.unloading()
            })
        } else {
            this.sv.updateAuthMgt(param).subscribe({
                next: (response) => {
                    const match = response.match(/'([^']*)'/);
                    if (match) {
                        const result = match[1];
                        this.sv.getAuthMgt(result).subscribe({
                            next: (newItem) => {
                                const convertedItem = {
                                    ...newItem,
                                    chg_dt_ymd: new Date(<Date>newItem.chg_dt_ymd),
                                    reg_dt_ymd: new Date(<Date>newItem.reg_dt_ymd),
                                };

                                this.data = this.data.map((item: any) => item.atno == newItem.atno ? convertedItem : item)
                                this.unloading();
                            }
                        });

                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update successfully!' });
                    } else {
                        this.unloading();
                        console.log("No match found.");
                    }

                }, error: () => this.unloading()
            })
        }
    }

    onSaveMemberInfo() {
        if (!this.selectedRowAtCd) return;
        this.loading();

        this.sv.delAuthMemberInfo(this.selectedRowAtCd).subscribe({
            next: () => {
                let list: any = [];

                this.selectedRowTb1.forEach((item: any, idx: number) => {
                    const param = {
                        at_cd: item.at_cd,
                        rnum: String(item.rnum),
                        userid: item.userid,
                    }

                    list[idx] = this.sv.saveAuthMemberInfo(param);
                })

                if (list.length > 0) {
                    if (list.length > 100) this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Uploading...Please wait!' });
                    forkJoin(...list).subscribe(
                        () => {
                            this.sv.selectAuthMemberInfo(this.selectedRowAtCd!, this.totalRecords1).subscribe({
                                next: (data) => {
                                    this.selectedRowTb1 = data.rows.filter((item: any) => item.check_yn == "Y");
                                    this.data1 = this.updateDataDisplay(data.rows);
                                    this.initialValue1 = this.data1;
                                    this.unloading();
                                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update successfully!' });
                                }
                            })
                        },
                        error => {
                            alert('An error occurred:' + error);
                            this.unloading();
                        }
                    );
                } else {
                    this.sv.selectAuthMemberInfo(this.selectedRowAtCd!, this.totalRecords1).subscribe({
                        next: (data) => {
                            this.selectedRowTb1 = data.rows.filter((item: any) => item.check_yn == "Y");
                            this.data1 = this.updateDataDisplay(data.rows);
                            this.initialValue1 = this.data1;
                            this.unloading();
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update successfully!' });
                        }
                    })
                }
                this.selectAll1 = false;
            }
        })

    }
    showModifyToast() {
        if (this.valueStatus == 'cre') this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please select row data' });
    }

    onSaveMenuInfo() {
        this.loading();
        this.sv.delAuthMenuInfo(this.selectedRowAtCd!).subscribe({
            next: () => {
                const param = this.selectedRowTb2.filter((dt: any) => this.checkListRowTb2.includes(dt.mnno)).map((item: any) => {
                    return {
                        at_cd: item.at_cd ? item.at_cd : '',
                        ct_yn: item.ct_yn ? item.ct_yn : 'N',
                        del_yn: item.del_yn ? item.del_yn : 'N',
                        mn_cd: item.mn_cd ? item.mn_cd : '',
                        mn_cd_full: item.mn_cd_full ? item.mn_cd_full : '',
                        mt_yn: item.mt_yn ? item.mt_yn : 'N',
                        re_mark: item.re_mark ? item.re_mark : '',
                        rnum: item.rnum ? String(item.rnum) : '',
                        st_yn: item.st_yn ? item.st_yn : '',
                        use_yn: item.use_yn ? item.use_yn : '',
                    };
                })

                this.sv.saveAuthMenuInfo(param).subscribe({
                    next: () => {
                        this.sv.selectAuthMenuInfo(this.selectedRowAtCd!, this.totalRecords2).subscribe({
                            next: (data) => {
                                this.selectedRowTb2 = data.rows.filter((item: any) => item.check_yn == "Y");
                                this.data2 = this.updateDataDisplay(data.rows);
                                this.initialValue2 = this.data2;

                                this.unloading();;
                                this.selectAll2 = false;
                                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update successfully!' });
                            }
                        })
                    }
                });
            }
        })
    }

    loading() { this.loadingTable1 = this.loadingTable2 = this.loadingTable = true };
    unloading() { this.loadingTable1 = this.loadingTable2 = this.loadingTable = false };

    onRowClick(information: any): void {
        if (this.loadingTable1 == false && this.loadingTable2 == false && this.loadingTable == false) {
            this.selectedRowAtCd = information.at_cd;
            this.loading();
            this.selectAll1 = this.selectAll2 = false;
            forkJoin({
                memberInfo: this.sv.selectAuthMemberInfo(information.at_cd, this.totalRecords1 ? this.totalRecords1 : 1500),
                menuInfo: this.sv.selectAuthMenuInfo(information.at_cd, this.totalRecords2 ? this.totalRecords2 : 200),
            }).subscribe({
                next: (data: any) => {

                    this.data1 = this.updateDataDisplay(data.memberInfo.rows);
                    this.data2 = this.updateDataDisplay(data.menuInfo.rows);

                    this.selectedRowTb1 = this.data1.filter((item: any) => item.check_yn == "Y");
                    this.selectedRowTb2 = this.data2.filter((item: any) => item.check_yn == "Y");
                    this.checkListRowTb2 = this.selectedRowTb2.map((item) => item.mnno);

                    this.totalRecords1 = data.memberInfo.records;
                    this.totalRecords2 = data.menuInfo.records;

                    this.initialValue1 = this.data1;
                    this.initialValue2 = this.data2;

                    this.unloading();
                    this.onModify(information);
                }
            })
        }

    }

    private loadData(): void {
        this.loadingTable = true;

        this.sv.selectAuthMgt(50).subscribe({
            next: (data) => {
                this.data = this.initialValue = data.rows;
                this.totalRecords = data.records;
                this.loadingTable = false;

                forkJoin({
                    fullData: this.sv.selectAuthMgt(this.totalRecords),
                    memberInfo: this.sv.selectAuthMemberInfo("000", this.totalRecords1),
                    menuInfo: this.sv.selectAuthMenuInfo("000", this.totalRecords2),
                }).subscribe({
                    next: (data: any) => {
                        this.data1 = data.memberInfo.rows;
                        this.data2 = data.menuInfo.rows;

                        this.totalRecords = data.fullData.records;

                        this.data = this.updateDataDisplay(data.fullData.rows);

                        this.initialValue = this.data;

                    }
                })
            }
        })
    }

    updateDataDisplay(data: any) {
        return data.map((ele: any) => {
            let ele_r: any = ele;
            if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
            }
            if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
            }
            return ele;
        })
    }

    @ViewChild('dt') dt!: Table;
    @ViewChild('dt1') dt1!: Table;
    @ViewChild('dt2') dt2!: Table;
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
            this.dt.reset();
        }
    }

    onRowClickTb1(data: any) {
        this.selectedRowTb1.includes(data) ? this.selectedRowTb1 = this.selectedRowTb1.filter((ri) => ri != data) : this.selectedRowTb1.push(data);
    }
    onRowClickTb2(data: any) {
        const check = this.selectedRowTb2.filter((item) => item.mnno == data.mnno)[0];
        if (check) {
            this.selectedRowTb2 = this.selectedRowTb2.map((item) => item.mnno == check.mnno ? check : item);
        } else {
            this.selectedRowTb2.push(data);
        }
        this.checkListRowTb2.includes(data.mnno) ? this.checkListRowTb2 = this.checkListRowTb2.filter((ri) => ri != data.mnno) : this.checkListRowTb2.push(data.mnno);
    }
    onChangeTb2Attr(data: any, field: 'ct_yn' | 'mt_yn' | 'del_yn') {
        const check = this.selectedRowTb2.filter((item) => data.mnno == item.mnno)[0];
        if (check) {
            this.selectedRowTb2 = this.selectedRowTb2.map((item: any) => item.mnno === data.mnno ? { ...item, [field]: item[field] == 'Y' ? 'N' : 'Y' } : item);
        } else {
            data[field] = data[field] == 'Y' ? 'N' : 'Y';
            this.selectedRowTb2.push(data);
        }
    }

    customSort1(event: SortEvent) {
        if (this.isSorted == null || this.isSorted === undefined) {
            this.isSorted = true;
            this.global_sv.sortTableData(event);
        } else if (this.isSorted == true) {
            this.isSorted = false;
            this.global_sv.sortTableData(event);
        } else if (this.isSorted == false) {
            this.isSorted = null;
            this.data1 = [...this.initialValue1];
            this.dt1.reset();
        }
    }

    customSort2(event: SortEvent) {
        if (this.isSorted == null || this.isSorted === undefined) {
            this.isSorted = true;
            this.global_sv.sortTableData(event);
        } else if (this.isSorted == true) {
            this.isSorted = false;
            this.global_sv.sortTableData(event);
        } else if (this.isSorted == false) {
            this.isSorted = null;
            this.data2 = [...this.initialValue2];
            this.dt2.reset();
        }
    }

    selectedRowAtCd: string | undefined = undefined;

    isVisible: boolean = true;
    isVisible1: boolean = true;
    isVisible2: boolean = true;

    showFilter() {
        if (this.isVisible === true) {
            this.isVisible = false;
        } else {
            this.isVisible = true;
        }
    }
    showFilter1() {
        if (this.isVisible1 === true) {
            this.isVisible1 = false;
        } else {
            this.isVisible1 = true;
        }
    }
    showFilter2() {
        if (this.isVisible2 === true) {
            this.isVisible2 = false;
        } else {
            this.isVisible2 = true;
        }
    }

    onChangeSelectAll1() {
        if (this.selectAll1) {
            if (this.dt1.filteredValue && Array.isArray(this.dt1.filteredValue)) {
                this.selectedRowTb1 = [...this.selectedRowTb1, ...this.dt1.filteredValue];
            } else {
                this.selectedRowTb1 = [...this.selectedRowTb1, ...this.data1.filter((_: any, i: number) => i >= this.first1 && i < this.first1 + this.rows1)];
            }
        } else {
            this.selectedRowTb1 = [];
        }
    }
    onChangeSelectAll2() {
        if (this.selectAll2) {
            if (this.dt2.filteredValue && Array.isArray(this.dt2.filteredValue)) {
                // chỉ lấy list chưa có vì trong list đầu có 3 thuộc tính có thể đã bị đổi, lấy full thì nó đè thêm row mới ('ct_yn' | 'mt_yn' | 'del_yn')
                const listId = this.selectedRowTb2.map((item) => item.mnno);
                const newData = this.dt2.filteredValue.filter((item) => !listId.includes(item.mnno));
                this.selectedRowTb2 = [...this.selectedRowTb2, ...newData];
                this.checkListRowTb2 = [...this.checkListRowTb2, ...this.dt2.filteredValue.map((item) => item.mnno)];
            } else {
                const listId = this.selectedRowTb2.map((item) => item.mnno);
                const newData = this.data2.filter((item: any, i: number) => (i >= this.first2 && i < this.first2 + this.rows2) && !listId.includes(item.mnno));
                this.selectedRowTb2 = [...this.selectedRowTb2, ...newData];
                this.checkListRowTb2 = [...this.checkListRowTb2, ...this.data2.filter((_: any, i: number) => i >= this.first2 && i < this.first2 + this.rows2).map((item: any) => item.mnno)]
            }
        } else {
            this.selectedRowTb2 = this.checkListRowTb2 = [];
        }
    }

    onRefresh() {
        this.selectedAtno = 0;
        this.selectedAtCd = '';
        this.selectedAtNm = '';
        this.selectedRemark = '';
        this.selectedUseYN = 'Y';
        this.valueStatus = 'cre';
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

    valueStatus: 'cre' | 'mod' = 'cre';

    onCreate() {
        this.valueStatus = 'cre';
        this.onRefresh();
    }

    onModify(item: any) {
        this.valueStatus = 'mod';
        this.selectedAtno = item.atno;
        this.selectedAtCd = item.at_cd;
        this.selectedAtNm = item.at_nm;
        this.selectedRemark = item.re_mark;
        this.selectedUseYN = item.use_yn;
    }
}
