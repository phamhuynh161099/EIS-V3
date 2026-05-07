import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
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
import { ToastModule } from 'primeng/toast';

import { MessageService, SortEvent } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { LanguageType } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { SystemService } from '../system.service';
interface Column {
  type: 'Text' | "Date" | "Number" | "Option" | "Null" | 'MultiSelect';
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  providers: [MessageService],
  imports: [CheckboxModule, TooltipModule, ToastModule, MultiSelectModule, IconFieldModule, TagModule, InputIconModule, InputTextModule, TableModule, ButtonModule, SelectModule, FormsModule, InputGroupModule, InputGroupAddonModule, DatePickerModule, RadioButtonModule, CommonModule],
  selector: 'app-location-history_report',
  templateUrl: './user_authority.html',
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

        :host ::ng-deep #multiselect p-iconfield > .p-inputtext,
        :host ::ng-deep p-columnfilterformelement,
        :host ::ng-deep p-columnfilterformelement input,
        :host ::ng-deep p-columnfilterformelement p-select,
        {
            width: 100% !important;
        }

    `]
})


export class UserAuthoritySystem implements OnInit {

  loadingTable: boolean = false;

  selectedUserId: string = '';

  selectedMtNm: string = '';
  selectedMtExp: string = '';
  selectedUseYN: string = 'Y';

  selectedDtCd: string = '';
  selectedDtNm: string = '';
  selectedDtExp: string = '';
  selectedDtOrder: number = 1;

  visible: boolean = false;
  toggleMtl() {
    this.visible = !this.visible;
  }

  cols!: Column[];
  colsTable2!: Column[];
  exportColumns!: ExportColumn[];
  data!: any;
  initialValue!: any;
  rows = 50;
  totalRecords = 0;

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
      { field: 'userid', header: this.valLanguage.grid_User_Id[this.optionLanguage], type: 'Text' },
      { field: 'uname', header: this.valLanguage.grid_User_Name[this.optionLanguage], type: 'Text' },
      { field: 'grade_nm', header: this.valLanguage.grid_Grade[this.optionLanguage], type: 'MultiSelect' },
      { field: 'cell_nb', header: this.valLanguage.grid_Cell_Phone[this.optionLanguage], type: 'Text' },
      { field: 'e_mail', header: this.valLanguage.grid_Email[this.optionLanguage], type: 'Text' },
      { field: 'reg_nm', header: this.valLanguage.grid_Reg_Name[this.optionLanguage], type: 'Text' },
      { field: 'reg_dt_ymd', header: this.valLanguage.grid_Reg_Date[this.optionLanguage], type: 'Date' },
      { field: 'chg_nm', header: this.valLanguage.grid_Change_Name[this.optionLanguage], type: 'Text' },
      { field: 'chg_dt_ymd', header: this.valLanguage.grid_Change_Date[this.optionLanguage], type: 'Date' },
    ];

    this.colsTable2 = [
      { field: 'check_yn', header: '', type: 'Null' },
      { field: 'rnum', header: '', type: 'Null' },
      { field: 'lctno', header: this.valLanguage.grid_Location_No[this.optionLanguage], type: 'Number' },
      { field: 'lct_cd', header: this.valLanguage.grid_Location_Code[this.optionLanguage], type: 'Text' },
      { field: 'lct_nm', header: this.valLanguage.grid_Location_Name[this.optionLanguage], type: 'MultiSelect' },
      { field: 'mn_full', header: this.valLanguage.grid_Full_Name[this.optionLanguage], type: 'Text' },
      { field: 'lct_rfid', header: this.valLanguage.grid_Location_RFID[this.optionLanguage], type: 'Text' },
      { field: 'lct_bar_cd', header: this.valLanguage.grid_Loc_Barcode[this.optionLanguage], type: 'Text' },
      { field: 'sp_yn', header: this.valLanguage.grid_ShippingYN[this.optionLanguage], type: 'Option' },
      { field: 'mv_yn', header: this.valLanguage.grid_MovementYN[this.optionLanguage], type: 'Option' },
      { field: 'ds_yn', header: this.valLanguage.grid_DestroyYN[this.optionLanguage], type: 'Option' },
      { field: 'rt_yn', header: this.valLanguage.grid_RentalYN[this.optionLanguage], type: 'Option' },
      { field: 'use_yn', header: this.valLanguage.grid_UseYN[this.optionLanguage], type: 'Option' },
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

  ysList!: any;
  check_ysList!: any;
  getUseYNColor(status: string) {
    return status == 'Y' ? 'info' : 'danger'
  }

  exportToExcelTb1() {
    let data: any[] = [];
    if (this.dt1.filteredValue && Array.isArray(this.dt1.filteredValue)) {
      this.dt1.filteredValue.forEach((emp: any) => {
        const rowData: any = {
          'User Id': emp.userid,
          'User Name': emp.uname,
          'Grade': emp.grade_nm,
          'Cell Phone': emp.cell_nb,
          'E_mail': emp.e_mail,
          'Reg Name': emp.reg_nm,
          'Reg Date': emp.reg_dt_ymd,
          'Chage Name': emp.chg_nm,
          'Chage Date': emp.chg_dt_ymd,
        };
        data.push(rowData);
      });
    } else {
      this.data.forEach((emp: any) => {
        const rowData: any = {
          'User Id': emp.userid,
          'User Name': emp.uname,
          'Grade': emp.grade_nm,
          'Cell Phone': emp.cell_nb,
          'E_mail': emp.e_mail,
          'Reg Name': emp.reg_nm,
          'Reg Date': emp.reg_dt_ymd,
          'Chage Name': emp.chg_nm,
          'Chage Date': emp.chg_dt_ymd,
        };
        data.push(rowData);
      });
    }
    if (data.length > 0) {
      this.global_sv.exportExcel(data, 'User Authority Member Info', 'data');
    }
  }

  exportToExcelTb2() {
    let data: any[] = [];
    if (this.dt2.filteredValue && Array.isArray(this.dt2.filteredValue)) {
      this.dt2.filteredValue.forEach((emp: any) => {
        const rowData: any = {
          'RNUM': emp.rnum,
          'LCTNO': emp.lctno,
          'Location Code': emp.lct_cd,
          'Location Name': emp.lct_nm,
          'Full Name': emp.mn_full,
          'Location RFID': emp.lct_rfid,
          'Loc BarCode': emp.lct_bar_cd,
          'Shipping': emp.sp_yn,
          'Movement': emp.mv_yn,
          'Destroy': emp.ds_yn,
          'Rental': emp.rt_yn,
          'USE YN': emp.use_yn,
          'Reg Name': emp.reg_nm,
          'Reg Date': emp.reg_dt_ymd,
          'Chage Name': emp.chg_nm,
          'Chage Date': emp.chg_dt_ymd,
        };
        data.push(rowData);
      });
    } else {
      this.data.forEach((emp: any) => {
        const rowData: any = {
          'RNUM': emp.rnum,
          'LCTNO': emp.lctno,
          'Location Code': emp.lct_cd,
          'Location Name': emp.lct_nm,
          'Full Name': emp.mn_full,
          'Location RFID': emp.lct_rfid,
          'Loc BarCode': emp.lct_bar_cd,
          'Shipping': emp.sp_yn,
          'Movement': emp.mv_yn,
          'Destroy': emp.ds_yn,
          'Rental': emp.rt_yn,
          'USE YN': emp.use_yn,
          'Reg Name': emp.reg_nm,
          'Reg Date': emp.reg_dt_ymd,
          'Chage Name': emp.chg_nm,
          'Chage Date': emp.chg_dt_ymd,
        };
        data.push(rowData);
      });
    }
    if (data.length > 0) {
      this.global_sv.exportExcel(data, 'Common Management Detail', 'data');
    }
  }
  first: number = 0;
  grades!: any[];
  locations!: any[];

  useYNTable2FilterValue: string | null = null;
  spYNTable2FilterValue: string | null = null;
  mvYNTable2FilterValue: string | null = null;
  dsYNTable2FilterValue: string | null = null;
  rtYNTable2FilterValue: string | null = null;
  checkYNTableFilterValue: string | null = null;

  private loadData(): void {
    this.loadingTable = true;

    this.sv.getUserAuthManagement(50).subscribe({
      next: (data) => {
        this.initialValue = this.data = data.rows;
        this.totalRecords = data.records;
        this.loadingTable = false;

        forkJoin({
          userAuthManagementData: this.sv.getUserAuthManagement(this.totalRecords),
          locations: this.global_sv.getLctFactory(),
          grades: this.global_sv.getGrade(),
        }).subscribe({
          next: (data: any) => {
            this.data = data.userAuthManagementData.rows;

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

            this.totalRecords = data.userAuthManagementData.records;
            this.grades = this.global_sv.convertToListFilterNotIncludeNull(data.grades);
            this.locations = this.global_sv.convertToListFilterNotIncludeNull(data.locations);

          },
          error: (error) => {
            console.error('Error loading data:', error);
            this.loadingTable = false;
          }
        });

      }
    })
  }

  onSave() {
    this.loadingTable = this.loadingDataTable2 = true;
    this.sv.delMemberLocationInfo(this.selectedUserId).subscribe({
      next: () => {
        let list: any = [];

        this.selectedRowTb2.forEach((item: any, idx: number) => {
          const param = {
            lct_cd: item.lct_cd,
            re_mark: item.re_mark,
            rnum: String(item.rnum),
            use_yn: item.use_yn,
            userid: item.userid,
          }

          list[idx] = this.sv.saveMemberLocationInfo(param);
        })

        if (list.length > 0) {
          forkJoin(...list).subscribe(
            () => {
              this.loadingTable = this.loadingDataTable2 = false;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update successfully!' });
            }
          );
        } else {
          this.loadingTable = this.loadingDataTable2 = false;
        }
      }
    })
  }

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
      this.dataTable2 = [...this.initialTable2];
      this.dt2.reset();
    }
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.selectAll = false;
  }

  selectedRowTb1: number | undefined = undefined;
  selectedRowTb2: any[] = [];
  isVisible: boolean = true;
  isVisible2: boolean = true;
  dataTable2: any[] = [];
  initialTable2: any[] = [];
  loadingDataTable2: boolean = false;
  recordsTable2: number = 0;

  onRowClickTb1(user_id: string, i: number): void {
    this.selectedRowTb1 = i;
    this.loadingDataTable2 = true;
    this.selectedRowTb2 = [];
    this.selectedUserId = user_id;

    this.sv.selectMemberLocMgt(user_id, 50).subscribe({
      next: (response) => {
        this.dataTable2 = response.rows;
        this.dataTable2.forEach((ele: any) => {
          let ele_r: any = ele;
          if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
            ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
          }
          if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
            ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
          }
          return ele;
        })
        this.initialTable2 = this.dataTable2;
        this.recordsTable2 = response.records;
        this.loadingDataTable2 = false;

        this.sv.selectMemberLocMgt(user_id, this.recordsTable2).subscribe({
          next: (response) => {
            this.dataTable2 = response.rows;
            this.dataTable2.forEach((ele: any) => {
              let ele_r: any = ele;
              if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
              }
              if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
              }
              return ele;
            })
            this.initialTable2 = this.dataTable2;
            this.selectedRowTb2 = response.rows.filter((item: any) => item.check_yn == "Y");
          }
        })
      }
    })
  }

  @ViewChild('ms_grade_nm') ms_grade_nm!: MultiSelect;
  @ViewChild('ms_lct_nm') ms_lct_nm!: MultiSelect;

  selectAllLctNmTable: boolean = false;
  selectAllGradeTable: boolean = false;

  gradeTableFilterValue: string[] = [];
  locationTableFilterValue: string[] = [];
  onSelectAllChangeTable(event: any, field: 'grade_nm' | 'lct_nm') {
    switch (field) {
      case 'lct_nm':
        this.locationTableFilterValue = event.checked ? [...this.ms_lct_nm.visibleOptions().map((item: any) => item.label)] : [];
        this.selectAllLctNmTable = event.checked;
        break;
      case 'grade_nm':
        this.gradeTableFilterValue = event.checked ? [...this.ms_grade_nm.visibleOptions().map((item: any) => item.label)] : [];
        this.selectAllGradeTable = event.checked;
        break;
    }
  }

  onRowClickTb2(user: any): void {
    this.selectedRowTb2.includes(user) ? this.selectedRowTb2 = this.selectedRowTb2.filter((ri) => ri != user) : this.selectedRowTb2.push(user);
  }

  selectAll: boolean = false;
  onChangeSelectAll() {

    if (this.selectAll) {
      if (this.dt2.filteredValue && Array.isArray(this.dt2.filteredValue)) {

        this.selectedRowTb2 = [...this.selectedRowTb2, ...this.dt2.filteredValue];
      } else {
        this.selectedRowTb2 = [...this.selectedRowTb2, ...this.dataTable2.filter((_, i) => i >= this.first && i < this.first + this.rows)];
      }
    } else {
      this.selectedRowTb2 = [];
    }
  }

  showFilter() {
    if (this.isVisible === true) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
  }

  showFilter2() {
    if (this.isVisible2 === true) {
      this.isVisible2 = false;
    } else {
      this.isVisible2 = true;
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