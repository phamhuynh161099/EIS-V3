import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { forkJoin } from 'rxjs';

import { MessageService, SortEvent } from 'primeng/api';
import { LanguageType } from '../../../../constants/constants.auth';
import { GlobalsService } from '../../../../globals.service';
import { TPMScheduleService } from './tpm_schedule.service';
interface Column {
    type: 'Text' | "Date" | "Number" | "Option" | "Null" | 'MultiSelect';
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    providers: [MessageService],
    imports: [ToastModule, FloatLabel, MultiSelectModule, IconFieldModule, TagModule, InputIconModule, InputTextModule, TableModule, ButtonModule, SelectModule, FormsModule, InputGroupModule, InputGroupAddonModule, DatePickerModule, RadioButtonModule, CommonModule],
    selector: 'app-location-history_report',
    template: `
        <section class="flex flex-col min-h-full w-full">
            <p-toast [showTransitionOptions]="'250ms'" [showTransformOptions]="'translateX(100%)'" [hideTransitionOptions]="'150ms'" [hideTransformOptions]="'translateX(100%)'" />
            <div class="header-title">
                <div class="flex flex-col sm:flex-row justify-between items-center mb-3 xl:mb-0">
                    <h2 class="text-2xl sm:text-3xl mr-auto">{{this.valLanguage.TPMSchedule[this.optionLanguage]}}</h2>
                    <div class="flex gap-2 *:w-[120px] *:*:w-full ml-auto">
                        <p-button [outlined]="true" icon="pi pi-search" [label]="this.valLanguage.btn_Search[this.optionLanguage]" (click)="onSearch()" severity="info" />
                        <p-button [outlined]="true" icon="pi pi-filter-slash" class="!w-32 *:!w-32" [label]="this.valLanguage.btn_Clear[this.optionLanguage]" (click)="onClearSearch()" severity="secondary" />
                    </div>
                </div>
            <div class="grid grid-cols-1 md:grid-cols-3 rounded justify-around gap-5 *:space-y-7 *:mt-2 box p-5 header-border-filter">
                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <input inputId="as_no_label" type="text" pInputText [(ngModel)]="selectedAs_nos" class="w-full" />
                        <label for="as_no_label">{{this.valLanguage.grid_Asset_No[this.optionLanguage]}} </label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="corp_label" class="w-full" [loading]="loading" (onChange)="onChangeCorp()" [(ngModel)]="selectedCorp" [options]="corps" [showClear]="true">
                            <ng-template let-option #item>
                                <p-tag [value]="option.label" class="w-full !py-2" [severity]="global_sv.getCorpColor(option.label)" />
                            </ng-template>
                        </p-select>
                        <label for="corp_label">{{this.valLanguage.grid_Corp[this.optionLanguage]}}</label>
                    </p-floatlabel>
                </div>

                <div>
                    <p-floatlabel *ngIf="!visible" class="max-w-sm mx-auto flex-1">
                        <p-inputgroup inputId="material_label">
                            <input type="text" pInputText [(ngModel)]="selectedMt_cd" />
                            <p-inputgroup-addon (click)="toggleMtl()" label="Show"><p-button icon="pi pi-plus" /></p-inputgroup-addon>
                        </p-inputgroup>
                        <label for="material_label">{{this.valLanguage.grid_Material[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <div *ngIf="visible" class="flex max-w-sm mx-auto gap-2 items-center">
                        <p-floatlabel class="max-w-sm mx-auto flex-1">
                            <input class="!max-w-[154px]" type="text" pInputText [(ngModel)]="selectedMt_cd1" />
                            <label for="material_label1">{{this.valLanguage.grid_Material[this.optionLanguage]}} 1</label>
                        </p-floatlabel>
                        <i class="pi pi-arrows-h" style="font-size: 1rem"></i>
                        <p-floatlabel class="max-w-sm mx-auto flex-1">
                            <p-inputgroup inputId="material2_label">
                                <input class="!max-w-[154px]" type="text" pInputText [(ngModel)]="selectedMt_cd2" />
                                <p-inputgroup-addon (click)="toggleMtl()" label="Show"><p-button icon="pi pi-minus" /></p-inputgroup-addon>
                            </p-inputgroup>
                            <label for="material2_label">{{this.valLanguage.grid_Material[this.optionLanguage]}} 2</label>
                        </p-floatlabel>
                    </div>

                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="storages_label" [options]="storages" [loading]="loadingStorage" [emptyMessage]="this.valLanguage.select_Corp_emptyMessage[this.optionLanguage]" [(ngModel)]="selectedStorage" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="storages_label">{{this.valLanguage.grid_Storage[this.optionLanguage]}}</label>
                    </p-floatlabel>
                </div>

                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="status_label" [options]="status" [(ngModel)]="selectedStatus" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" [severity]="global_sv.getStatusColor(option.label)" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="status_label">{{this.valLanguage.grid_Status[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="manufacturer_label" (onChange)="onChangeManufacturer()" [options]="manufacturers" [(ngModel)]="selectedManufacturer" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="manufacturer_label">{{this.valLanguage.grid_Manufacturer[this.optionLanguage]}}</label>
                    </p-floatlabel>
                </div>

                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <input inputId="barcode_label" type="text" pInputText [(ngModel)]="selectedBarcode" class="w-full" />
                        <label for="barcode_label">{{this.valLanguage.grid_Barcode[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="model_label" [options]="models" [emptyMessage]="this.valLanguage.select_Manufacturer_emptyMessage[this.optionLanguage]" [(ngModel)]="selectedModel" [loading]="loadingModel" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="model_label">{{this.valLanguage.grid_Model[this.optionLanguage]}}</label>
                    </p-floatlabel>
                </div>
            </div>
        </div>
        <section class="card-2 p-[5px] md:p-[20px] flex-1]">
            <p-table class="table_minheight" #dt1 [scrollable]="true" scrollHeight="300px" virtualScrollItemSize="300" [loading]="loadingTable" [columns]="cols"
                [value]="data" [paginator]="true" [rows]="50" [showCurrentPageReport]="true" exportFilename="TPM Schedule" [exportHeader]="'customExportHeader'"
                [tableStyle]="{ 'min-width': '50rem' }" (sortFunction)="customSort($event)" [customSort]="true" [totalRecords]="totalRecords"
                [showCurrentPageReport]="true" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" [first]="first"
                [rowsPerPageOptions]="[50, 100, 200, 500 ,1000]">
                <ng-template #caption>
                <div class="flex justify-between *:text-nowrap overflow-x-auto gap-x-4 py-2">
                        <div class="flex gap-x-4">
                            <p-button class="" [label]="this.valLanguage.btn_ClearFilter[this.optionLanguage]" [outlined]="true" icon="pi pi-filter-slash" (click)="onClearTable(dt1)" />
                            <p-button [outlined]="true" [icon]="isVisible ? 'pi pi-unlock' : 'pi pi-lock-open'" class="text-nowrap" [label]="this.valLanguage.btn_ShowFilter[optionLanguage]" (click)="showFilter()"></p-button>
                            <p-button [outlined]="true" icon="pi pi-file-excel" [label]="this.valLanguage.btn_Export[this.optionLanguage]" (click)="exportToExcel()"/>
                        </div>
                        <p-button [outlined]="true" icon="pi pi-filter-slash" class="text-nowrap" label="{{this.valLanguage.btn_Clear_All[this.optionLanguage]}}" (click)="onClearAllSearch()" severity="warn" />
                    </div>
                </ng-template>
                <ng-template #header pTemplate="header">
                    <tr>
                        <th></th>
                        <th *ngFor="let header of cols" [pSortableColumn]="header.field" class="sortable-header cursor-pointer">
                            <div class="header-content">
                                <span>{{header.header}}</span>
                                <p-sortIcon [field]="header.field" />
                            </div>
                        </th>
                    </tr>
                    <tr [hidden]="isVisible">
                            <!-- <th pFrozenColumn></th> -->
                            <th></th>
                            @for (col of cols; track col.field) {
                                @if (col.type == 'Text') {
                                    <th><p-columnFilter type="text" matchMode="contains" [field]="col.field" [placeholder]="loading ? 'Loading...Please wait!' : 'Type to search'" ariaLabel="Filter Name" filterOn="input"></p-columnFilter></th>
                                } @else if (col.type == 'Number') {
                                    <th><p-columnFilter type="numeric" [field]="col.field" [placeholder]="loading ? 'Loading...Please wait!' : 'Type to search'" ariaLabel="Filter Name" filterOn="input"></p-columnFilter></th>
                                } @else if (col.type == 'Date') {
                                    <th>
                                        <div class="flex justify-center item-center">
                                            <label class="w-32 opacity-55 self-center">Search By Date:</label>
                                            <p-columnFilter type="date" [field]="col.field" display="menu" [showMatchModes]="true" [showOperator]="false" [showAddButton]="true">
                                                <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                                    <p-datepicker #calendar [ngModel]="value" (onSelect)="filter(calendar.value)" (onInput)="setup(calendar.value, col.field)" [showButtonBar]="true" [placeholder]="loading ? 'Loading...Please wait!' : 'yyyy-MM-DD'" [disabled]="loading" dateFormat="yy-mm-dd">
                                                    </p-datepicker>
                                                </ng-template>
                                            </p-columnFilter>
                                        </div>
                                    </th>
                                } @else if (col.type == 'MultiSelect') {
                                    <th>
                                        <p-columnFilter [field]="col.field" matchMode="in" [showMenu]="false" [showClearButton]="false">
                                            <ng-template #filter let-value let-filter="filterCallback">
                                                @if (col.field == 'corp_nm') {
                                                    <p-multiselect [options]="listOption[col.field]" variant="outlined" [showToggleAll]="false" [selectAll]="selectAllCorpTable" [(ngModel)]="corpTableFilterValue" (onChange)="filter(corpTableFilterValue)" optionLabel="label" [loading]="loading" optionValue="label" [virtualScroll]="true" [virtualScrollItemSize]="30" [filter]="false" class="multiselect-custom-virtual-scroll max-w-full min-w-32" placeholder="Select Multiple" (onSelectAllChange)="onSelectAllChangeTable($event, 'corp_nm')" [maxSelectedLabels]="2" styleClass="w-full" #ms_corp_nm>
                                                        <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                                            <i class="pi pi-check" *ngIf="allSelected"></i>
                                                            <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                                        </ng-template>
                                                    </p-multiselect>
                                                }
                                                @if (col.field == 'factory_nm') {
                                                    <p-multiselect [options]="listOption[col.field]" variant="outlined" [showToggleAll]="true" [selectAll]="selectAllFactoryNmTable" [(ngModel)]="factoryNmTableFilterValue" (onChange)="filter(factoryNmTableFilterValue)" optionLabel="label" [loading]="loading" optionValue="label" [virtualScroll]="true" [virtualScrollItemSize]="30" [filter]="true" class="multiselect-custom-virtual-scroll max-w-full min-w-56" placeholder="Select Multiple" (onSelectAllChange)="onSelectAllChangeTable($event, 'factory_nm')" [maxSelectedLabels]="2" styleClass="w-full" #ms_factory_nm>
                                                        <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                                            <i class="pi pi-check" *ngIf="allSelected"></i>
                                                            <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                                        </ng-template>
                                                    </p-multiselect>
                                                }
                                                @if (col.field == 'lct_nm') {
                                                    <p-multiselect [options]="listOption[col.field]" variant="outlined" [showToggleAll]="true" [selectAll]="selectAllLctNmTable" [(ngModel)]="lctNmTableFilterValue" (onChange)="filter(lctNmTableFilterValue)" optionLabel="label" [loading]="loading" optionValue="label" [virtualScroll]="true" [virtualScrollItemSize]="30" [filter]="true" class="multiselect-custom-virtual-scroll max-w-full min-w-56" placeholder="Select Multiple" (onSelectAllChange)="onSelectAllChangeTable($event, 'lct_nm')" [maxSelectedLabels]="2" styleClass="w-full" #ms_lct_nm>
                                                        <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                                            <i class="pi pi-check" *ngIf="allSelected"></i>
                                                            <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                                        </ng-template>
                                                    </p-multiselect>
                                                }
                                                @if (col.field == 'mf_nm') {
                                                    <p-multiselect [options]="listOption[col.field]" variant="outlined" [showToggleAll]="true" [selectAll]="selectAllMfNmTable" [(ngModel)]="mfNmTableFilterValue" (onChange)="filter(mfNmTableFilterValue)" optionLabel="label" [loading]="loading" optionValue="label" [virtualScroll]="true" [virtualScrollItemSize]="30" [filter]="true" class="multiselect-custom-virtual-scroll max-w-full min-w-32" placeholder="Select Multiple" (onSelectAllChange)="onSelectAllChangeTable($event, 'md_cd')" [maxSelectedLabels]="2" styleClass="w-full" #ms_md_cd>
                                                        <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                                            <i class="pi pi-check" *ngIf="allSelected"></i>
                                                            <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                                        </ng-template>
                                                    </p-multiselect>
                                                }
                                                @if (col.field == 'md_cd') {
                                                    <p-multiselect [options]="listOption[col.field]" variant="outlined" [showToggleAll]="true" [selectAll]="selectAllMdCdTable" [(ngModel)]="mdCdTableFilterValue" (onChange)="filter(mdCdTableFilterValue)" optionLabel="label" [loading]="loading" optionValue="label" [virtualScroll]="true" [virtualScrollItemSize]="30" [filter]="true" class="multiselect-custom-virtual-scroll max-w-full min-w-72" placeholder="Select Multiple" (onSelectAllChange)="onSelectAllChangeTable($event, 'md_cd')" [maxSelectedLabels]="2" styleClass="w-full" #ms_md_cd>
                                                        <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                                            <i class="pi pi-check" *ngIf="allSelected"></i>
                                                            <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                                        </ng-template>
                                                    </p-multiselect>
                                                }
                                                @if (col.field == 'sts_nm') {
                                                    <p-multiselect [options]="listOption[col.field]" variant="outlined" [showToggleAll]="false" [selectAll]="selectAllStsNmTable" [(ngModel)]="stsNmTableFilterValue" (onChange)="filter(stsNmTableFilterValue)" optionLabel="label" [loading]="loading" optionValue="label" [virtualScroll]="true" [virtualScrollItemSize]="30" [filter]="false" class="multiselect-custom-virtual-scroll max-w-full min-w-32" placeholder="Select Multiple" (onSelectAllChange)="onSelectAllChangeTable($event, 'sts_nm')" [maxSelectedLabels]="2" styleClass="w-full" #ms_sts_nm>
                                                        <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                                            <i class="pi pi-check" *ngIf="allSelected"></i>
                                                            <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                                        </ng-template>
                                                    </p-multiselect>
                                                }
                                            </ng-template>
                                        </p-columnFilter>
                                    </th>
                                } @else {
                                    <th>
                                    </th>
                                }
                            }
                        </tr>
                </ng-template>
                <ng-template #body let-item let-i="rowIndex" pTemplate="body">
                    <tr [ngClass]="{
                                            'even-row': i % 2 === 0,
                                            'odd-row': i % 2 === 1,
                                            'selected-row': selectedRow === i,
                                            'clickable-row': true
                                        }"
                                        (click)="onRowClick(item.as_no, i)">
                        <td aria-describedby="list_rn">{{ i + 1 }}</td>
                        <td aria-describedby="list_corp_nm"><p-tag [value]="item.corp_nm" class="w-full !py-2" [severity]="global_sv.getCorpColor(item.corp_nm)" /></td>
                        <td aria-describedby="list_factory_nm" class="text-nowrap">{{ item.factory_nm }}</td>
                        <td aria-describedby="list_lct_nm" class="text-nowrap">{{ item.lct_nm }}</td>
                        <td aria-describedby="list_as_no" class="text-nowrap">{{ item.as_no }}</td>
                        <td aria-describedby="list_mt_cd" class="text-nowrap">{{ item.mt_cd }}</td>
                        <td aria-describedby="list_mt_nm" class="text-nowrap">{{ item.mt_nm }}</td>
                        <td aria-describedby="list_mf_nm" class="text-nowrap">{{ item.mf_nm }}</td>
                        <td aria-describedby="list_md_cd" class="text-nowrap">{{ item.md_cd }}</td>
                        <td aria-describedby="list_sp_nm" class="text-nowrap">{{ item.sp_nm }}</td>
                        <td aria-describedby="list_sts_nm" class="text-nowrap"><p-tag [value]="item.sts_nm" *ngIf="item.sts_nm != ''" class="w-full !py-2" [severity]="global_sv.getStatusColor(item.sts_nm)" /></td>
                        <td aria-describedby="list_srl_no" class="text-nowrap">{{ item.srl_no }}</td>
                        <td aria-describedby="list_puchs_dt_ymd" class="text-nowrap">{{ item.puchs_dt_ymd | date: 'yyyy/MM/dd'}}</td>
                        <td aria-describedby="list_mgm_dept_nm" class="text-nowrap">{{ item.mgm_dept_nm }}</td>
                        <td aria-describedby="list_cost_dept_nm" class="text-nowrap">{{ item.cost_dept_nm }}</td>
                        <td aria-describedby="list_barcode " class="text-nowrap">{{ item.barcode }}</td>
                        <td aria-describedby="list_reg_nm" class="text-nowrap">{{ item.reg_nm }}</td>
                        <td aria-describedby="list_reg_dt_ymd" class="text-nowrap">{{ item.reg_dt_ymd | date: 'yyyy/MM/dd HH:mm:ss'}}</td>
                        <td aria-describedby="list_chg_nm" class="text-nowrap">{{ item.chg_nm }}</td>
                        <td aria-describedby="list_chg_dt_ymd" class="text-nowrap">{{ item.chg_dt_ymd | date: 'yyyy/MM/dd HH:mm:ss'}}</td>
                    </tr>
                </ng-template>
            </p-table>
        </section>

        <section class="card-2 p-[5px] md:p-[20px] flex-1]">
            <p-table #dt2 [scrollable]="true" scrollHeight="600px" virtualScrollItemSize="600" [loading]="loadingDataTable2" [columns]="cols"
                [value]="dataTable2" [paginator]="true" [rows]="50" [showCurrentPageReport]="true" exportFilename="TPM Schedule" [exportHeader]="'customExportHeader'"
                [tableStyle]="{ 'min-width': '50rem' }" (sortFunction)="customSort2($event)" [customSort]="true" [totalRecords]="totalRecordsTable2"
                [showCurrentPageReport]="true" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" [first]="first"
                [rowsPerPageOptions]="[50, 100, 200, 500 ,1000]">
                <ng-template #caption>
                    <div class="pb-4 font-bold text-xl">
                        {{this.valLanguage.TPM_Schedule_Look_Save[this.optionLanguage]}}
                    </div>
                    <div class="flex gap-4">
                        <p-button class="" [label]="this.valLanguage.btn_ClearFilter[this.optionLanguage]" [outlined]="true" icon="pi pi-filter-slash" (click)="onClearTable(dt2)" />
                        <p-button [outlined]="true" [icon]="isVisible2 ? 'pi pi-unlock' : 'pi pi-lock-open'" class="text-nowrap" [label]="this.valLanguage.btn_ShowFilter[optionLanguage]" (click)="showFilter2()"></p-button>
                    </div>
                </ng-template>
                <ng-template #header pTemplate="header">
                    <tr>
                        <th></th>
                        <th *ngFor="let header of colsTable2" [pSortableColumn]="header.field" class="sortable-header cursor-pointer">
                            <div class="header-content">
                                <span>{{header.header}}</span>
                                <p-sortIcon [field]="header.field" />
                            </div>
                        </th>
                    </tr>
                    <tr [hidden]="isVisible2">
                            <!-- <th pFrozenColumn></th> -->
                            <th></th>
                            <th>
                                <p-columnFilter type="text" field="tc_cd" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="tc_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="tpm_cyle2" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th class="flex justify-center items-center">
                                <label class="w-32 opacity-55">Search By Date:</label>
                                <p-columnFilter type="date" field="start_dt_ymd" display="menu" [showMatchModes]="true" [showOperator]="false" [showAddButton]="true">
                                    <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                        <p-datepicker [disabled]="loading" [placeholder]="loading ? 'Loading...Please wait!' : 'yyyy-MM-DD'" #calendar [ngModel]="value" (onSelect)="filter(calendar.value)" (onInput)="setup(calendar.value, 'start_dt_ymd')" [showButtonBar]="true" placeholder="Registration Date" dateFormat="yy-mm-dd">
                                        </p-datepicker>
                                    </ng-template>
                                </p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="tc_due_id" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="ltc_due_cd" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="mgr_due_id" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="reg_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th class="flex justify-center items-center">
                                <label class="w-32 opacity-55">Search By Date:</label>
                                <p-columnFilter type="date" field="reg_dt_ymd" display="menu" [showMatchModes]="true" [showOperator]="false" [showAddButton]="true">
                                    <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                        <p-datepicker [disabled]="loading" [placeholder]="loading ? 'Loading...Please wait!' : 'yyyy-MM-DD'" #calendar [ngModel]="value" (onSelect)="filter(calendar.value)" (onInput)="setup(calendar.value, 'reg_dt_ymd')" [showButtonBar]="true" placeholder="Registration Date" dateFormat="yy-mm-dd">
                                        </p-datepicker>
                                    </ng-template>
                                </p-columnFilter>
                            </th>
                            <th>
                                <p-columnFilter type="text" field="chg_nm" placeholder="Type to search" ariaLabel="Filter Name" filterOn="input"></p-columnFilter>
                            </th>
                            <th class="flex justify-center items-center">
                                <label class="w-32 opacity-55">Search By Date:</label>
                                <p-columnFilter type="date" field="chg_dt_ymd" display="menu" [showMatchModes]="true" [showOperator]="false" [showAddButton]="true">
                                    <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                        <p-datepicker [disabled]="loading" [placeholder]="loading ? 'Loading...Please wait!' : 'yyyy-MM-DD'" #calendar [ngModel]="value" (onSelect)="filter(calendar.value)" (onInput)="setup(calendar.value, 'chg_dt_ymd')" [showButtonBar]="true" placeholder="Registration Date" dateFormat="yy-mm-dd">
                                        </p-datepicker>
                                    </ng-template>
                                </p-columnFilter>
                            </th>
                        </tr>
                </ng-template>
                <ng-template #body let-item let-i="rowIndex" pTemplate="body">
                    <tr [ngClass]="{
                                            'even-row': i % 2 === 0,
                                            'odd-row': i % 2 === 1,
                                            'selected-row': selectedRow === i,
                                            'clickable-row': true
                                        }"
                                        (click)="onRowClick(item.as_no, i)">
                        <td aria-describedby="list2_rn">{{ i + 1 }}</td>
                        <td aria-describedby="list2_tc_cd" class="text-nowrap">{{ item.tc_cd }}</td>
                        <td aria-describedby="list2_tc_nm" class="text-nowrap">{{ item.tc_nm }}</td>
                        <td aria-describedby="list2_tpm_cyle2" class="text-nowrap">{{ item.tpm_cyle2 }}</td>
                        <td aria-describedby="list2_start_dt_ymd" class="text-nowrap">{{ item.start_dt_ymd | date: 'yyyy/MM/dd HH:mm:ss'}}</td>
                        <td aria-describedby="list2_tc_due_id" class="text-nowrap">{{ item.tc_due_id }}</td>
                        <td aria-describedby="list2_ltc_due_cd" class="text-nowrap">{{ item.ltc_due_cd }}</td>
                        <td aria-describedby="list2_mgr_due_id" class="text-nowrap">{{ item.mgr_due_id }}</td>
                        <td aria-describedby="list2_reg_nm" class="text-nowrap">{{ item.reg_nm }}</td>
                        <td aria-describedby="list2_reg_dt_ymd" class="text-nowrap">{{ item.reg_dt_ymd | date: 'yyyy/MM/dd HH:mm:ss'}}</td>
                        <td aria-describedby="list2_chg_nm" class="text-nowrap">{{ item.chg_nm }}</td>
                        <td aria-describedby="list2_chg_dt_ymd" class="text-nowrap">{{ item.chg_dt_ymd | date: 'yyyy/MM/dd HH:mm:ss'}}</td>
                    </tr>
                </ng-template>
            </p-table>
        </section>

        <div class="card-2 p-[5px] pt-8 md:p-[15px]">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 md:pt-2 gap-5 *:space-y-7 *:mt-2">

                <div>
                    <div class="flex *:flex-1 max-w-lg mx-auto gap-3">
                        <p-floatlabel class="max-w-sm mx-auto">
                            <input inputId="code_label" type="text" pInputText [(ngModel)]="selectedCode" class="w-full" disabled />
                            <label for="code_label">{{this.valLanguage.grid_Code[this.optionLanguage]}}</label>
                        </p-floatlabel>
                        <p-floatlabel class="max-w-sm mx-auto">
                            <input inputId="name_label" type="text" pInputText [(ngModel)]="selectedName" class="w-full" disabled />
                            <label for="name_label">{{this.valLanguage.grid_Name[this.optionLanguage]}}</label>
                        </p-floatlabel>
                    </div>
                    <p-floatlabel class="max-w-lg mx-auto">
                        <p-select inputId="workplace_label" class="w-full" [loading]="loading" [filter]="true" filterBy="label" [(ngModel)]="selectedWorkplace" [options]="workplaces" [showClear]="true">
                            <ng-template let-option #item>
                                <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                            </ng-template>
                        </p-select>
                        <label for="workplace_label">{{this.valLanguage.grid_Workplace[this.optionLanguage]}}</label>
                    </p-floatlabel>
                </div>

                <div>
                    <div class="flex *:flex-1 max-w-lg mx-auto gap-3 *:shrink-0">
                        <p-floatlabel class="max-w-sm mx-auto">
                            <input inputId="schedule_label" type="text" pInputText [(ngModel)]="selectedSchedule" class="w-full" disabled />
                            <label for="schedule_label">{{this.valLanguage.grid_Schedule[this.optionLanguage]}}</label>
                        </p-floatlabel>
                            <p-floatlabel class="max-w-sm mx-auto">
                            <p-datepicker class="w-full *:w-full [&>span>div]:!left-[unset] [&>span>div]:!right-0"  inputId="startDate_label" [(ngModel)]="selectedStartDate" dateFormat="yy-mm-dd" />
                            <label for="startDate_label">{{this.valLanguage.grid_Start_Date[this.optionLanguage]}}</label>
                        </p-floatlabel>
                    </div>
                    <div class="flex *:flex-1 max-w-lg mx-auto gap-3">
                        <p-floatlabel class="max-w-sm mx-auto">
                            <input inputId="manager_label" type="text" pInputText [(ngModel)]="selectedManager" class="w-full"  />
                            <label for="manager_label">{{this.valLanguage.grid_Manager[this.optionLanguage]}}</label>
                        </p-floatlabel>
                        <p-floatlabel class="max-w-sm mx-auto">
                            <input inputId="managerName_label" type="text" pInputText [(ngModel)]="selectedManagerName" class="w-full" disabled />
                            <label for="managerName_label">{{this.valLanguage.grid_Manager_Name[this.optionLanguage]}}</label>
                        </p-floatlabel>
                    </div>
                </div>

                <div>
                    <div class="flex *:flex-1 max-w-lg mx-auto gap-3">
                        <p-floatlabel class="max-w-sm mx-auto">
                            <input inputId="worker_label" type="text" pInputText [(ngModel)]="selectedWorker" class="w-full"  />
                            <label for="worker_label">{{this.valLanguage.grid_Worker[this.optionLanguage]}}</label>
                        </p-floatlabel>
                        <p-floatlabel class="max-w-sm mx-auto">
                            <input inputId="workerName_label" type="text" pInputText [(ngModel)]="selectedWorkerName" class="w-full" />
                            <label for="workerName_label">{{this.valLanguage.grid_Worker_Name[this.optionLanguage]}}</label>
                        </p-floatlabel>
                    </div>

                    <p-button [outlined]="true" icon="pi pi-save" class="mx-auto xl:flex max-w-lg hidden w-full *:w-full" label="Save" (click)="show()" severity="success" />
                </div>

                <p-button [outlined]="true" icon="pi pi-save" class="w-full *:w-full max-w-lg mx-auto flex xl:hidden" label="Save" (click)="show()" severity="success" />
            </div>
        </div>

    </section>
    `,
    styles: [`
        ::ng-deep .p-datatable .p-datatable-thead > tr > th {
            font-weight: 600;
            font-size: 13px;
            padding: 12px 8px;
            vertical-align: top;
            border: 1px solid var(--surface-border, #e5e7eb);
        }

        ::ng-deep .p-select-label {
            align-self: center;
        }

        .header-content {
            text-wrap: nowrap;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 4px;
        }

        ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
            padding: 8px;
            font-size: 13px;
            border: 1px solid var(--surface-border, #e5e7eb);
        }

        ::ng-deep .p-datatable .p-datatable-thead > tr > .search_bg {
            background: var(--p-datatable-header-cell-selected-background);
        }

        :host ::ng-deep .date-left > .p-datepicker > .ng-trigger {
            right:0 !important;
            left:unset !important;
        }

        :host ::ng-deep #datepicker_style .p-datepicker{
            width: 100%;
            height: 100%;
        }

        :host ::ng-deep #multiselect p-iconfield > .p-inputtext,
        :host ::ng-deep p-columnfilterformelement
        {
            width: 100% !important;
        }

    `]
})


