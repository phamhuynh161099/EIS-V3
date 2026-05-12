import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Input, NgZone, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { forkJoin, Subject, Subscription } from 'rxjs';

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


import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Textarea } from 'primeng/textarea';
import { NewArticleService } from './new-article.service';
import { Name_Language } from '../../../../constants/constants.auth';
import { TAB_BAR_HEIGHT } from '../../../../constants/constants.system';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageSixViewPopup } from './image-six-view-popup/image-six-view-popup';
import { ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from '../../../strategy/custom-reuse-strategy';

/**
 * Param Query
 */
// import '../../../../../assets/js/paramquery/localize/pq-localize-en.js';
// import pq from '../../../../../assets/js/paramquery';
declare var pq: any

@Component({
    selector: 'app-new-article',
    imports: [
        Dialog,
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
        Textarea,

        DynamicDialogModule
    ],
    providers: [MessageService, DialogService],
    standalone: true,
    templateUrl: './new-article.html',
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
export class NewArticlePage implements OnInit, OnDestroy, AfterViewInit {
    private apiService = inject(NewArticleService);
    private unsubscribe$ = new Subject<void>();
    private reuseStrategy = inject(RouteReuseStrategy);

    private isDetached = false; // track trạng thái detach
    private activatedRoute = inject(ActivatedRoute);


    // Signal lưu chiều cao
    boxHeight = signal<string>('0');

    private refreshSubscription?: Subscription;

    constructor(
        private messageService: MessageService,
        public dialogService: DialogService,
        private ngZone: NgZone
    ) {
        const lang = localStorage.getItem(Name_Language);

    }


    ngOnInit(): void {
        const layoutTopBar = document.querySelector('.layout-topbar') as HTMLElement
        this.boxHeight.set(`calc(100vh - ${layoutTopBar.offsetHeight}px - ${TAB_BAR_HEIGHT}px)`);
    }

    ngAfterViewInit(): void {

        this.InitGrid();
        this.grid.refreshView();
        this.grid.loadState();
        this.getArticle();

        this.subscribeReuseEvents();
    }


    private subscribeReuseEvents(): void {
        const strategy = this.reuseStrategy as CustomReuseStrategy;

        // ✅ Lấy key của route này để filter đúng event
        const myKey = this.activatedRoute.snapshot.pathFromRoot
            .map(r => r.url.map(u => u.toString()).join('/'))
            .filter(Boolean)
            .join('/');

        strategy.onDetach$
            .pipe(
                takeUntil(this.unsubscribe$),
                filter(key => key === myKey)
            )
            .subscribe(() => {
                this.isDetached = true;
            });

        strategy.onAttach$
            .pipe(
                takeUntil(this.unsubscribe$),
                filter(key => key === myKey)
            )
            .subscribe(() => {
                this.isDetached = false;
                if (this.grid) {
                    // console.log('[NewArticle] force refresh', this.dataArticle);
                    // this.grid.option('dataModel.data', this.dataArticle);
                    setTimeout(() => {
                        this.grid.refreshDataAndView();
                        this.grid.hideLoading();
                    }, 0);
                }
            });
    }

    dataArticle = [];
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
            .getNewArticles(parameter)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (responses) => {
                    console.log('...', responses);

                    this.dataArticle = responses['data'];
                    this.grid.option('dataModel.data', this.dataArticle);
                    if (!this.isDetached) {
                        // this.grid.option('dataModel.data', this.dataArticle);
                        setTimeout(() => {
                            this.grid.refreshDataAndView();
                            this.grid.hideLoading();
                        }, 0);
                    }
                },
                (error) => {
                    console.error('Error loading filter lists:', error);
                }
            );
    }


    getSeasonFromArticle(rowData: any) {
        const parameter = {
            'data': {
                article_no: rowData['article_code'],
            },
        };

        this.grid.showLoading();
        this.apiService.getSeasonFromArticle(parameter)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data: any) => {

                const splitcode = rowData['article_code'].split('-');
                let mainCode = '';
                if (splitcode.length > 1) {
                    mainCode = splitcode[1];
                } else {
                    mainCode = splitcode[0];

                }

                this.toggleImageSixViewPopup({
                    sesson: data.data[0]['season'],
                    article_no: mainCode,
                    model_name: rowData['model_name'],
                });

                this.grid.hideLoading();


            },
                (error) => {
                    this.grid.hideLoading();
                    console.error('Error:', error);
                },
            );
    }

    //==========
    InitGrid() {
        let layoutMainHeight = (document.querySelector('.block-wrapper') as HTMLElement).offsetHeight;
        let boxHeightMainContent = (Math.max(layoutMainHeight - 28, 400))

        const obj: any = {
            numberCell: {
                title: 'No',
                resizable: false,
                minWidth: 40,
                show: true,
            },
            width: 'auto',
            height: boxHeightMainContent,
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
                // this.toggleImageSixViewPopup();
                this.ngZone.run(() => {
                    // this.toggleImageSixViewPopup();
                });

                const rowData = ui.rowData;
                if (ui.colIndx !== 15) {
                    this.getSeasonFromArticle(rowData);
                }
            },
            create: function (evt: any, ui: any) {
                // restore state of grid.
                this.loadState({ refresh: false });
            },
        };
        this.grid = pq.grid('#grid_new_article', obj);
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
            width: 140,
            dataIndx: 'mcs_to_hwk_midas',
            align: 'center',
            editable: false,
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
            title: 'MCS to PROD',
            // width: 300,
            width: 140,
            dataIndx: 'mcs_to_prod_midas',
            align: 'center',
            editable: false,
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
                return null
            },
            filter: { crules: [{ condition: 'range' }] },
        },
        {
            title: 'MCS REMARK',
            width: 300,
            dataIndx: 'mcs_remark',
            align: 'center',
            editable: false,
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
                return null
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


    topicImageSixViewRef: DynamicDialogRef | undefined;
    toggleImageSixViewPopup(rowData: any) {
        console.log("run function toggle")
        this.topicImageSixViewRef = this.dialogService.open(ImageSixViewPopup, {
            header: `View Six Images`,
            width: '80vw',
            modal: true,
            closable: true,
            data: {
                article_no_img: (rowData['article_no']),
                sesson: rowData['sesson'],
                model_name: rowData['model_name'],
            }

        });

        this.topicImageSixViewRef.onClose.subscribe(() => {
            this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: "" });
        });
    }


    ngOnDestroy(): void {
        if (this.grid) {
            try { this.grid.destroy(); } catch (e) { }
            this.grid = null;
        }
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

}
