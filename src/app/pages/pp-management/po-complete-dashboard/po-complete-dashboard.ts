import { CommonModule } from '@angular/common';
import { afterNextRender, AfterViewInit, Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
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
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Toast, ToastModule } from 'primeng/toast';



import { Textarea } from 'primeng/textarea';
import { filter, takeUntil } from 'rxjs/operators';
import { PoCompleteDashboardService } from './po-complete-dashboard.service';
import { QrCodeGeneratorComponent } from '../../management/equipment/qr_code_manage/qr_code_generator';
import { GlobalsService } from '../../../../globals.service';
import { Name_Language } from '../../../../constants/constants.auth';
import { EquipmentService } from '../../management/equipment/equipment.service';
import moment from 'moment';
import { CheckboxModule } from 'primeng/checkbox';
import { TAB_BAR_HEIGHT } from '../../../../constants/constants.system';
import { CustomReuseStrategy } from '../../../strategy/custom-reuse-strategy';
import { ActivatedRoute, RouteReuseStrategy } from '@angular/router';

/**
 * Param Query
 */
// import '../../../../../assets/js/paramquery/localize/pq-localize-en.js';
// import pq from '../../../../../assets/js/paramquery';
declare var pq: any

@Component({
    selector: 'app-pp-complete-dashboard',
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
        Textarea,
        CheckboxModule,
    ],
    providers: [EquipmentService, MessageService],
    standalone: true,
    templateUrl: './po-complete-dashboard.html',
    styleUrls: ['./po-complete-dashboard.scss'],
})
export class PoCompleteDashboard implements OnInit, OnDestroy, AfterViewInit {

    private unsubscribe$ = new Subject<void>();
    private service = inject(PoCompleteDashboardService);

    // // Define
    grid: any;
    date: any;
    defaultFactory: String = 'Factory 1';
    defaultDate: String = '';
    defaultType: String = 'sdd';

    checkedInComplete: boolean = true;
    checkedAll: boolean = false;

    listFactory: any = [
        { factory_name: 'Factory 1', factory_code: 'F1' },
        { factory_name: 'Factory 2', factory_code: 'F2' },
        // { factory_name: 'Factory 3', factory_code: 'F3' },
        { factory_name: 'RACH GIA A', factory_code: 'RACH GIA A' },
        { factory_name: 'RACH GIA B', factory_code: 'RACH GIA B' },
        { factory_name: 'RACH GIA C', factory_code: 'RACH GIA C' },
        { factory_name: 'RACH GIA D', factory_code: 'RACH GIA D' },
    ];

    listDate: any = [];
    listData: any = [];
    tempListData: any = [];


    todate = new Date();
    toDate: Date = new Date(this.todate.getFullYear(), this.todate.getMonth(), this.todate.getDate());

    isPrimaryLoading: boolean = false;

    totalPO: number = 0;
    completedPO: number = 0;
    incompletedPO: number = 0;
    percentInfo: number = 0;

    tempcompletedPO: number = 0;

    lstOptionDate: any[] = [];
    arrSDD: any[] = [];
    arrCRD: any[] = [];
    defaultDateSDD = '';
    defaultDateCRD = '';

    defaultDateSDD_inc = '';
    defaultDateCRD_inc = '';

    // Option Multy Date
    dropdownSettings: any;
    lstDateSDD: any = [];
    dropdownListSDD: any = [];
    selectedItems: any[] = [];
    selectedSDD: any[] = [];
    selectedDefaultSDD: any = [];
    arrMulSDD: any[] = [];
    arrMulCRD: any[] = [];
    defaultMulDateSDD = [];
    defaultMulDateCRD = [];
    // END: Option Multy Date

    // Option type search FROM TO
    lstOptionFromTo: any = [];
    defaultDateFrom = '';
    defaultDateTo = '';
    // END: Option type search FROM TO


    // Signal lưu chiều cao
    boxHeight = signal<string>('0');
    // Signal lưu chiều cao của table
    boxHeightMainContent = 0;
    // chiều cao của filter
    boxHeightFilter = 0;
    // pading
    paddingTableAFilter = 24;
    private resizeObserver: ResizeObserver | null = null;
    constructor() {

    }

