import { CommonModule } from '@angular/common';
import { afterNextRender, Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Toast, ToastModule } from 'primeng/toast';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SliderModule } from 'primeng/slider';
import { TextareaModule } from 'primeng/textarea';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { EspService } from '../esp.service';
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
        Toast
    ],
    selector: 'app-tpm-engineer-line',
    templateUrl: './tpm_engineer_line.html',
    styleUrls: ['./tpm_engineer_line.scss']
})


export class TpmEngineerLinePage implements OnInit {
    private apiService = inject(EspService);
    private unsubscribe$ = new Subject<void>();


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
            selectEspEngineer: [null, [ValidateNotNull]],
            selectEspLine: [null, [ValidateNotNull]],
        });
    }
    ngOnInit(): void {
        // Generate Fake Data


        this.getEngineerConnectLine();
        this.loadingFilterData();
    }

    isShowFilter:boolean = true;
     ShowFilter() {
        this.isShowFilter = !this.isShowFilter;
    }


    getSeverity(status: string) {
        switch (status) {
            case 'Active':
                return 'success';
            case 'Not Active':
                return 'danger';
            default:
                return 'info';
        }
    }

    engineerConnectLine = [];
    getEngineerConnectLine(): void {
        this.apiService
            .getEngineerConnectLine()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (responses) => {
                    if (responses.data && responses.data.length > 0) {
                        this.engineerConnectLine = responses.data;
                    } else {
                        this.engineerConnectLine = [];
                    }
                },
                (error) => {
                    console.error('Error loading filter lists:', error);
                }
            );
    }

    listEngineer = [];
    listLine = []
    loadingFilterData() {
        this.loading = true;
        forkJoin({
            allEngineerConnectESP: this.apiService.getEngineerConnectESP(),
            allLineConnectESP: this.apiService.getLineConnectESP(),
        }).subscribe({
            next: (response: any) => {
                console.log('all data', response);

                //** ESP device
                this.listEngineer = response.allEngineerConnectESP.data
                    .filter((item: any) => item.status === 'Active')
                    .map((item: any) => ({ label: item.eng_name, value: item.id, status: item.status }));

                this.listLine = response.allLineConnectESP.data
                    .filter((item: any) => item.status === 'Active')
                    .map((item: any) => ({ label: item.line_name, value: item.id, status: item.status }));



                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading data:', error);
                this.listEngineer = [];
                this.listLine = [];
                this.loading = false;
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
    selectedMonth: any;
    selectedWeeks: any[] = [{ label: 'Tuần 1', value: 1 }]; // Set sẵn giá trị giống trong hình
    selectedFactory: any;
    selectedArea: any;
    selectedAll: any;

    // Dữ liệu cho các Dropdown
    years = [
        { label: '2026', value: 2026 },
        { label: '2025', value: 2025 }
    ];

    months = Array.from({ length: 12 }, (_, i) => ({
        label: `Tháng ${i + 1}`, value: i + 1
    }));

    weeks = [
        { label: 'Tuần 1', value: 1 },
        { label: 'Tuần 2', value: 2 },
        { label: 'Tuần 3', value: 3 },
        { label: 'Tuần 4', value: 4 }
    ];

    factories = [
        { label: 'Xưởng A', value: 'A' },
        { label: 'Xưởng B', value: 'B' }
    ];

    areas = [
        { label: 'Khu vực Bắc', value: 'N' },
        { label: 'Khu vực Nam', value: 'S' }
    ];

    allOptions = [
        { label: 'Tất cả', value: 'ALL' },
        { label: 'Chưa xử lý', value: 'PENDING' }
    ];

    loading: boolean = false;


    createModel() {
        const param = {
            data: {
                engineer_esp_id: this.addModelForm.value.selectEspEngineer,
                line_esp_id: this.addModelForm.value.selectEspLine,
            }
        };


        console.log('data save:', this.addModelForm.value)

        this.apiService.saveEngineerConnectLine(param).subscribe(
            (response) => {

                console.log('response', response, response.message === 'ERROR')
                if (response !== null && response !== undefined) {
                    if (response.message === 'ERROR') {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update engineer and esp', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update engineer and esp successfully', life: 3000 });
                        this.getEngineerConnectLine();
                        this.isShowDialog = false;
                    }
                }
            },
            (error) => {
                console.error('Error creating Model information:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update engineer and esp', key: 'tl', life: 3000 });
            }
        );
    }

    onEditSaved() {
        const param = {
            data: {
                engineer_esp_id: this.addModelForm.value.selectEspEngineer,
                line_esp_id: this.addModelForm.value.selectEspLine,
            }
        };


        console.log('data save:', this.addModelForm.value)

        this.apiService.saveEngineerConnectLine(param).subscribe(
            (response) => {

                console.log('response', response, response.message === 'ERROR')
                if (response !== null && response !== undefined) {
                    if (response.message === 'ERROR') {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update engineer and esp', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update engineer and esp successfully', life: 3000 });
                        this.getEngineerConnectLine();
                        this.isShowDialog = false;
                    }
                }
            },
            (error) => {
                console.error('Error creating Model information:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update engineer and esp', key: 'tl', life: 3000 });
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

    setData() {
        this.addModelForm.setValue({
            selectEspLine: this.selectedRowTable.line_esp_id,
            selectEspEngineer: this.selectedRowTable.engineer_esp_id,
        });
    }

    removeEngineerConnectLine(id: any) {
        const param = {
            data: {
                id
            }
        };

        this.apiService.removeEngineerConnectLine(param).subscribe(
            (response) => {

                console.log('response', response, response.message === 'ERROR')
                if (response !== null && response !== undefined) {
                    if (response.message === 'ERROR') {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to disconnect this Engineer from the Line', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update disconnect this Engineer from the Line successfully', life: 3000 });
                        this.getEngineerConnectLine();
                        this.isShowDialog = false;
                    }
                }
            },
            (error) => {
                console.error('Error creating Model information:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to disconnect this Engineer from the Line', key: 'tl', life: 3000 });
            }
        );
    }

    reconnectEngineerConnectLine(rowData: any) {
        const param = {
            data: {
                engineer_esp_id: rowData.engineer_esp_id,
                line_esp_id: rowData.line_esp_id,
            }
        };

        this.apiService.saveEngineerConnectLine(param).subscribe(
            (response) => {

                console.log('response', response, response.message === 'ERROR')
                if (response !== null && response !== undefined) {
                    if (response.message === 'SUCCESS') {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update disconnect this Engineer from the Line successfully', life: 3000 });
                        this.getEngineerConnectLine();
                        this.isShowDialog = false;

                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
                    }
                }
            },
            (error) => {
                console.error('Error creating Model information:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to disconnect this Engineer from the Line', key: 'tl', life: 3000 });
            }
        );
    }

    confirmRemove(event: Event, rowTable: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Do you want to DISCONNECT this Engineer from the Line?`,
            header: 'Danger Zone',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'DISCONNECT',
                severity: 'danger'
            },

            accept: () => {
                this.removeEngineerConnectLine(rowTable.id);
            },
            reject: () => {
                this.messageService.add({ severity: 'secondary', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }

    confirmReconnect(event: Event, rowTable: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Do you want to RECONNECT this Engineer from the Line?`,
            header: 'Danger Zone',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'RECONNECT',
                severity: 'danger'
            },

            accept: () => {
                this.reconnectEngineerConnectLine(rowTable);
            },
            reject: () => {
                this.messageService.add({ severity: 'secondary', summary: 'Rejected', detail: 'You have rejected' });
            }
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
