import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { EquipmentService } from '../equipment.service';

import { FormsModule } from '@angular/forms';
import { MessageService, SelectItem, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Toast, ToastModule } from 'primeng/toast';

import { GlobalsService } from '../../../../../globals.service';
import { QrCodeGeneratorComponent } from './qr_code_generator';

import { LanguageType, Name_Language } from '../../../../../constants/constants.auth';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Textarea } from 'primeng/textarea';
import { SearchOptionValue } from '../information/information';
import { QrCodeGeneratorService } from './qr_code_generator.service';

/**
 * Param Query
 */
// import '../../../../../assets/js/paramquery/localize/pq-localize-en.js';
// import pq from '../../../../../assets/js/paramquery';
declare var pq: any

interface City {
    name: string;
    code: string;
}
interface ExportColumn {
    title: string;
    dataKey: string;
}
interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

@Component({
    selector: 'app-empty',
    imports: [
        FormsModule,
        FloatLabel,
        Dialog,
        TableModule,
        CommonModule,
        InputTextModule,
        TagModule,
        SelectModule,
        MultiSelectModule,
        DropdownModule,
        ButtonModule,
        IconField,
        InputIcon,
        SliderModule,
        ToastModule,
        Toast,
        ProgressSpinnerModule,
        DatePicker,
        QrCodeGeneratorComponent,
        Textarea
    ],
    providers: [EquipmentService, MessageService],
    standalone: true,
    templateUrl: './qr_code_management.html',
    styles: `
        ::ng-deep {
            .btn_search_global {
                .p-inputtext {
                    width: 24rem;
                    @media (min-width: 991px) {
                        width: 30rem;
                    }
                }
            }
            .btn_search_choose {
                .p-button {
                    width: 100%;
                }
            }
            .style_date .p-datepicker-input {
                width: 10rem !important;
                @media (min-width: 991px) {
                    width: 14rem !important;
                }
            }
            .p-progressspinner-circle {
                stroke: var(--grid-stroke) !important;
            }
            table {
                th,
                td {
                    white-space: nowrap;
                }
            }
            .p-select-list-container {
                max-height: 250px !important;
            }
            .p-multiselect-list-container {
                max-height: 270px !important;
            }

            //.p-dialog .p-dialog-content{
            //    overflow-y: unset !important;
            //}

            #search-by-excel-dialog{
                p-select{
                    .p-overlay.p-component{
                        top: unset !important;
                        bottom: 34px !important;
                    }
                }

                .p-dialog-content{
                    @media (width > 640px) {
                        min-width: 400px;
                    }
                }
            }

            .p-dialog-title {
                @media (max-width: 600px) {
                    font-size: 0.88em;
                }
            }

            #gen-dialog {
                .p-dialog {
                    @media (width < 640px) {
                        width: 100vw !important;
                        border-radius: 0;
                        max-height: 100%;
                        height: 100%;
                    }
                }
                .p-dialog-content {
                    overflow-y: unset !important;

                    .print-container {
                        display: flex;
                        flex-direction: column;
                        max-height: 70vh;
                        overflow-y: hidden;

                        #print-section {
                            overflow-y: auto !important;
                            flex-grow: 1;
                        }

                        @media (width < 640px) {
                            height: 80vh;
                            max-height: 80vh !important;
                        }
                        p-button {
                        }
                    }
                }
            }
        }
    `
})
export class QR_Code_Management implements OnInit, OnDestroy {
    private apiService = inject(QrCodeGeneratorService);
    private unsubscribe$ = new Subject<void>();

    private refreshSubscription?: Subscription;

    constructor(
        private sv: EquipmentService,
        private messageService: MessageService,
        public global_sv: GlobalsService
    ) {
        const lang = localStorage.getItem(Name_Language);

    }

    ngOnInit(): void {
        this.InitGrid();
        this.grid.refreshView();
        this.grid.loadState();

        this.getArticle();
    }

    ngOnDestroy(): void {
        // Cleanup subscription để tránh memory leak
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }


    getArticle(): void {
        const parameter = {
            'data': {
                'pq_curpage': 1,
                'pq_rpp': '',
                'fr_sdd': '',
                'to_sdd': '',
                'art_cd': '',
            },
        };
        this.apiService
            .getData(parameter)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (responses) => {
                    console.log('...', responses);

                    const dataLst: any = responses['data'];
                    this.grid.option('dataModel.data', dataLst);
                    this.grid.refreshDataAndView();
                    this.grid.hideLoading();
                },
                (error) => {
                    console.error('Error loading filter lists:', error);
                }
            );
    }

    //==========
    InitGrid() {
        const obj: any = {
            numberCell: {
                title: 'No',
                resizable: false,
                minWidth: 40,
                show: true,
            },
            width: 'auto',
            height: 800,
            // maxHeight: 798,
            collapsible: {
                on: false,
                css: {
                    zIndex: 1400,
                },
            },
            type: 'local',
            autoRow: false,
            wrap: false,
            hwrap: false,
            resizable: true,
            filterModel: {
                on: true,
                mode: 'AND',
                header: true,
                type: 'local',
            },
            selectionModel: { type: 'row' },
            colModel: this.colModel,
            dataModel: {
                data: [],
            },
            animModel: {
                on: true,
            },
            toolbar: {
                cls: 'pq-toolbar-export',
                items: [
                    {
                        type: 'button',
                        label: 'Export',
                        attr: 'title="Export Excel"',
                        cls: 'export-button',
                        // icon: 'ui-icon-arrowthickstop-1-s', // fa fa-file-excel-o
                        icon: 'export',
                        listener: function () {

                        },
                    },
                    { type: 'separator' },
                    {
                        type: 'button',
                        options: { text: false, showLabel: false },
                        attr: 'title="Refresh"',
                        icon: 'refresh',
                        listener: () => {
                            this.grid.showLoading();

                        },
                    },
                    {
                        type: 'button',
                        options: { text: false, showLabel: false },
                        attr: 'title="Reset Filter"',
                        icon: 'reset',
                        listener: function () {

                        },
                    },
                ],
                type: 'local',
            },
            pageModel: {
                type: 'local',
                rPP: 25,
                format: '##,###',
                strRpp: '{0}',
                strDisplay: '{0} to {1} of {2} row(s) ',
                strPage: 'Page {0} / {1}',
                rPPOptions: [25, 50, 100, 200],
                layout: [
                    // 'refresh', '|',
                    'strRpp', '|',
                    'strDisplay',
                    'first', 'prev', '|', 'strPage', '|', 'next', 'last',
                ],
            },
            scrollModel: {
                autoFit: true,
            },
            cellClick: (evt: any, ui: any) => {

            },
            create: function (evt: any, ui: any) {
                // restore state of grid.
                this.loadState({ refresh: false });
            },
        };
        this.grid = pq.grid('#grid_NArticle_01', obj);
    }

    colModel = [
        {
            title: 'BU',
            // width: 732,
            width: 200,
            dataType: 'string',
            dataIndx: 'business_unit',
            align: 'left',
            editable: false,
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            render: (ui: any) => this.renderRow(ui),
            style: this.styleCellFirst(),
            styleHead: {
                'background': '#3f424c',
                // 'border-left': '1px solid #959595',
                'border-left': 'none',
                'border-top': 'none',
            },
            filter: { crules: [{ condition: 'range' }] },
        },
        {
            title: 'Model Name',
            // width: 732,
            width: 200,
            dataType: 'string',
            dataIndx: 'model_name',
            align: 'left',
            editable: false,
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            render: (ui: any) => this.renderRow(ui),
            style: this.styleCellFirst(),
            styleHead: {
                'background': '#3f424c',
                // 'border-left': '1px solid #959595',
                'border-left': 'none',
                'border-top': 'none',
            },
            filter: { crules: [{ condition: 'range' }] },
        },
        {
            title: 'PB Type',
            // width: 732,
            width: 200,
            dataType: 'string',
            dataIndx: 'pb_type',
            align: 'left',
            editable: false,
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            render: (ui: any) => this.renderRow(ui),
            style: this.styleCellFirst(),
            styleHead: {
                'background': '#3f424c',
                // 'border-left': '1px solid #959595',
                'border-left': 'none',
                'border-top': 'none',
            },
            filter: { crules: [{ condition: 'range' }] },
        },
        {
            title: 'Art.No',
            // width: 300,
            width: 150,
            dataType: 'string',
            dataIndx: 'article_code',
            align: 'center',
            editable: false,
            hvalign: 'center',
            valign: 'center',
            render: (ui: any) => this.renderRow(ui),
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: { crules: [{ condition: 'contain' }] },
        },
        {
            title: 'SO.No',
            // width: 300,
            width: 150,
            dataType: 'string',
            dataIndx: 'so_no',
            align: 'center',
            editable: false,
            hvalign: 'center',
            valign: 'center',
            hidden: true,
            render: (ui: any) => this.renderRow(ui),
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: { crules: [{ condition: 'contain' }] },
        },
        {
            title: 'SO-Item',
            // width: 300,
            width: 150,
            dataType: 'string',
            dataIndx: 'so_item',
            align: 'center',
            editable: false,
            hvalign: 'center',
            valign: 'center',
            hidden: false,
            render: (ui: any) => this.renderRow(ui),
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: { crules: [{ condition: 'contain' }] },
        },
        {
            title: 'Factory Name',
            // width: 200,
            width: 100,
            dataType: 'string',
            dataIndx: 'factory_name',
            align: 'left',
            editable: false,
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            render: (ui: any) => this.renderRow(ui),
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: { crules: [{ condition: 'range' }] },
        },
        {
            title: 'SO.Qty',
            // width: 300,
            width: 100,
            dataIndx: 'so_qty',
            dataType: 'integer',
            align: 'right',
            format: '##,###',
            editable: false,
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            render: (ui: any) => this.renderRow(ui),
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: { crules: [{ condition: 'contain' }], menuIcon: true },
        },
        {
            title: 'Setting MTR',
            // width: 300,
            width: 140,
            dataIndx: 'setting_mtr',
            align: 'center',
            editable: false,
            format: 'yy.mm.dd',
            dataType: 'date',
            hvalign: 'center',
            valign: 'center',
            render: (ui: any) => this.renderRow(ui),
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: { crules: [{ condition: 'between' }] },
        },
        {
            title: 'SDD',
            // width: 300,
            width: 140,
            dataIndx: 'mst_sdd',
            align: 'center',
            editable: false,
            format: 'yy.mm.dd',
            dataType: 'date',
            hvalign: 'center',
            valign: 'center',
            render: (ui: any) => this.renderRow(ui),
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: { crules: [{ condition: 'range' }] },
        },
        {
            title: 'SDD',
            dataType: 'date',
            dataIndx: 'sdd',
            hidden: true,
            editable: false,
            menuInHide: true,
        },
        {
            title: 'MCS ETC',
            // width: 300,
            width: 140,
            dataIndx: 'mcs_etc_midas',
            align: 'center',
            editable: false,
            // format: 'yy.mm.dd',
            dataType: 'string',
            hvalign: 'center',
            valign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            render: function (ui: any) {
                if (ui.rowIndx % 2 === 0) {
                    return {
                        style: { 'background-color': '#3d4049' },
                    };
                }
                return null;
            },
            filter: { crules: [{ condition: 'range' }] },
        },
        {
            title: 'MCS to HWA',
            // width: 300,
            width: 140,
            dataIndx: 'mcs_to_hwa_midas',
            align: 'center',
            editable: false,
            // format: 'yy.mm.dd',
            dataType: 'string',
            hvalign: 'center',
            valign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            render: function (ui: any) {
                if (ui.rowIndx % 2 === 0) {
                    return {
                        style: { 'background-color': '#3d4049' },
                    };
                }
                return null;
            },
            filter: { crules: [{ condition: 'range' }] },
        },
        {
            title: 'MCS to HWK',
            // width: 300,
            width: 140,
            dataIndx: 'mcs_to_hwk_midas',
            align: 'center',
            editable: false,
            // format: 'yy.mm.dd',
            dataType: 'string',
            hvalign: 'center',
            valign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            render: function (ui: any) {
                if (ui.rowIndx % 2 === 0) {
                    return {
                        style: { 'background-color': '#3d4049' },
                    };
                }

                return null;
            },
            filter: { crules: [{ condition: 'range' }] },
        },
    ];

    styleCell() {
        return {
            'border-right-color': '#959595',
            'border-bottom-color': '#959595',
        };
    }

    styleCellLast() {
        return {
            'border-right-color': '#3D3F49',
            'border-bottom-color': '#959595',
        };
    }

    styleCellFirst() {
        return {
            'border-right-color': '#959595',
            'border-bottom-color': '#959595',
            'border-left': '1px solid #959595 !important',
        };
    }

    styleHead() {
        return {
            'background': '#3f424c',
            'border-top': 'none',
        };
    }
    grid: any;

    renderRow(ui: any) {
        const ri = ui.rowIndx;
        if (ri % 2 === 0) {
            return {
                style: { 'background-color': '#3d4049' },
            };
        }

        return null;
    }

}
