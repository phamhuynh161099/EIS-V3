import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, NgZone, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TagModule } from 'primeng/tag';
import { Toast, ToastModule } from 'primeng/toast';


import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Textarea } from 'primeng/textarea';
import { takeUntil } from 'rxjs/operators';
import { Name_Language } from '../../../../constants/constants.auth';
import { TAB_BAR_HEIGHT } from '../../../../constants/constants.system';
import { UserConfigService } from './user-config.service';

/**
 * Param Query
 */
// import '../../../../../assets/js/paramquery/localize/pq-localize-en.js';
// import pq from '../../../../../assets/js/paramquery';
declare var pq: any

@Component({
    selector: 'app-user-config',
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

        DynamicDialogModule, // Popup
    ],
    providers: [MessageService, DialogService],
    standalone: true,
    templateUrl: './user-config.html',
    styleUrls: [
        './user-config.scss'
    ]

})
export class UserConfigPage implements OnInit, OnDestroy, AfterViewInit {
    private apiService = inject(UserConfigService);
    private unsubscribe$ = new Subject<void>();


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
        this.getListUser();
    }




    getListUser() {
        const parameter = {
            'data': {
                'usr_id': '',
            },
        };
        this.apiService.getListUser(parameter)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (responses: any) => {
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
    colModel = [
        {
            title: 'User ID',
            width: 200,
            dataType: 'string',
            dataIndx: 'usr_id',
            editable: false,
            align: 'left',
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: {
                crules: [{ condition: 'contain' }],
            },
        },
        {
            title: 'User Name',
            width: 300,
            dataType: 'string',
            dataIndx: 'usr_nm',
            align: 'left',
            editable: false,
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: {
                crules: [{ condition: 'contain' }],
            },
        },
        {
            title: 'Gender',
            width: 200,
            dataType: 'string',
            dataIndx: 'gender',
            align: 'left',
            editable: false,
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: {
                crules: [{ condition: 'range' }],
            },
        },
        {
            title: 'Email',
            width: 300,
            dataType: 'string',
            dataIndx: 'usr_email',
            align: 'left',
            editable: false,
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: {
               crules: [{ condition: 'contain' }],
            },
        },
        {
            title: 'Phone',
            width: 200,
            dataType: 'string',
            dataIndx: 'phone',
            align: 'left',
            editable: false,
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: {
               crules: [{ condition: 'contain' }],
            },
        },
        {
            title: 'DEPT Lv1',
            width: 100,
            dataType: 'string',
            dataIndx: 'dept_lv1',
            align: 'left',
            editable: false,
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: {
                crules: [{ condition: 'range' }],
            },
        },
        {
            title: 'DEPT Lv2',
            width: 100,
            dataType: 'string',
            dataIndx: 'dept_lv2',
            align: 'left',
            editable: false,
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: {
                crules: [{ condition: 'range' }],
            },
        },
        {
            title: 'DEPT Lv3',
            width: 100,
            dataType: 'string',
            dataIndx: 'dept_lv3',
            align: 'left',
            editable: false,
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: {
                crules: [{ condition: 'range' }],
            },
        },
        {
            title: 'Cost Center',
            width: 200,
            dataType: 'string',
            dataIndx: 'cost_center',
            align: 'left',
            editable: false,
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: {
                crules: [{ condition: 'contain' }],
            },
        },
        {
            title: 'COM DEPT NM',
            width: 200,
            dataType: 'string',
            dataIndx: 'com_dept_nm',
            align: 'left',
            editable: false,
            hvalign: 'center',
            halign: 'center',
            valign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: {
                crules: [{ condition: 'contain' }],
            },
        },
        {
            title: 'Role',
            width: 200,
            dataType: 'string',
            dataIndx: 'rol_nm',
            align: 'left',
            hvalign: 'center',
            valign: 'center',
            halign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: { crules: [{ condition: 'contain' }] },
        },
        {
            title: 'Status',
            width: 200,
            dataType: 'string',
            dataIndx: 'status',
            align: 'left',
            hvalign: 'center',
            valign: 'center',
            halign: 'center',
            style: this.styleCell(),
            styleHead: this.styleHead(),
            filter: { crules: [{ condition: 'contain' }] },
        },
        {
            title: 'Action',
            selectionModel: { type: 'cell' },
            resizable: false,
            width: 225,
            align: 'center',
            editable: false,
            hvalign: 'center',
            valign: 'center',
            nodrag: true,
            nodrop: true,
            sortable: false,
            style: this.styleCellLast(),
            styleHead: {
                'background': 'linear-gradient(180deg, #5E5E5E 0%, #86909B 100%)',
                'border-right': 'none',
                'border-top': 'none',
            },
            render: () => {
                return '<button type="button" class="edit-btn" ' +
                    '>Edit</button>\
        <button type="button" class="delete-btn" disabled>Cancel</button>';
            },
            postRender: (ui: any) => {
                const rowIndex = ui.rowIndx,
                    grid = this.grid,
                    $cell = grid.getCell(ui);
                // Edit user
                $cell.find('.edit-btn')
                    .button({
                        label: 'Edit',
                        icons: { primary: 'ui-icon-check' },
                    })
                    .off('click')
                    .on('click', () => {
                        // this.showEditUser(ui.rowData);
                    });

                // Delete user
                $cell.find('.delete-btn').button({
                    label: 'Delete',
                    disabled: false,
                    icons: { primary: 'ui-icon-close' },
                })
                    .off('click')
                    .on('click', () => {
                        // this.showDeleteUser(ui.rowData);
                        this.grid.hideLoading();
                    });
            },
        },
    ];

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
            // type: 'local',
            // columnTemplate: { editable: false },
            autoRow: false,
            wrap: false,
            hwrap: true,
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
                        label: 'Add',
                        attr: 'title="Update List Email"',
                        cls: 'export-button',
                        icon: 'export',
                        listener: () => {

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
                            this.getListUser();
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
            postRenderInterval: -1,
            editable: (ui: any) => {
                return this.grid.hasClass({ rowIndx: ui.rowIndx, cls: 'pq-row-edit' });
            },
            create: function (evt: any, ui: any) {
                // restore state of grid.
                // this.loadState({ refresh: false });
            },
        };
        this.grid = pq.grid('#grid_user_config', obj);

    }

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

    ngOnDestroy(): void {
        // Cleanup subscription để tránh memory leak
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

}
