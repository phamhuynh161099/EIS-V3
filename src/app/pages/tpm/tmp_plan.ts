import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { forkJoin, Subject, takeUntil } from 'rxjs';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBar } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Ripple } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TreeTableModule } from 'primeng/treetable';

import { LanguageType } from '../../../constants/constants.auth';
import { GlobalsService } from '../../../globals.service';
import { TPMService } from './tpm.service';

function ValidateNotNull(control: AbstractControl): { [key: string]: any } | null {
    if (control.value === null && control.value === '') {
        return { valueInvalid: true };
    }
    return null;
}
@Component({
    imports: [
        CommonModule,
        Dialog,
        ProgressBar,
        ProgressSpinnerModule,
        TreeTableModule,
        TagModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        TextareaModule,
        TableModule,
        FloatLabelModule,
        ToastModule,
        SelectModule,
        Ripple,
        ConfirmDialogModule,
        DatePicker,
        InputMaskModule
    ],
    standalone: true,
    providers: [TPMService, MessageService, ConfirmationService],
    template: `<section class="header-title"  *ngIf="valLanguage">
            <p-toast />
            <p-toast position="top-left" key="tl" />
            <div class="flex justify-between items-center gap-3 flex-wrap">
                <h2 class="text-2xl sm:text-3xl mr-auto mb-0">{{ valLanguage.TPMPlan[optionLanguage] }}</h2>
                <div class="flex gap-2 *:w-[160px] *:*:w-full ml-auto">
                    <p-button severity="success" variant="outlined" icon="pi pi-plus-circle" [label]="valLanguage.btn_Add[optionLanguage] + ' TPM'" (click)="showDialog_add()" />
                    <p-button [label]="valLanguage.btn_Refresh[optionLanguage]" severity="secondary" icon="pi pi-refresh" (click)="ngOnInit()" />
                </div>
            </div>
        </section>
        <p-confirmdialog />
        <div class="flex flex-wrap flex-row items-start gap-4 grid-flow-col justify-center xl:justify-between">
            @for (item of dataFactory; track item.factory) {
                <div class="card tmp_line">
                    <div class="md:p-3 space-y-2">
                        <div class="text-nowrap text-lg md:text-xl">
                            <label class="pr-2">{{ valLanguage.txt_Corp[optionLanguage] }} : {{ getTitleName(corpFac, item.corp) }} <i class="pi pi-angle-right"></i> </label>
                            <label>{{ valLanguage.txt_Factory[optionLanguage] }} : {{ getTitleName(factory, item.factory) }} </label>
                        </div>
                        <div class="flex justify-end gap-x-2 *:w-40  *:*:w-full">
                            <p-button icon="pi pi-address-book" (click)="showDialog(item.corp, item.factory, item.dataChart)" [label]="'TPM ' + valLanguage.btn_Line[optionLanguage]" variant="outlined" severity="info" />
                            <p-button icon="pi pi-address-book" (click)="confirmDelete($event, { corp: item.corp, factory: item.factory })" [label]="valLanguage.btn_Delete[optionLanguage]" variant="outlined" severity="danger" />
                        </div>
                    </div>
                    @for (itemChild of item.dataChart; track i; let i = $index) {
                        <div class="card-2">
                            <div *ngIf="i === 0" class="flex justify-between">
                                <label></label>
                                <label>100%</label>
                            </div>
                            <div class="flex justify-between">
                                <label>{{ itemChild.name }}</label>
                                <p-progressbar class="shrink-0" [class]="'w w-1/2 ' + itemChild.color" [value]="itemChild.value" />
                            </div>
                        </div>
                    }
                </div>
            } @empty {
                <p-progress-spinner *ngIf="loading" strokeWidth="5" fill="transparent" animationDuration=".5s" [style]="{ width: '60px', height: '60px' }" class="flex justify-center w-full h-full" ariaLabel="loading" />
            }
        </div>
        <p-dialog id="main-dialog" [modal]="true" [(visible)]="visible" [style]="{ width: '80%' }">
            <ng-template #header>
                <div class="flex justify-between items-center w-full">
                    <h3>TMP {{ valLanguage.txt_Plan[optionLanguage] }}. {{ valLanguage.txt_Corp[optionLanguage] }} : {{ nameCorp }} , {{ valLanguage.txt_Storage[optionLanguage] }} : {{ nameFactory }}</h3>
                    <div class="hidden md:flex justify-between items-center gap-x-4 mr-3">
                        <p-button icon="pi pi-file-plus" class="btn_header" variant="outlined" (click)="dialogCreateTMPLine(addLineForm)" [label]="valLanguage.txt_AddGroup[optionLanguage]" severity="success" />
                        <p-button icon="pi pi-save" class="btn_header" variant="outlined" (click)="saveCreateTpmPlan_line()" [label]="valLanguage.btn_Save[optionLanguage]" severity="warn" />
                    </div>
                </div>
            </ng-template>
            <div class="md:hidden flex justify-between items-center *:flex-1 *:*:w-full gap-3 pb-4 card">
                <p-button icon="pi pi-file-plus" variant="outlined" (click)="dialogCreateTMPLine(addLineForm)" [label]="valLanguage.txt_AddGroup[optionLanguage]" severity="success" />
                <p-button icon="pi pi-save" variant="outlined" (click)="saveCreateTpmPlan_line()" [label]="valLanguage.btn_Save[optionLanguage]" severity="warn" />
            </div>
            <div class="flex flex-wrap flex-row items-start gap-4 grid-flow-col justify-center xl:justify-between">
                @for (dtline of dataLine; track i; let i = $index) {
                    <div class="card tmp_line_child">
                        <div class="py-3 flex justify-between">
                            <div pRipple class="box" style="border: 1px solid rgba(255, 193, 6, 0.3); --p-ripple-background: rgba(255, 193, 6, 0.3)">
                                <label class="pr-2"><i class="pi pi-chevron-right pr-3"></i> {{ valLanguage.txt_Line[optionLanguage] }} : {{ dtline.plan_grp }} </label>
                            </div>
                        </div>
                        <div class="flex *:flex-1 *:*:w-full flex-wrap gap-x-4 gap-y-2 text-nowrap text-center mb-4">
                            <p-button icon="pi pi-address-book" (click)="dialogCreateTMPGroupLine(dtline)" [label]="valLanguage.txt_AddNewLine[optionLanguage]" variant="outlined" severity="success" />
                            <p-button icon="pi pi-address-book" (click)="deleteTpmPlan_line(dtline)" [label]="valLanguage.txt_DeleteCurentGroup[optionLanguage]" variant="outlined" severity="danger" />
                        </div>
                        <p-table class="overflow-auto" dataKey="id" editMode="row" [value]="dtline.dataLine" [scrollable]="true" scrollHeight="390px" [tableStyle]="{ 'max-width': '100%' }">
                            <ng-template #header>
                                <tr>
                                    <th>{{ valLanguage.txt_Delete[optionLanguage] }}</th>
                                    <th>{{ valLanguage.txt_PlanDate[optionLanguage] }}</th>
                                    <th>{{ valLanguage.txt_EndDate[optionLanguage] }}</th>
                                    <th>{{ valLanguage.txt_Line[optionLanguage] }}</th>
                                    <th>{{ valLanguage.txt_Edit[optionLanguage] }}</th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-lines let-editing="editing" let-ri="rowIndex">
                                <tr [pEditableRow]="lines">
                                    <td>
                                        <button pButton pRipple type="button" icon="pi pi-trash" (click)="onRowDeleteLine(lines, dtline.plan_grp)" text rounded severity="secondary"></button>
                                    </td>
                                    <td>
                                        <p-cellEditor>
                                            <ng-template #input>
                                                <p-datepicker inputId="Plandate" dateFormat="yy/mm/dd" [(ngModel)]="lines.plan_dt" showIcon iconDisplay="input" />
                                            </ng-template>
                                            <ng-template #output>
                                                {{ lines.plan_dt | date: 'yyyy/MM/dd' }}
                                            </ng-template>
                                        </p-cellEditor>
                                    </td>
                                    <td>
                                        <p-cellEditor>
                                            <ng-template #input>
                                                <p-datepicker inputId="Plandate" dateFormat="yy/mm/dd" [(ngModel)]="lines.end_dt" showIcon iconDisplay="input" />
                                            </ng-template>
                                            <ng-template #output>
                                                {{ lines.end_dt | date: 'yyyy/MM/dd' }}
                                            </ng-template>
                                        </p-cellEditor>
                                    </td>
                                    <td>
                                        <p-cellEditor>
                                            <ng-template #input>
                                                <input pInputText type="text" class="inp_date" [(ngModel)]="lines.value" required />
                                            </ng-template>
                                            <ng-template #output>
                                                {{ lines.value }}
                                            </ng-template>
                                        </p-cellEditor>
                                    </td>
                                    <td>
                                        <div class="flex items-center justify-center gap-2">
                                            <button *ngIf="!editing" pButton pRipple type="button" pInitEditableRow icon="pi pi-pencil" (click)="onRowEditInit(lines)" text rounded severity="secondary"></button>
                                            <button *ngIf="editing" pButton pRipple type="button" pSaveEditableRow icon="pi pi-check" (click)="onRowEditSave(lines)" text rounded severity="secondary"></button>
                                            <button *ngIf="editing" pButton pRipple type="button" pCancelEditableRow icon="pi pi-times" (click)="onRowEditCancel(lines, ri)" text rounded severity="secondary"></button>
                                        </div>
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>
                        <div class="flex justify-between p-3">
                            <label>Processing(%)</label>
                            <p-progressbar [class]="'w w-2/3 ' + dtline.color" [value]="dtline.processing" />
                        </div>
                    </div>
                } @empty {
                    <p-progress-spinner *ngIf="flagDataLine" strokeWidth="6" fill="transparent" animationDuration=".5s" [style]="{ width: '100px', height: '100px' }" class="flex justify-center w-full h-full" ariaLabel="loading" />
                }
            </div>
        </p-dialog>
        <p-dialog [modal]="true" id="dialog-example" [(visible)]="visible_add" [style]="{ width: '28rem', height: '30rem' }">
            <ng-template #header>
                <p-button icon="pi pi-file-plus" class="w-full [&>button]:w-full [&>button]:flex [&>button]:gap-2 [&>button]:justify-between [&>button]:px-2.5 mr-2" variant="outlined" severity="info">{{ valLanguage.btn_Add[optionLanguage] }} TPM</p-button>
            </ng-template>
            <form class="needs-validation" novalidate [formGroup]="myForm" *ngIf="myForm" (ngSubmit)="saveCreateTMP(myForm)">
                <p-floatlabel class="w-full mt-2">
                    <p-select class="w-full" formControlName="corpValue" (onChange)="handleChangeCorp($event)" [options]="corpFac" [showClear]="true">
                        <ng-template let-option #item>
                            <p-tag [value]="option.label" [severity]="global_sv.getCorpColor(option.label)" />
                        </ng-template>
                    </p-select>
                    <label for="username">{{ valLanguage.txt_Corp[optionLanguage] }}</label>
                </p-floatlabel>
                <!--  [(ngModel)]="storageFilterValue" -->
                <p-floatlabel class="w-full mt-7">
                    <p-select [filter]="true" filterBy="label" formControlName="storageValue" class="w-full" [options]="storage" [showClear]="true">
                        <ng-template let-option #item>
                            <p-tag [value]="option.label" severity="secondary" />
                        </ng-template>
                    </p-select>
                    <label for="username">{{ valLanguage.txt_Storage[optionLanguage] }}</label>
                </p-floatlabel>
                <div class="flex justify-between p-3">
                    <label>example</label>
                    <p-progressbar [class]="'w w-2/3 red'" [value]="0" />
                </div>
                <div class="flex justify-between p-3">
                    <label>example</label>
                    <p-progressbar [class]="'w w-2/3 red'" [value]="0" />
                </div>
                <div class="flex justify-between p-3">
                    <label>example</label>
                    <p-progressbar [class]="'w w-2/3 red'" [value]="0" />
                </div>
            </form>
            <ng-template #footer>
                <div class="flex justify-center gap-2 mt-3 w-full *:w-full ">
                    <p-button class="[&>button]:w-full" label="Cancel" icon="pi pi-times-circle" variant="outlined" severity="contrast" (click)="visible_add = false" />
                    <p-button class="[&>button]:w-full" label="Save" icon="pi pi-save" variant="outlined" severity="success" (click)="saveCreateTMP(myForm)" />
                </div>
            </ng-template>
        </p-dialog>
        <p-dialog id="dialog-example" [modal]="true" [(visible)]="visible_addLine" [style]="{ width: '20rem' }">
            <ng-template #header>
                <p-button icon="pi pi-file-plus" class="w-full [&>button]:w-full [&>button]:flex [&>button]:gap-2 [&>button]:justify-between [&>button]:px-2.5 mr-2" variant="outlined" severity="info">{{ valLanguage.txt_AddTPMGroupLine[optionLanguage] }}</p-button>
            </ng-template>
            <form class="needs-validation" novalidate [formGroup]="addLineForm" *ngIf="addLineForm" (ngSubmit)="CreateTpmPlan_line(addLineForm)">
                <p-floatlabel class="w-full mt-2">
                    <input class="w-full" pInputText id="over_label" formControlName="inputTitleLine" autocomplete="off" />
                    <label for="over_label">{{ valLanguage.txt_TitleLine[optionLanguage] }}</label>
                </p-floatlabel>
            </form>
            <ng-template #footer>
                <div class="flex justify-center gap-2 *:w-full w-full">
                    <p-button class="[&>button]:w-full" [label]="valLanguage.btn_Cancel[optionLanguage]" icon="pi pi-times-circle" variant="outlined" severity="contrast" (click)="visible_addLine = false" />
                    <p-button class="[&>button]:w-full" [label]="valLanguage.btn_Add[optionLanguage]" icon="pi pi-file-plus" variant="outlined" severity="success" (click)="CreateTpmPlan_line(addLineForm)" />
                </div>
            </ng-template>
        </p-dialog>
        <p-dialog [modal]="true" [(visible)]="visible_addGroupLine" id="dialog-example" [style]="{ width: '25rem' }">
            <ng-template #header>
                <div class="flex justify-center w-full">
                    <p-button icon="pi pi-file-plus" class="w-full [&>button]:w-full [&>button]:flex [&>button]:gap-2 [&>button]:justify-between [&>button]:px-2.5 mr-2" variant="outlined" severity="info">{{ valLanguage.txt_AddNewLine[optionLanguage] }}</p-button>
                </div>
            </ng-template>
            <div class="flex *:w-full gap-x-2">
                <p-button class="[&>button]:w-full" [label]="valLanguage.btn_Cancel[optionLanguage]" icon="pi pi-times-circle" variant="outlined" severity="contrast" (click)="visible_addGroupLine = false" />
                <p-button class="[&>button]:w-full" [label]="valLanguage.btn_Add[optionLanguage]" icon="pi pi-save" icon="pi pi-plus" variant="outlined" severity="success" (click)="CreateTpmPlan_Groupline(addGroupLineForm)" />
            </div>
            <div class="my-4">
                <label for="Line">{{ valLanguage.txt_Factory[optionLanguage] }} : {{ nameFactory }}</label>
            </div>
            <div class="my-4">
                <label for="Line">{{ valLanguage.txt_Line[optionLanguage] }} : {{ nameGroupLine }}</label>
            </div>
            <form class="needs-validation" novalidate [formGroup]="addGroupLineForm" *ngIf="addGroupLineForm" (ngSubmit)="CreateTpmPlan_line(addGroupLineForm)">
                <p-floatlabel class="mt-8 w-full">
                    <input class="w-full" pInputText id="Line" formControlName="inputTitleGroupLine" autocomplete="off" />
                    <label for="Line">{{ valLanguage.txt_TitleLine[optionLanguage] }}</label>
                </p-floatlabel>
                <p-floatlabel class="mt-8 w-full">
                    <p-datepicker class="w-full *:w-full" formControlName="dateStartGroupLine" inputId="Plandate" showIcon iconDisplay="input" />
                    <label for="Plandate">{{ valLanguage.txt_PlanDate[optionLanguage] }}</label>
                </p-floatlabel>
                <p-floatlabel class="mt-8 w-full">
                    <p-datepicker class="w-full *:w-full" formControlName="dateEndGroupLine" inputId="EndStart" showIcon iconDisplay="input" />
                    <label for="EndStart">{{ valLanguage.txt_EndDate[optionLanguage] }}</label>
                </p-floatlabel>
            </form>
            <!-- <ng-template #footer>
            </ng-template> -->
        </p-dialog> `,
    styles: `
        ::ng-deep {
            .inp_date input,
            input.inp_date {
                width: 8rem;
            }
            .tmp_line {
                width: 100%;
                max-width: 400px;
                @media (max-width: 991px) {
                    width: 100%;
                    max-width: 380px;
                }
            }
            .tmp_line_child {
                width: 600px;
                height: 550px;
                // overflow: auto;
                @media (max-width: 991px) {
                    width: 380px;
                    height: 550px;
                }
                .p-datatable-table-container {
                    height: 390px;
                }
            }
            table thead{
                text-wrap: nowrap;
            }
            p-progressbar .p-progressbar-label {
                color: #000;
            }

            p-dialog#dialog-example .p-dialog-content {
                overflow-y: unset;
            }
            p-dialog#main-dialog {
                .p-dialog-content {
                    padding-top: 20px;
                    background: var(--surface-ground);
                }

               h3 {
                    font-size: 1.25em ;

                    @media (max-width: 600px) {
                        font-size: 1em !important;
                    }
                }

                div[pfocustrap]{
                    max-height: 100%;
                    height: 100%;
                    border-radius: 0;
                    width: 100% !important;
                }
            }
            .p-datatable-table-container {
                border-radius: 5px;
            }
            .green .p-progressbar .p-progressbar-value {
                background: var(--chart-green);
            }
            .red .p-progressbar .p-progressbar-value {
                background: var(--chart-red);
            }
            .yellow .p-progressbar .p-progressbar-value {
                background: var(--chart-yellow);
            }
            #chart-container {
            }
            .e_chart {
                position: relative;
                height: 400px;
                width: 500px;
                overflow: hidden;
            }
            .p-progressspinner-circle {
                stroke: var(--grid-stroke) !important;
            }
            .custom_height .p-select-list-container {
                max-height: 9rem !important;
            }
            .btn_header .p-button {
                width: 10rem;
            }
            .btn_header_group .p-button {
                width: 18rem;
            }
        }
        :host {
            .box {
                padding: 0.5rem;
                border-radius: 5px;
                width: 100%;
                text-align: center;
            }
        }
    `
})
export class TMPPlan implements OnInit {
    //, OnDestroy
     private unsubscribe$ = new Subject<void>();
    private apiService = inject(TPMService);
    loading: boolean = false;
    records!: number;
    dataFactory!: any;
    dataLine!: any;
    flagDataLine: boolean = true;
    factory!: any;
    corpFac!: any;
    corpFilterValue: string | null = null;
    storage!: SelectItem[];
    storageFilterValue: string | null = null;
    flagLoad: boolean = false;
    visible: boolean = false;
    nameFactory: string = '';
    nameCorp: string = '';
    idFactory: string = '';
    idCorp: string = '';
    nameGroupLine: string = '';

