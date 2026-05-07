import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';

import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
// import { DatePicker } from 'primeng/datepicker';
import { PrimeNG } from 'primeng/config';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadEvent } from 'primeng/fileupload';
import { FloatLabel } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { ImageModule } from 'primeng/image';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { Toast, ToastModule } from 'primeng/toast';
import { LanguageType } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { EquipmentService } from '../equipment.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface ExportColumn {
    title: string;
    dataKey: string;
}
interface Column {
    type: 'Text' | 'Date' | 'Number' | 'Option' | 'Null' | 'MultiSelect';
    field: string;
    header: string;
    customExportHeader?: string;
}

function ValidateNotNull(control: AbstractControl): { [key: string]: any } | null {
    if (control.value === null && control.value === '') {
        return { valueInvalid: true };
    }
    return null;
}

@Component({
    selector: 'app-empty',
    imports: [
        ImageModule,
        TextareaModule,
        DatePickerModule,
        DialogModule,
        FormsModule,
        FloatLabel,
        TableModule,
        CommonModule,
        InputTextModule,
        TagModule,
        SelectModule,
        MultiSelectModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        SliderModule,
        ToastModule,
        Toast,
        ConfirmDialogModule,
        ProgressSpinnerModule,
        ReactiveFormsModule,
        FileUpload
    ],
    providers: [EquipmentService, MessageService, ConfirmationService],
    standalone: true,
    templateUrl: './model_information.html',
    styles: `
        ::ng-deep {
            .p-datatable .p-datatable-thead > tr > .search_bg {
                background: var(--p-datatable-header-cell-selected-background);
            }

            p-columnfilterformelement,
            p-columnfilterformelement p-select {
                width: 100%;
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
            .choose_file {
                width: 33rem !important;
            }
            .p-fileupload-header {
                padding: 0.5rem 2rem !important;
            }
            #fileInput {
                border-radius: 10px;
                background: black;
            }
            .select_right p-overlay > div {
                left: unset !important;
                right: 0 !important;
            }

            .select_group p-overlay > div {
                @media (width > 790px) {
                    left: 50% !important;
                    transform: translateX(-50%);
                }
            }

            .p-dialog {
                max-height: 100%;

                @media (width < 500px) {
                    height: 100%;
                    width: 100%;
                    border-radius: 0;
                }

                .coo > div {
                    @media (width < 430px) {
                        grid-template-columns: repeat(1, minmax(0, 1fr));
                    }
                }
            }
        }
    `
})
export class ModelInformation implements OnInit, OnDestroy {
    private refreshSubscription?: Subscription;

    dataTable: any[] = [];
    // variables for filter
    selectedCode!: string;
    selectedName!: string;
    selectedDescription!: string;
    selectedManufacturer: string | null = null;
    selectedGroup: string | null = null;
    selectedFunc: string | null = null;

    manufacturers!: any[];
    groups!: any[];
    funcs!: any[];
    creFuncs!: any[];
    eUnits!: any[];
    eConsumpUnits!: any[];
    wts!: any[];
    func_nm_upd!: any[];
    parents!: any[];

    loading: boolean = true;
    loading_filter: boolean = true;

    reg_date_input: string = ''; // Default to today's date in YYYY-MM-DD format
    exportColumns!: ExportColumn[];
    cols!: Column[];
    isVisible: boolean = true;
    isVisibleCheckAll: boolean = false;

    listOption!: any;

    //  config lazyLoad for tbale
    first = 0;
    rows = 10;
    totalRecords: number = 0;
    totalRecordsAll: number = 0;
    //form config
    addModelForm!: FormGroup;
    selectedFile: File | null = null;
    uploadedFiles: any[] = [];
    param: any = {
        code: '',
        name: '',
        description: '',
        manufacturer_cd: '',
        group_cd: '',
        func_cd: '',
        rows: 0
    };
    files: File[] = [];
    filesUpdate: File[] = [];
    totalSize: number = 0;
    totalSizePercent: number = 0;
    valLanguage: any;
    optionLanguage: LanguageType = 'LANG_EN';

    // If you need to handle file input and upload button, do it in a lifecycle hook:
    ngAfterViewInit(): void {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
        const uploadButton = document.getElementById('uploadButton') as HTMLElement | null;

        if (uploadButton && fileInput) {
            uploadButton.addEventListener('click', () => {
                const file = fileInput.files && fileInput.files[0]; // Get the selected file

                if (file) {
                    const reader = new FileReader();

                    reader.onload = (event) => {
                        const binaryData = event.target?.result; // This will be an ArrayBuffer

                        // Now, send this binaryData to your server
                        // using XMLHttpRequest or Fetch API
                        // uploadBinaryData(binaryData, file.name);
                    };

                    reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
                } else {
                    console.log('No file selected.');
                }
            });
        }
    }

