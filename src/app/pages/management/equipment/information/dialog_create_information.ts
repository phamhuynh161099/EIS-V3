import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { MessageService, SelectItem } from 'primeng/api';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Ripple } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { Toast } from 'primeng/toast';

import { GlobalsService } from '../../../../../globals.service';
import { EquipmentService } from '../equipment.service';

export interface Infor {
    cp_cd: string;
    mt_cd: string;
    mt_nm: string | null;
    lct_cd: string;
    mgm_dept_cd: string;
    cost_dept_cd: string;
    mf_cd: string;
    md_cd: string;
    sp_cd: string;
    as_no: string;
    as_sno: string;
    srl_no: string;
    lct_sts_cd: string;
    print_yn: string;
    dev_start_dt: Date | '';
    puchs_dt: Date | '';
    vailed_dt: Date | '';
    re_mark: string;
    use_yn: string;
}

@Component({
    selector: 'dialog-create-information',
    imports: [CommonModule, FormsModule, Toast, AutoFocusModule, Ripple, ButtonModule, SelectModule, Dialog, TextareaModule, InputTextModule, FloatLabel, TagModule, DatePicker, Message],
    providers: [MessageService],
    standalone: true,
    template: `
        <p-dialog id="create-dialog" class="dialog_create_information card" [(visible)]="informationCreateDialog" [style]="{ width: '800px' }" [closable]="false" [modal]="true">
            <p-toast />

            <ng-template #header>
                <div class="flex *:w-full justify-center items-center w-full">
                    <p-message severity="info">
                        <div class="inline-flex items-center justify-center gap-2">
                            <i class="pi pi-folder-plus"></i>
                            <span class="font-bold whitespace-nowrap">{{ valLanguage.btn_CreateEquipmentInformation[optionLanguage] }}</span>
                        </div>
                    </p-message>
                </div>
            </ng-template>

            <ng-template #content class="pb-6">
                <div class="flex flex-col gap-6 box" pRipple style="border: 1px solid rgba(75, 175, 80, 0.3); --p-ripple-background: rgba(75, 175, 80, 0.3)">
                    <div class="grid sm:grid-cols-2 md:grid-cols-3 *:w-full gap-x-3 gap-y-7">
                        <!-- Corp -->
                        <p-floatlabel>
                            <p-select
                                [pAutoFocus]="slt_corp"
                                [fluid]="true"
                                id="slt_corp"
                                [class]="slt_corp ? 'w-full ng-invalid ng-dirty' : 'w-full ng_not_empty'"
                                [(ngModel)]="corpValue"
                                (onChange)="handleChangeCorp($event)"
                                [options]="corpList"
                                readonly
                                class="text-left"
                            >
                                <ng-template let-option #item>
                                    <p-tag [value]="option.label" [severity]="getCorp(option.label)" class="w-full !py-2" />
                                </ng-template>
                            </p-select>
                            <label [class]="slt_corp ? 'lb_error' : 'lb_not_empty'" for="slt_corp"> ***{{ valLanguage.grid_Corp[optionLanguage] }} </label>
                        </p-floatlabel>

                        <!-- Storage -->
                        <p-floatlabel>
                            <p-select
                                [pAutoFocus]="slt_storage"
                                (onChange)="handleChangeStorage($event)"
                                [class]="slt_storage ? 'w-full ng-invalid ng-dirty' : 'w-full ng_not_empty'"
                                [(ngModel)]="storageValue"
                                [options]="storageList"
                                [showClear]="true"
                                class="text-left"
                                [filter]="true"
                                filterBy="label"
                            >
                                <ng-template let-option #item>
                                    <p-tag [value]="option.label" severity="secondary" class="w-full !py-2" />
                                </ng-template>
                            </p-select>
                            <label [class]="slt_storage ? 'lb_error' : 'lb_not_empty'" for="slt_storage"> ***{{ valLanguage.grid_Storage[optionLanguage] }} </label>
                        </p-floatlabel>

                        <!-- Manufacturer -->
                        <p-floatlabel>
                            <p-select
                                [pAutoFocus]="slt_manufacturer"
                                (onChange)="handleChangeManufacturer($event)"
                                [class]="slt_manufacturer ? 'w-full ng-invalid ng-dirty' : 'w-full ng_not_empty'"
                                [(ngModel)]="manufacturerValue"
                                [options]="manufacturer"
                                [showClear]="true"
                                [filter]="true"
                                filterBy="label"
                                class="text-left"
                            >
                                <ng-template let-option #item>
                                    <p-tag [value]="option.label" severity="secondary" class="w-full !py-2" />
                                </ng-template>
                            </p-select>
                            <label [class]="slt_manufacturer ? 'lb_error' : 'lb_not_empty'" for="slt_manufacturer"> ***{{ valLanguage.grid_Manufacturer[optionLanguage] }} </label>
                        </p-floatlabel>

                        <!-- Model -->
                        <p-floatlabel>
                            <p-select
                                [pAutoFocus]="slt_model"
                                class="text-left"
                                (onChange)="handleChangeModel($event)"
                                [class]="slt_model ? 'w-full ng-invalid ng-dirty' : 'w-full ng_not_empty'"
                                [(ngModel)]="modelValue"
                                [options]="model"
                                [showClear]="true"
                                [filter]="true"
                                filterBy="label"
                            >
                                <ng-template let-option #item>
                                    <p-tag [value]="option.label + ' / ' + option.value" severity="secondary" class="w-full !py-2" />
                                </ng-template>
                            </p-select>
                            <label [class]="slt_model ? 'lb_error' : 'lb_not_empty'" for="slt_model"> ***{{ valLanguage.grid_Model[optionLanguage] }} </label>
                        </p-floatlabel>

                        <!--
                            Material Code: dùng native input + datalist
                            - Không lag vì không có PrimeNG overhead
                            - datalist tự cập nhật ngay khi listMtCodeFiltered thay đổi
                            - Debounce 800ms: filter + check duplicate
                            - startsWith: nếu không match → valid (xanh), exact match → existed (đỏ)
                        -->
                        <p-floatlabel>
                            <input pInputText id="material_code" class="w-full" [class]="getMtCdInputClass()" list="mt_cd_datalist" [(ngModel)]="information.mt_cd" (input)="onMtCdInput($event)" autocomplete="off" />
                            <!-- datalist: browser tự render, cập nhật realtime, zero lag -->
                            <datalist id="mt_cd_datalist">
                                <option *ngFor="let cd of listMtCodeFiltered" [value]="cd"></option>
                            </datalist>
                            <label [class]="getMtCdLabelClass()" for="material_code"> ***{{ valLanguage.grid_Material[optionLanguage] }} </label>
                        </p-floatlabel>

                        <!-- Material Name -->
                        <p-floatlabel>
                            <input pInputText id="material_name" class="w-full" [(ngModel)]="information.mt_nm" autocomplete="off" />
                            <label for="material_name">{{ valLanguage.grid_Material_Name[optionLanguage] }}</label>
                        </p-floatlabel>

                        <!-- Cost Dept -->
                        <p-floatlabel>
                            <p-select class="w-full text-left" [filter]="true" filterBy="label" [(ngModel)]="costDeptValue" [options]="costDept" [showClear]="true">
                                <ng-template let-option #item>
                                    <p-tag [value]="option.label" severity="secondary" class="w-full !py-2" />
                                </ng-template>
                            </p-select>
                            <label for="cost_dept">{{ valLanguage.grid_Cost_Dept[optionLanguage] }}</label>
                        </p-floatlabel>

                        <!-- Storage Status -->
                        <p-floatlabel>
                            <p-select class="w-full text-left" [(ngModel)]="storageStatusValue" [options]="storageStatus" [showClear]="true">
                                <ng-template let-option #item>
                                    <p-tag [value]="option.label" severity="secondary" class="w-full !py-2" />
                                </ng-template>
                            </p-select>
                            <label for="storage_status">{{ valLanguage.grid_Storage_Status[optionLanguage] }}</label>
                        </p-floatlabel>

                        <!-- Supplier -->
                        <p-floatlabel id="left-filter">
                            <p-select [filter]="true" filterBy="label" class="w-full text-left" [(ngModel)]="supplierValue" [options]="supplier" [showClear]="true">
                                <ng-template let-option #item>
                                    <p-tag [value]="option.label" severity="secondary" class="w-full !py-2" />
                                </ng-template>
                            </p-select>
                            <label for="supplier">{{ valLanguage.grid_Supplier[optionLanguage] }}</label>
                        </p-floatlabel>

                        <!-- Management Dept -->
                        <p-floatlabel>
                            <p-select [filter]="true" filterBy="label" class="w-full text-left" [(ngModel)]="managementDeptlValue" [options]="managementDept" [showClear]="true">
                                <ng-template let-option #item>
                                    <p-tag [value]="option.label" severity="secondary" class="w-full !py-2" />
                                </ng-template>
                            </p-select>
                            <label for="mgm_dept">{{ valLanguage.grid_Management_Dept[optionLanguage] }}</label>
                        </p-floatlabel>

                        <!-- Printed Or Not -->
                        <p-floatlabel>
                            <p-select class="w-full text-left" [(ngModel)]="printedOrNotValue" [options]="printedOrNot" [showClear]="true">
                                <ng-template let-option #item>
                                    <p-tag [value]="option.label" [severity]="option.value == 'Y' ? 'info' : 'danger'" class="w-full !py-2" />
                                </ng-template>
                            </p-select>
                            <label for="printed">{{ valLanguage.grid_Printed_Or_Not[optionLanguage] }}</label>
                        </p-floatlabel>

                        <!-- Used Or Not -->
                        <p-floatlabel>
                            <p-select class="w-full text-left" [(ngModel)]="usedOrNotValue" [options]="usedOrNot" [showClear]="true">
                                <ng-template let-option #item>
                                    <p-tag [value]="option.label" [severity]="option.value == 'Y' ? 'info' : 'danger'" class="w-full !py-2" />
                                </ng-template>
                            </p-select>
                            <label for="used">{{ valLanguage.grid_Used_Or_Not[optionLanguage] }}</label>
                        </p-floatlabel>

                        <!-- Asset Number -->
                        <p-floatlabel>
                            <input pInputText id="asset_number" class="w-full" [(ngModel)]="information.as_no" autocomplete="off" />
                            <label for="asset_number">{{ valLanguage.grid_Asset_Number[optionLanguage] }}</label>
                        </p-floatlabel>

                        <!-- Asset Serial -->
                        <p-floatlabel>
                            <input pInputText id="asset_serial" class="w-full" [(ngModel)]="information.as_sno" autocomplete="off" />
                            <label for="asset_serial">{{ valLanguage.grid_Asset_Serial[optionLanguage] }}</label>
                        </p-floatlabel>

                        <!-- Serial Number -->
                        <p-floatlabel>
                            <input pInputText id="serial_number" class="w-full" [(ngModel)]="information.srl_no" autocomplete="off" />
                            <label for="serial_number">{{ valLanguage.grid_Serial_Number[optionLanguage] }}</label>
                        </p-floatlabel>
                    </div>

                    <!-- Remark -->
                    <p-floatlabel>
                        <textarea pTextarea id="re_mark" [(ngModel)]="information.re_mark" required rows="3" cols="20" fluid style="resize: none" class="h-full"></textarea>
                        <label for="re_mark">{{ valLanguage.grid_Remark[optionLanguage] }}</label>
                    </p-floatlabel>

                    <!-- Dates -->
                    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-7 *:w-full">
                        <p-floatlabel>
                            <p-datepicker [readonlyInput]="true" class="w-full *:w-full" [(ngModel)]="information.dev_start_dt" [showButtonBar]="true" dateFormat="yy.mm.dd" />
                            <label for="dev_start_dt">{{ valLanguage.grid_Start_Date[optionLanguage] }}</label>
                        </p-floatlabel>
                        <p-floatlabel>
                            <p-datepicker [readonlyInput]="true" class="w-full *:w-full" [(ngModel)]="information.puchs_dt" [showButtonBar]="true" dateFormat="yy.mm.dd" />
                            <label for="puchs_dt">{{ valLanguage.grid_Purchased_Date[optionLanguage] }}</label>
                        </p-floatlabel>
                        <p-floatlabel>
                            <p-datepicker [readonlyInput]="true" class="w-full *:w-full" [(ngModel)]="information.vailed_dt" [showButtonBar]="true" dateFormat="yy.mm.dd" />
                            <label for="vailed_dt">{{ valLanguage.grid_Valid_Date[optionLanguage] }}</label>
                        </p-floatlabel>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <div class="flex justify-end gap-3 *:md:max-w-40 *:flex-1 sm:*:w-full *:*:w-full items-center w-full mt-5 *:h-[32.8px] *:shrink-0">
                    <p-button [label]="valLanguage.btn_Cancel[optionLanguage]" class="*:h-full" severity="contrast" icon="pi pi-times" (click)="hideDialog()" />
                    <p-button [label]="valLanguage.btn_Save[optionLanguage]" class="*:h-full" severity="info" icon="pi pi-check" (click)="saveProduct()" />
                </div>
            </ng-template>
        </p-dialog>
    `,
    styles: [
        `
            :host {
                .box {
                    padding: 2rem;
                    border-radius: 10px;
                    text-align: center;
                }
            }

            ::ng-deep {
                .ng_not_empty {
                    border-color: var(--p-button-warn-background) !important;

                    div,
                    label {
                        color: var(--p-button-warn-background);
                    }
                }

                .lb_not_empty {
                    color: var(--p-button-warn-background) !important;
                }

                .lb_error {
                    color: var(--p-select-invalid-border-color) !important;
                }

                .lb_valid {
                    color: var(--p-green-500) !important;
                }

                #left-filter {
                    .p-overlay.p-component {
                        left: unset !important;
                        right: 0;
                    }
                }

                /* Style cho native input material code */
                #material_code {
                    width: 100%;

                    &.mt_cd_valid {
                        border-color: var(--p-green-500) !important;
                    }

                    &.mt_cd_invalid {
                        border-color: var(--p-select-invalid-border-color) !important;
                    }

                    &.mt_cd_warn {
                        border-color: var(--p-button-warn-background) !important;
                    }
                }

                .p-dialog-content .p-ripple {
                    overflow: visible;
                }

                p-dialog#create-dialog {
                    p-datepicker .p-datepicker-panel {
                        top: unset !important;
                        bottom: 100%;
                    }

                    .p-dialog {
                        height: 65vh;
                    }

                    @media (width < 500px) {
                        .p-dialog {
                            width: 95vw;
                            height: 95vh;
                            max-height: 95vh;
                            border-radius: unset;

                            .p-ripple {
                                padding: 0;
                                border: unset !important;
                            }
                        }
                    }
                }
            }
        `
    ]
})
export class DialogCreateInformationComponent implements OnInit, OnChanges, OnDestroy {
    @Input() informationCreateDialog: any = [];
    @Input() corpList: any = [];
    @Input() storageList: any = [];
    @Input() listMtCd!: string[];
    @Output() changeHideDialog = new EventEmitter<string>();
    @Output('parentFun') parentFun: EventEmitter<any> = new EventEmitter();
    @Output('parentCreateDone') parentCreateDone: EventEmitter<any> = new EventEmitter();

