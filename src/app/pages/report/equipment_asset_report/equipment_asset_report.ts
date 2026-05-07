import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { forkJoin, Subject, takeUntil } from 'rxjs';

import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { Image } from 'primeng/image';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Ripple } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TreeTableModule } from 'primeng/treetable';
import { ReportService } from '../report.service';
// import { TableLazyLoadEvent } from 'primeng/table';
// import { Toast } from 'primeng/toast';

import { GlobalsService } from '../../../../globals.service';

import { AgGridAngular } from 'ag-grid-angular';
import {
    CellSpanModule,
    ClientSideRowModelModule,
    ColDef,
    ColGroupDef,
    CsvExportModule,
    GridApi,
    GridReadyEvent,
    ModuleRegistry,
    PaginationModule,
    QuickFilterModule,
    RowApiModule,
    RowClassRules,
    RowStyleModule,
    TextFilterModule,
    Theme,
    themeQuartz,
    ValidationModule
} from 'ag-grid-community';
import { LanguageType } from '../../../../constants/constants.auth';
import { Car } from '../../tpm/car';
import { LogoRenderer } from './logo_renderer';
ModuleRegistry.registerModules([RowStyleModule, RowApiModule, CsvExportModule, ValidationModule, QuickFilterModule, TextFilterModule, PaginationModule, CellSpanModule, ClientSideRowModelModule, ...[]]);

const myTheme = themeQuartz.withParams({
    backgroundColor: 'var(--surface-card)',
    accentColor: 'var(--text-color)',
    foregroundColor: 'var(--text-color)',
    headerTextColor: 'var(--text-color)',
    headerBackgroundColor: 'var(--surface-card)',
    // oddRowBackgroundColor: 'var(--p-inputtext-background)',
    headerColumnResizeHandleColor: 'var(--surface-card)',
    borderColor: 'var(--p-datatable-body-cell-border-color)',
    rowBorder: { style: 'solid', width: 1 },
    columnBorder: { style: 'solid' }
});