export class TPMSchedulePage implements OnInit {

    loading: boolean = false;
    loadingTable: boolean = false;
    loadingModel: boolean = false;
    loadingStorage: boolean = false;
    now = new Date();

    corps!: any[];
    manufacturers!: any[];
    storages!: any[];
    status!: any[];
    models!: any[];

    selectedMt_cd: string | null = null;
    selectedMt_cd1: string | null = null;
    selectedMt_cd2: string | null = null;
    selectedCorp: string | null = null;
    selectedAs_nos: string | null = null;
    selectedManufacturer: string | null = null;
    selectedMachine_nm: string | null = null;
    selectedStorage: string | null = null;
    selectedModel: string | null = null;
    selectedBarcode: string | null = null;
    selectedStatus: string | null = null;

    selectedCode: string | null = null;
    selectedName: string | null = null;
    selectedWorkplace: string | null = null;
    selectedSchedule: string | null = null;
    selectedManager: string | null = null;
    selectedStartDate: Date | null = new Date();
    selectedManagerName: string | null = null;
    selectedWorker: string | null = null;
    selectedWorkerName: string | null = null;

    workplaces!: any[];

    stateTableFilterValue: string | null = null;


    @ViewChild('ms') ms!: MultiSelect;

    visible: boolean = false;
    toggleMtl() {
        this.visible = !this.visible;
    }

