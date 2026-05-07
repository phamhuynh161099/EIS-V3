import { CommonModule } from '@angular/common';
import { afterNextRender, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from "primeng/floatlabel";
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Toast, ToastModule } from 'primeng/toast';

import { ConfirmationService, MessageService } from 'primeng/api';
import { LanguageType } from '../../../../constants/constants.auth';
import { GlobalsService } from '../../../../globals.service';
import { DropdownModule } from 'primeng/dropdown';
import { EspService } from '../esp.service';
import { BehaviorSubject, catchError, exhaustMap, filter, forkJoin, of, Subject, switchMap, takeUntil, timer } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { TextareaModule } from 'primeng/textarea';
import { SliderModule } from 'primeng/slider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileUpload } from 'primeng/fileupload';
import moment from 'moment';
interface Column {
    type: 'Text' | "Date" | "Number" | "Option" | "Null" | 'MultiSelect';
    field: string;
    header: string;
    customExportHeader?: string;
}

export interface Employee {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Offline' | 'Busy';
    avatar: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

function ValidateNotNull(control: AbstractControl): { [key: string]: any } | null {
    if (control.value === null && control.value === '') {
        return { valueInvalid: true };
    }
    return null;
}

const TIME_POOLING = 10 * 1000 // 10s

@Component({
    providers: [MessageService, ConfirmationService],
    imports: [
        ButtonModule,
        CommonModule,
        ConfirmDialogModule,
        DatePickerModule,
        DialogModule,
        DropdownModule,
        FloatLabel,
        FormsModule,
        IconFieldModule,
        ImageModule,
        InputGroupAddonModule,
        InputGroupModule,
        InputIconModule,
        InputTextModule,
        MultiSelectModule,
        ProgressSpinnerModule,
        RadioButtonModule,
        ReactiveFormsModule,
        SelectModule,
        SliderModule,
        TableModule,
        TagModule,
        TextareaModule,
        ToastModule,
        Toast,
        ConfirmDialogModule,



    ],
    selector: 'app-tpm-ticket-history-dashboard',
    templateUrl: './tpm_ticket_history_dashboard.html',
    styleUrls: ['./tpm_ticket_history_dashboard.scss']
})


export class TpmTicketHistoryDashboardPage implements OnInit {
    private apiService = inject(EspService);
    private unsubscribe$ = new Subject<void>();

    private payloadGetTicketChange$ = new BehaviorSubject<any>(null);

    isShowFilter: boolean = true;

    addModelForm!: FormGroup;

    searchValue: string = '';

    // Signal lưu chiều cao
    boxHeight = signal<number>(0);

    // Signal lưu chiều cao của table
    boxHeightTable = signal<number>(0);

    // chiều cao của filter
    boxHeightFilter = 0;

    // pading
    paddingTableAFilter = 24;