@Component({
    imports: [
        CommonModule,
        AgGridAngular,
        RadioButtonModule,
        DatePicker,
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
        Ripple,
        Dialog,
        Image
    ],
    standalone: true,
    providers: [ReportService, MessageService],
    template: `<div>
        <p-toast />
        <div class="card">
            <div class="flex justify-between">
                <h2>Equipment Asset Report</h2>
                <div class="xl:flex">
                    <div class="btn_search_choose mr-3 mb-3 xl:mb-0">
                        <p-button severity="info" variant="outlined" icon="pi pi-search" [label]="this.valLanguage.btn_Search[this.optionLanguage]" (click)="filterChooseSearch()" />
                    </div>
                    <!-- <div class="btn_search_choose mr-3 mb-3 xl:mb-0">
                        <p-button label="Excel" variant="outlined" severity="success" icon="pi pi-file-excel" (click)="exportToExcel()" />
                    </div> -->
                    <p-button [label]="this.valLanguage.btn_Refresh[optionLanguage]" severity="secondary" icon="pi pi-refresh" (click)="ngOnInit()" />
                </div>
            </div>
            <div class="rounded flex flex-wrap items-end gap-4 mb-3 box p-5 pt-5 mt-2" style="border: 1px solid rgba(75, 175, 80, 0.3); --p-ripple-background: rgba(75, 175, 80, 0.3)">
                <p-floatlabel class="w-40 mr-3 mt-5">
                    <p-select class="w-full" [(ngModel)]="corpFilterValue" [options]="corpFac" [showClear]="true">
                        <ng-template let-option #item>
                            <p-tag [value]="option.label" [severity]="getCorp(option.label)" />
                        </ng-template>
                    </p-select>
                    <label for="corp">Corp</label>
                </p-floatlabel>
                <p-floatlabel class="w-52 mr-3 mt-5">
                    <p-select [filter]="true" filterBy="label" class="w-full" [(ngModel)]="parentFilterValue" (onChange)="handleChangeParent($event)" [options]="parent" [showClear]="true">
                        <ng-template let-option #item>
                            <p-tag [value]="option.label" severity="secondary" />
                        </ng-template>
                    </p-select>
                    <label for="parent_filter">Parent</label>
                </p-floatlabel>
                <p-floatlabel class=" w-52 mr-3 mt-5">
                    <p-select [filter]="true" filterBy="label" class="w-full" [(ngModel)]="typeFilterValue" [options]="type" [showClear]="true">
                        <ng-template let-option #item>
                            <p-tag [value]="option.label" severity="secondary" />
                        </ng-template>
                    </p-select>
                    <label for="storage">Type</label>
                </p-floatlabel>
                <p-floatlabel class="w-52 mr-3 mt-5">
                    <p-select [filter]="true" filterBy="label" class="w-full" [(ngModel)]="groupFilterValue" [options]="group" [showClear]="true">
                        <ng-template let-option #item>
                            <p-tag [value]="option.label" severity="secondary" />
                        </ng-template>
                    </p-select>
                    <label for="parent_filter">Group</label>
                </p-floatlabel>
                <p-floatlabel class="w-52 mr-3 mt-5">
                    <input class="w-full" pInputText [(ngModel)]="modelFilterValue" />
                    <label for="model_filter">Model</label>
                </p-floatlabel>

                <div class="flex flex-wrap gap-4 box p-2" pRipple style="border: 1px solid rgba(255, 193, 6, 0.3); --p-ripple-background: rgba(255, 193, 6, 0.3)">
                    <label for="ingredient1" class="ml-2">Language: </label>
                    <div class="flex items-center">
                        <p-radiobutton name="pizza" value="" [(ngModel)]="language" inputId="language1" />
                        <label for="ingredient1" class="ml-2">English</label>
                    </div>

                    <div class="flex items-center">
                        <p-radiobutton name="pizza" value="korean" [(ngModel)]="language" inputId="language2" />
                        <label for="ingredient2" class="ml-2">Korean</label>
                    </div>

                    <div class="flex items-center">
                        <p-radiobutton name="pizza" value="vietnam" [(ngModel)]="language" inputId="language3" />
                        <label for="ingredient3" class="ml-2">Vietnam</label>
                    </div>
                </div>
                <div class="flex flex-wrap gap-4 box p-2" pRipple style="border: 1px solid rgba(255, 193, 6, 0.3); --p-ripple-background: rgba(255, 193, 6, 0.3)">
                    <div class="flex items-center">
                        <p-radiobutton name="pizza" value="" [(ngModel)]="erp" inputId="language1" />
                        <label for="ingredient1" class="ml-2">Total</label>
                    </div>

                    <div class="flex items-center">
                        <p-radiobutton name="pizza" value="008" [(ngModel)]="erp" inputId="language2" />
                        <label for="ingredient2" class="ml-2">Not in ERP</label>
                    </div>

                    <div class="flex items-center">
                        <p-radiobutton name="pizza" value="000" [(ngModel)]="erp" inputId="language3" />
                        <label for="ingredient3" class="ml-2">ERP</label>
                    </div>
                </div>
                <p-floatlabel class="w-56 mr-3 mt-5">
                    <p-datepicker class="style_date" [showButtonBar]="true" dateFormat="yy/mm/dd" [(ngModel)]="regDateFilterValue" selectionMode="range" inputReadonly="true" />
                    <label for="create_date">Create Date (from-to)</label>
                </p-floatlabel>
            </div>
        </div>

        <p-toast />
        <div class="card" style="position: relative;">
            <div class="btn_search_choose mr-3 mb-3">
                <p-button label="Excel" variant="outlined" severity="success" icon="pi pi-file-excel" (click)="exportToExcel()" />
                <p-button class="ml-5" label="Clear Filter" [outlined]="true" severity="secondary" icon="pi pi-filter-slash" (click)="clear()" />
            </div>

            <p-progress-spinner *ngIf="loading" class="absolute spinner-cl" strokeWidth="5" fill="transparent" animationDuration=".5s" [style]="{ width: '50px', height: '50px', color: '#333' }" />
            <ag-grid-angular
                style="width: 100%; height: 629px;"
                [paginationPageSizeSelector]="paginationPageSizeSelector"
                [pagination]="pagination"
                [paginationPageSize]="paginationPageSize"
                [columnDefs]="columnDefs"
                [theme]="theme"
                [defaultColDef]="defaultColDef"
                [pagination]="true"
                [rowData]="rowData"
                [enableCellSpan]="true"
                [rowClassRules]="rowClassRules"
                (gridReady)="onGridReady($event)"
            />
        </div>
        <p-dialog class="image-dialog" [header]="name_dialog" [modal]="true" [(visible)]="visible" [style]="{ width: '50rem' }" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" [maximizable]="true">
            <p-image class="logo_full w-full flex justify-center items-center" [alt]="img_val" [src]="img_val" alt="Image" width="250" [preview]="true" />
        </p-dialog>
    </div>`,
    styles: `
        ::ng-deep {
            .ag-input-field-input:where(input:not([type]), input[type='text'], input[type='number'], input[type='tel'], input[type='date'], input[type='datetime-local'], textarea) {
                background-color: var(--input-bg);
                color: var(--input-text);
            }
            .rag-yellow {
                background: rgb(255, 228, 0);
                color: #333;
            }
            .ag-header-cell,
            .ag-header-group-cell {
                border-right: 1px solid var(--p-datatable-body-cell-border-color);
            }
            .ag-paging-page-size .ag-label {
                display: none;
            }
            @media (max-width: 991px) {
                .ag-paging-panel {
                    height: 75px;
                    position: relative;
                    margin: auto;
                    display: block;
                }
                .ag-paging-page-size .ag-label {
                    display: block;
                }
            }
            .p-progressspinner-circle {
                stroke: var(--login-stroke) !important;
            }
            .spinner-cl {
                z-index: 10;
                left: 0;
                right: 0;
                top: 50%;
                margin-inline: auto;
                width: fit-content;
            }
            :host {
                .box {
                    padding: 2rem;
                    border-radius: 10px;
                    width: 110px;
                    text-align: center;
                }
            }
            .style_date .p-datepicker-input {
                width: 10rem !important;
                @media (min-width: 991px) {
                    width: 14rem !important;
                }
            }
            .logo_full {
                height: 500px !important;
            }
        }
    `
})
export class EquipmentAssetReport implements OnInit {
    //, OnDestroy
    value!: string;
    file_open: string = 'No file selected';
    // data!: any;
    loading: boolean = false;
    flagAssetLazyFull: boolean = false;
    private unsubscribe$ = new Subject<void>();
    private apiService = inject(ReportService);
    rowsPage: number = 10;