    visible_add: boolean = false;
    visible_addLine: boolean = false;
    visible_addGroupLine: boolean = false;
    myForm!: FormGroup;
    addLineForm!: FormGroup;
    addGroupLineForm!: FormGroup;

    clonedProducts: { [s: string]: any } = {};

    constructor(
        public global_sv: GlobalsService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService
    ) {
        this.optionLanguage = this.global_sv.getLangue();
    }
    valLanguage: any;
    optionLanguage: LanguageType = 'LANG_EN';
    ngOnInit(): void {
        this.valLanguage = this.global_sv.getValLanguage();

        if (this.valLanguage === null) {
            this.global_sv._valLanguage$.subscribe((data) => {
                this.valLanguage = data;
                this.reloadPage();
            });
        } else {
            this.reloadPage();
        }
    }

    reloadPage() {
        this.dataFactory = null;
        this.myForm = this.fb.group({
            corpValue: [null, [ValidateNotNull]],
            storageValue: [null, [ValidateNotNull]]
        });
        this.addLineForm = this.fb.group({
            inputTitleLine: [null, [ValidateNotNull]]
        });
        this.addGroupLineForm = this.fb.group({
            inputTitleGroupLine: [null, [ValidateNotNull]],
            dateStartGroupLine: [null, [ValidateNotNull]],
            dateEndGroupLine: [null, [ValidateNotNull]]
        });
        this.loadListFilter();
    }