    private resizeObserver: ResizeObserver | null = null;
    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) {
        afterNextRender(() => {
            const layoutMainEl = document.querySelector('.layout-main') as HTMLElement;
            this.boxHeightFilter = (document.querySelector('#block-filter') as HTMLElement).offsetHeight;

            if (layoutMainEl) {
                this.boxHeight.set(layoutMainEl.clientHeight);
                this.boxHeightTable.set(Math.max(layoutMainEl.clientHeight - this.boxHeightFilter - this.paddingTableAFilter, 400))

                this.resizeObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        this.boxHeight.set(entry.contentRect.height);
                        this.boxHeightTable.set(Math.max(entry.contentRect.height - this.boxHeightFilter - this.paddingTableAFilter, 400))
                    }
                });

                this.resizeObserver.observe(layoutMainEl);
            }
        });

        this.addModelForm = this.fb.group({
            selectId: [],
            selectLineName: [null, [ValidateNotNull]],
            selectLineCode: [],
            selectWorkshop: [null, [ValidateNotNull]],
            selectFactory: [null, [ValidateNotNull]],
            selectLocation: [],
        });
    }
    ngOnInit(): void {
        this.getListTicket();
        this.setupPollingStreamGetTicket();
    }

    ShowFilter() {
        this.isShowFilter = !this.isShowFilter;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'NONE':
                return 'secondary';
            case 'REQUESTED':
                return 'danger';
            case 'ACKNOWLEDGED':
                return 'danger';
            case 'COMPLETED':
                return 'success';
            default:
                return 'success';
        }
    }

    formatTime(time: any) {
        let result = '';
        try {
            if (time) {
                result = moment(time, 'YYYY-MM-DD HH:mm:ss').format('YYYY.MM.DD - HH:mm:ss');
            } else {
                result = '-';
            }
        } catch (error) {
            result = '-';
        }

        return result;
    }

    listLine = [];
    getListTicket(): void {
        let payload = {
            data: {

            }
        }
        this.apiService
            .getListTicket(payload)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (responses) => {
                    if (responses.data && responses.data.length > 0) {
                        this.listLine = responses.data;
                    } else {
                        this.listLine = [];
                    }
                },
                (error) => {
                    console.error('Error loading filter lists:', error);
                }
            );
    }

    setupPollingStreamGetTicket(): void {
        this.payloadGetTicketChange$
            .pipe(
                // 1. Chỉ tiếp tục chạy nếu type có giá trị (bỏ qua null lúc mới khởi tạo nếu chưa có selectedType)
                // filter(type => !!type),

                // 2. switchMap: Hủy timer cũ ngay lập tức nếu có tín hiệu chọn Workshop mới
                switchMap((currentType) => {
                    let payload = {
                        data: {
                            type: currentType
                        }
                    };

                    // 3. Bắt đầu luồng timer mới (gọi ngay lúc 0ms, lặp lại sau mỗi TIME_POOLING)
                    return timer(0, TIME_POOLING).pipe(
                        // 4. exhaustMap: Bỏ qua các nhịp timer mới nếu API trước đó đang bị treo/delay
                        exhaustMap(() => this.apiService.getListTicket(payload).pipe(
                            // Bắt lỗi API để không làm đứt chuỗi timer
                            catchError((error) => {
                                console.error('Error when call Api:', error);
                                return of(null);
                            })
                        ))
                    );
                }),
                // 5. Ngắt toàn bộ luồng khi component bị destroy (chống memory leak)
                takeUntil(this.unsubscribe$)
            )
            .subscribe((responses: any) => {
                // 6. Xử lý dữ liệu khi API trả về thành công
                if (responses && responses.data && responses.data.length > 0) {
                    this.listLine = responses.data;

                } else {
                    this.listLine = []

                }
            });
    }





    isEdit: boolean = false;
    isShowDialog: boolean = false;
    selectedRowTable: any = null;
    selectedRow: number | undefined = undefined;
    onRowCreateInit() {
        this.isShowDialog = true;
        this.isEdit = false;
        this.selectedRowTable = null;
        this.addModelForm.reset();
    }

    // Biến lưu trữ giá trị được chọn
    selectedYear: any;

    selectedType: any;

    // Dữ liệu cho các Dropdown
    arrayType = [
        { label: 'Stitching', value: 'Stitching' },
        { label: 'Assembly', value: 'Assembly' }
    ];

    arrFactories = [
        { label: 'Fac.1', value: 'Fac.1' },
        { label: 'Fac.2', value: 'Fac.2' }
    ];

    loading: boolean = false;
    createModel() {
        const param = {
            data: {
                id: "",
                line_name: this.addModelForm.value.selectLineName,
                line_code: this.addModelForm.value.selectLineCode,
                type: this.addModelForm.value.selectWorkshop,
                factory: this.addModelForm.value.selectFactory,
                location: this.addModelForm.value.selectLocation,
            }
        };


        console.log('data save:', param);



        this.apiService.saveLine(param).subscribe(
            (response) => {

                console.log('response', response, response.message === 'ERROR')
                if (response !== null && response !== undefined) {
                    if (response.message === 'ERROR') {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add new line', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Add line successfully', life: 3000 });
                        this.getListTicket();
                        this.isShowDialog = false;
                    }
                }
            },
            (error) => {
                console.error('Error creating Model information:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update line and esp', key: 'tl', life: 3000 });
            }
        );
    }

    onEditSaved() {
        const param = {
            data: {
                id: this.addModelForm.value.selectId,
                line_name: this.addModelForm.value.selectLineName,
                line_code: this.addModelForm.value.selectLineCode,
                type: this.addModelForm.value.selectWorkshop,
                factory: this.addModelForm.value.selectFactory,
                location: this.addModelForm.value.selectLocation,
            }
        };

        this.apiService.saveLine(param).subscribe(
            (response) => {

                console.log('response', response, response.message === 'ERROR')
                if (response !== null && response !== undefined) {
                    if (response.message === 'ERROR') {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update line and esp', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update line and esp successfully', life: 3000 });
                        this.getListTicket();
                        this.isShowDialog = false;
                    }
                }
            },
            (error) => {
                console.error('Error creating Model information:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update line and esp', key: 'tl', life: 3000 });
            }
        );
    }

    onEditCancel() {
        this.isShowDialog = false;
        this.selectedRow = undefined;
    }

    onRowEditInit(rowTable: any, rowNum: number) {
        this.isShowDialog = this.isEdit = true;
        this.selectedRow = rowNum;
        this.selectedRowTable = rowTable;

        this.setData();
    }

    removeLineConnectESP(id: any) {
        const param = {
            data: {
                id
            }
        };

        this.apiService.removeLineConnectESP(param).subscribe(
            (response) => {

                console.log('response', response, response.message === 'ERROR')
                if (response !== null && response !== undefined) {
                    if (response.message === 'ERROR') {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to disconnect this line from the ESP circuit', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update disconnect this line from the ESP circuit successfully', life: 3000 });
                        this.getListTicket();
                        this.isShowDialog = false;
                    }
                }
            },
            (error) => {
                console.error('Error creating Model information:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to disconnect this line from the ESP circuit', key: 'tl', life: 3000 });
            }
        );
    }

    confirmRemove(event: Event, rowTable: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Do you want to disconnect this line from the ESP circuit?`,
            header: 'Danger Zone',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger'
            },

            accept: () => {
                this.removeLineConnectESP(rowTable.id);
            },
            reject: () => {
                this.messageService.add({ severity: 'secondary', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }

    setData() {
        console.log('this.selectedRowTable', this.selectedRowTable)
        this.addModelForm.setValue({
            // selectEspDevice: this.selectedRowTable.esp_id,
            // selectLine: this.selectedRowTable.line_id,


            selectId: this.selectedRowTable.id,
            selectLineName: this.selectedRowTable.line_name,
            selectLineCode: this.selectedRowTable.line_code,
            selectWorkshop: this.selectedRowTable.type,
            selectFactory: this.selectedRowTable.factory,
            selectLocation: this.selectedRowTable.location,
        });
    }


    ngOnDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