    @Input() mt_cd_not_exited: string = '';
    @Input() valLanguage: any = [];
    @Input() optionLanguage: any = [];
    @Input()
    set setInfo(c: Partial<Infor>) {
        this.information = Object.assign(this.information, c);
    }

    // datalist options: cập nhật sau debounce 800ms theo startsWith
    listMtCodeFiltered: string[] = [];
    // null=chưa nhập | false=valid (không tồn tại) | true=đã tồn tại
    mtCdExists: boolean | null = null;

    private mtCdSubject = new Subject<string>();
    private destroy$ = new Subject<void>();

    slt_corp = false;
    slt_storage = false;
    slt_manufacturer = false;
    slt_model = false;
    int_material_code = false;
    int_material_name = false;

    corpValue = 'H100';
    storageValue: string | null = null;
    manufacturer!: SelectItem[];
    manufacturerValue: string | null = null;
    model!: SelectItem[];
    modelValue: string | null = null;
    costDept!: SelectItem[];
    costDeptValue: string | null = null;
    storageStatus!: SelectItem[];
    storageStatusValue: string | null = null;
    supplier!: SelectItem[];
    supplierValue: string | null = null;
    managementDept!: SelectItem[];
    managementDeptlValue: string | null = null;
    printedOrNot!: SelectItem[];
    printedOrNotValue: string | null = null;
    usedOrNot!: SelectItem[];
    usedOrNotValue: string | null = null;

