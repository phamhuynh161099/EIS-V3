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
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { TextareaModule } from 'primeng/textarea';
import { SliderModule } from 'primeng/slider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileUpload } from 'primeng/fileupload';
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
        Toast,
        ConfirmDialogModule,



    ],
    selector: 'app-tpm-engineer-management',
    templateUrl: './tpm_engineer_management.html',
    styleUrls: ['./tpm_engineer_management.scss']
})


export class TpmEngineerManagementPage implements OnInit {
    private apiService = inject(EspService);
    private unsubscribe$ = new Subject<void>();

    isShowFilter:boolean = true;

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
            selectEngineerName: [null, [ValidateNotNull]],
            selectEmployeeId: [],
        });
    }
    ngOnInit(): void {
        // Generate Fake Data


        this.getListEngineer();
        // this.loadingFilterData();
    }

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

    listEngineer = [];
    getListEngineer(): void {
        this.apiService
            .getListEngineer()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (responses) => {
                    if (responses.data && responses.data.length > 0) {
                        this.listEngineer = responses.data;
                    } else {
                        this.listEngineer = [];
                    }
                },
                (error) => {
                    console.error('Error loading filter lists:', error);
                }
            );
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


    loading: boolean = false;
    createModel() {
        const param = {
            data: {
                id: "",
                eng_name: this.addModelForm.value.selectEngineerName,
                employee_id: this.addModelForm.value.selectEmployeeId,
            }
        };

        this.apiService.saveEngineer(param).subscribe(
            (response) => {

                console.log('response', response, response.message === 'ERROR')
                if (response !== null && response !== undefined) {
                    if (response.message === 'ERROR') {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add new Engineer', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Add Engineer successfully', life: 3000 });
                        this.getListEngineer();
                        this.isShowDialog = false;
                    }
                }
            },
            (error) => {
                console.error('Error creating Model information:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add new Engineer', key: 'tl', life: 3000 });
            }
        );
    }

    onEditSaved() {
        const param = {
            data: {
                id: this.addModelForm.value.selectId,
                eng_name: this.addModelForm.value.selectEngineerName,
                employee_id: this.addModelForm.value.selectEmployeeId,
            }
        };

        this.apiService.saveEngineer(param).subscribe(
            (response) => {

                console.log('response', response, response.message === 'ERROR')
                if (response !== null && response !== undefined) {
                    if (response.message === 'ERROR') {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Engineer', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update Engineer successfully', life: 3000 });
                        this.getListEngineer();
                        this.isShowDialog = false;
                    }
                }
            },
            (error) => {
                console.error('Error creating Model information:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Engineer', key: 'tl', life: 3000 });
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
        console.log('this.selectedRowTable', this.selectedRowTable)
        this.addModelForm.setValue({
            // selectEspDevice: this.selectedRowTable.esp_id,
            // selectLine: this.selectedRowTable.line_id,


            selectId: this.selectedRowTable.id,
            selectEngineerName: this.selectedRowTable.eng_name,
            selectEmployeeId: this.selectedRowTable.employee_id,
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
