import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
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
import { forkJoin } from 'rxjs';

import { SortEvent } from 'primeng/api';
import { LanguageType } from '../../../../constants/constants.auth';
import { GlobalsService } from '../../../../globals.service';
import { LocationHistoryReportService } from './location_history_report.service';
interface Column {
    field: string;
    header: string;
    type: 'Text' | "Date" | "Number" | "Option" | "MultiSelect";
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    imports: [FloatLabel, MultiSelectModule, IconFieldModule, TagModule, InputIconModule, Dialog, InputTextModule, TableModule, ButtonModule, SelectModule, FormsModule, InputGroupModule, InputGroupAddonModule, DatePickerModule, RadioButtonModule, CommonModule],
    selector: 'app-location-history_report',
    standalone: true,
    template: `
        <section class="flex flex-col min-h-full w-full">
        <div class="header-title">
            <div class="flex flex-col sm:flex-row justify-between items-center mb-3 xl:mb-0">
                <h2 class="text-2xl sm:text-3xl mr-auto">{{this.valLanguage.LocationHistoryReport[this.optionLanguage]}}</h2>
                <div class="flex gap-2 *:w-[120px] *:*:w-full ml-auto">
                    <p-button [outlined]="true" icon="pi pi-search" class="!w-32 *:!w-32" [label]="this.valLanguage.btn_Search[this.optionLanguage]" (click)="onSearch()" severity="info" />
                    <p-button [outlined]="true" icon="pi pi-filter-slash" class="!w-32 *:!w-32" [label]="this.valLanguage.btn_Clear[this.optionLanguage]" (click)="onClearSearch()" severity="secondary" />
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 rounded gap-5 *:space-y-7 *:mt-2 box p-5 header-border-filter">
                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-inputgroup inputId="material_label">
                            <p-multiselect id="multiselect" [options]="listMtl" variant="outlined" [showToggleAll]="true" [selectAll]="selectAll" optionLabel="value" optionValue="value" [loading]="loading" [(ngModel)]="searchMtCodeList" [virtualScroll]="true" [virtualScrollItemSize]="43" class="multiselect-custom-virtual-scroll" (onSelectAllChange)="onSelectAllChange($event)" [maxSelectedLabels]="3" styleClass="w-full" #ms>
                                <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                    <i class="pi pi-check" *ngIf="allSelected"></i>
                                    <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                </ng-template>
                            </p-multiselect>
                            <p-inputgroup-addon (click)="showDialog()" label="Show"><p-button icon="pi pi-plus" /></p-inputgroup-addon>
                        </p-inputgroup>
                        <label for="material_label">{{this.valLanguage.grid_Material[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-dialog id="search_dialog" [header]="this.valLanguage.Material_Search[this.optionLanguage]" [(visible)]="visible" class="md:h-[50rem] h-screen" [style]="{ width: '30rem' }">
                        <div class="flex items-center gap-4 mb-4">

                            <p-multiselect [options]="listMtl" variant="outlined" [showToggleAll]="true" [selectAll]="selectAll" [(ngModel)]="searchMtCodeList" optionLabel="value" [loading]="loading" optionValue="value" [virtualScroll]="true" [virtualScrollItemSize]="43" class="multiselect-custom-virtual-scroll max-w-full" [placeholder]="this.valLanguage.Select_Material_Code[this.optionLanguage]" (onSelectAllChange)="onSelectAllChange($event)" [maxSelectedLabels]="2" styleClass="w-full" #ms>
                                <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                    <i class="pi pi-check" *ngIf="allSelected"></i>
                                    <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                </ng-template>
                            </p-multiselect>

                        </div>
                        <div class="flex items-start gap-4 mb-4 h-[500px] overflow-y-auto">
                            <div class="flex-1 space-y-3">
                                <div (click)="delFromSearchList(item)" *ngFor="let item of searchMtCodeList" class="p-2 border border-gray-light dark:border-gray-dark rounded-sm cursor-pointer"  >
                                    <div class="header-content">
                                        <span>{{ item }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="w-full flex flex-col md:flex-row *:flex-1 gap-2">
                            <p-button id="apply_btn" size="large" [label]="this.valLanguage.btn_Apply_Search[this.optionLanguage]" (click)="handleApplySearch()" [raised]="true" severity="info" />
                            <p-button id="apply_btn" size="large" [label]="this.valLanguage.btn_Clear_All[this.optionLanguage]" (click)="handleClearSearch()" [raised]="true" severity="danger" />
                        </div>
                    </p-dialog>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="corp_label" (onChange)="onChangeCorp()" class="w-full" [loading]="loading" [(ngModel)]="selectedCorp" [options]="corps" [showClear]="true">
                            <ng-template let-option #item>
                                <p-tag [value]="option.label" class="w-full !py-2" [severity]="global_sv.getCorpColor(option.label)" />
                            </ng-template>
                        </p-select>
                        <label for="corp_label">{{this.valLanguage.grid_Corp[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="state_label" class="w-full" [loading]="loading" [(ngModel)]="selectedState" [options]="states" [showClear]="true">
                            <ng-template let-option #item>
                                <p-tag [value]="option.label" class="w-full !py-2" [severity]="global_sv.getStatusColor(option.label)" />
                            </ng-template>
                        </p-select>
                        <label for="state_label">{{this.valLanguage.grid_State[this.optionLanguage]}}</label>
                    </p-floatlabel>
                </div>

                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="model_label" [options]="fModelList" [(ngModel)]="selectedMdCode" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="model_label">{{this.valLanguage.grid_Model[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="pro_dev_label" [options]="provideDepts" [(ngModel)]="selectedProvideDept" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="pro_dev_label">{{this.valLanguage.grid_Provide_Dept[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="language_label" id="include_tags" class="w-full" [(ngModel)]="gubun" [options]="languages">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="success" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="language_label">{{this.valLanguage.grid_Language[this.optionLanguage]}}</label>
                    </p-floatlabel>

                </div>

                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="parent_label" [options]="parents" [(ngModel)]="selectedParent" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="parent_label">{{this.valLanguage.grid_Parent[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="req_dev_label" [options]="requestDepts" [(ngModel)]="selectedRequestDept" [loading]="loading" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="req_dev_label">{{this.valLanguage.grid_Request_Dept[this.optionLanguage]}}</label>
                    </p-floatlabel>
                </div>

                <div>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-datepicker inputId="date_label" id="datepicker_style" [(ngModel)]="selectedRangeDates" class="w-full date-left" (onClearClick)="onClearFilterDate()" dateFormat="yy-mm-dd" (onClose)="onCloseFilterDate()" showIcon iconDisplay="input" selectionMode="range" [showButtonBar]="true" [readonlyInput]="true" />
                        <label for="date_label">{{this.valLanguage.grid_Create_Date[this.optionLanguage]}}</label>
                    </p-floatlabel>
                    <p-floatlabel class="max-w-sm mx-auto">
                        <p-select inputId="storage_label" [options]="storages" [(ngModel)]="selectedStorage" [loading]="loadingStorage" [emptyMessage]="'Please select Corp first'" optionValue="value" [filter]="true" filterBy="label" [showClear]="true" class="w-full">
                            <ng-template let-option #item>
                                <div class="flex items-center gap-2 w-full">
                                    <p-tag [value]="option.label" class="w-full !py-2" severity="secondary" />
                                </div>
                            </ng-template>
                        </p-select>
                        <label for="storage_label">{{this.valLanguage.grid_Storage[this.optionLanguage]}}</label>
                    </p-floatlabel>
                </div>
            </div>

        </div>
        <section class="card-2 p-[5px] md:p-[20px] flex-1]">
            <p-table #dt1 class="table_minheight" [scrollable]="true" scrollHeight="600px" virtualScrollItemSize="600" [loading]="loadingTable" [columns]="cols"
                [value]="data" [paginator]="true" [rows]="50" [showCurrentPageReport]="true" exportFilename="Location History Report" [exportHeader]="'customExportHeader'"
                [tableStyle]="{ 'min-width': '50rem' }" (sortFunction)="customSort($event)" [customSort]="true" [totalRecords]="totalRecords"
                [showCurrentPageReport]="true" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" [first]="first"
                [rowsPerPageOptions]="[50, 100, 200, 500 ,1000]">
                <ng-template #caption>
                    <div class="flex justify-between *:text-nowrap overflow-x-auto gap-x-4 py-2">
                        <div class="flex gap-4">
                            <p-button [label]="this.valLanguage.btn_ClearFilter[this.optionLanguage]" [outlined]="true" icon="pi pi-filter-slash" (click)="onClearTable(dt1)" />
                            <p-button [outlined]="true" [icon]="isVisible ? 'pi pi-unlock' : 'pi pi-lock-open'" class="text-nowrap" [label]="this.valLanguage.btn_ShowFilter[optionLanguage]" (click)="showFilter()"></p-button>
                            <p-button [outlined]="true" icon="pi pi-file-excel" [label]="this.valLanguage.btn_Export[this.optionLanguage]" (click)="exportToExcel()"/>
                        </div>
                        <p-button [outlined]="true" icon="pi pi-filter-slash" class="text-nowrap" [label]="this.valLanguage.btn_Clear_All[this.optionLanguage]" (click)="onClearAllSearch()" severity="warn" />
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
                                } @else if (col.type == 'Option') {
                                    <th>
                                        <p-columnFilter class="filter-option" [field]="col.field" matchMode="equals" [showMenu]="false" [showClearButton]="false">
                                            <ng-template #filter let-value let-filter="filterCallback">
                                                @if (col.field == 'corp_nm') {
                                                    <p-select [loading]="loading" [(ngModel)]="corpTableFilterValue" [options]="listOption[col.field]" (onChange)="filter(corpTableFilterValue)" optionValue="label" filterBy="label" placeholder="Select One" [showClear]="true">
                                                        <ng-template let-option #item>
                                                            <p-tag [value]="option.label" [severity]="global_sv.getCorpColor(option.label)" class="w-full !py-2" />
                                                        </ng-template>
                                                    </p-select>
                                                }
                                            </ng-template>
                                        </p-columnFilter>
                                    </th>
                                } @else if (col.type == 'MultiSelect') {
                                    <th>
                                        <p-columnFilter [field]="col.field" matchMode="in" [showMenu]="false" [showClearButton]="false">
                                            <ng-template #filter let-value let-filter="filterCallback">
                                                @if (col.field == 'mt_cd') {
                                                    <p-multiselect [options]="listOption[col.field]" variant="outlined" [showToggleAll]="true" [selectAll]="selectAllMtCodeTable" [(ngModel)]="mtCodeTableFilterValue" (onChange)="filter(mtCodeTableFilterValue)" optionLabel="value" [loading]="loading" optionValue="value" [virtualScroll]="true" [virtualScrollItemSize]="30" class="multiselect-custom-virtual-scroll max-w-full min-w-64" placeholder="Select Multiple" (onSelectAllChange)="onSelectAllChangeTable($event, 'mt_cd')" [maxSelectedLabels]="2" styleClass="w-full" #ms_mt_cd>
                                                        <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                                            <i class="pi pi-check" *ngIf="allSelected"></i>
                                                            <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                                        </ng-template>
                                                    </p-multiselect>
                                                }
                                                @if (col.field == 'corp_nm') {
                                                    <p-multiselect [options]="listOption[col.field]" variant="outlined" [showToggleAll]="false" [selectAll]="selectAllCorpTable" [(ngModel)]="corpTableFilterValue" (onChange)="filter(corpTableFilterValue)" optionLabel="label" [loading]="loading" optionValue="label" [virtualScroll]="true" [virtualScrollItemSize]="30" [filter]="false" class="multiselect-custom-virtual-scroll max-w-full min-w-32" placeholder="Select Multiple" (onSelectAllChange)="onSelectAllChangeTable($event, 'corp_nm')" [maxSelectedLabels]="2" styleClass="w-full" #ms_corp_nm>
                                                        <ng-template let-option #item>
                                                            <p-tag [value]="option.label" class="w-full !py-2" [severity]="global_sv.getCorpColor(option.label)" *ngIf="option.label" />
                                                        </ng-template>
                                                    </p-multiselect>
                                                }
                                                @if (col.field == 'md_cd') {
                                                    <p-multiselect [options]="listOption[col.field]" variant="outlined" [showToggleAll]="true" [selectAll]="selectAllMdCodeTable" [(ngModel)]="mdCodeTableFilterValue" (onChange)="filter(mdCodeTableFilterValue)" optionLabel="value" [loading]="loading" optionValue="value" [virtualScroll]="true" [virtualScrollItemSize]="30" class="multiselect-custom-virtual-scroll max-w-full min-w-64" placeholder="Select Multiple" (onSelectAllChange)="onSelectAllChangeTable($event, 'md_cd')" [maxSelectedLabels]="2" styleClass="w-full" #ms_md_cd>
                                                        <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                                            <i class="pi pi-check" *ngIf="allSelected"></i>
                                                            <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                                        </ng-template>
                                                    </p-multiselect>
                                                }
                                                @if (col.field == 'lct_nm') {
                                                    <p-multiselect [options]="listOption[col.field]" variant="outlined" [showToggleAll]="true" [selectAll]="selectAllLctNmTable" [(ngModel)]="requestDeptTableFilterValue" (onChange)="filter(requestDeptTableFilterValue)" optionLabel="label" [loading]="loading" optionValue="label" [virtualScroll]="true" [virtualScrollItemSize]="30" class="multiselect-custom-virtual-scroll max-w-full min-w-64" placeholder="Select Multiple" (onSelectAllChange)="onSelectAllChangeTable($event, 'lct_nm')" [maxSelectedLabels]="2" styleClass="w-full" #ms_lct_nm>
                                                        <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                                            <i class="pi pi-check" *ngIf="allSelected"></i>
                                                            <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                                        </ng-template>
                                                    </p-multiselect>
                                                }
                                                @if (col.field == 'from_lct_nm') {
                                                    <p-multiselect [options]="listOption[col.field]" variant="outlined" [showToggleAll]="true" [selectAll]="selectAllFromLctNmTable" [(ngModel)]="provideDeptTableFilterValue" (onChange)="filter(provideDeptTableFilterValue)" optionLabel="label" [loading]="loading" optionValue="label" [virtualScroll]="true" [virtualScrollItemSize]="30" class="multiselect-custom-virtual-scroll max-w-full min-w-64" placeholder="Select Multiple" (onSelectAllChange)="onSelectAllChangeTable($event, 'from_lct_nm')" [maxSelectedLabels]="2" styleClass="w-full" #ms_from_lct_nm>
                                                        <ng-template #headercheckboxicon let-allSelected let-partialSelected="partialSelected">
                                                            <i class="pi pi-check" *ngIf="allSelected"></i>
                                                            <i class="pi pi-minus" *ngIf="partialSelected" [ngStyle]="{ color: 'var(--text-color)' }"></i>
                                                        </ng-template>
                                                    </p-multiselect>
                                                }
                                            </ng-template>
                                        </p-columnFilter>
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
                                        (click)="onRowClick(i)">
                        <td aria-describedby="list_rn">{{ i + 1 }}</td>
                        <td aria-describedby="list_reg_dt_ymd">{{ item.reg_dt_ymd | date: 'yyyy/MM/dd HH:mm:ss'}}</td>
                        <td aria-describedby="list_corp_nm"><p-tag [value]="item.corp_nm" class="w-full !py-2" [severity]="global_sv.getCorpColor(item.corp_nm)" /></td>
                        <td aria-describedby="list_from_lct_nm">{{ item.from_lct_nm }}</td>
                        <td aria-describedby="list_lct_nm">{{ item.lct_nm }}</td>
                        <td aria-describedby="list_lct_nm">{{ item.lct_nm }}</td>
                        <td aria-describedby="list_md_kr" class="text-nowrap">{{ item.md_kr }}</td>
                        <td aria-describedby="list_mt_cd" class="text-nowrap">{{ item.mt_cd }}</td>
                        <td aria-describedby="list_md_cd" class="text-nowrap">{{ item.md_cd }}</td>
                        <td aria-describedby="list_re_mark" class="text-nowrap">{{ item.re_mark }}</td>
                        <td aria-describedby="list_reason_nm" class="text-nowrap">{{ item.reason_nm }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </section>
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

        :host ::ng-deep #include_tags .p-select-option{
            padding:4px 0 4px 0 !important;
        }

        :host ::ng-deep #apply_btn button{
            width:100% !important;
        }

        :host ::ng-deep #multiselect p-iconfield > .p-inputtext,
        :host ::ng-deep p-columnfilterformelement
        {
            width: 100% !important;
        }


        @media (min-width: 768px) {
            :host ::ng-deep #search_dialog .p-dialog {
                height: 50rem /* 800px */;
            }
        }
        @media (max-width: 768px) {
            :host ::ng-deep #search_dialog .p-dialog {
                height: 100vh /* 800px */;
                max-height: 100% !important;
            }

        }

        :host ::ng-deep p-columnfilterformelement,
        :host ::ng-deep p-columnfilterformelement > input {
            min-width: 175px;
            width: 100%;
        }

        :host ::ng-deep p-columnfilter.filter-option p-columnfilterformelement {
        min-width: 50px;
            width: 100%;
        }

    `]
})