    assets!: Car[];
    virtualAsset!: Car[];
    // cols!: Column[];
    records!: number;

    // variables for filter
    corpFac!: SelectItem[];
    corpFilterValue: string | null = null;
    parent!: SelectItem[];
    parentFilterValue: string | null = null;
    type!: SelectItem[];
    typeFilterValue: string | null = null;
    group!: SelectItem[];
    groupFilterValue: string | null = null;
    modelFilterValue!: string;
    regDateFilterValue!: Date[] | undefined;
    language: string = '';
    erp: string = '';
    param: any = {
        corp: '',
        model: '',
        parent: '',
        storage: ''
    };

    // AG Grid
    pagination = true;
    rowClassRules: RowClassRules = {
        'rag-yellow': 'data.md_cd === "TOTAL"',
        'rag-none': 'data.md_cd !== "TOTAL"'
    };

    // sets 10 rows per page (default is 100)
    paginationPageSize = 10;
    paginationPageSizeSelector = [10, 20, 50, 100];
    columnDefs: (ColDef | ColGroupDef)[] = [
        {
            field: 'prt_nm',
            spanRows: true,
            headerName: 'Parent'
        },
        { field: 'tp_nm', spanRows: true, headerName: 'Type' },
        { field: 'group_nm', spanRows: true, headerName: 'Group' },
        { field: 'md_cd', headerName: 'Model' },
        { field: 'lct_cd40', headerName: 'TOTAL' }
    ];
    defaultColDef: ColDef = {
        flex: 1,
        minWidth: 150,
        filter: true,
        floatingFilter: true,
        suppressHeaderMenuButton: true
    };
    rowData!: any[];
    rowDataHeader!: any[];
    theme: Theme | 'legacy' = myTheme;
    visible: boolean = false;
    img_val: string = '';
    name_dialog: string = '';

    private gridApi!: GridApi<any>;