    showDialog(idCorp: string, idFac: string, dataChart: any) {
        this.nameFactory = this.getTitleName(this.factory, idFac);
        this.idFactory = idFac;
        this.nameCorp = this.getTitleName(this.corpFac, idCorp);
        this.idCorp = idCorp;
        const param: any = { corp: idCorp, factory: idFac };
        this.getTpmPlanLine(param, dataChart);
        this.visible = true;
    }

    showDialog_add() {
        this.visible_add = true;
    }

    saveCreateTMP(form: FormGroup) {
        if (form.valid) {
            let param = {
                corp: form.value.corpValue,
                factory: form.value.storageValue
            };

            this.apiService.saveTpmPlan(param).subscribe(
                (response) => {
                    if (response !== null && response !== undefined) {
                        if (response.indexOf('Error updating') < 0 && this.global_sv.isValidJsonString(response)) {
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'TPM Line created successfully !', key: 'tl', life: 3000 });
                            this.visible_add = false;
                            this.ngOnInit();
                        } else {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'TPM Line created failure, can exist corp & fac !', key: 'tl', life: 3000 });
                        }
                    }
                },
                (error) => {
                    console.error('Error handleChangeCorp:', error);
                }
            );
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select Corp & Factory !', key: 'tl', life: 3000 });
        }
    }

    saveDeleteTMP(param: any) {
        this.apiService.delTpmPlan(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    // this.global_sv.isValidJsonString(response)
                    if (response.corp === param.corp && response.factory === param.factory) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'PM Line Delete successfully ! !' });
                        this.visible_add = false;
                        this.ngOnInit();
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'TPM Line Delete failure !' });
                    }
                }
            },
            (error) => {
                console.error('Error handleChangeCorp:', error);
            }
        );
    }

    confirmDelete(event: Event, param: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Do you want to delete this record? Corp: ${this.getTitleName(this.corpFac, param.corp)}, Fac: ${this.getTitleName(this.factory, param.factory)} !`,
            header: 'Delete TMP Plan',
            icon: 'pi pi-trash',
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
                this.saveDeleteTMP(param);
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }

    CreateTpmPlan_line(form: FormGroup) {
        if (form.valid) {
            if (this.dataLine === null) {
                const paramAdd = {
                    factory: this.idFactory,
                    plan_grp: form.value.inputTitleLine,
                    dataLine: [],
                    processing: 0,
                    color: ''
                };
                this.dataLine = [paramAdd];
            } else {
                const paramAdd = {
                    factory: this.dataLine[0].factory,
                    plan_grp: form.value.inputTitleLine,
                    dataLine: [],
                    processing: 0,
                    color: ''
                };
                this.dataLine.unshift(paramAdd);
            }

            this.visible_addLine = false;
            this.addLineForm.reset();
            this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Message Content, Please press Save button to save', key: 'tl', life: 3000 });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter Title Line !', key: 'tl', life: 3000 });
        }
    }

    dialogCreateTMPLine(form: FormGroup) {
        this.visible_addLine = true;
    }

    saveCreateTpmPlan_line() {
        let paramSave: any = [];
        this.dataLine.forEach((element: any) => {
            if (element.dataLine.length > 0) {
                element.dataLine.forEach((eleChild: any) => {
                    const paramChild = {
                        factory: element.factory,
                        plan_grp: element.plan_grp,
                        line_cd: eleChild.value,
                        end_dt: eleChild.end_dt !== '' && eleChild.end_dt !== null ? this.global_sv.formatDateSave(eleChild.end_dt) : '',
                        plan_dt: eleChild.plan_dt !== '' && eleChild.plan_dt !== null ? this.global_sv.formatDateSave(eleChild.plan_dt) : ''
                    };
                    paramSave.push(paramChild);
                });
            } else {
                const paramChild = {
                    factory: element.factory,
                    plan_grp: element.plan_grp,
                    line_cd: '',
                    end_dt: '',
                    plan_dt: ''
                };
                paramSave.push(paramChild);
            }
        });

        const param = { ds_data: paramSave, factory: this.idFactory };

        this.apiService.saveCreateTpmPlan_line(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    if (response.indexOf('Error updating') < 0 && this.global_sv.isValidJsonString(response)) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'TPM Line Save successfully !', key: 'tl', life: 3000 });
                        this.ngOnInit();
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'TPM Line Save failure, Line name already exists please remove and recreate Line name!', key: 'tl', life: 3000 });
                    }
                }
            },
            (error) => {
                console.error('Error handleChangeCorp:', error);
            }
        );
    }

    dialogCreateTMPGroupLine(dataGroupLine: any) {
        this.nameGroupLine = dataGroupLine.plan_grp;
        this.visible_addGroupLine = true;
    }

    CreateTpmPlan_Groupline(form: FormGroup) {
        if (form.valid) {
            const paramAdd = {
                id: this.idFactory + form.value.inputTitleGroupLine,
                value: form.value.inputTitleGroupLine,
                plan_dt: form.value.dateStartGroupLine,
                end_dt: form.value.dateEndGroupLine
            };

            this.dataLine.forEach((ele: any) => {
                if (ele.plan_grp === this.nameGroupLine) {
                    ele.dataLine.unshift(paramAdd);
                }
            });

            this.visible_addGroupLine = false;
            this.addGroupLineForm.reset();
            this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Message Content, Please press Save button to save', key: 'tl', life: 3000 });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter Title Line !', key: 'tl', life: 3000 });
        }
    }

    onRowEditInit(dataGroupLine: any) {
        this.clonedProducts[dataGroupLine.id as string] = { ...dataGroupLine };
    }

    onRowEditSave(dataGroupLine: any) {
        // if (dataGroupLine.price > 0) {
        delete this.clonedProducts[dataGroupLine.id as string];
        //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
        // } else {
        //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
        // }
    }

    onRowEditCancel(dataGroupLine: any, index: number) {
        // this.dataGroupLine[index] = this.clonedProducts[dataGroupLine.id as string];
        delete this.clonedProducts[dataGroupLine.id as string];
    }
    onRowDeleteLine(dataGroupLine: any, plan_grp: string) {
        let deleteGroupLine = this.dataLine.map((parent: any) => {
            if (parent.plan_grp === plan_grp) {
                return {
                    ...parent,
                    dataLine: parent.dataLine.filter((child: any) => child.value !== dataGroupLine.value)
                };
            }
            return {
                ...parent
            };
        });
        this.dataLine = deleteGroupLine;
    }

    deleteTpmPlan_line(dataLineDelete: any) {
        this.dataLine = this.dataLine.filter((item: any) => item.plan_grp !== dataLineDelete.plan_grp);
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Message Content,Please press Save button to save', key: 'tl', life: 3000 });
    }

    loadListFilter(): void {
        forkJoin({
            factory: this.global_sv.getLctFactory(),
            corp: this.global_sv.getCorp(),
            dataFactory: this.apiService.selectTpmPlan(),
            storage: this.global_sv.getStorage('')
        })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (responses) => {
                    if (responses.factory !== null && responses.factory !== undefined) {
                        this.factory = responses.factory
                            .filter((item: any) => item.comm_nm !== '')
                            .map((item: any) => ({
                                label: item.comm_nm,
                                value: item.comm_cd
                            }));
                    }
                    if (responses.corp !== null && responses.corp !== undefined) {
                        this.corpFac = responses.corp.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    }

                    if (responses.dataFactory !== undefined && responses.dataFactory !== null) {
                        let dataChart: any = this.formatCreateDataLine(responses.dataFactory);
                        dataChart.sort(function (a: any, b: any) {
                            return a.factory.localeCompare(b.factory);
                        });
                        this.dataFactory = dataChart;
                    }

                    if (responses.storage !== null && responses.storage !== undefined) {
                        this.storage = responses.storage.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    }
                },
                (error) => {
                    console.error('Error loading filter lists:', error);
                }
            );
    }

    loadListAfter(): void {
        this.apiService
            .selectTpmPlan()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (responses) => {
                    if (responses !== undefined && responses !== null) {
                        let dataChart: any = this.formatCreateDataLine(responses.dataFactory);
                        dataChart.sort(function (a: any, b: any) {
                            return a.factory.localeCompare(b.factory);
                        });
                        this.dataFactory = dataChart;
                    }
                },
                (error) => {
                    console.error('Error loading filter lists:', error);
                }
            );
    }

    handleChangeCorp(event: any): void {
        this.global_sv.getStorage(event.value).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.storage = response.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                }
            },
            (error) => {
                console.error('Error handleChangeCorp:', error);
            }
        );
    }

    getTpmPlanLine(param: any, dataChart: any): void {
        this.loading = true;
        this.flagDataLine = true;
        this.apiService
            .getTpmPlanLine(param)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (response) => {
                    // Handle response
                    if (response !== undefined && response !== null && response.ds_group.length > 0) {
                        let data: any = this.formatCreateDataLineChild(response);
                        dataChart.forEach((ele: any) => {
                            data.forEach((eleChild: any, index: number) => {
                                if (ele.name === eleChild.plan_grp) {
                                    data[index]['processing'] = ele.value;
                                    data[index]['color'] = ele.color;
                                }
                            });
                        });
                        this.dataLine = data;
                    } else {
                        this.dataLine = null;
                    }
                    this.flagDataLine = false;
                    this.loading = false;
                },
                (error) => {
                    console.error('Error getTpmPlanLine:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load TPM Plan Line data!',
                        key: 'tl',
                        life: 3000
                    });
                    this.flagDataLine = false;
                    this.loading = false;
                    this.dataLine = null;
                }
            );
    }

    formatCreateDataLine(response: any): any {
        let dataChart: any = response.ds_fact;
        const ds_grp: any = response.ds_grp;

        dataChart.forEach((ele: any, index: number) => {
            let dataValue: any = [];
            ds_grp.forEach((eleChild: any) => {
                if (ele.factory === eleChild.factory) {
                    if (eleChild.plan_rt < 81 && eleChild.plan_rt > 50) {
                        dataValue.push({
                            value: eleChild.plan_rt,
                            name: eleChild.plan_grp,
                            color: 'yellow'
                        });
                    } else if (eleChild.plan_rt <= 50) {
                        dataValue.push({
                            value: eleChild.plan_rt,
                            name: eleChild.plan_grp,
                            color: 'red'
                        });
                    } else {
                        dataValue.push({
                            value: eleChild.plan_rt,
                            name: eleChild.plan_grp,
                            color: 'green'
                        });
                    }
                }
            });
            dataChart[index]['dataChart'] = dataValue;
        });
        return dataChart;
    }

    formatCreateDataLineChild(response: any): any {
        let dataLineChild: any = response.ds_group;
        const ds_grp: any = response.ds_line;

        dataLineChild.forEach((ele: any, index: number) => {
            let dataValue: any = [];
            ds_grp.forEach((eleChild: any, indexChild: number) => {
                if (ele.plan_grp === eleChild.plan_grp) {
                    let plan_date!: Date;
                    if (eleChild.plan_dt !== null || eleChild.plan_dt === undefined) {
                        plan_date = new Date(this.global_sv.checkDate(eleChild.plan_dt));
                    }
                    let end_date!: Date;
                    if (eleChild.end_dt !== null || eleChild.end_dt === undefined) {
                        end_date = new Date(this.global_sv.checkDate(eleChild.end_dt));
                    }
                    dataValue.push({
                        id: 'a' + index + indexChild,
                        value: eleChild.line_cd,
                        plan_dt: eleChild.plan_dt === '' ? null : plan_date,
                        end_dt: eleChild.end_dt === '' ? null : end_date
                    });
                }
            });
            dataLineChild[index]['dataLine'] = dataValue;
        });
        return dataLineChild;
    }

    getTitleName(list: any, code: string): string {
        let name = '';
        list.forEach((ele: any) => {
            if (ele.value === code) {
                name = ele.label;
            }
        });
        return name;
    }

    ngAfterContentChecked(): void {
        // Perform actions after the component's view and its child views have been checked
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