    cols!: Column[];
    colsTable2!: Column[];
    exportColumns!: ExportColumn[];
    data!: any;
    initialValue!: any;
    rows = 50;
    first = 0;
    page: number = 1;
    totalRecords = 0;

    listOption!: any;

    constructor(private sv: TPMScheduleService, public global_sv: GlobalsService, private messageService: MessageService) {
        this.optionLanguage = this.global_sv.getLangue();
    }
    valLanguage: any;
    optionLanguage: LanguageType = "LANG_EN";
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
        this.loadData();

        this.cols = [
            { field: 'corp_nm', header: this.valLanguage.grid_Corp[this.optionLanguage], type: 'MultiSelect' },
            { field: 'factory_nm', header: this.valLanguage.grid_Storage[this.optionLanguage], type: 'MultiSelect' },
            { field: 'lct_nm', header: this.valLanguage.grid_Location[this.optionLanguage], type: 'MultiSelect' },
            { field: 'as_no', header: this.valLanguage.grid_Asset_No[this.optionLanguage], type: 'Text' },
            { field: 'mt_cd', header: this.valLanguage.grid_Machine_Code[this.optionLanguage], type: 'Text' },
            { field: 'mt_nm', header: this.valLanguage.grid_Machine_Description[this.optionLanguage], type: 'Text' },
            { field: 'mf_nm', header: this.valLanguage.grid_Manufacturer[this.optionLanguage], type: 'MultiSelect' },
            { field: 'md_cd', header: this.valLanguage.grid_Model_Code[this.optionLanguage], type: 'MultiSelect' },
            { field: 'sp_nm', header: this.valLanguage.grid_Supplier[this.optionLanguage], type: 'Text' },
            { field: 'sts_nm', header: this.valLanguage.grid_State[this.optionLanguage], type: 'MultiSelect' },
            { field: 'srl_no', header: this.valLanguage.grid_Serial_No[this.optionLanguage], type: 'Text' },
            { field: 'puchs_dt_ymd', header: this.valLanguage.grid_Purchased_Date[this.optionLanguage], type: 'Text' },
            { field: 'mgm_dept_nm', header: this.valLanguage.grid_Management_Dept[this.optionLanguage], type: 'Text' },
            { field: 'cost_dept_nm', header: this.valLanguage.grid_Cost_Dept[this.optionLanguage], type: 'Text' },
            { field: 'barcode', header: this.valLanguage.grid_Barcode[this.optionLanguage], type: 'Text' },
            { field: 'reg_nm', header: this.valLanguage.grid_Create_Name[this.optionLanguage], type: 'Text' },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Create_Date[this.optionLanguage], type: 'Date' },
            { field: 'chg_nm', header: this.valLanguage.grid_Change_Name[this.optionLanguage], type: 'Text' },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Change_Date[this.optionLanguage], type: 'Date' },
        ];

        this.colsTable2 = [
            { field: 'tc_cd', header: this.valLanguage.grid_Schedule_Code[this.optionLanguage], type: 'Text' },
            { field: 'tc_nm', header: this.valLanguage.grid_Schedule_Name[this.optionLanguage], type: 'Text' },
            { field: 'tpm_cyle2', header: this.valLanguage.grid_Schedule[this.optionLanguage], type: 'Text' },
            { field: 'start_dt_ymd', header: this.valLanguage.grid_Start_Date[this.optionLanguage], type: 'Text' },
            { field: 'tc_due_id', header: this.valLanguage.grid_Worker[this.optionLanguage], type: 'Text' },
            { field: 'ltc_due_cd', header: this.valLanguage.grid_Workplace[this.optionLanguage], type: 'Text' },
            { field: 'mgr_due_id', header: this.valLanguage.grid_Manager[this.optionLanguage], type: 'Text' },
            { field: 'reg_nm', header: this.valLanguage.grid_Create_Name[this.optionLanguage], type: 'Text' },
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Create_Date[this.optionLanguage], type: 'Date' },
            { field: 'chg_nm', header: this.valLanguage.grid_Change_Name[this.optionLanguage], type: 'Text' },
            { field: 'chg_dt_ymd', header: this.valLanguage.grid_Change_Date[this.optionLanguage], type: 'Date' },
        ];

        this.listOption = {
            'corp_nm': this.corps,
            'lct_nm': this.provideDepts,
            'factory_nm': this.provideDepts,
            'md_cd': this.fModelList,
            'mt_cd': this.mtCdList,
            'sts_nm': this.states,
            'mf_nm': this.manufacturers,
        }

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    show() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select Grid of TPM Schedule Look & Save.' });
    }

    filterTable() {
        const param = {
            as_no: this.selectedAs_nos ? this.selectedAs_nos : '',
            mt_cd: this.selectedMt_cd ? this.selectedMt_cd : '',
            mt_cd1: this.selectedMt_cd1 ? this.selectedMt_cd1 : '',
            mt_cd2: this.selectedMt_cd2 ? this.selectedMt_cd2 : '',
            barcode: this.selectedBarcode ? this.selectedBarcode : '',
            corp: this.selectedCorp ? this.selectedCorp : '',
            factory: this.selectedStorage ? this.selectedStorage : '',
            mf_cd: this.selectedManufacturer ? this.selectedManufacturer : '',
            sts_cd: this.selectedStatus ? this.selectedStatus : '',
            md_cd: this.selectedModel ? this.selectedModel : '',
            row: this.totalRecords,
        }

        this.loadingTable = true;
        this.sv.getFilteredData(param).subscribe({
            next: (data: any) => {
                this.totalRecords = data.records;
                this.loadingTable = false
                this.data = data.rows;

                this.data.forEach((ele: any) => {
                    let ele_r: any = ele;
                    if (ele_r.puchs_dt_ymd !== null && ele_r.puchs_dt_ymd != '' && ele_r.puchs_dt_ymd === undefined) {
                        ele_r.puchs_dt_ymd = new Date(<Date>ele.puchs_dt_ymd);
                    }
                    if (ele_r.reg_dt_ymd !== null && ele_r.reg_dt_ymd != '' && ele_r.reg_dt_ymd === undefined) {
                        ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                    }
                    if (ele_r.chg_dt_ymd !== null && ele_r.chg_dt_ymd != '' && ele_r.chg_dt_ymd === undefined) {
                        ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                    }
                    return ele;
                })
                this.initialValue = this.data;
            }
        });
    }

    onSave() {
        if (this.dataTable2.length == 0) {

        }
    }

    exportToExcel() {
        let data: any[] = [];
        if (this.dt1.filteredValue && Array.isArray(this.dt1.filteredValue)) {
            this.dt1.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    'Corp': emp.corp_nm,
                    'Storage': emp.factory_nm,
                    'Location': emp.lct_nm,
                    'Asset No': emp.as_no,
                    'Machine Code': emp.mt_cd,
                    'Machine Description': emp.mt_nm,
                    'Manufacturer': emp.mf_nm,
                    'Model': emp.md_cd,
                    'Supplier': emp.sp_nm,
                    'State': emp.sts_nm,
                    'Serial No': emp.srl_no,
                    'Purchased Date': emp.puchs_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.puchs_dt_ymd) : emp.puchs_dt_ymd,
                    'Management Dept': emp.mgm_dept_nm,
                    'Cost Dept': emp.cost_dept_nm,
                    'barcode': emp.barcode,
                    'Create Name': emp.reg_nm,
                    'Create Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd,
                };
                data.push(rowData);
            });
        } else {
            this.data.forEach((emp: any) => {
                const rowData: any = {
                    'Corp': emp.corp_nm,
                    'Storage': emp.factory_nm,
                    'Location': emp.lct_nm,
                    'Asset No': emp.as_no,
                    'Machine Code': emp.mt_cd,
                    'Machine Description': emp.mt_nm,
                    'Manufacturer': emp.mf_nm,
                    'Model': emp.md_cd,
                    'Supplier': emp.sp_nm,
                    'State': emp.sts_nm,
                    'Serial No': emp.srl_no,
                    'Purchased Date': emp.puchs_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.puchs_dt_ymd) : emp.puchs_dt_ymd,
                    'Management Dept': emp.mgm_dept_nm,
                    'Cost Dept': emp.cost_dept_nm,
                    'barcode': emp.barcode,
                    'Create Name': emp.reg_nm,
                    'Create Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Change Name': emp.chg_nm,
                    'Change Date': emp.chg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.chg_dt_ymd) : emp.chg_dt_ymd,
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'TPM Schedule', 'data');
        }
    }
    provideDepts!: any[];
    fModelList!: any[];
    mtCdList!: any[];
    states!: any[];

    private loadData(): void {
        this.loading = true;
        this.loadingTable = true;

        this.sv.getData(50, 1).subscribe({
            next: (data) => {
                this.data = data.rows;
                this.totalRecords = data.records;
                this.loadingTable = false;

                forkJoin({
                    fullData: this.sv.getData(this.totalRecords, 1),
                    corps: this.global_sv.getCorp(),
                    manufacturers: this.global_sv.getManufac(),
                    status: this.global_sv.getStatus(),
                    workplaces: this.global_sv.getAllLctList(),
                    factories: this.global_sv.getProvideDept(),
                    models: this.global_sv.getFModelList(),
                    mtCdList: this.global_sv.getMtCdList(),
                    commCdList: this.global_sv.getStatus(),
                }).subscribe({
                    next: (data: any) => {
                        this.data = data.fullData.rows;

                        this.data.forEach((ele: any) => {
                            let ele_r: any = ele;
                            if (ele_r.puchs_dt_ymd !== null && ele_r.puchs_dt_ymd !== '' && ele_r.puchs_dt_ymd !== undefined) {
                                ele_r.puchs_dt_ymd = new Date(<Date>ele.puchs_dt_ymd);
                            }
                            if (ele_r.chg_dt_ymd !== null && ele_r.chg_dt_ymd !== '' && ele_r.chg_dt_ymd !== undefined) {
                                ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                            }
                            if (ele_r.reg_dt_ymd !== null && ele_r.reg_dt_ymd !== '' && ele_r.reg_dt_ymd !== undefined) {
                                ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                            }
                            return ele;
                        })

                        this.initialValue = this.data;

                        this.page = data.fullData.page;

                        this.totalRecords = data.fullData.records;

                        this.loading = false;
                        this.loadingTable = false;

                        this.states = data.commCdList.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.corps = data.corps.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.manufacturers = data.manufacturers.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.status = data.status.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.workplaces = data.workplaces.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.provideDepts = data.factories.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.fModelList = data.models.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.mtCdList = data.mtCdList.filter((item: any) => item.comm_cd !== '' && !item.comm_cd.toLowerCase().includes('test')).map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));

                        this.listOption = {
                            'corp_nm': this.corps,
                            'lct_nm': this.provideDepts,
                            'factory_nm': this.provideDepts,
                            'md_cd': this.fModelList,
                            'mt_cd': this.mtCdList,
                            'sts_nm': this.states,
                            'mf_nm': this.manufacturers,
                        }
                    },
                    error: (error) => {
                        console.error('Error loading data:', error);
                        this.loading = false;
                        this.loadingTable = false;
                    }
                });

            }
        })
    }

    @ViewChild('dt1') dt1!: Table;
    @ViewChild('dt2') dt2!: Table;
    isSorted: boolean | null = null;

    onSearch() {
        this.filterTable();
    }

    onClearTableFilter() {
        this.reg_date_input = '';
        this.corpTableFilterValue = [];
        this.stateTableFilterValue = null;
    }

    onClearSearch() {
        this.selectedCorp = null;
        this.selectedAs_nos = null;
        this.selectedManufacturer = null;
        this.selectedMt_cd = null;
        this.selectedMt_cd1 = null;
        this.selectedMt_cd2 = null;
        this.selectedMachine_nm = null;
        this.selectedStorage = null;
        this.selectedModel = null;
        this.selectedBarcode = null;
        this.selectedStatus = null;
    }

    onClearTable(table: Table) {
        table.clear();
        this.onClearTableFilter();
        this.page = 1;
        // this.filterTable();
    }

    onClearAllSearch() {
        this.onClearSearch()
        this.onClearTableFilter();
        this.onClearTable(this.dt1)
        this.filterTable();
    }

    handleApplySearch() {
        this.filterTable();
    }

    onChangeManufacturer() {
        if (this.selectedManufacturer) {
            this.loadingModel = true;
            this.global_sv.getModelList(this.selectedManufacturer).subscribe({
                next: (response) => {
                    this.models = response.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    this.loadingModel = false;
                }
            })
        } else {
            this.selectedModel = null;
            this.models = [];
        }
    }

    onChangeCorp() {
        if (this.selectedCorp) {
            this.loadingStorage = true;
            this.global_sv.getStorage(this.selectedCorp).subscribe({
                next: (response) => {
                    this.storages = response.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                    this.loadingStorage = false;
                }
            })
        } else {
            this.selectedStorage = null;
            this.storages = [];
        }
    }

    customSort(event: SortEvent) {
        if (this.isSorted == null || this.isSorted === undefined) {
            this.isSorted = true;
            this.global_sv.sortTableData(event);
        } else if (this.isSorted == true) {
            this.isSorted = false;
            this.global_sv.sortTableData(event);
        } else if (this.isSorted == false) {
            this.isSorted = null;
            this.data = [...this.initialValue];
            this.dt1.reset();
        }
    }

    customSort2(event: SortEvent) {
        if (this.isSorted == null || this.isSorted === undefined) {
            this.isSorted = true;
            this.global_sv.sortTableData(event);
        } else if (this.isSorted == true) {
            this.isSorted = false;
            this.global_sv.sortTableData(event);
        } else if (this.isSorted == false) {
            this.isSorted = null;
            this.dataTable2 = [...this.initialTable2];
            this.dt2.reset();
        }
    }

    selectedRow: number | undefined = undefined;
    isVisible: boolean = true;
    isVisible2: boolean = true;
    dataTable2: any[] = [];
    initialTable2: any[] = [];
    loadingDataTable2: boolean = false;
    recordsTable2: number = 0;
    totalRecordsTable2: number = 0;

    onRowClick(as_no: string, i: number): void {
        this.selectedRow = i;
        this.loadingDataTable2 = true;

        this.sv.getDataByAsNo(0, as_no).subscribe({
            next: (response) => {
                this.totalRecordsTable2 = response.total;

                this.sv.getDataByAsNo(this.totalRecordsTable2, as_no).subscribe({
                    next: (response) => {
                        this.dataTable2 = response.rows;

                        this.dataTable2.forEach((ele: any) => {
                            let ele_r: any = ele;
                            if (ele_r.start_dt_ymd !== null && ele_r.start_dt_ymd !== '' && ele_r.start_dt_ymd !== undefined) {
                                ele_r.start_dt_ymd = new Date(<Date>ele.start_dt_ymd);
                            }
                            if (ele_r.chg_dt_ymd !== null && ele_r.chg_dt_ymd !== '' && ele_r.chg_dt_ymd !== undefined) {
                                ele_r.chg_dt_ymd = new Date(<Date>ele.chg_dt_ymd);
                            }
                            if (ele_r.reg_dt_ymd !== null && ele_r.reg_dt_ymd !== '' && ele_r.reg_dt_ymd !== undefined) {
                                ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                            }
                            return ele;
                        })

                        this.initialTable2 = this.dataTable2;

                        this.recordsTable2 = response.records;
                        this.loadingDataTable2 = false;
                    }
                })
            }
        })
    }

    showFilter() {
        if (this.isVisible === true) {
            this.isVisible = false;
        } else {
            this.isVisible = true;
        }
    }

    showFilter2() {
        if (this.isVisible2 === true) {
            this.isVisible2 = false;
        } else {
            this.isVisible2 = true;
        }
    }

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

    reg_date_input: string = ''; // Default to today's date in YYYY-MM-DD format
    @ViewChild('ms_corp_nm') ms_corp_nm!: MultiSelect;
    @ViewChild('ms_factory_nm') ms_factory_nm!: MultiSelect;
    @ViewChild('ms_lct_nm') ms_lct_nm!: MultiSelect;
    @ViewChild('ms_mf_nm') ms_mf_nm!: MultiSelect;
    @ViewChild('ms_md_cd') ms_md_cd!: MultiSelect;
    @ViewChild('ms_sts_nm') ms_sts_nm!: MultiSelect;

    selectAllCorpTable: boolean = false;
    selectAllFactoryNmTable: boolean = false;
    selectAllLctNmTable: boolean = false;
    selectAllMfNmTable: boolean = false;
    selectAllMdCdTable: boolean = false;
    selectAllStsNmTable: boolean = false;

    corpTableFilterValue: string[] = [];
    factoryNmTableFilterValue: string[] = [];
    lctNmTableFilterValue: string[] = [];
    mfNmTableFilterValue: string[] = [];
    mdCdTableFilterValue: string[] = [];
    stsNmTableFilterValue: string[] = [];

    onSelectAllChangeTable(event: any, field: 'factory_nm' | 'lct_nm' | 'mf_nm' | 'md_cd' | 'sts_nm' | 'corp_nm') {
        switch (field) {
            case 'corp_nm':
                this.corpTableFilterValue = event.checked ? [...this.ms_corp_nm.visibleOptions().map((item: any) => item.value)] : [];
                this.selectAllCorpTable = event.checked;
                break;
            case 'factory_nm':
                this.factoryNmTableFilterValue = event.checked ? [...this.ms_factory_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllFactoryNmTable = event.checked;
                break;
            case 'lct_nm':
                this.lctNmTableFilterValue = event.checked ? [...this.ms_mf_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllLctNmTable = event.checked;
                break;
            case 'mf_nm':
                this.mfNmTableFilterValue = event.checked ? [...this.ms_mf_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllMfNmTable = event.checked;
                break;
            case 'md_cd':
                this.mdCdTableFilterValue = event.checked ? [...this.ms_md_cd.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllMdCdTable = event.checked;
                break;
            case 'sts_nm':
                this.stsNmTableFilterValue = event.checked ? [...this.ms_sts_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllStsNmTable = event.checked;
                break;
        }

    }
}