    constructor(
        private el: ElementRef,
        private global_sv: GlobalsService
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
        let param: any = {
            rows: '',
            page: ''
        };
        this.corpFilterValue = null;
        this.parentFilterValue = null;
        this.typeFilterValue = null;
        this.groupFilterValue = null;
        this.modelFilterValue = '';
        this.regDateFilterValue = undefined;
        this.language = '';
        this.erp = '';
        this.loading = true;
        this.apiService.selectEquiAssetTitleHeader().subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.columnDefs = [];
                    let indexTotalHeader = 0;
                    this.rowDataHeader = response.rows;
                    response.rows.forEach((ele: any, index: number) => {
                        if (ele.dt_exp.indexOf('Total (') >= 0) {
                            indexTotalHeader++;
                            this.columnDefs.push({
                                headerName: this.findChartTitle(ele.dt_exp),
                                children: [
                                    { columnGroupShow: 'closed', field: 'lct_cd' + indexTotalHeader, headerName: 'Total', filter: false },
                                    { columnGroupShow: 'open', field: 'sts_cd' + indexTotalHeader + '_u', headerName: 'Using', filter: false },
                                    { columnGroupShow: 'open', field: 'sts_cd' + indexTotalHeader + '_s', headerName: 'T.Stock', filter: false }
                                ],
                                filter: false,
                                floatingFilter: false
                            });
                        } else {
                            if (ele.dt_cd !== 'photo_file') {
                                this.columnDefs.push({
                                    field: ele.dt_cd,
                                    spanRows: index < 3 ? true : false,
                                    headerName: ele.dt_nm,
                                    resizable: true,
                                    minWidth: 200,
                                    filter: 'agTextColumnFilter'
                                });
                            } else {
                                this.columnDefs.push({
                                    field: ele.dt_cd,
                                    spanRows: index < 3 ? true : false,
                                    headerName: ele.dt_nm,
                                    resizable: true,
                                    minWidth: 200,
                                    filter: false,
                                    cellRenderer: LogoRenderer
                                    //  (params: any) => {
                                    //     let html = '';
                                    //     if (params.value !== null && params.value !== '') {
                                    //         html = `<div (click)="showDialog()" :class="imgSpanLogo">
                                    //                         <img [alt]="value()" [src]="https://ams.hsvina.com${params.value}" [height]="30" :class="logo" />
                                    //                 </div>`;
                                    //     }

                                    //     // put the value in bold
                                    //     return "<img [alt]="+params.value+" [src]='https://ams.hsvina.com"+params.value+"' [height]='30'  />";
                                    // }
                                });
                            }
                        }
                    });
                    this.apiService
                        .selectEquipmentAssetAll()
                        .pipe(takeUntil(this.unsubscribe$))
                        .subscribe((response) => {
                            // Handle response
                            if (response !== undefined && response !== null) {
                                this.records = response.records;
                                param = {
                                    rows: response.records,
                                    page: '1'
                                };
                                this.apiService
                                    .selectEquipmentAsset(param)
                                    .pipe(takeUntil(this.unsubscribe$))
                                    .subscribe((response) => {
                                        // Handle response
                                        if (response !== undefined && response !== null) {
                                            this.records = response.records;
                                            this.virtualAsset = response.rows;
                                            this.rowData = response.rows;
                                            this.loading = false;
                                        }
                                    });
                            }
                        });
                }
            },
            (error) => {
                console.error('Error handleChangeCorp:', error);
                this.loading = false;
            }
        );
    }

    @HostListener('click', ['$event.target'])
    onClick(targetElement: HTMLElement) {
        if (targetElement.classList.contains('photo_file')) {
            const altText = (targetElement as HTMLImageElement).alt;
            const nameText = (targetElement as HTMLImageElement).name;

            this.showDialog(altText, nameText);
            // You can add specific logic here for 'action-button' clicks
        }
    }

    exportToExcel(): void {
        let items: Array<any> = [];
        this.gridApi.forEachNode((node) => {
            let dataPush: any = {
                Parent: node.data.prt_nm,
                Type: node.data.tp_nm,
                Group: node.data.group_nm,
                'Photo File': node.data.photo_file,
                Total: node.data.lct_cd40
            };
            let indexTotalHeader = 0;
            this.rowDataHeader.forEach((ele: any, index: number) => {
                if (ele.dt_exp.indexOf('Total (') >= 0) {
                    indexTotalHeader++;
                    const lct_cd: string = 'lct_cd' + indexTotalHeader;
                    const nameTotal: string = this.findChartTitle(ele.dt_exp) + '-Total';
                    dataPush[nameTotal] = node.data[lct_cd];
                    const sts_cd: string = 'sts_cd' + indexTotalHeader + '_u';
                    const nameUsingl: string = this.findChartTitle(ele.dt_exp) + '-Using';
                    dataPush[nameUsingl] = node.data[sts_cd];
                    const sts_cd_s: string = 'sts_cd' + indexTotalHeader + '_s';
                    const nameStock: string = this.findChartTitle(ele.dt_exp) + '-T.Stock';
                    dataPush[nameStock] = node.data[sts_cd_s];
                }
            });
            items.push(dataPush);
        });
        this.global_sv.exportExcel(items, 'Equiment Asset Report', 'data');
    }

    clear() {
        this.gridApi.setFilterModel(null);
        this.gridApi.onFilterChanged();
        this.loading = true;
        this.parentFilterValue = null;
        this.corpFilterValue = null;
        this.typeFilterValue = null;
        this.groupFilterValue = null;
        this.modelFilterValue = '';
        this.language = '';
        this.erp = '';

        this.loading = false;
    }

    onBtExport() {
        this.gridApi.exportDataAsExcel();
    }

    onGridReady(params: GridReadyEvent<any>) {
        this.gridApi = params.api;
    }

    showDialog(img: string, name: string) {
        this.visible = true;
        this.img_val = 'https://ams.hsvina.com' + img;
        this.name_dialog = name;
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
                    }
                    if (responses.corp !== null && responses.corp !== undefined) {
                        this.corpFac = responses.corp.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    }
                    if (responses.type !== null && responses.type !== undefined) {
                        this.type = responses.type.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    }
                    if (responses.group !== null && responses.group !== undefined) {
                        this.group = responses.group.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
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
                                this.rowData = response.rows;
                                this.loading = false;
                            }
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
        // console.log('Filter parameters:', this.param);

        // this.records = response.records;
        // this.virtualAsset = response.rows;
        // this.rowData = response.rows;
        // this.loading = false;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