    information: Infor = {
        cp_cd: '',
        mt_cd: '',
        mt_nm: null,
        lct_cd: '',
        mgm_dept_cd: '',
        cost_dept_cd: '',
        mf_cd: '',
        md_cd: '',
        sp_cd: '',
        as_no: '',
        as_sno: '',
        srl_no: '',
        lct_sts_cd: '',
        print_yn: '',
        dev_start_dt: '',
        puchs_dt: '',
        vailed_dt: '',
        re_mark: '',
        use_yn: ''
    };

    submitted = false;
    group!: SelectItem[];
    materialNames!: SelectItem[];

    constructor(
        private messageService: MessageService,
        private sv: EquipmentService,
        private global_sv: GlobalsService,
        private ngZone: NgZone
    ) {
        this.storageStatus = [
            { label: 'Import', value: '101' },
            { label: 'Export', value: '201' }
        ];
        this.printedOrNot = [
            { label: 'Yes', value: 'Y' },
            { label: 'No', value: 'N' }
        ];
        this.usedOrNot = [
            { label: 'Yes', value: 'Y' },
            { label: 'No', value: 'N' }
        ];
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['listMtCd']?.currentValue) {
            this.listMtCodeFiltered = [...this.listMtCd];
        }
    }

    ngOnInit(): void {
        this.loadListCreateEqui();

        // Debounce 800ms: chạy ngoài zone khi nhận input,
        // chỉ vào zone khi có kết quả để cập nhật UI
        this.mtCdSubject.pipe(debounceTime(800), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((value: string) => {
            this.ngZone.run(() => {
                const trimmed = value.trim().toLowerCase();

                if (!trimmed) {
                    this.listMtCodeFiltered = [...this.listMtCd];
                    this.mtCdExists = null;
                    this.int_material_code = false;
                    return;
                }

                // Filter startsWith
                const matched = this.listMtCd.filter((cd) => cd.toLowerCase().startsWith(trimmed));

                // Không có match nào → code mới hoàn toàn → valid
                // Có match nhưng không exact → prefix đang gõ → valid
                // Exact match → đã tồn tại → invalid
                const exactExists = matched.some((cd) => cd.toLowerCase() === trimmed);
                this.listMtCodeFiltered = matched;
                this.mtCdExists = exactExists ? true : matched.length === 0 ? false : false;
                this.int_material_code = exactExists;
            });
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // Angular (input) event — emit ra ngoài zone ngay để tránh lag khi gõ
    onMtCdInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value ?? '';
        // Emit ngoài zone — Subject.next() không trigger change detection
        this.ngZone.runOutsideAngular(() => {
            this.mtCdSubject.next(value);
        });
    }

    getMtCdInputClass(): string {
        if (this.int_material_code || this.mtCdExists === true) return 'mt_cd_invalid';
        if (this.mtCdExists === false && this.information.mt_cd) return 'mt_cd_valid';
        return 'mt_cd_warn';
    }

    getMtCdLabelClass(): string {
        if (this.int_material_code || this.mtCdExists === true) return 'lb_error';
        if (this.mtCdExists === false && this.information.mt_cd) return 'lb_valid';
        return 'lb_not_empty';
    }

    hideDialog(): void {
        this.informationCreateDialog = false;
        this.changeHideDialog.emit(this.informationCreateDialog);
        this.submitted = false;
        this.mtCdExists = null;
    }

    saveProduct(): void {
        let flagError = false;

        if (!this.information.mt_cd) {
            flagError = true;
            this.int_material_code = true;
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please enter Material Code.' });
        } else if (this.mtCdExists === true) {
            flagError = true;
            this.int_material_code = true;
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Material Code already exists, please use another.' });
        }
        if (!this.corpValue) {
            this.slt_corp = true;
            flagError = true;
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select Corp.' });
        }
        if (!this.storageValue) {
            this.slt_storage = true;
            flagError = true;
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select Storage.' });
        }
        if (!this.manufacturerValue) {
            this.slt_manufacturer = true;
            flagError = true;
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select Manufacturer.' });
        }
        if (!this.modelValue) {
            this.slt_model = true;
            flagError = true;
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select Model.' });
        }
        if (!this.information.mt_nm) {
            this.int_material_name = true;
            flagError = true;
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select Material Name.' });
        }

        if (flagError) return;

        const param: any = {
            corp: this.corpValue,
            storage: this.storageValue,
            manufac: this.manufacturerValue,
            model: this.modelValue,
            information: this.information,
            costDept: this.costDeptValue ?? '',
            import: this.storageStatusValue ?? '',
            supplier: this.supplierValue ?? '',
            manaDept: this.managementDeptlValue ?? '',
            printed: this.printedOrNotValue ?? '',
            usedValue: this.usedOrNotValue ?? '',
            statusDate: this.information.dev_start_dt ? this.global_sv.formatDateFilter(this.information.dev_start_dt) : '',
            purchasedDate: this.information.puchs_dt ? this.global_sv.formatDateFilter(this.information.puchs_dt) : '',
            validDate: this.information.vailed_dt ? this.global_sv.formatDateFilter(this.information.vailed_dt) : ''
        };

        this.sv.createEquipmentInfo(param).subscribe(
            (response) => {
                if (response?.indexOf("''") >= 0 || response?.indexOf("'0'") >= 0) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data creation failed!' });
                } else {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data creation successful!' });
                    this.resetForm();
                    this.parentFun.emit();
                    this.parentCreateDone.emit();
                    this.hideDialog();
                }
            },
            (error) => console.error('Error response:', error)
        );
    }

    private resetForm(): void {
        this.storageValue = this.manufacturerValue = this.modelValue = null;
        this.costDeptValue = this.storageStatusValue = this.supplierValue = null;
        this.managementDeptlValue = this.printedOrNotValue = this.usedOrNotValue = null;
        this.mtCdExists = null;
        this.int_material_code = false;
        this.int_material_name = false;
        this.listMtCodeFiltered = [...(this.listMtCd ?? [])];
        this.information = {
            cp_cd: '',
            mt_cd: '',
            mt_nm: '',
            lct_cd: '',
            mgm_dept_cd: '',
            cost_dept_cd: '',
            mf_cd: '',
            md_cd: '',
            sp_cd: '',
            as_no: '',
            as_sno: '',
            srl_no: '',
            lct_sts_cd: '',
            print_yn: '',
            dev_start_dt: '',
            puchs_dt: '',
            vailed_dt: '',
            re_mark: '',
            use_yn: ''
        };
    }

    loadListCreateEqui(): void {
        forkJoin({
            getManufac: this.global_sv.getManufac(),
            getDept: this.global_sv.getDept(),
            getSupplier: this.global_sv.getSupplier(),
            group: this.global_sv.getGroup('1')
        }).subscribe(
            (responses) => {
                if (responses.getManufac) {
                    this.manufacturer = responses.getManufac.filter((i: any) => i.comm_nm !== '').map((i: any) => ({ label: i.comm_nm, value: i.comm_cd }));
                }
                if (responses.getDept) {
                    const dept = responses.getDept.filter((i: any) => i.comm_nm !== '').map((i: any) => ({ label: i.comm_nm, value: i.comm_cd }));
                    this.managementDept = dept;
                    this.costDept = dept;
                }
                if (responses.getSupplier) {
                    this.supplier = responses.getSupplier.filter((i: any) => i.comm_nm !== '').map((i: any) => ({ label: i.comm_nm, value: i.comm_cd }));
                }
                if (responses.group) {
                    this.group = responses.group.filter((i: any) => i.comm_nm !== '').map((i: any) => ({ label: i.comm_nm, value: i.comm_cd }));
                }
            },
            (error) => console.error('Error loading filter lists:', error)
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

    handleChangeCorp(event: any): void {
        if (event.value) this.slt_corp = false;
        this.global_sv.getStorage(event.value).subscribe(
            (res) => {
                if (res) this.storageList = res.filter((i: any) => i.comm_nm !== '').map((i: any) => ({ label: i.comm_nm, value: i.comm_cd }));
            },
            (err) => console.error('Error handleChangeCorp:', err)
        );
    }

    handleChangeStorage(event: any): void {
        if (event.value) this.slt_storage = false;
    }

    handleChangeManufacturer(event: any): void {
        if (event.value) this.slt_manufacturer = false;
        this.sv.getModelParam(event.value).subscribe(
            (res) => {
                if (res) this.model = res.filter((i: any) => i.comm_nm !== '').map((i: any) => ({ label: i.comm_nm, value: i.comm_cd }));
            },
            (err) => console.error('Error handle fetch manufacturer:', err)
        );
    }

    handleChangeModel(event: any): void {
        if (event.value) this.slt_model = false;
        this.information.mt_nm = this.model.find((m)=> m.value == event.value)?.label ?? ''
    }
}
