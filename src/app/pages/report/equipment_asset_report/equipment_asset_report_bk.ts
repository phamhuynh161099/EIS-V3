import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, SelectItem, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { forkJoin, Subject, takeUntil } from 'rxjs';

import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { Image } from 'primeng/image';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TreeTableModule } from 'primeng/treetable';

import { LanguageType } from '../../../../constants/constants.auth';
import { GlobalsService } from '../../../../globals.service';
import { ReportService } from '../report.service';

interface Column {
    field: string;
    header: string;
}

@Component({
    imports: [
        CommonModule,
        DatePicker,
        Image,
        Dialog,
        RadioButtonModule,
        ProgressSpinnerModule,
        TreeTableModule,
        TagModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        ButtonModule,
        FormsModule,
        TextareaModule,
        TableModule,
        FloatLabelModule,
        ToastModule,
        SelectModule,
        InputGroupAddonModule,
        // InputGroup,
        ReactiveFormsModule,
        MultiSelectModule
    ],
    providers: [ReportService, MessageService],
    templateUrl: './equipment_asset_report.html',
    standalone: true,
    styles: `
        ::ng-deep {
            .rag-yellow {
                background: rgb(255, 228, 0) !important;
                color: #333 !important;
            }
            table {
                th,
                td {
                    white-space: nowrap;
                }
            }
            .btn_search_global {
                .p-inputtext {
                    width: 24rem;
                    @media (min-width: 991px) {
                        width: 30rem;
                    }
                }
            }
            input.prt_nm,
            input.tp_nm,
            input.group_nm,
            input.md_cd,
            input.lct_cd40 {
                width: 8rem !important;
            }
        }
    `
})
export class EquipmentAssetReport_bk implements OnInit {
    //, OnDestroy
    private unsubscribe$ = new Subject<void>();
    private apiService = inject(ReportService);
    flagAssetLazyFull: boolean = false;
    dataAllFilter!: any[];
    virtualAsset!: any[];
    initialValue: any[] = [];

    loading: boolean = false;
    loading_full: boolean = false;
    cols: Column[] = [];
    colsParent: Column[] = [];
    colsChild: Column[] = [];
    rowSpanType: { [key: string]: number } = {};
    rowSpanGroup: Column[] = [];
    records!: number;

    // variables for filter
    corpFac!: SelectItem[];
    corpFilterValue: string | null = null;
    corpTableFac!: SelectItem[];
    corpTableFilterValue: string | null = null;
    parent!: SelectItem[];
    parentFilterValue: string | null = null;
    parentTable!: SelectItem[];
    parentTableFilterValue: string | null = null;
    type!: SelectItem[];
    typeFilterValue: string | null = null;
    group!: SelectItem[];
    groupFilterValue: string | null = null;
    modelFilterValue!: string;
    regDateFilterValue!: Date[] | undefined;

    corpFacTB!: SelectItem[];
    corpFilterTbValue: string | null = null;
    parentTB!: SelectItem[];
    parentFilterTBValue: string | null = null;
    typeTB!: SelectItem[];
    typeFilterTBValue: string | null = null;
    groupTB!: SelectItem[];
    groupFilterTBValue: string | null = null;
    language: string = '';
    erp: string = '';
    name_dialog: string = '';
    visible: boolean = false;
    isVisible: boolean = true;
    img_val: string = '';
    param: any = {
        corp: '',
        model: '',
        parent: '',
        storage: '',
        rows: '',
        page: ''
    };
    // rowData!: any[];
    first: number = 0;
    rows: number = 15;
    totalRecords: number = 0;
    rowSpanStart: number = 0;
    isSorted: boolean | null = null;
    @ViewChild('dtInformation') dataTableComponent!: Table;
    filterForm!: FormGroup;
    prt_nm: string = '';
    tp_nm: string = '';
    group_nm: string = '';
    md_cd: string = '';
    photo_file: string = '';
    lct_cd40: string = '';

    //  check rowspan

    visibleData!: any[]; // initially full dataset
    filters: any = {};

    onTableFilter(event: any) {
        if (event.filteredValue !== undefined) {
            this.visibleData = event.filteredValue || [];
        }
    }