export class LocationHistoryReportPage implements OnInit {

    loading: boolean = false;
    loadingTable: boolean = false;
    loadingStorage: boolean = false;
    now = new Date();

    corps!: any[];
    states!: any[];
    provideDepts!: any[];
    requestDepts!: any[];
    parents!: any[];
    fModelList!: any[];
    storages!: any[];

    gubun: string = 'korean';
    selectedCorp: string | null = null;
    selectedState: string | null = null;
    selectedStorage: string | null = null;
    selectedParent: string | null = null;
    selectedProvideDept: string | null = null;
    selectedRequestDept: string | null = null;
    selectedMdCode: string | null = null;
    selectedStartDate: string | null = null;
    selectedEndDate: string | null = null;
    searchMtCodeList: any[] = [];
    searchMtCodeListTable: any[] = [];


    corpTableFilterValue: string[] = [];
    provideDeptTableFilterValue: string[] = [];
    requestDeptTableFilterValue: string[] = [];
    storageTableFilterValue: string | null = null;
    stateTableFilterValue: string | null = null;
    parentTableFilterValue: string | null = null;
    mdCodeTableFilterValue: string[] = [];
    mtCodeTableFilterValue: string[] = [];

    selectedRangeDates: string | null = null;
    listOption!: any;

    listMtl!: any;
    languages!: any[];