    @Input() filteredValue: any[] = [];

    setup(value: any, id: any) {
        if (value != null) {
            const filter = this.dt1.filters[id];
            if (Array.isArray(filter)) {
                filter[0].value = value;
            } else if (filter) {
                filter.value = value;
            }
        }
        this.reg_date_input = value;
    }

    constructor(
        private sv: EquipmentService,
        private messageService: MessageService,
        public global_sv: GlobalsService,
        private fb: FormBuilder,
        private config: PrimeNG,
        private confirmationService: ConfirmationService
    ) {
        this.optionLanguage = this.global_sv.getLangue();

        this.addModelForm = this.fb.group({
            mdno: null,
            inputCode: [null, [ValidateNotNull]],
            inputName: [null, [ValidateNotNull]],
            inputGroup: [null, [ValidateNotNull]],
            inputManufacturer: [null, [ValidateNotNull]],
            inputFunc: [null, [ValidateNotNull]],
            // inputElectronicInput: [null, [ValidateNotNull]],
            // inputElectronicUnit: [null, [ValidateNotNull]],
            // inputEConsumption: [null, [ValidateNotNull]],
            // inputEConsumptionUnit: [null, [ValidateNotNull]],
            // inputWeight: [null, [ValidateNotNull]],
            // inputWeightUnit: [null, [ValidateNotNull]],
            // inputDimension: [null, [ValidateNotNull]],
            inputDescription: [null, [ValidateNotNull]]
        });
    }

    ngOnInit(): void {
        this.valLanguage = this.global_sv.getValLanguage();

        if (this.valLanguage === null) {
            this.global_sv._valLanguage$.subscribe((data) => {
                this.valLanguage = data;
                if (this.valLanguage !== null) {
                    this.reloadPage();
                }
            });
        } else {
            this.reloadPage();
        }
    }

