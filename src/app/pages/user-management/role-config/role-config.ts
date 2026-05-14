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
import { filter, takeUntil } from 'rxjs/operators';
import { Name_Language } from '../../../../constants/constants.auth';
import { TAB_BAR_HEIGHT } from '../../../../constants/constants.system';
import { RoleConfigService } from './role-config.service';
import { CustomReuseStrategy } from '../../../strategy/custom-reuse-strategy';
import { ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { RoleAddPopup } from './role-add-popup/role-add-popup';
import { RoleUpdatePopup } from './role-update-popup/role-update-popup';

/**
 * Param Query
 */
// import '../../../../../assets/js/paramquery/localize/pq-localize-en.js';
declare var pq: any

@Component({
    selector: 'app-role-config',
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
    templateUrl: './role-config.html',
    styleUrls: [
        './role-config.scss'
    ]

})
export class RoleConfigPage implements OnInit, OnDestroy, AfterViewInit {
    private apiService = inject(RoleConfigService);
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
        this.getAllRBACRole();

        this.subscribeReuseEvents();


        this.getListPermission();
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
                    // console.log('[NewArticle] force refresh', this.dataArticle);
                    // this.grid.option('dataModel.data', this.dataArticle);
                    setTimeout(() => {
                        this.grid.refreshDataAndView();
                        this.grid.hideLoading();
                    }, 0);
                }
            });
    }


    getAllRBACRole() {
        const parameter = {
            'data': {
                'usr_id': '',
            },
        };
        this.apiService.getAllRBACRole(parameter)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (responses: any) => {
                    const rawDataRole: any = responses['data'] || [];
                    const dataLst: any = [];
                    for (let i = 0; i < rawDataRole.length; i++) {
                        const item = rawDataRole[i];

                        let resourceSet = new Set(item['permissionResourcee'].split(","));
                        item['handledResource'] = Array.from(resourceSet).join(", ");

                        let categorySet = new Set(item['permissionCategory'].split(","));
                        item['handledCategory'] = Array.from(categorySet).join(", ");

                        dataLst.push(item);
                    }


                    this.grid.option('dataModel.data', dataLst);
                    this.grid.refreshDataAndView();
                    this.grid.hideLoading();
                },
                (error) => {
                    console.error('Error loading filter lists:', error);
                }
            );
    }

    listPermissions = []
    getListPermission() {
        const parameter = {
            'data': {

            },
        };
        this.apiService.getAllRBACPermission(parameter)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (responses: any) => {
                    this.listPermissions = responses['data'];
                },
                (error) => {
                    this.listPermissions = [];
                    console.error('Error loading [Permission]', error);
                }
            );
    }

    //==========
    colModel = [
        {
            title: 'Role ID',
            width: 200,
            dataType: 'string',
            dataIndx: 'roleId',
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
            title: 'Role Name',
            width: 300,
            dataType: 'string',
            dataIndx: 'roleName',
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
            title: 'Role Description',
            width: 200,
            dataType: 'string',
            dataIndx: 'roleDescription',
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
            title: 'Permission Category',
            width: 300,
            dataType: 'string',
            dataIndx: 'handledCategory',
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
            title: 'Permission Resource',
            width: 200,
            dataType: 'string',
            dataIndx: 'handledResource',
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
            style: this.styleCell(),
            styleHead: this.styleHead(),
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
                        this.toggleRoleUpdatePopup(ui.rowData);
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
                show: false,
            },
            width: 'auto',
            height: boxHeightMainContent,
            collapsible: {
                on: false,
                css: {
                    zIndex: 1400,
                },
            },
            rowHtHead: 50,
            rowHt: 40,

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
                            this.toggleRoleAddPopup()
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
                            this.getAllRBACRole();
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
        this.grid = pq.grid('#grid_role_config', obj);

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


    roleAddRef: DynamicDialogRef | undefined;
    toggleRoleAddPopup() {
        console.log("run function toggle")
        this.roleAddRef = this.dialogService.open(RoleAddPopup, {
            header: `Role Add Popup`,
            width: '40vw',
            modal: true,
            closable: true,
            data: {
                listPermissions: this.listPermissions
            }
        });

        this.roleAddRef.onClose.subscribe(() => {
            this.messageService.add({ severity: 'info', summary: '', detail: "" });
        });
    }



    roleUpdateRef: DynamicDialogRef | undefined;
    toggleRoleUpdatePopup(rowData: any) {
        console.log('rowData',rowData)
        this.roleUpdateRef = this.dialogService.open(RoleUpdatePopup, {
            header: 'Update Role',
            width: '800px',
            modal: true,
            closable: false,
            data: {
                listPermissions: this.listPermissions,        // toàn bộ permission list (đã load sẵn)
                roleId: rowData.roleId,
                roleName: rowData.roleName,
                roleDescription: rowData.roleDescription,
                permissionIds: Array.from(new Set(rowData.permissionId.split(",")))
            }

        });

        this.roleUpdateRef.onClose.subscribe(() => {
            this.messageService.add({ severity: 'info', summary: '', detail: "" });
        });
    }

    ngOnDestroy(): void {
        // Cleanup subscription để tránh memory leak
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

}
