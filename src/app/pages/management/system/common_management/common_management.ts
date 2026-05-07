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
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { MessageService, SortEvent } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
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
  imports: [TooltipModule, ToastModule, FloatLabel, MultiSelectModule, IconFieldModule, TagModule, InputIconModule, InputTextModule, TableModule, ButtonModule, SelectModule, FormsModule, InputGroupModule, InputGroupAddonModule, DatePickerModule, RadioButtonModule, CommonModule],
  selector: 'app-location-history_report',
  templateUrl: './common_management.html',
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

        :host ::ng-deep #multiselect p-iconfield > .p-inputtext,
        :host ::ng-deep p-columnfilterformelement,
        :host ::ng-deep p-columnfilterformelement input,
        :host ::ng-deep p-columnfilterformelement p-select,
        {
            width: 100% !important;
        }

    `]
})


export class CommonManagementSystem implements OnInit {

  loadingTable: boolean = false;

  selectedMtCd: string = '';

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
      { field: 'mt_cd', header: this.valLanguage.grid_Material_Code[this.optionLanguage], type: 'Text' },
      { field: 'mt_nm', header: this.valLanguage.grid_Material_Name[this.optionLanguage], type: 'Text' },
      { field: 'mt_exp', header: this.valLanguage.grid_Main_Explain[this.optionLanguage], type: 'Text' },
      { field: 'use_yn', header: this.valLanguage.grid_UseYN[this.optionLanguage], type: 'Option' },
    ];

    this.colsTable2 = [
      { field: 'mt_nm', header: this.valLanguage.grid_Main_Name[this.optionLanguage], type: 'Text' },
      { field: 'dt_cd', header: this.valLanguage.grid_Detail_Code[this.optionLanguage], type: 'Text' },
      { field: 'dt_nm', header: this.valLanguage.grid_Detail_Name[this.optionLanguage], type: 'Text' },
      { field: 'dt_exp', header: this.valLanguage.grid_Detail_Explain[this.optionLanguage], type: 'Text' },
      { field: 'use_yn', header: this.valLanguage.grid_UseYN[this.optionLanguage], type: 'Option' },
      { field: 'dt_order', header: this.valLanguage.grid_Order[this.optionLanguage], type: 'Text' },
    ];

    this.ysList = [
      { label: "Use", value: "Y" },
      { label: "UnUse", value: "N" },
    ]

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  ysList!: any;
  clonedTables1: { [s: string]: {} } = {};
  clonedTables2: { [s: string]: {} } = {};

  onRowEditCancelTb1(rowTable: any, index: number) {
    this.data[index] = this.clonedTables1[rowTable.mnno as string];
    delete this.clonedTables1[rowTable.mnno as string];
  }

  onRowEditCancelTb2(rowTable: any, index: number) {
    this.dataTable2[index] = this.clonedTables2[rowTable.cdid as string];
    delete this.clonedTables2[rowTable.cdid as string];
  }

  onRowEditInitTb1(rowTable: any) {
    this.clonedTables1[rowTable.mnno as string] = { ...rowTable };
  }

  onRowEditInitTb2(rowTable: any) {
    this.clonedTables2[rowTable.cdid as string] = { ...rowTable };
  }


  onRowEditSaveTb1(rowTable: any) {
    delete this.clonedTables1[rowTable.mnno as string];
    this.sv.updateCommonMainManagement(rowTable).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update successfully!' });
      }
    });
  }

  onRowEditSaveTb2(rowTable: any) {
    delete this.clonedTables2[rowTable.cdid as string];
    this.sv.updateCommonDetailManagement(rowTable).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update successfully!' });
      }
    });
  }

  onInsertCommonMain() {
    this.loadingTable = true;
    this.sv.insertCommonMainManagement(this.selectedMtNm, this.selectedMtExp, this.selectedUseYN).subscribe({
      next: (response: any) => {
        const match = response.match(/'([^']*)'/);
        if (match) {
          const result = match[1];
          this.sv.getCommMt(result).subscribe({
            next: (newItem) => {
              this.data = [
                newItem,
                ...this.data
              ];
              this.selectedRowTb1 = 0;
              this.totalRecords++;
              this.loadingTable = false;
            }, error: () => this.loadingTable = false
          });

          this.onRefresh('Main');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Create new Common Main successfully!' });
        } else {
          this.loadingTable = false;
          console.log("No match found.");
        }
      }, error: () => this.loadingTable = false
    });
  }

  onInsertCommonDetail() {
    const param = {
      cdid: '1',
      mt_cd: this.selectedMtCd,
      dt_cd: this.selectedDtCd,
      dt_nm: this.selectedDtNm,
      dt_exp: this.selectedDtExp,
      dt_order: this.selectedDtOrder,
      use_yn: this.selectedUseYN,
    };

    this.loadingDataTable2 = true;

    this.sv.insertCommonDetailManagement(param).subscribe({
      next: (response: any) => {
        const match = response.match(/'([^']*)'/);
        if (match) {
          const result = match[1];
          this.sv.getCommDt(result).subscribe({
            next: (newItem) => {
              this.dataTable2 = [
                newItem,
                ...this.dataTable2
              ];
              this.selectedRowTb2 = 0;
              this.recordsTable2++;
              this.loadingDataTable2 = false;
            },
            error: () => {
              this.loadingDataTable2 = false;
            }
          });

          this.onRefresh('Detail');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Create new Common Detail successfully!' });
        } else {
          this.loadingDataTable2 = false;
          console.log("No match found.");
        }
      }, error: () => {
        this.loadingDataTable2 = false;
      }
    });
  }

  onRefresh(status: 'Main' | 'Detail') {
    if (status == 'Main') {
      this.selectedMtNm = '';
      this.selectedMtExp = '';
    } else {
      this.selectedDtCd = '';
      this.selectedDtNm = '';
      this.selectedDtExp = '';
      this.selectedDtOrder = 1;
    }
    this.selectedUseYN = 'Y';
  }

  exportToExcelTb1() {
    let data: any[] = [];
    if (this.dt1.filteredValue && Array.isArray(this.dt1.filteredValue)) {
      this.dt1.filteredValue.forEach((emp: any) => {
        const rowData: any = {
          'Material Code': emp.mt_cd,
          'Material Name': emp.mt_nm,
          'Main Explain': emp.mt_exp,
          'Use Y/N': emp.use_yn,
        };
        data.push(rowData);
      });
    } else {
      this.data.forEach((emp: any) => {
        const rowData: any = {
          'Material Code': emp.mt_cd,
          'Material Name': emp.mt_nm,
          'Main Explain': emp.mt_exp,
          'Use Y/N': emp.use_yn,
        };
        data.push(rowData);
      });
    }
    if (data.length > 0) {
      this.global_sv.exportExcel(data, 'Common Management Main', 'data');
    }
  }

  exportToExcelTb2() {
    let data: any[] = [];
    if (this.dt1.filteredValue && Array.isArray(this.dt1.filteredValue)) {
      this.dt1.filteredValue.forEach((emp: any) => {
        const rowData: any = {
          'Main Name': emp.mt_nm,
          'Detail Code': emp.dt_cd,
          'Detail Name': emp.dt_nm,
          'Detail Explain': emp.dt_exp,
          'Use Y/N': emp.use_yn,
          'Order': emp.dt_order,
        };
        data.push(rowData);
      });
    } else {
      this.data.forEach((emp: any) => {
        const rowData: any = {
          'Main Name': emp.mt_nm,
          'Detail Code': emp.dt_cd,
          'Detail Name': emp.dt_nm,
          'Detail Explain': emp.dt_exp,
          'Use Y/N': emp.use_yn,
          'Order': emp.dt_order,
        };
        data.push(rowData);
      });
    }
    if (data.length > 0) {
      this.global_sv.exportExcel(data, 'Common Management Detail', 'data');
    }
  }


  provideDepts!: any[];
  fModelList!: any[];
  mtCdList!: any[];
  states!: any[];

  isCreTb1: boolean = true;

  useYNTable1FilterValue: string | null = null;
  useYNTable2FilterValue: string | null = null;

  private loadData(): void {
    this.loadingTable = true;

    this.sv.getCommonManagement().subscribe({
      next: (data) => {
        this.initialValue = this.data = data.rows;
        this.totalRecords = data.records;
        this.loadingTable = false;
      }
    })
  }

  onAddNew(status: boolean) {
    this.isCreTb1 = status;
    document.getElementById("addNewForm")!.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
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

  selectedRowTb1: number | undefined = undefined;
  selectedRowTb2: number | undefined = undefined;
  isVisible: boolean = true;
  isVisible2: boolean = true;
  dataTable2: any[] = [];
  initialTable2: any[] = [];
  loadingDataTable2: boolean = false;
  recordsTable2: number = 0;

  onRowClickTb1(mt_cd: string, i: number): void {
    this.selectedRowTb1 = i;
    this.loadingDataTable2 = true;
    this.selectedRowTb2 = undefined;
    this.selectedMtCd = mt_cd;

    this.sv.selectCommDt(mt_cd).subscribe({
      next: (response) => {
        this.dataTable2 = response.rows;

        this.initialTable2 = this.dataTable2;

        this.recordsTable2 = response.records;
        this.loadingDataTable2 = false;
      }
    })
  }

  onRowClickTb2(i: number): void {
    this.selectedRowTb2 = i;
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