    ngOnInit(): void {
        const layoutTopBar = document.querySelector('.layout-topbar') as HTMLElement
        this.boxHeight.set(`calc(100vh - ${layoutTopBar.offsetHeight}px - ${TAB_BAR_HEIGHT}px)`);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.InitGrid();
        }, 0);
        this.getCRD();

        this.subscribeReuseEvents();

    }

    private reuseStrategy = inject(RouteReuseStrategy);
    private isDetached = false; // track trạng thái detach
    private activatedRoute = inject(ActivatedRoute);
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
                    // this.grid.option('dataModel.data', this.dataArticle);
                    setTimeout(() => {
                        this.grid.refreshDataAndView();
                        this.grid.hideLoading();
                    }, 0);
                }
            });
    }

    onSelectAll(items: any) {
        this.selectedItems = [];
        this.selectedSDD = [];

        this.selectedItems = this.selectedDefaultSDD;
        this.selectedSDD = this.selectedDefaultSDD;

        this.grid.reset({ filter: true, sort: true });
        this.getTotalPO();
        this.getPOCompletionDashboard();

    }

    onDeSelectAll(items: any) {
        this.selectedSDD = [];
        this.grid.reset({ filter: true, sort: true });
        this.getTotalPO();
        this.getPOCompletionDashboard();
    }

    getDaysInMonth(year: any, month: any) {
        return new Date(year, month, 0).getDate();
    }

    initDefaultDate() {

    }

    onSelectionChangeFactory($event: any) {
        this.defaultFactory = $event;
        this.defaultType = 'sdd';
        this.grid.reset({ filter: true, sort: true });

        this.getCRD();
    }

    onSelectionChangeDate($event: any) {
        this.defaultDate = $event;

        this.grid.reset({ filter: true, sort: true });
        this.getTotalPO();
        this.getPOCompletionDashboard();
    }

    onSelectionChangeType($event: any) {
        this.defaultType = $event;
        if ($event === 'sdd') {
            this.lstOptionDate = this.arrSDD;
            this.defaultDate = this.defaultDateSDD;
        } else if ($event === 'crd') {
            this.lstOptionDate = this.arrCRD;
            this.defaultDate = this.defaultDateCRD;
        }
        // END: Area set dafault date Mul

        // Option From To
        if ($event === 'sdd') {
            this.lstOptionFromTo = this.arrSDD;
            this.defaultDateFrom = this.defaultDateSDD_inc;
            this.defaultDateTo = this.defaultDateSDD;
        } else if ($event === 'crd') {
            this.lstOptionFromTo = this.arrCRD;
            this.defaultDateFrom = this.defaultDateCRD_inc;
            this.defaultDateTo = this.defaultDateCRD;
        }
        // console.log('view', this.lstOptionFromTo, this.defaultDateTo);
        // END: Option From To

        this.grid.refreshDataAndView();
        this.grid.reset({ filter: true, sort: true });
        // this.getPOInfor();
        this.getTotalPO();
        this.getPOCompletionDashboard();
    }


    onSelectionChangeDateFrom($event: any) {
        this.defaultDateFrom = $event;
        this.grid.reset({ filter: true, sort: true });
        this.getTotalPO();
        this.getPOCompletionDashboard();
    }

    onSelectionChangeDateTo($event: any) {
        this.defaultDateTo = $event;
        this.grid.reset({ filter: true, sort: true });
        this.getTotalPO();
        this.getPOCompletionDashboard();
    }

    toggleInComplete($event: any) {
        this.checkedInComplete = true;
        this.checkedAll = false;

        this.grid.reset({ filter: true, sort: true });
        this.getTotalPO();
        this.getPOCompletionDashboard();
    }

    toggleAll($event: any) {
        this.checkedInComplete = false;
        this.checkedAll = true;

        this.grid.reset({ filter: true, sort: true });
        this.getTotalPO();
        this.getPOCompletionDashboard();
    }

    // #Init Col Model pq
    colModel = [
        {
            title: 'SDD',
            width: 80,
            dataType: 'string',
            dataIndx: 'mst_sdd',
            align: 'center',
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            sortable: false,
            editable: false,
            render: (ui: any) => {
                const dataCell = ui.cellData;
                // console.log('SDD', dataCell);
                // return {
                //   text: dataCell.replace('-', '.').replace('-', '.'),
                // };
                return {
                    text: `
          <div style="font-size:14px;font-weight:500;margin-top: -10px;">
            ${dataCell.replace('-', '.').replace('-', '.')}
          </div>
          `,
                };

            },
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: {
                crules: [{ condition: 'range' }],
            },
        },
        {
            title: 'CRD',
            dataType: 'string',
            width: 80,
            dataIndx: 'crd',
            align: 'center',
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            sortable: false,
            editable: false,
            render: (ui: any) => {
                const dataCell = ui.cellData;
                // console.log('SDD', dataCell);
                // return {
                //   text: dataCell.replace('-', '.').replace('-', '.'),
                // };
                // ${dataCell.replace('-', '.').replace('-', '.')}
                return {
                    text: `
          <div style="font-size:14px;font-weight:500;margin-top: -10px;">
          ${dataCell}
          </div>
          `,
                };

            },
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: {
                crules: [{ condition: 'range' }],
            },
        },
        {
            title: 'UPPER FAC',
            dataType: 'string',
            dataIndx: 'upper_fac_name',
            align: 'center',
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            // sortable: false,
            editable: false,
            style: this.styleCell(),
            styleHead: this.styleHead(),
            render: (ui: any) => {
                return {
                    text: `
          <div style="font-size:14px;font-weight:500;margin-top: -10px;">
            ${ui.cellData}
          </div>
          `,
                };
            },
            filter: {
                crules: [{ condition: 'range' }],
            },

        },
        {
            title: 'Model',
            dataType: 'string',
            dataIndx: 'model_name',
            align: 'center',
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            // sortable: false,
            editable: false,
            style: this.styleCell(),
            styleHead: this.styleHead(),
            render: (ui: any) => {
                return {
                    text: `
          <div style="font-size:14px;font-weight:500;margin-top: -10px;">
            ${ui.cellData}
          </div>
          `,
                };
            },
            filter: { crules: [{ condition: 'range' }] },
        },
        {
            title: 'PGSC',
            dataType: 'string',
            dataIndx: 'article_code',
            align: 'center',
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            // sortable: false,
            editable: false,
            style: this.styleCell(),
            styleHead: this.styleHead(),
            render: (ui: any) => {
                return {
                    text: `
          <div style="font-size:14px;font-weight:500;margin-top: -10px;">
            ${ui.cellData}
          </div>
          `,
                };
            },
            filter: { crules: [{ condition: 'contain' }] },
        },
        {
            title: 'PO-Item',
            dataType: 'string',
            dataIndx: 'so_item',
            align: 'center',
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            sortable: false,
            editable: false,
            style: this.styleCell(),
            styleHead: this.styleHead(),
            render: (ui: any) => {
                let bg_color = '';
                if (ui.rowData.alert === 'Priority') {
                    bg_color = 'background-color: #ffc000;';
                } else {
                    bg_color = '';
                }


                return {
                    text: `
          <div style="font-size:14px;font-weight:500;height:40px;margin-top: 5px;${bg_color}">
            ${ui.cellData}
          </div>
          `,
                };
            },
            filter: { crules: [{ condition: 'contain' }] },
        },
        {
            title: 'Dest',
            dataType: 'string',
            dataIndx: 'destination',
            align: 'center',
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            sortable: false,
            editable: false,
            style: this.styleCell(),
            styleHead: this.styleHead(),
            render: (ui: any) => {
                let bg_color = '';
                if (ui.cellData === 'China') {
                    bg_color = 'background-color: #df6a6c;';
                } else {
                    bg_color = '';
                }
                return {
                    text: `
          <div style="font-size:14px;font-weight:500;height:40px;margin-top: 5px;${bg_color}">
            ${ui.cellData}
          </div>
          `,
                };
            },
            filter: { crules: [{ condition: 'range' }] },
        },
        {
            title: 'Q.ty',
            dataType: 'string',
            dataIndx: 'so_qty',
            align: 'center',
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            sortable: false,
            editable: false,
            style: this.styleCell(),
            styleHead: this.styleHead(),
            render: (ui: any) => {
                return {
                    text: `
          <div style="font-size:14px;font-weight:500;margin-top: -10px;">
            ${Intl.NumberFormat('en-US').format(ui.cellData)}
          </div>
          `,
                };
            },
            filter: { crules: [{ condition: 'contain' }] },
        },
        {
            title: 'PO STATUS',
            dataType: 'string',
            dataIndx: 'po_status',
            width: '30%',
            align: 'center',
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            // sortable: false,
            editable: false,
            style: this.styleCell(),
            styleHead: this.styleHead(),
            render: this.dataBar(),
        },
        {
            title: 'SET READY',
            dataType: 'string',
            dataIndx: 'set_ready',
            align: 'center',
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            sortable: true,
            editable: false,
            style: this.styleCell(),
            styleHead: this.styleHead(),
            render: (ui: any) => {
                if (Number(ui.rowData.count_line_ready) > 1) {
                    return {
                        text: `
            <div style="font-size:14px;font-weight:500;margin-top: -10px;">
              ${ui.cellData} +
            </div>
            `,
                    };
                } else {
                    return {
                        text: `
            <div style="font-size:14px;font-weight:500;margin-top: -10px;">
              ${ui.cellData}
            </div>
            `,
                    };
                }
            },
            filter: { crules: [{ condition: 'contain' }] },
        },
        {
            title: 'ON GOING',
            dataType: 'string',
            dataIndx: 'on_going',
            align: 'center',
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            sortable: true,
            editable: false,
            style: this.styleCell(),
            styleHead: this.styleHead(),
            render: (ui: any) => {
                if (Number(ui.rowData.count_line_ongoing) > 1) {
                    return {
                        text: `
            <div style="font-size:14px;font-weight:500;margin-top: -10px;">
              ${ui.cellData} + ${ui.rowData.count_line_ongoing}
            </div>
            `,
                    };
                } else {
                    return {
                        text: `
            <div style="font-size:14px;font-weight:500;margin-top: -10px;">
              ${ui.cellData}
            </div>
            `,
                    };
                }
            },
            filter: { crules: [{ condition: 'contain' }] },
        },
    ];

    InitGrid() {
        let layoutMainHeight = (document.querySelector('.block-wrapper') as HTMLElement).clientHeight;
        let boxHeightFilter = (document.querySelector('#block-filter') as HTMLElement).clientHeight;
        let boxHeightMainContent = (Math.max(layoutMainHeight - boxHeightFilter - TAB_BAR_HEIGHT, 400))

        const $this = this;

        const obj: any = {
            showTop: false,
            numberCell: {
                title: 'No',
                resizable: false,
                minWidth: 40,
                show: true,
            },
            rowHt: 38.5,
            height: boxHeightMainContent,
            collapsible: {
                on: false,
                css: {
                    zIndex: 1400,
                },
            },
            columnTemplate: { editable: false },
            type: 'local',
            autoRow: false,
            wrap: false,
            hwrap: false,
            resizable: true,
            filterModel: { on: true, mode: 'AND', header: true, type: 'local' },
            dataModel: {
                data: [],
            },

            filter: function (event: any, ui: any) {
                // console.log('ui', ui.rules);
                // const infoListData = $this.grid.option('dataModel.data');
                let infoListData: any = '';

                // $this.checkedAll
                if (0) {
                    infoListData = $this.grid.option('dataModel.data');
                    // infoListData = $this.tempListData;
                } else {
                    // get rules of upper fac
                    const uiRules = ui.rules;
                    let filterUpperFac: any = '';
                    for (let i = 0; i < uiRules.length; i++) {
                        // console.log(uiRules[i].dataIndx === 'upper_fac_name');
                        if (uiRules[i].dataIndx === 'upper_fac_name') {
                            // console.log('chay true');
                            filterUpperFac = uiRules[i];
                        }
                    }
                    // console.log(`filter ui rules`,filterUpperFac === '');
                    // end get rules of upper fac

                    // handle data with filter
                    if (filterUpperFac === '') {
                        // infoListData = $this.grid.option('dataModel.data');
                        infoListData = $this.tempListData;
                    } else {
                        const arrFilter = filterUpperFac.crules[0].value;
                        const arrListDataAfter = [];
                        for (let i = 0; i < $this.tempListData.length; i++) {
                            const item = $this.tempListData[i];
                            if (arrFilter.includes(item.upper_fac_name)) {
                                arrListDataAfter.push(item);
                                // console.log(`${item.upper_fac_name} thuoc filter`);
                            } else {
                                // console.log(`${item.upper_fac_name} khong thuoc filter`);
                            }
                        }

                        infoListData = arrListDataAfter;
                        // console.log('data after filter',infoListData);
                    }
                    // end handle data with filter
                }

                // ===================================================================

                // handle main percent
                $this.totalPO = 0;
                $this.completedPO = 0;
                $this.percentInfo = 0;
                $this.tempcompletedPO = 0;

                for (let i = 0; i < infoListData?.length; i++) {
                    if (infoListData[i].status === 'Incomplete' || infoListData[i].status === 'Complete') {
                        $this.totalPO++;
                    }

                    if (infoListData[i].status === 'Complete') {
                        $this.completedPO++;
                    }
                }

                if ($this.totalPO === 0) {
                    $this.percentInfo = 0;
                } else {
                    $this.percentInfo = Number(Math.round($this.completedPO * 100 / $this.totalPO));
                }
                // end handle main percent
            },

            // postRenderInterval: -1,
            create: function (evt: any, ui: any) {
                this.widget().pqTooltip();
            },

            cellClick: (evt: any, ui: any) => {
                // console.log('cell click', ui);
                const dataIndxArr = ['set_ready', 'on_going'];
                if (dataIndxArr.includes(ui.dataIndx.toString())) {
                    // $this.openPoCompletionPopup(ui.rowData, ui.dataIndx.toString());
                }
            },

            colModel: this.colModel,
            animModel: {
                on: true,
            },
            flex: { on: true },

            pageModel: {
                type: 'local',
                rPP: 300,
                format: '##,###',
                strRpp: '{0}',
                strDisplay: '{0} to {1} of {2} row(s) ',
                strPage: 'Page {0} / {1}',
                rPPOptions: [15, 50, 100, 200, 300],
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
            cache: true,
        };
        this.grid = pq.grid('#grid_POD', obj);
    }

    getCRD() {
        let facCode = '';
        for (let i = 0; i < this.listFactory.length; i++) {
            if (this.listFactory[i].factory_name === this.defaultFactory) {
                facCode = this.listFactory[i].factory_code;
                break;
            }
        }


        const parameter = {
            'data': {
                'factory_name': facCode,
            },
        };
        this.isPrimaryLoading = true;

        this.service.getCRD(parameter)
            .subscribe((data: any) => {
                if (data.data === undefined) {
                    data.data = [];
                }
                this.arrCRD = [];
                this.arrMulCRD = [{ sdd_date: '==> Clear SDD Option <==' }];
                let tempDate = moment(data.data[0].crd, 'YYYYMMDD').format('YYYYMMDD');
                let tempDate_inc = moment(data.data[1].crd, 'YYYYMMDD').format('YYYYMMDD');
                let keyMin = Math.abs(Number(tempDate) - Number(moment().format('YYYYMMDD')));

                for (let i = 0; i < data.data.length - 1; i++) {
                    if (Math.abs(Number(moment(data.data[i].crd, 'YYYYMMDD').format('YYYYMMDD')) - Number(moment().format('YYYYMMDD'))) <= keyMin) {
                        keyMin = Math.abs(Number(moment(data.data[i].crd, 'YYYYMMDD').format('YYYYMMDD')) - Number(moment().format('YYYYMMDD')));
                        tempDate = moment(data.data[i].crd, 'YYYYMMDD').format('YYYYMMDD');
                        tempDate_inc = moment(data.data[i + 1].crd, 'YYYYMMDD').format('YYYYMMDD');
                    }
                }

                for (let i = 0; i < data.data.length; i++) {
                    this.arrCRD.push({
                        filter_SDD: moment(data.data[i].crd, 'YYYYMMDD').format('yyyy-MM-DD'),
                        real_SDD: moment(data.data[i].crd, 'YYYYMMDD').format('YYYYMMDD'),
                    });


                    this.arrMulCRD.push({
                        sdd: moment(data.data[i].crd, 'YYYYMMDD').format('YYYYMMDD'),
                        sdd_date: moment(data.data[i].crd, 'YYYYMMDD').format('YYYY-MM-DD'),
                    });
                }
                this.defaultDateCRD = moment(tempDate, 'YYYYMMDD').format('YYYYMMDD');
                this.defaultDateCRD_inc = moment(tempDate_inc, 'YYYYMMDD').format('YYYYMMDD');

                this.getSDD();

            },
                (error: any) => {
                    alert('Post has problem');
                },
            );
    }

    getSDD() {
        let facCode = '';
        for (let i = 0; i < this.listFactory.length; i++) {
            if (this.listFactory[i].factory_name === this.defaultFactory) {
                facCode = this.listFactory[i].factory_code;
                break;
            }
        }


        const parameter = {
            'data': {
                'factory_name': facCode,
            },
        };

        // this.isLoading01 = true;
        this.isPrimaryLoading = true;

        this.service.getSDD(parameter)
            .subscribe((data: any) => {
                if (data.data === undefined) {
                    data.data = [];
                }



                let tempDate = moment(data.data[0].sdd, 'YYYYMMDD').format('YYYYMMDD');
                let tempDate_inc = moment(data.data[1].sdd, 'YYYYMMDD').format('YYYYMMDD');
                let keyMin = Math.abs(Number(tempDate) - Number(moment().format('YYYYMMDD')));

                this.arrSDD = [];
                this.arrMulSDD = [{ sdd_date: '==> Clear SDD Option <==' }];

                for (let i = 0; i < data.data.length - 1; i++) {
                    if (Math.abs(Number(moment(data.data[i].sdd, 'YYYYMMDD').format('YYYYMMDD')) - Number(moment().format('YYYYMMDD'))) <= keyMin) {
                        keyMin = Math.abs(Number(moment(data.data[i].sdd, 'YYYYMMDD').format('YYYYMMDD')) - Number(moment().format('YYYYMMDD')));
                        tempDate = moment(data.data[i].sdd, 'YYYYMMDD').format('YYYYMMDD');
                        tempDate_inc = moment(data.data[i + 1].sdd, 'YYYYMMDD').format('YYYYMMDD');
                    }
                }

                for (let i = 0; i < data.data.length; i++) {
                    this.arrSDD.push({
                        filter_SDD: moment(data.data[i].sdd, 'YYYYMMDD').format('yyyy-MM-DD'),
                        real_SDD: moment(data.data[i].sdd, 'YYYYMMDD').format('YYYYMMDD'),
                    });

                    this.arrMulSDD.push({
                        sdd: moment(data.data[i].sdd, 'YYYYMMDD').format('YYYYMMDD'),
                        sdd_date: moment(data.data[i].sdd, 'YYYYMMDD').format('YYYY-MM-DD'),
                    });
                }

                this.lstOptionDate = this.arrSDD;
                this.defaultDateSDD = moment(tempDate, 'YYYYMMDD').format('YYYYMMDD');
                this.defaultDateSDD_inc = moment(tempDate_inc, 'YYYYMMDD').format('YYYYMMDD');
                this.defaultDate = this.defaultDateSDD;
                // END: Area set dafault date Mul

                // Area Option From To
                this.lstOptionFromTo = this.arrSDD;
                this.defaultDateFrom = this.defaultDateSDD_inc;
                this.defaultDateTo = this.defaultDateSDD;
                // END: Area Option From To

                this.getPOCompletionDashboard();
                this.getTotalPO();
                // this.InitGrid();

                // this.getPOInfor();
            },
                (error: any) => {
                    alert('Post has problem');
                },
            );
    }

    getPOCompletionDashboard() {
        let facCode = '';
        for (let i = 0; i < this.listFactory.length; i++) {
            if (this.listFactory[i].factory_name === this.defaultFactory) {
                facCode = this.listFactory[i].factory_code;
                break;
            }
        }

        const dataArr = this.convertArrSDD(this.selectedSDD);
        const parameter = {
            'data': {
                'status': this.checkedInComplete ? 'Incomplete' : 'All',
                // 'arr_date': dataArr,
                'frDate': this.defaultDateFrom,
                'toDate': this.defaultDateTo,
                'factory_name': facCode,
                'date_type': this.defaultType,
            },
        };

        // this.isLoading01 = true;
        this.isPrimaryLoading = true;

        this.service.getPOCompletionDashboard(parameter)
            .subscribe((data: any) => {
                if (data.data === undefined) {
                    data.data = [];
                }

                this.listData = data.data;

                for (let i = 0; i < this.listData.length; i++) {
                    // Handle percent bar
                    const cntXData = 0;
                    let percentBar = 0;
                    const _percentBar = 0;
                    const baseBar = 0;
                    if (Number(this.listData[i].so_qty) === 0) {
                        percentBar = 0;
                    } else {
                        percentBar = Math.floor(100 - (Number(this.listData[i].total_bal) * 100 / (5 * this.listData[i].so_qty)));
                    }

                    this.listData[i] = { ...this.listData[i], po_status: percentBar };
                    // End Handle percent bar

                }

                this.grid.option('dataModel.data', this.listData);
                this.grid.refreshDataAndView();
                this.isPrimaryLoading = false;


            },
                (error: any) => {
                    alert('Post has problem');
                },
            );

    }

    getPOInfor() {
        let facCode = '';
        for (let i = 0; i < this.listFactory.length; i++) {
            if (this.listFactory[i].factory_name === this.defaultFactory) {
                facCode = this.listFactory[i].factory_code;
                break;
            }
        }
        const parameter = {
            'data': {
                'status': 'All',
                'frDate': this.defaultDateFrom,
                'toDate': this.defaultDateTo,
                'factory_name': facCode,
                'date_type': this.defaultType,
            },
        };

        this.service.getPOCompletionDashboard(parameter)
            .subscribe((data: any) => {
                if (data.data === undefined) {
                    data.data = [];
                }

                this.tempListData = [...data.data];
                const tempListData = data.data;

                // handle main percent
                this.totalPO = 0;
                this.completedPO = 0;
                this.percentInfo = 0;

                this.tempcompletedPO = 0;

                // let dataComp=[];

                for (let i = 0; i < tempListData?.length; i++) {
                    if (tempListData[i].status === 'Incomplete' || tempListData[i].status === 'Complete') {
                        this.totalPO++;
                    }

                    if (tempListData[i].status === 'Complete') {
                        this.completedPO++;
                    }
                }

                if (this.totalPO === 0) {
                    this.percentInfo = 0;
                } else {
                    this.percentInfo = Math.round(this.completedPO * 100 / this.totalPO);
                }
                // end handle main percent
            },
                (error: any) => {
                    alert('Post has problem');
                },
            );
    }

    getTotalPO() {
        let facCode = '';
        for (let i = 0; i < this.listFactory.length; i++) {
            if (this.listFactory[i].factory_name === this.defaultFactory) {
                facCode = this.listFactory[i].factory_code;
                break;
            }
        }

        const dataArr = this.convertArrSDD(this.selectedSDD);

        const parameterTotalPO = {
            'data': {
                'status': 'All',
                // 'arr_date': dataArr,
                'frDate': this.defaultDateFrom,
                'toDate': this.defaultDateTo,
                'factory_name': facCode,
                'date_type': this.defaultType,
            },
        };

        const parameterCompletePO = {
            'data': {
                'status': 'Incomplete',
                // 'arr_date': dataArr,
                'frDate': this.defaultDateFrom,
                'toDate': this.defaultDateTo,
                'factory_name': facCode,
                'date_type': this.defaultType,
            },
        };

        this.service.getPOCompletionDashboard(parameterTotalPO)
            .subscribe((dataTotalPO: any) => {
                this.service.getPOCompletionDashboard(parameterCompletePO)
                    .subscribe((dataCompletePO: any) => {
                        if (dataTotalPO.data === undefined) {
                            this.totalPO = 0;
                        } else {
                            this.totalPO = dataTotalPO.data.length;
                        }

                        if (dataCompletePO.data === undefined) {
                            this.completedPO = 0;
                        } else {
                            this.completedPO = dataCompletePO.data.length;
                        }

                        this.incompletedPO = this.totalPO - this.completedPO;

                        if (this.totalPO === 0 || this.incompletedPO === 0) {
                            this.percentInfo = 0;
                        } else {
                            this.percentInfo = Number((this.incompletedPO / this.totalPO * 100).toFixed(0));
                        }
                    },
                        (error: any) => {
                            alert('Post has problem');
                        },
                    );
            },
                (error: any) => {
                    alert('Post has problem');
                },
            );
    }

    dataBar() {
        return function (ui: any) {
            const percentBar = ui.cellData;
            const dataInRow = ui.rowData;


            let color: any = '';
            if (percentBar !== undefined || percentBar !== null) {
                if (percentBar > 105) {
                    color = '#01b051';
                } else if (percentBar >= 95 && percentBar <= 105) {
                    color = '#01b051';
                } else {
                    color = '#01b051';
                }
            }

            //
            const htmlFtitle = '<div style="background-color: #101424;width: 280px;padding:10px;border-radius: 5px;margin-top:-20px;margin-bottom:-15px;margin-left:-20px;">' +
                // `<p style="margin-bottom:10px;color:white;font-weight: 900;">${dataInRow.model_name} (${dataInRow.article_code})</p>`
                `<p style="margin-bottom:10px;color:white;font-weight: 900;">${dataInRow.model_name}</p>`

                + '<div style="display: flex;justify-content: space-between;width: 260px;background-color: #414140;border-radius: 2px;margin-bottom:10px;">'
                + '<div style="padding: 0 0;width: 50%;">'
                + '<p style="padding-left: 15px;text-align: left;font-weight: 600;font-size: 18px;color:#8f9bb5;margin:0;">PO Q.TY</p>'
                + '</div>'
                + '<div style="background-color: #4e535e;border-radius: 2px;padding: 0 0;width: 50%;">'
                + `<p style="text-align: right;font-weight: 600;font-size: 20px;padding-right: 15px;margin:0;">
        ${Intl.NumberFormat('en-US').format(dataInRow.so_qty)} <span style="font-size:15px;"> PRS</span></p>`
                // + `<p style="text-align: right;font-weight: 600;font-size: 20px;padding-right: 15px;margin:0;">
                // 999,999<span style="font-size:15px;"> PRS</span></p>`
                + '</div>'
                + '</div>'

                + '<div style="display: flex;justify-content: space-between;width: 260px;background-color: #414140;border-radius: 2px;margin-bottom:10px;">'
                + '<div style="padding: 0 0;width: 50%;">'
                + '<p style="padding-left: 15px;text-align: left;font-weight: 600;font-size: 18px;color:#8f9bb5;margin:0;">OSC IN BAL</p>'
                + '</div>'
                + '<div style="background-color: #4e535e;border-radius: 2px;padding: 0 0;width: 50%;">'
                + `<p style="color:${dataInRow.osc_in_b === '0' ? '#00b151' : '#de6a6d'};text-align: right;font-weight: 600;font-size: 20px;padding-right: 15px;margin:0;">${Intl.NumberFormat('en-US').format(dataInRow.osc_in_b)} <span style="font-size:15px;"> PRS</span></p>`
                + '</div>'
                + '</div>'

                + '<div style="display: flex;justify-content: space-between;width: 260px;background-color: #414140;border-radius: 2px;margin-bottom:10px;">'
                + '<div style="padding: 0 0;width: 50%;">'
                + `<p style="padding-left: 15px;text-align: left;font-weight: 600;font-size: 18px;color:#8f9bb5;margin:0;">STT BAL</p>`
                + '</div>'
                + '<div style="background-color: #4e535e;border-radius: 2px;padding: 0 0;width: 50%;">'
                + `<p style="color:${dataInRow.sew_bal === '0' ? '#00b151' : '#de6a6d'};text-align: right;font-weight: 600;font-size: 20px;padding-right: 15px;margin:0;">${Intl.NumberFormat('en-US').format(dataInRow.sew_bal)} <span style="font-size:15px;"> PRS</span></p>`
                + '</div>'
                + '</div>'

                + '<div style="display: flex;justify-content: space-between;width: 260px;background-color: #414140;border-radius: 2px;margin-bottom:10px;">'
                + '<div style="padding: 0 0;width: 50%;">'
                + '<p style="padding-left: 15px;text-align: left;font-weight: 600;font-size: 18px;color:#8f9bb5;margin:0;">SF BAL</p>'
                + '</div>'
                + '<div style="background-color: #4e535e;border-radius: 2px;padding: 0 0;width: 50%;">'
                + `<p style="color:${dataInRow.sf_bal === '0' ? '#00b151' : '#de6a6d'};text-align: right;font-weight: 600;font-size: 20px;padding-right: 15px;margin:0;">${Intl.NumberFormat('en-US').format(dataInRow.sf_bal)} <span style="font-size:15px;"> PRS</span></p>`
                + '</div>'
                + '</div>'

                + '<div style="display: flex;justify-content: space-between;width: 260px;background-color: #414140;border-radius: 2px;margin-bottom:10px;">'
                + '<div style="padding: 0 0;width: 50%;">'
                + '<p style="padding-left: 15px;text-align: left;font-weight: 600;font-size: 18px;color:#8f9bb5;margin:0;">ASSY BAL</p>'
                + '</div>'
                + '<div style="background-color: #4e535e;border-radius: 2px;padding: 0 0;width: 50%;">'
                + `<p style="color:${dataInRow.ass_bal === '0' ? '#00b151' : '#de6a6d'};text-align: right;font-weight: 600;font-size: 20px;padding-right: 15px;margin:0;">${Intl.NumberFormat('en-US').format(dataInRow.ass_bal)} <span style="font-size:15px;"> PRS</span></p>`
                + '</div>'
                + '</div>'

                + '<div style="display: flex;justify-content: space-between;width: 260px;background-color: #414140;border-radius: 2px;margin-bottom:10px;">'
                + '<div style="padding: 0 0;width: 50%;">'
                + '<p style="padding-left: 15px;text-align: left;font-weight: 600;font-size: 18px;color:#8f9bb5;margin:0;">WH. IN BAL</p>'
                + '</div>'
                + '<div style="background-color: #4e535e;border-radius: 2px;padding: 0 0;width: 50%;">'
                + `<p style="color:${dataInRow.wh_bal === '0' ? '#00b151' : '#de6a6d'};text-align: right;font-weight: 600;font-size: 20px;padding-right: 15px;margin:0;">${Intl.NumberFormat('en-US').format(dataInRow.wh_bal)} <span style="font-size:15px;"> PRS</span></p>`
                + '</div>'
                + '</div>'

                + '</div>';

            const widthPercent = percentBar >= 0 ? percentBar : 0;
            const marginLeft = widthPercent > 5 ? 40 : 0;

            return {
                text: `
        <div class="main-wrapper bg-test" style="width:${widthPercent}%;height:36.5px;margin-top: -20px;">
          <div class="proccess" style="width:100%;height:20px;background-color:${color};border-radius: 5px;animation-name: example;animation-duration: 2s;">
            <p class="info" style="margin-left:calc(100% - ${marginLeft}px);margin-top: -8px;font-size: 15px;font-weight: 700;">${percentBar}%</p>
          </div>
        </div>`,
                attr: {
                    title: htmlFtitle,
                },
            };


        };
    }



    // // Detail Po Complition Popup
    // //   openPoCompletionPopup = function (data, type_select) {
    // //     // console.log('Start function open Dialog');
    // //     const dialogRef = this.dialogService.open(PoCompletionPopupComponent, {
    // //       context: {
    // //         data: data,
    // //         type_select,
    // //       },
    // //       closeOnBackdropClick: true,
    // //     });

    // //     // When Dialog close
    // //     dialogRef.onClose.subscribe(result => {
    // //       if (result?.event === 'Reset') {
    // //         // this.getData();
    // //       }
    // //     },
    // //     );
    // //   };

    ngOnDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        // this.unsubscribe$.next();
        // this.unsubscribe$.complete();
    }

    // Conver Array Object {sdd,sdd_date} => arr [sdd]
    convertArrSDD(arrSDD: any) {
        const result = [];
        for (let i = 0; i < arrSDD.length; i++) {
            const item = arrSDD[i];
            result.push(item.sdd);
        }
        return result;
    }

    // For pq
    styleCell() {
        return {
            'border-right-color': 'rgba(112,112,112,0.39)',
            'border-bottom-color': '#959595',
        };
    }

    styleHead() {
        return {
            'background': '#3f424c',
            'color': 'white',
        };
    }

    styleHead02() {
        return {
            'background': '#3f424c',
            'color': 'white',
            'border-bottom': 'solid 1px gray',
        };
    }


}