    visible: boolean = false;
    showDialog() {
        this.visible = true;
    }

    cols!: Column[];
    exportColumns!: ExportColumn[];
    data!: any;
    initialValue!: any;
    rows = 50;
    first = 0;
    page: number = 1;
    totalRecords = 0;
    allRecords = 0;

    constructor(private sv: LocationHistoryReportService, public  global_sv: GlobalsService) {
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
        }else {
            this.reloadPage();
        }
    }

    reloadPage() {
        this.loadData();
        this.languages = [
            {
                label: 'English',
                value: 'english'
            },
            {
                label: 'Korean',
                value: 'korean'
            },
            {
                label: 'Vietnam',
                value: 'vietnam'
            }
        ]

        this.cols = [
            { field: 'reg_dt_ymd', header: this.valLanguage.grid_Storage_Updated_Date[this.optionLanguage], type: 'Date' },
            { field: 'corp_nm', header: this.valLanguage.grid_Corp[this.optionLanguage], type: 'MultiSelect' },
            { field: 'from_lct_nm', header: this.valLanguage.grid_Provide_Dept[this.optionLanguage], type: 'MultiSelect' },
            { field: 'lct_nm', header: this.valLanguage.grid_Request_Dept[this.optionLanguage], type: 'MultiSelect' },
            { field: 'lct_nm', header: this.valLanguage.grid_Storage_Loca[this.optionLanguage], type: 'MultiSelect' },
            { field: 'md_kr', header: this.valLanguage.grid_Machine_Name[this.optionLanguage], type: 'Text' },
            { field: 'mt_cd', header: this.valLanguage.grid_Machine_Code[this.optionLanguage], type: 'MultiSelect' },
            { field: 'md_cd', header: this.valLanguage.grid_Model_Name[this.optionLanguage], type: 'MultiSelect' },
            { field: 're_mark', header: this.valLanguage.grid_Remark[this.optionLanguage], type: 'Text' },
            { field: 'reason_nm', header: this.valLanguage.grid_Reason[this.optionLanguage], type: 'Text' },
        ];

        this.listOption = {
            'corp_nm': this.corps,
            'lct_nm': this.provideDepts,
            'from_lct_nm': this.provideDepts,
            'md_cd': this.fModelList,
            'mt_cd': this.listMtl,
        }

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    @ViewChild('ms') ms!: MultiSelect;
    @ViewChild('ms_corp_nm') ms_corp_nm!: MultiSelect;
    @ViewChild('ms_mt_cd') ms_mt_cd!: MultiSelect;
    @ViewChild('ms_md_cd') ms_md_cd!: MultiSelect;
    @ViewChild('ms_lct_nm') ms_lct_nm!: MultiSelect;
    @ViewChild('ms_from_lct_nm') ms_from_lct_nm!: MultiSelect;

    selectAll: boolean = false;
    onSelectAllChange(event: any) {
        this.searchMtCodeList = event.checked ? [...this.ms.visibleOptions().map((item: any) => item.value)] : [];
        this.selectAll = event.checked;
    }

    selectAllCorpTable: boolean = false;
    selectAllMtCodeTable: boolean = false;
    selectAllMdCodeTable: boolean = false;
    selectAllLctNmTable: boolean = false;
    selectAllFromLctNmTable: boolean = false;
    onSelectAllChangeTable(event: any, field: 'mt_cd' | 'md_cd' | 'corp_nm' | 'from_lct_nm' | 'lct_nm') {
        switch(field){
            case 'mt_cd':
                this.mtCodeTableFilterValue = event.checked ? [...this.ms_mt_cd.visibleOptions().map((item: any) => item.value)] : [];
                this.selectAllMtCodeTable = event.checked;
                break;
            case 'md_cd':
                this.mdCodeTableFilterValue = event.checked ? [...this.ms_md_cd.visibleOptions().map((item: any) => item.value)] : [];
                this.selectAllMdCodeTable = event.checked;
                break;
            case 'corp_nm':
                this.corpTableFilterValue = event.checked ? [...this.ms_corp_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllCorpTable = event.checked;
                break;
            case 'lct_nm':
                this.requestDeptTableFilterValue = event.checked ? [...this.ms_lct_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllLctNmTable = event.checked;
                break;
            case 'from_lct_nm':
                this.provideDeptTableFilterValue = event.checked ? [...this.ms_from_lct_nm.visibleOptions().map((item: any) => item.label)] : [];
                this.selectAllFromLctNmTable = event.checked;
                break;
        }

    }

    filterTable() {
        const param = {
            page: 1,
            rows: this.allRecords == null ? '' : this.allRecords,
            corp: this.selectedCorp == null ? '' : this.selectedCorp,
            pro_dept: this.selectedProvideDept == null ? '' : this.selectedProvideDept,
            req_dept: this.selectedRequestDept == null ? '' : this.selectedRequestDept,
            start_dt: this.selectedStartDate == null ? '' : this.selectedStartDate,
            end_dt: this.selectedEndDate == null ? '' : this.selectedEndDate,
            md_cd: this.selectedMdCode == null ? '' : this.selectedMdCode,
            prt_cd: this.selectedParent == null ? '' : this.selectedParent,
            factory: this.selectedStorage == null ? '' : this.selectedStorage,
            mt_cd: this.searchMtCodeList.length > 0 ? this.searchMtCodeList.join("@@") + '@@' : '',
            gubun: this.gubun == null ? '' : this.gubun,
        }
        this.loadingTable = true;
        this.sv.getFilteredData(param).subscribe({
            next: (data: any) => {
                this.totalRecords = data.records;
                this.loadingTable = false
                this.data = data.rows;

                this.data.forEach((ele: any) => {
                    let ele_r: any = ele;
                    if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                        ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                    }
                    return ele;
                })
                this.initialValue = this.data;
            }
        });
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

    exportToExcel() {
        let data: any[] = [];
        if (this.dt1.filteredValue && Array.isArray(this.dt1.filteredValue)) {
            this.dt1.filteredValue.forEach((emp: any) => {
                const rowData: any = {
                    'Storage Updated Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Corp': emp.corp_nm,
                    'Provide Dept': emp.from_lct_nm,
                    'Request Dept': emp.lct_nm,
                    'Storage Loca': emp.lct_nm,
                    '기계이름': emp.md_kr,
                    '머신코드': emp.mt_cd,
                    '모델이름': emp.md_cd,
                    'Remark': emp.re_mark,
                    'Reason': emp.reason_nm,
                };
                data.push(rowData);
            });
        } else {
            this.data.forEach((emp: any) => {
                const rowData: any = {
                    'Storage Updated Date': emp.reg_dt_ymd instanceof Date ? this.global_sv.formatDate(emp.reg_dt_ymd) : emp.reg_dt_ymd,
                    'Corp': emp.corp_nm,
                    'Provide Dept': emp.from_lct_nm,
                    'Request Dept': emp.lct_nm,
                    'Storage Loca': emp.lct_nm,
                    '기계이름': emp.md_kr,
                    '머신코드': emp.mt_cd,
                    '모델이름': emp.md_cd,
                    'Remark': emp.re_mark,
                    'Reason': emp.reason_nm,
                };
                data.push(rowData);
            });
        }
        if (data.length > 0) {
            this.global_sv.exportExcel(data, 'Location History Report','data');
        }
    }

    private loadData(): void {
        this.loading = true;
        this.loadingTable = true;

        this.sv.getSelectLctHistReport(1, 50).subscribe({
            next: (data) => {
                this.data  = data.rows;
                this.totalRecords = data.records;
                        this.loadingTable = false;

                forkJoin({
                    selectLctHistReport: this.sv.getSelectLctHistReport(this.page, this.totalRecords),
                    factories: this.global_sv.getProvideDept(),
                    parentList: this.global_sv.getParent(),
                    commCdList: this.global_sv.getStatus(),
                    corps: this.global_sv.getCorp(),
                    models: this.global_sv.getFModelList(),
                    mtCdList: this.global_sv.getMtCdList(),
                }).subscribe({
                    next: (data: any) => {
                        this.data  = data.selectLctHistReport.rows;

                        this.data.forEach((ele: any) => {
                            let ele_r: any = ele;
                            if (ele_r.reg_dt_ymd !== null || ele_r.reg_dt_ymd === undefined) {
                                ele_r.reg_dt_ymd = new Date(<Date>ele.reg_dt_ymd);
                            }
                            return ele;
                        })
                        this.initialValue = this.data;

                        this.page = data.selectLctHistReport.page;

                        this.totalRecords = data.selectLctHistReport.records;
                        this.allRecords = data.selectLctHistReport.records;

                        this.states = data.commCdList;
                        this.loading = false;

                        this.corps = this.global_sv.convertToListFilterNotIncludeNull(data.corps);
                        this.states = this.global_sv.convertToListFilterNotIncludeNull(data.commCdList);
                        this.provideDepts = this.requestDepts = this.global_sv.convertToListFilterNotIncludeNull(data.factories);
                        this.fModelList = data.models.filter((item: any) => item.comm_nm.trim() !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        // this.listMtl = data.mtCdList.filter((item: any) => item.comm_cd !== '' && !item.comm_cd.toLowerCase().includes('test')).map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        this.listMtl = data.mtCdList.filter((item: any) => item.comm_cd !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                        // console.log(this.listMtl.map((p:any)=>p.value));
                        this.parents = this.global_sv.convertToListFilterNotIncludeNull(data.parentList);

                        this.listOption = {
                            'corp_nm': this.corps,
                            'lct_nm': this.provideDepts,
                            'from_lct_nm': this.provideDepts,
                            'md_cd': this.fModelList,
                            'mt_cd': this.listMtl,
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

    delFromSearchList(searchText: any): void {
        this.searchMtCodeList = this.searchMtCodeList.filter((item) => searchText != item);
    }

    @ViewChild('dt1') dt1!: Table;
    isSorted: boolean | null = null;

    onSearch() {
        this.filterTable();
    }

    onClearTableFilter(){
        this.corpTableFilterValue = [];
        this.provideDeptTableFilterValue = [];
        this.requestDeptTableFilterValue = [];
        this.storageTableFilterValue = null;
        this.parentTableFilterValue = null;
        this.mtCodeTableFilterValue = [];
        this.mdCodeTableFilterValue = [];
        this.reg_date_input = '';
    }

    onClearSearch(){
        this.selectedCorp = null;
        this.selectedProvideDept = null;
        this.selectedRequestDept = null;
        this.selectedStorage = null;
        this.selectedParent = null;
        this.searchMtCodeList = [];
        this.selectedMdCode = null;
        this.selectedRangeDates = null;
        this.selectedState = null;
        this.selectedStartDate = null;
        this.selectedEndDate = null;
        this.selectedRangeDates = null;
    }

    onClearTable(table: Table) {
        table.clear();
        this.onClearTableFilter();
        this.page = 1;
        // this.filterTable();
    }

    onClearAllSearch(){
        this.onClearSearch()
        this.onClearTableFilter();
        this.onClearTable(this.dt1)
        this.filterTable();
    }

    handleApplySearch() {
        this.filterTable();
    }

    handleClearSearch() {
        this.searchMtCodeList = [];
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

    selectedRow: number | undefined = undefined;

    isVisible: boolean = true;

    onRowClick(i: number): void {
        this.selectedRow = i;
    }

    showFilter() {
        if (this.isVisible === true) {
            this.isVisible = false;
        } else {
            this.isVisible = true;
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

    onClearFilterDate() {
        this.selectedStartDate = this.selectedEndDate = '';
    }

    onCloseFilterDate() {
        if (this.selectedRangeDates != undefined && this.selectedRangeDates != null) {
            const data: string[] = (this.selectedRangeDates + '').split(",");

            const start = this.global_sv.formatDateFilter(new Date(data[0]));
            const end = this.global_sv.formatDateFilter(new Date(data[1]));

            this.selectedStartDate = start;
            this.selectedEndDate = end;
        }
    }
}