    reloadPage() {
        this.loadingFilterData();
        this.loadDataTableCustom({}, this.param);
        this.cols = [
            { field: 'md_cd', header: this.valLanguage.grid_Model_Code[this.optionLanguage], type: 'Text' },
            { field: 'md_nm', header: this.valLanguage.grid_Model_Name[this.optionLanguage], type: 'Text' },
            { field: 're_mark', header: this.valLanguage.grid_Description[this.optionLanguage], type: 'Text' },
            { field: 'photo_file', header: this.valLanguage.grid_Photo_File[this.optionLanguage], type: 'Null' },
            { field: 'mf_nm', header: this.valLanguage.grid_Manufacturer[this.optionLanguage], type: 'MultiSelect' },
            { field: 'prt_nm', header: this.valLanguage.grid_Parent[this.optionLanguage], type: 'MultiSelect' },
            { field: 'tp_nm', header: this.valLanguage.grid_Type[this.optionLanguage], type: 'Text' },
            { field: 'group_nm', header: this.valLanguage.grid_Group[this.optionLanguage], type: 'MultiSelect' },
            { field: 'func_nm', header: this.valLanguage.grid_Function[this.optionLanguage], type: 'MultiSelect' },
            { field: 'reg_nm', header: this.valLanguage.grid_Create_Name[this.optionLanguage], type: 'Text' },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Create_Date[this.optionLanguage], type: 'Date' },
            { field: 'chg_nm', header: this.valLanguage.grid_Change_Name[this.optionLanguage], type: 'Text' },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Change_Date[this.optionLanguage], type: 'Date' }
        ];
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
        this.listOption = {
            mf_nm: this.manufacturers,
            prt_nm: this.parents,
            group_nm: this.groups,
            func_nm: this.groups,
            elect_unit_nm: this.eUnits,
            ecst_unit_nm: this.eConsumpUnits,
            wgt_unit_nm: this.wts
        };
    }

    ngOnDestroy(): void {
        // Cleanup subscription để tránh memory leak
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    exportToExcel() {
        let data: any[] = [];
        if (this.dt1.filteredValue && Array.isArray(this.dt1.filteredValue)) {
            this.dt1.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    'Model Code': emp.md_cd,
                    'Model Name': emp.md_nm,
                    Description: emp.re_mark,
                    'Photo File': emp.photo_file,
                    Manufacturer: emp.mf_nm,
                    Parent: emp.prt_nm,
                    Type: emp.tp_nm,
                    Group: emp.group_nm,
                    Function: emp.func_nm,
                    Electronic: emp.elect,
                    'Electronic Unit': emp.elect_unit_nm,
                    Dimension: emp.dimension,
                    'E-Consumption': emp.e_cst,
                    'E-Consumption Unit': emp.ecst_unit_nm,
                    Weight: emp.wgt,
                    'Weight Unit': emp.wgt_unit_nm,
                    'Create Name': emp.reg_nm,
                    'Create Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        } else {
            this.dataTable.forEach((emp: any) => {
                const rowData: any = {
                    'Model Code': emp.md_cd,
                    'Model Name': emp.md_nm,
                    Description: emp.re_mark,
                    'Photo File': emp.photo_file,
                    Manufacturer: emp.mf_nm,
                    Parent: emp.prt_nm,
                    Type: emp.tp_nm,
                    Group: emp.group_nm,
                    Function: emp.func_nm,
                    Electronic: emp.elect,
                    'Electronic Unit': emp.elect_unit_nm,
                    Dimension: emp.dimension,
                    'E-Consumption': emp.e_cst,
                    'E-Consumption Unit': emp.ecst_unit_nm,
                    Weight: emp.wgt,
                    'Weight Unit': emp.wgt_unit_nm,
                    'Create Name': emp.reg_nm,
                    'Create Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'Model Information', 'data');
        }
    }

    ShowFilter() {
        this.isVisible = !this.isVisible;
    }

    loadingFilterData() {
        this.loading_filter = true;
        forkJoin({
            manufacturers: this.global_sv.getManufac(),
            groups: this.sv.getGroupList(),
            weights: this.sv.getWeightUnitList(),
            eConsumptions: this.sv.getEConsumptionUnitList(),
            electronics: this.sv.getEUnitList(),
            parents: this.global_sv.getParent()
        }).subscribe({
            next: (response: any) => {
                this.manufacturers = response.manufacturers.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                this.groups = response.groups.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                this.wts = response.weights.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                this.eConsumpUnits = response.eConsumptions.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                this.eUnits = response.electronics.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                this.parents = response.parents.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));

                this.loading_filter = false;

                this.listOption = {
                    mf_nm: this.manufacturers,
                    prt_nm: this.parents,
                    group_nm: this.groups,
                    func_nm: this.groups,
                    elect_unit_nm: this.eUnits,
                    ecst_unit_nm: this.eConsumpUnits,
                    wgt_unit_nm: this.wts
                };
            },
            error: (error) => {
                console.error('Error loading data:', error);
                this.loading_filter = false;
            }
        });
    }

    loadDataTableCustom(event: any, param: any) {
        this.loading = true;
        this.sv.selectModelInfo(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.totalRecords = response.records;
                    param.rows = this.totalRecords;

                    this.sv.selectModelInfo(param).subscribe(
                        (response) => {
                            if (response !== null && response !== undefined) {
                                this.dataTable = this.convertData(response.rows);
                                this.dataTable.forEach((ele: any) => {
                                    let ele_r: any = ele;
                                    if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                                        ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                                    }
                                    if (ele_r.chg_dt_ymd !== null || ele_r.chg_dt_ymd === undefined) {
                                        ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                                    }
                                    return ele;
                                });
                                this.initialValue = this.dataTable;
                                this.loading = false;
                            }
                        },
                        (error) => {
                            console.error('Error fetching equipment information:', error);
                        }
                    );
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
    }

    filterChooseSearch(): void {
        this.param = {
            code: this.selectedCode !== null && this.selectedCode !== undefined ? this.selectedCode : '',
            name: this.selectedName !== null && this.selectedName !== undefined ? this.selectedName : '',
            description: this.selectedDescription !== null && this.selectedDescription !== undefined ? this.selectedDescription : '',
            manufacturer_cd: this.selectedManufacturer !== null && this.selectedManufacturer !== undefined ? this.selectedManufacturer : '',
            group_cd: this.selectedGroup !== null && this.selectedGroup !== undefined ? this.selectedGroup : '',
            func_cd: this.selectedFunc !== null && this.selectedFunc !== undefined ? this.selectedFunc : '',
            rows: this.totalRecords
        };

        let event: any = {
            first: 1, //this.first,
            rows: this.rows,
            last: '',
            rowsPerPage: '',
            filters: {}
        };
        this.loadDataTableCustom(event, this.param);
    }

    clear(table: Table) {
        table.clear();
        this.selectedCode = '';
        this.selectedName = '';
        this.selectedDescription = '';
        this.param = {
            code: '',
            name: ''
        };
    }

    onChangeGroup(type: 'cre' | 'filter') {
        let checkValue = type == 'cre' ? this.addModelForm.value.inputGroup : this.selectedGroup;
        let isCre = type == 'cre';

        if (checkValue) {
            this.sv.getFunctionList(checkValue).subscribe({
                next: (response) => {
                    if (isCre) {
                        this.creFuncs = response.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    } else {
                        this.funcs = response.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    }
                }
            });
        } else {
            if (isCre) {
                this.creFuncs = [];
                this.addModelForm.value.inputFunc = null;
            } else {
                this.funcs = [];
                this.selectedFunc = null;
            }
        }
    }

    onChangeUpdGroup() {
        if (this.addModelForm.value.inputGroup) {
            this.sv.getFunctionList(this.addModelForm.value.inputGroup).subscribe({
                next: (response) => {
                    this.func_nm_upd = response.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                }
            });
        }
    }

    onChangeCreGroup() {
        if (this.addModelForm.value.inputGroup) {
            this.sv.getFunctionList(this.addModelForm.value.inputGroup).subscribe({
                next: (response) => {
                    this.creFuncs = response.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                }
            });
        } else {
            this.addModelForm.value.inputFunc = null;
            this.creFuncs = [];
        }
    }

    isShowDialog: boolean = false;
    selectedRowTable: any = null;
    selectedRow: number | undefined = undefined;
    onRowClick(i: number) {
        this.selectedRow = i;
    }

    onRowEditInit(rowTable: any, rowNum: number) {
        this.isShowDialog = this.isEdit = true;
        this.selectedRow = rowNum;
        this.selectedRowTable = rowTable;

        this.setData();

        if (rowTable.group_cd) {
            this.sv.getFunctionList(rowTable.group_cd).subscribe({
                next: (response) => {
                    this.func_nm_upd = response.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                }
            });
        }
    }

    setData() {
        this.addModelForm.setValue({
            mdno: this.selectedRowTable.mdno ?? null,
            inputCode: this.selectedRowTable.md_cd ?? null,
            inputName: this.selectedRowTable.md_nm ?? null,
            inputGroup: this.selectedRowTable.group_cd ?? null,
            inputManufacturer: this.selectedRowTable.mf_nm,
            inputFunc: this.selectedRowTable.func_cd ?? null,
            // inputElectronicInput: this.selectedRowTable.elect ?? null,
            // inputElectronicUnit: this.selectedRowTable.elect_unit_cd ?? null,
            // inputEConsumption: this.selectedRowTable.e_cst ?? null,
            // inputEConsumptionUnit: this.selectedRowTable.ecst_unit_cd ?? null,
            // inputWeight: this.selectedRowTable.wgt ?? null,
            // inputWeightUnit: this.selectedRowTable.wgt_unit_cd ?? null,
            // inputDimension: this.selectedRowTable.dimension ?? null,
            inputDescription: this.selectedRowTable.re_mark ?? null
        });
    }

    onResetUpdate() {
        if (this.isEdit) {
            if (this.selectedRowTable.group_cd) {
                this.sv.getFunctionList(this.selectedRowTable.group_cd).subscribe({
                    next: (response) => {
                        this.func_nm_upd = response.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.setData();
                    }
                });
            } else {
                this.setData();
            }
        } else {
            this.addModelForm.reset();
        }
    }

    onEditCancel() {
        this.isShowDialog = false;
        this.selectedRow = undefined;
    }

    onEditSaved() {
        const paramAdd = {
            mdno: this.addModelForm.value.mdno,
            code: this.addModelForm.value.inputCode,
            name: this.addModelForm.value.inputName,
            group: this.addModelForm.value.inputGroup,
            manufacturer: this.addModelForm.value.inputManufacturer,
            function: this.addModelForm.value.inputFunc,
            // eInput: this.addModelForm.value.inputElectronicInput,
            // eUnit: this.addModelForm.value.inputElectronicUnit,
            // eConsump: this.addModelForm.value.inputEConsumption,
            // eConsumpUnit: this.addModelForm.value.inputEConsumptionUnit,
            // weight: this.addModelForm.value.inputWeight,
            // weightUnit: this.addModelForm.value.inputWeightUnit,
            // dimension: this.addModelForm.value.inputDimension,
            description: this.addModelForm.value.inputDescription
        };

        this.sv.updateModelInfo(paramAdd, this.filesUpdate).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Model information created successfully', key: 'tl', life: 3000 });
                    this.loadDataTableCustom({}, this.param);
                    this.filesUpdate = [];
                    this.isShowDialog = false;
                }
            },
            (error) => {
                console.error('Error creating Model information:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Model information', key: 'tl', life: 3000 });
            }
        );
    }

    onUpload(event: FileUploadEvent) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
    }

    choose(event: any, callback: any) {
        callback();
    }

    isEdit: boolean = false;
    onRowCreateInit() {
        this.isShowDialog = true;
        this.isEdit = false;
        this.selectedRowTable = null;
        this.addModelForm.reset();
    }

    onTemplatedUpload() {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    }

    uploadEvent(callback: any) {
        // callback();
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    }

    onSelectedFiles(event: { currentFiles: File[] }) {
        this.files = event.currentFiles;
        this.files.forEach((file) => {
            this.totalSize += parseInt(this.formatSize(file.size));
        });
        this.totalSizePercent = this.totalSize / 10;
    }

    onSelectedFilesUpdate(event: { currentFiles: File[] }) {
        this.filesUpdate = event.currentFiles;
    }

    formatSize(bytes: any) {
        const k = 1024;
        const dm = 3;
        const sizes = this.config.translation?.fileSizeTypes ?? ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        if (bytes === 0) {
            return `0 ${sizes && sizes.length > 0 ? sizes[0] : 'Bytes'}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes[i] ?? 'Bytes'}`;
    }

    createModel() {
        if (this.addModelForm.valid) {
            if (this.addModelForm.value.inputCode === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Code !', life: 3000 });
                return;
            }
            if (this.addModelForm.value.inputName === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Name !', life: 3000 });
                return;
            }
            if (this.addModelForm.value.inputGroup === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Group !', life: 3000 });
                return;
            }
            if (this.addModelForm.value.inputManufacturer === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Manufacturer !', life: 3000 });
                return;
            }
            if (this.addModelForm.value.inputFunc === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Function !', life: 3000 });
                return;
            }
            if (this.addModelForm.value.inputElectronicInput === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Electronic Input !', life: 3000 });
                return;
            }
            if (this.addModelForm.value.inputElectronicUnit === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Electronic Unit !', life: 3000 });
                return;
            }
            if (this.addModelForm.value.inputEConsumption === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter E-Consumption !', life: 3000 });
                return;
            }
            if (this.addModelForm.value.inputEConsumptionUnit === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter E-Consumption Unit !', life: 3000 });
                return;
            }
            if (this.addModelForm.value.inputWeight === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Weight !', life: 3000 });
                return;
            }
            if (this.addModelForm.value.inputWeightUnit === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Weight Unit !', life: 3000 });
                return;
            }
            if (this.addModelForm.value.inputDimension === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Dimension !', life: 3000 });
                return;
            }
            if (this.addModelForm.value.inputDescription === null) {
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter Description !', life: 3000 });
                return;
            }

            const paramAdd = {
                code: this.addModelForm.value.inputCode,
                name: this.addModelForm.value.inputName,
                group: this.addModelForm.value.inputGroup,
                manufacturer: this.addModelForm.value.inputManufacturer,
                function: this.addModelForm.value.inputFunc,
                eInput: this.addModelForm.value.inputElectronicInput,
                eUnit: this.addModelForm.value.inputElectronicUnit,
                eConsump: this.addModelForm.value.inputEConsumption,
                eConsumpUnit: this.addModelForm.value.inputEConsumptionUnit,
                weight: this.addModelForm.value.inputWeight,
                weightUnit: this.addModelForm.value.inputWeightUnit,
                dimension: this.addModelForm.value.inputDimension,
                description: this.addModelForm.value.inputDescription,
                file: this.files
            };
            this.sv.insertModelInfo(paramAdd).subscribe(
                (response) => {
                    if (response !== null && response !== undefined) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Model information created successfully', key: 'tl', life: 3000 });
                        this.loadDataTableCustom({}, this.param);
                        this.files = [];
                        this.addModelForm.reset();
                    }
                },
                (error) => {
                    console.error('Error creating Model information:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create Model information', key: 'tl', life: 3000 });
                }
            );
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter Title Line !', key: 'tl', life: 3000 });
        }
    }

    initialValue!: any;
    @ViewChild('dt1') dt1!: Table;
    isSorted: boolean | null = null;
    customSort(event: SortEvent) {
        if (this.isSorted == null || this.isSorted === undefined) {
            this.isSorted = true;
            this.global_sv.sortTableData(event);
        } else if (this.isSorted == true) {
            this.isSorted = false;
            this.global_sv.sortTableData(event);
        } else if (this.isSorted == false) {
            this.isSorted = null;
            this.dataTable = [...this.initialValue];
            this.dt1.reset();
        }
    }

    mf_nmTableFilterValue: string[] = [];
    prt_nmTableFilterValue: string[] = [];
    group_nmTableFilterValue: string[] = [];
    func_nmTableFilterValue: string[] = [];
    elect_unit_nmTableFilterValue: string[] = [];
    ecst_unit_nmTableFilterValue: string[] = [];
    wgt_unit_nmTableFilterValue: string[] = [];

    selectAllPrtNmTable: boolean = false;
    selectAllMfNmTable: boolean = false;
    selectAllGroupNmTable: boolean = false;
    selectAllFuncNmTable: boolean = false;
    selectAllElectUnitNmTable: boolean = false;
    selectAllEcstUnitNmTable: boolean = false;
    selectAllWgtUnitNmTable: boolean = false;

    @ViewChild('ms_prt_nm') ms_prt_nm!: MultiSelect;
    @ViewChild('ms_mf_nm') ms_mf_nm!: MultiSelect;
    @ViewChild('ms_group_nm') ms_group_nm!: MultiSelect;
    @ViewChild('ms_func_nm') ms_func_nm!: MultiSelect;
    @ViewChild('ms_elect_unit_nm') ms_elect_unit_nm!: MultiSelect;
    @ViewChild('ms_ecst_unit_nm') ms_ecst_unit_nm!: MultiSelect;
    @ViewChild('ms_wgt_unit_nm') ms_wgt_unit_nm!: MultiSelect;

    onSelectAllChangeTable(event: any, field: 'prt_nm' | 'mf_nm' | 'group_nm' | 'func_nm' | 'elect_unit_nm' | 'ecst_unit_nm' | 'wgt_unit_nm') {
        switch (field) {
            case 'prt_nm':
                this.prt_nmTableFilterValue = event.checked ? [...this.ms_prt_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllPrtNmTable = event.checked;
                break;
            case 'mf_nm':
                this.mf_nmTableFilterValue = event.checked ? [...this.ms_mf_nm.visibleOptions().map((item: any) => item.value)] : [];
                this.selectAllMfNmTable = event.checked;
                break;
            case 'group_nm':
                this.group_nmTableFilterValue = event.checked ? [...this.ms_group_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllGroupNmTable = event.checked;
                break;
            case 'func_nm':
                this.func_nmTableFilterValue = event.checked ? [...this.ms_func_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllFuncNmTable = event.checked;
                break;
            case 'elect_unit_nm':
                this.elect_unit_nmTableFilterValue = event.checked ? [...this.ms_elect_unit_nm.visibleOptions().map((item: any) => item.value)] : [];
                this.selectAllElectUnitNmTable = event.checked;
                break;
            case 'ecst_unit_nm':
                this.ecst_unit_nmTableFilterValue = event.checked ? [...this.ms_ecst_unit_nm.visibleOptions().map((item: any) => item.value)] : [];
                this.selectAllEcstUnitNmTable = event.checked;
                break;
            case 'wgt_unit_nm':
                this.wgt_unit_nmTableFilterValue = event.checked ? [...this.ms_wgt_unit_nm.visibleOptions().map((item: any) => item.value)] : [];
                this.selectAllWgtUnitNmTable = event.checked;
                break;
        }
    }

    convertData(rows: any[]) {
        return rows.map((item) => {
            return {
                ...item,
                wgt: Number(item.wgt),
                elect: Number(item.elect),
                e_cst: Number(item.e_cst),
                dimension: Number(item.dimension)
            };
        });
    }

    onDelete(mdno: number) {
        this.sv.deleteModelInfo(mdno).subscribe(
            () => {
                this.loadDataTableCustom({}, this.param);
            },
            (error) => {
                console.error('Error fetching model information:', error);
            }
        );
    }

    confirmDelete(event: Event, rowTable: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Do you want to delete this record? Code: ${rowTable.md_cd}, Name: ${rowTable.md_nm}`,
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
                this.onDelete(rowTable.mdno);
            },
            reject: () => {
                this.messageService.add({ severity: 'secondary', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }
}