    onTableSort(event: any) {
        // Optional: Update visibleData after sorting
        if (this.dataTableComponent !== undefined) {
            this.visibleData = this.dataTableComponent.filteredValue || this.virtualAsset;
        }

    }

    shouldRenderRowspan(index: number, field: string): boolean {
        if (index === 0) return true;
        return this.visibleData[index][field] !== this.visibleData[index - 1][field];
    }

    getRowspanCount(index: number, field: string): number {
        const currentValue = this.visibleData[index][field];
        let count = 0;

        for (let i = index; i < this.visibleData.length; i++) {
            if (this.visibleData[i][field] === currentValue) {
                count++;
            } else {
                break;
            }
        }

        return count;
    }

    selectedRow: number | undefined = undefined;
    onRowClick(i: number): void {
        this.selectedRow = i;
    }

    constructor(
        public global_sv: GlobalsService,
        private fb: FormBuilder
    ) {
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
        this.loading = true;
        this.virtualAsset = [];
        this.colsParent = [];
        this.cols = [];
        this.colsChild = [];
        this.apiService.selectEquiAssetTitleHeader().subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    let flagRowSpan = 0;
                    response.rows.forEach((item: any) => {
                        if (item.dt_exp.indexOf('Total (') >= 0) {
                            flagRowSpan++;
                            this.colsParent.push({ field: item.dt_cd, header: this.findChartTitle(item.dt_exp) });

                            this.colsChild.push({ field: item.dt_cd, header: 'Total' });
                            this.colsChild.push({ field: 'sts_cd' + flagRowSpan + '_u', header: 'Using' });
                            this.colsChild.push({ field: 'sts_cd' + flagRowSpan + '_s', header: 'T.Stock' });
                        } else {
                            this.cols.push({ field: item.dt_cd, header: item.dt_nm });
                        }
                    });
                    this.getEquimentAsset();
                }
            },
            (error) => {
                console.error('Error selectColEquipmentInfo:', error);
            }
        );
    }

    next() {
        this.first = this.first + this.rows;
    }

    prev() {
        this.first = this.first - this.rows;
    }

    onFilterChange(event: any) {
        console.log('Filter changed:', event);
        // You can access the filtered data, filter metadata, etc.
    }

    pageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        console.log('Page changed:', event);
        console.log('Current page index:', event.page);
        console.log('First record index on current page:', event.first);
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
            this.virtualAsset = [...this.initialValue];
            this.dataTableComponent.reset();
        }
    }

    getEquimentAsset(): void {
        this.apiService
            .selectEquipmentAssetAll()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((response) => {
                if (response !== undefined && response !== null) {
                    this.records = response.records;
                    this.param = {
                        rows: response.records,
                        page: '1'
                    };
                    this.apiService
                        .selectEquipmentAsset(this.param)
                        .pipe(takeUntil(this.unsubscribe$))
                        .subscribe((response) => {
                            if (response !== undefined && response !== null) {
                                this.records = response.records;
                                let dtTableRes = response.rows;
                                // this.virtualAsset = response.rows;
                                this.virtualAsset = dtTableRes.map((ele: any) => {
                                    let ele_r: any = ele;
                                    ele_r = {
                                        ...ele_r,
                                        parent_name: {
                                            label: ele_r.prt_nm
                                        },
                                        type_name: {
                                            label: ele_r.tp_nm
                                        },
                                        group_name: {
                                            label: ele_r.group_nm
                                        }
                                    };
                                    return ele_r;
                                });
                                this.visibleData = [...this.virtualAsset];
                                this.initialValue = [...this.virtualAsset];

                                this.loading = false;
                                // this.loading_full = false;
                            }
                        });
                }
            });
    }

    handleImageError(event: Event) {
        //  console.error('Image failed to load:', event);
        // You can set a fallback image source here
        if (event.target) {
            (event.target as HTMLImageElement).src = 'assets/image/image-error.png';
        }
    }

    checkFindFilter(parent: string, child: string): boolean {
        if (child === '' || child === null) {
            return true;
        } else if (parent.toUpperCase().indexOf(child.toUpperCase()) >= 0) {
            return true;
        }
        return false;
    }

    onGlobalFilter(event: Event, table: Table) {
        const input = event.target as HTMLInputElement;
        table.filterGlobal(input.value, 'contains');
    }

    isFirstRowInGroup(rowData: any, rowIndex: number): boolean {
        const boolRow = rowIndex === 0 || rowData.prt_nm !== this.virtualAsset[rowIndex - 1].prt_nm;
        return boolRow;
    }

    calculateRowspan(rowData: any): number {
        let count = 0;
        this.virtualAsset.forEach((ele: any) => {
            if (ele.prt_nm === rowData.prt_nm) {
                count++;
            }
        });
        return count;
    }

    clear(table: Table) {
        this.loading = true;
        table.clear();
        this.parentFilterValue = null;
        this.corpFilterValue = null;
        this.typeFilterValue = null;
        this.groupFilterValue = null;
        this.modelFilterValue = '';
        this.language = '';
        this.erp = '';
        this.prt_nm = '';
        this.tp_nm = '';
        this.group_nm = '';
        this.md_cd = '';
        this.lct_cd40 = '';
        this.virtualAsset = this.initialValue;
        this.loading = false;
    }

    ShowFilter() {
        this.isVisible = !this.isVisible;
    }

    showDialog(img: string, name: string) {
        this.visible = true;
        this.img_val = 'https://ams.hsvina.com' + img;
        this.name_dialog = name;
    }

    exportToExcel() {
        let data: any[] = [];
        if (this.dataTableComponent.filteredValue && Array.isArray(this.dataTableComponent.filteredValue)) {
            this.dataTableComponent.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    Corp: emp.corp_nm,
                    Parent: emp.prt_nm,
                    'Material code': emp.mt_cd,
                    'Material description': emp.mt_nm,
                    State: emp.sts_nm,
                    'Re Mark': emp.re_mark,
                    Reason: emp.reason_nm,
                    'Storage Loca': emp.factory_nm,
                    Model: emp.md_cd,
                    'Asset No': emp.as_no,
                    'Des. of Storage Loca': emp.to_lct_nm,
                    'Cost Center Name': emp.cost_dept_nm,
                    Unit: emp.unit,
                    Quantity: emp.quantity,
                    'Create Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Buying Date': emp.puchs_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.puchs_dt_ymd) : emp.puchs_dt_ymd,
                    Maker: emp.maker,
                    'Dep. of Storage Loca': emp.from_lct_nm,
                    'Location State': emp.lct_sts_nm,
                    Requester: emp.charge_nm,
                    Receiver: emp.receive_nm,
                    'Output Date': emp.output_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.output_dt_ymd) : emp.output_dt_ymd,
                    'Input Date': emp.input_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.input_dt_ymd) : emp.input_dt_ymd,
                    Activity: emp.input_yn,
                    Verified: emp.reg_nm,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        } else {
            this.virtualAsset.forEach((emp: any) => {
                const rowData: any = {
                    Corp: emp.corp_nm,
                    Parent: emp.prt_nm,
                    'Material code': emp.mt_cd,
                    'Material description': emp.mt_nm,
                    State: emp.sts_nm,
                    'Re Mark': emp.re_mark,
                    Reason: emp.reason_nm,
                    'Storage Loca': emp.factory_nm,
                    Model: emp.md_cd,
                    'Asset No': emp.as_no,
                    'Des. of Storage Loca': emp.to_lct_nm,
                    'Cost Center Name': emp.cost_dept_nm,
                    Unit: emp.unit,
                    Quantity: emp.quantity,
                    'Create Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Buying Date': emp.puchs_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.puchs_dt_ymd) : emp.puchs_dt_ymd,
                    Maker: emp.maker,
                    'Dep. of Storage Loca': emp.from_lct_nm,
                    'Location State': emp.lct_sts_nm,
                    Requester: emp.charge_nm,
                    Receiver: emp.receive_nm,
                    'Output Date': emp.output_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.output_dt_ymd) : emp.output_dt_ymd,
                    'Input Date': emp.input_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.input_dt_ymd) : emp.input_dt_ymd,
                    Activity: emp.input_yn,
                    Verified: emp.reg_nm,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'Equipment Status Report', 'data');
        }
    }

    findChartTitle(str: string): string {
        const flag = str.indexOf('(');
        if (flag >= 0) {
            return str.substring(flag + 1, str.length - 1);
        }
        return str;
    }

    handleChangeParent(event: any): void {
        this.apiService.getType(event.value).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.type = response.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                }
            },
            (error) => {
                console.error('Error handleChangeParent:', error);
            }
        );
    }

    loadListFilter(): void {
        forkJoin({
            parent: this.global_sv.getParent(),
            corp: this.global_sv.getCorp(),
            type: this.apiService.getType(''),
            group: this.apiService.getGroup()
        })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (responses) => {
                    if (responses.parent !== null && responses.parent !== undefined) {
                        this.parent = responses.parent
                            .filter((item: any) => item.comm_nm !== '')
                            .map((item: any) => ({
                                label: item.comm_nm,
                                value: item.comm_cd
                            }));
                        this.parentTB = responses.parent.map((item: any) => ({
                            label: item.comm_nm
                        }));
                    }
                    if (responses.corp !== null && responses.corp !== undefined) {
                        this.corpFac = responses.corp.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.corpFacTB = responses.corp.map((item: any) => ({ label: item.comm_nm }));
                    }
                    if (responses.type !== null && responses.type !== undefined) {
                        this.type = responses.type.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.typeTB = responses.type.map((item: any) => ({ label: item.comm_nm }));
                    }
                    if (responses.group !== null && responses.group !== undefined) {
                        this.group = responses.group.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.groupTB = responses.group.map((item: any) => ({ label: item.comm_nm }));
                    }
                },
                (error) => {
                    console.error('Error loading filter lists:', error);
                }
            );
    }

    filterChooseSearch(): void {
        let regDate = '';
        let regEndDate = '';
        if (this.regDateFilterValue !== null && this.regDateFilterValue !== undefined) {
            regDate = this.global_sv.formatDateFilter(new Date(<Date>this.regDateFilterValue[0]));
            regEndDate = this.global_sv.formatDateFilter(new Date(<Date>this.regDateFilterValue[1]));
        }
        this.param = {
            corp: this.corpFilterValue !== null && this.corpFilterValue !== undefined ? this.corpFilterValue : '',
            model: this.modelFilterValue !== null && this.modelFilterValue !== undefined ? this.modelFilterValue : '',
            parent: this.parentFilterValue !== null && this.parentFilterValue !== undefined ? this.parentFilterValue : '',
            type: this.typeFilterValue !== null && this.typeFilterValue !== undefined ? this.typeFilterValue : '',
            group: this.groupFilterValue !== null && this.groupFilterValue !== undefined ? this.groupFilterValue : '',
            language: this.language,
            erp: this.erp,
            rows: '',
            startdate: regDate,
            enddate: regEndDate
        };

        this.loading = true;
        this.apiService.selectEquipmentAssetFilterNumber(this.param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.param.rows = response.records;
                    this.apiService.selectEquipmentAssetFilterAll(this.param).subscribe(
                        (response) => {
                            if (response !== null && response !== undefined) {
                                let dtTableRes = response.rows;
                                this.virtualAsset = dtTableRes.map((ele: any) => {
                                    let ele_r: any = ele;
                                    ele_r = {
                                        ...ele_r,
                                        parent_name: {
                                            label: ele_r.prt_nm
                                        },
                                        type_name: {
                                            label: ele_r.tp_nm
                                        },
                                        group_name: {
                                            label: ele_r.group_nm
                                        }
                                    };
                                    return ele_r;
                                });
                                this.visibleData = [...this.virtualAsset];
                                this.initialValue = [...this.virtualAsset];
                            }
                            this.loading = false;
                        },
                        (error) => {
                            this.loading = false;
                            console.error('Error EquipmentAssetFilter:', error);
                        }
                    );
                }
            },
            (error) => {
                console.error('Error EquipmentAssetFilter:', error);
            }
        );
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
