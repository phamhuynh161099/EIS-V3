import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';
import { TextareaModule } from 'primeng/textarea';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EquipmentService } from '../app/pages/management/equipment/equipment.service';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { Image } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { SelectItem, SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { Toast, ToastModule } from 'primeng/toast';

import { LanguageType } from '../constants/constants.auth';
import { GlobalsService } from '../globals.service';

@Component({
    imports: [CommonModule, ButtonModule, ToastModule, Toast, Image, InputTextModule, RadioButton, FormsModule, TextareaModule, ZXingScannerModule, FloatLabel, TagModule, SelectModule],
    standalone: true,
    providers: [EquipmentService, MessageService],
    template: ` <div class="card-2 py-2 lg:p-5">
        <p-toast />
        <div class="mr-auto flex">
            <h4 class="text-2xl ml-3 sm:text-3xl">{{ valLanguage.nameQRScanner[optionLanguage] }}</h4>
            <p-button class="ml-3" label="" severity="secondary" [outlined]="true" icon="pi pi-refresh" (click)="refresh()" />
        </div>
        <div class="grid  grid-flow-col grid-rows-4 grid-cols-4 gap-4  m-4 *:border *:border-[var(--p-primary-color)] *:rounded-md">
            <div class="box p-3 xl:p-10 col-start-1 col-span-4 xl:col-span-2 row-span-4  ... " pRipple>
                <div class="flex justify-center w-full mb-6">
                    <!-- <p-image *ngIf="flagImageScanner" src="https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg" alt="Image" width="250" /> -->

                    <div *ngIf="avatarURL" class="">
                        <p-image [src]="avatarURL" height="200" alt="Image" width="250" />
                        <label>{{ file_open }}</label>
                    </div>
                    <p-button *ngIf="flagImageScanner && !avatarURL" icon="pi pi-qrcode" [rounded]="true" severity="success" class="qr-result" [outlined]="true" />
                    <zxing-scanner *ngIf="!flagImageScanner && !avatarURL" #scanner (camerasFound)="onCamerasFound($event)" [device]="selectedDevice" (scanSuccess)="onScanSuccess($event)"> </zxing-scanner>
                </div>

                <div class="flex flex-col md:flex-row flex-wrap w-fit mx-auto justify-center gap-x-4 gap-y-2">
                    <div class="flex justify-between w-[17rem]">
                        <p-button [label]="valLanguage.btn_CameraScanner[optionLanguage]" severity="contrast" class="camera-scanner row-auto flex-1 *:w-full rounded-md">
                            <i class="pi pi-camera"></i>
                            <select [(ngModel)]="selectedCamera" style="width: '100%'; padding: 1px; color:#fff" class="p-inputtext p-component" (change)="onDeviceChange($event)">
                                <option value="" [selected]="!selectedDevice">Choose</option>
                                <option *ngFor="let device of availableDevices" [value]="device.deviceId">{{ device.label }}</option>
                            </select>
                        </p-button>
                    </div>
                    <div class="flex justify-between w-[17rem]">
                        <p-button [label]="valLanguage.btn_QRChoose[optionLanguage]" severity="contrast" class="qr-choose row-auto flex-1 *:w-full rounded-md">
                            <i class="pi pi-folder-open"></i>
                            <input id="file_input_qr" style="width: 90px;" type="file" (change)="onFileSelected($event)" />
                        </p-button>
                    </div>
                </div>
            </div>
            <div class="col-start-1 xl:col-start-3 p-3 col-span-4 xl:p-10  xl:col-span-2 row-span-2 ..." pRipple>
                <div class="flex flex-wrap gap-4">
                    <div class="flex items-center">
                        <p-radiobutton name="ingredient" value="single" [(ngModel)]="ingredient" (click)="changeRadioMullti()" inputId="ingredient1" />
                        <label for="ingredient1" class="ml-2">{{ valLanguage.radio_Single[optionLanguage] }}</label>
                    </div>

                    <div class="flex items-center">
                        <p-radiobutton name="ingredient" value="mulltiple" [(ngModel)]="ingredient" (click)="changeRadioMullti()" inputId="ingredient2" />
                        <label for="ingredient2" class="ml-2">{{ valLanguage.radio_Multiple[optionLanguage] }}</label>
                    </div>
                </div>
                <div *ngIf="ingredient === 'mulltiple'" class="border border-[var(--p-primary-color)] rounded-md flex flex-wrap items-end gap-4 mb-3 box p-5 pt-3 mt-2">
                    <p-floatlabel class="w-full sm:w-40 mt-4">
                        <p-select class="w-full" [(ngModel)]="corpFilterValue" (onChange)="handleChangeCorp($event)" [options]="corpFac" [showClear]="true">
                            <ng-template let-option #item>
                                <p-tag [value]="option.label" [severity]="global_sv.getCorpColor(option.label)" />
                            </ng-template>
                        </p-select>
                        <label for="username">{{ valLanguage.grid_Corp[this.optionLanguage] }}</label>
                    </p-floatlabel>
                    <p-floatlabel class="w-full sm:w-40 mt-4">
                        <p-select [filter]="true" filterBy="label" class="w-full" [(ngModel)]="statusFilterValue" [options]="status" [showClear]="true">
                            <ng-template let-option #item>
                                <p-tag [value]="option.label" severity="secondary" />
                            </ng-template>
                        </p-select>
                        <label for="username">{{ valLanguage.grid_Status[this.optionLanguage] }}</label>
                    </p-floatlabel>
                    <p-floatlabel class="w-full sm:w-60 mt-4">
                        <p-select [filter]="true" filterBy="label" class="w-full" [(ngModel)]="storageFilterValue" [options]="storage" [showClear]="true">
                            <ng-template let-option #item>
                                <p-tag [value]="option.label" severity="secondary" />
                            </ng-template>
                        </p-select>
                        <label for="username">{{ valLanguage.grid_Storage[this.optionLanguage] }}</label>
                    </p-floatlabel>
                </div>
                <div *ngIf="ingredient === 'mulltiple'" class="*:w-full *:md:w-40 *:*:w-full flex flex-wrap gap-4">
                    <p-button [label]="valLanguage.btn_Clear[this.optionLanguage]" severity="secondary" [outlined]="true" icon="pi pi-filter-slash" (click)="clear()" />
                    <p-button [outlined]="true" severity="danger" icon="pi pi-save" [label]="valLanguage.btn_Save[this.optionLanguage]" (click)="saveMulltiple()"></p-button>
                </div>
            </div>
            <div class="col-start-1 xl:col-start-3 p-3 xl:p-10 col-span-4 xl:col-span-2  row-span-2  ..." pRipple>
                <label class="w-full">{{ valLanguage.txt_ScanResuft[this.optionLanguage] }}</label>
                <textarea class="w-full mt-2 h-4/5 !pt-10" rows="5" cols="30" pTextarea [(ngModel)]="value"></textarea>
            </div>
        </div>

        <div *ngIf="flagScanner" class="rounded box m-4" style="border: 1px solid rgba(75, 175, 80, 0.3); --p-ripple-background: rgba(75, 175, 80, 0.3)">
            <h4 class="pl-5 pt-3">{{ valLanguage.txt_MachineInfo[this.optionLanguage] }}</h4>
            <div class="rounded gap-x-4 gap-y-7 mb-3 box px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 *:max-w-xs *:w-full *:mx-auto">
                <input placeholder="Asset No" pInputText [disabled]="true" [(ngModel)]="asset_no" />
                <input placeholder="Material Code" pInputText [disabled]="true" [(ngModel)]="material_code" />
                <input placeholder="Material Name" pInputText [disabled]="true" [(ngModel)]="material_name" />
                <input placeholder="Model" pInputText [disabled]="true" [(ngModel)]="model" />
                <p-floatlabel>
                    <p-select [filter]="true" filterBy="label" class="w-full" [(ngModel)]="statusScannerValue" [options]="status" [showClear]="true">
                        <ng-template let-option #item>
                            <p-tag [value]="option.label" severity="secondary" />
                        </ng-template>
                    </p-select>
                    <label for="username">Status</label>
                </p-floatlabel>
            </div>
            <h4 class="pl-5 pt-3">Location</h4>
            <div class="rounded gap-x-4 gap-y-7 mb-3 box px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 *:max-w-xs *:w-full *:mx-auto">
                <input placeholder="Corp Name" pInputText [disabled]="true" [(ngModel)]="corp" />
                <p-floatlabel>
                    <p-select [filter]="true" filterBy="label" class="w-full" [(ngModel)]="storageScannerValue" [options]="storage" [showClear]="true">
                        <ng-template let-option #item>
                            <p-tag [value]="option.label" severity="secondary" />
                        </ng-template>
                    </p-select>
                    <label for="username">Storage</label>
                </p-floatlabel>
            </div>

            <div class="rounded gap-4 mb-3 box px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 *:max-w-xs *:w-full *:mx-auto *:*:w-full">
                <p-button label="Clear Scanner" severity="secondary" [outlined]="true" icon="pi pi-filter-slash" (click)="clearScanner()" />
                <p-button [outlined]="true" severity="danger" icon="pi pi-save" label="Save Scanner" (click)="saveScanner()"></p-button>
            </div>
        </div>
    </div>`,
    styles: `
        @media screen and (max-width: 991px) {
            .video-container {
                position: relative;
            }
        }
        ::ng-deep {
            .qr-choose {
                input {
                    width: 86px !important;
                    border-radius: 10px;
                }
            }
            .camera-scanner {
                select {
                    width: 72px;
                    border-radius: 10px;
                    color: var(--input-text) !important;
                    text-align: center;
                }
            }
            .qr-result {
                button {
                    width: 15rem;
                    height: 15rem !important;
                    span {
                        font-size: 10rem;
                    }
                }
            }
        }
    `
})
export class Qrscanner implements OnDestroy {
    ingredient: string = 'single';
    value: string = '';
    file_open: string = 'No file selected';
    data!: any;
    private unsubscribe$ = new Subject<void>();
    private apiService = inject(EquipmentService);
    emno_id: string = '';
    corpFac!: any[];
    arrayMaterial!: SelectItem[];
    corpFilterValue: string | null = null;
    status!: SelectItem[];
    statusFilterValue: string | null = null;
    storage!: SelectItem[];
    storageFilterValue: string | null = null;
    flagScanner: boolean = false;
    flagImageScanner: boolean = false;
    asset_no: string = '';
    material_code: string = '';
    material_name: string = '';
    model: string = '';
    corp: string = '';
    statusScannerValue: string | null = null;
    storageScannerValue: string | null = null;

    @ViewChild('scanner') scanner!: ZXingScannerComponent;
    availableDevices: MediaDeviceInfo[] = [];
    selectedDevice?: MediaDeviceInfo;
    selectedCamera: string | null = '';
    avatarURL: any = null;
    valLanguage: any;
    optionLanguage: LanguageType = 'LANG_EN';

    constructor(
        public global_sv: GlobalsService,
        private messageService: MessageService
    ) {
        this.optionLanguage = this.global_sv.getLangue();
    }

    ngOnInit() {
        this.valLanguage = this.global_sv.getValLanguage();

        // Check if valLanguage is null and subscribe to the observable
        if (this.valLanguage === null) {
            this.global_sv._valLanguage$.subscribe((data) => {
                this.valLanguage = data;
                if (this.valLanguage !== null) {
                    this.loadListFilter();
                }
            });
        } else {
            this.loadListFilter();
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onCamerasFound(devices: MediaDeviceInfo[]): void {
        this.availableDevices = devices;
        this.selectedCamera = devices[0].deviceId;
        //Optional: Set a default camera
    }

    onDeviceChange(event: any): void {
        // Set selectedDevice based on the selected option in the dropdown
        const deviceId = event.target.value;
        this.selectedDevice = this.availableDevices.find((device) => device.deviceId === deviceId) || undefined;
    }

    refresh() {
        this.clear();
        this.clearScanner();
    }

    clear() {
        this.corpFilterValue = null;
        this.statusFilterValue = null;
        this.storageFilterValue = null;
        this.value = '';
        this.avatarURL = null;
        this.flagImageScanner = false;
        this.file_open = 'No file selected';
        this.resetFileInput();
    }

    clearScanner() {
        this.flagScanner = false;
        this.flagImageScanner = false;
        this.avatarURL = null;
        this.file_open = 'No file selected';
        this.value = '';
        this.resetFileInput();
    }

    changeRadioMullti() {
        if (this.ingredient === 'mulltiple') {
            this.flagScanner = true;
            this.clearScanner();
        } else {
            this.flagScanner = false;
        }
    }

    saveScanner() {
        let param = {
            emno: this.emno_id,
            sts_cd: this.statusScannerValue,
            factory: this.storageScannerValue
        };
        this.apiService.updateQRScanEquipmentInfo(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    if (response.indexOf('errors') === -1) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'QR Scan update successfully', life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update QR Scan', life: 3000 });
                    }
                }
            },
            (error) => {
                console.error('Error update QR Scan EquipmentInfo:', error);
            }
        );
    }

    saveMulltiple() {
        let flagSave = false;
        let param = {
            ds_data: <any>[],
            factory: '',
            lstMtcd: <any>[]
        };

        if (this.statusFilterValue !== null) {
            flagSave = true;
        }
        if (this.storageFilterValue !== null) {
            flagSave = true;
        }

        const words: any = this.value.split(',');
        if (words.length > 1) {
            param.factory = this.storageFilterValue ?? '';
            words.forEach((ele: any) => {
                param.ds_data.push({
                    factory: this.storageFilterValue ?? '',
                    sts_cd: this.statusFilterValue,
                    mt_cd: ele.trim()
                });
                param.lstMtcd.push(ele.trim());
            });
        } else if (words.length >= 0 && words.length <= 1) {
            param = {
                ds_data: [
                    {
                        factory: this.storageFilterValue ?? '',
                        sts_cd: this.statusFilterValue,
                        mt_cd: words[0].trim()
                    }
                ],
                factory: this.storageFilterValue ?? '',
                lstMtcd: [words[0].trim()]
            };
        } else {
            flagSave = false;
        }

        if (flagSave) {
            this.apiService.saveQRScannerMulti(param).subscribe(
                (response) => {
                    if (response !== null && response !== undefined) {
                        if (response.indexOf('errors') === -1) {
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'QR Scan update successfully', life: 3000 });
                        } else {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update QR Scan', life: 3000 });
                        }
                    }
                },
                (error) => {
                    console.error('Error update QR Scan EquipmentInfo:', error);
                }
            );
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please scan QR Code and choose Status or Storage!', life: 3000 });
        }
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

    loadListFilter(): void {
        forkJoin({
            corp: this.global_sv.getCorp(),
            status: this.global_sv.getStatus(),
            storage: this.global_sv.getStorage('')
        }).subscribe(
            (responses) => {
                if (responses.corp !== null && responses.corp !== undefined) {
                    this.corpFac = responses.corp.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                }
                if (responses.status !== null && responses.status !== undefined) {
                    this.status = responses.status.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
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

    resetFileInput() {
        const fileInput: any = document.getElementById('file_input_qr');
        fileInput.value = ''; // Clears the selected file
    }

    onScanSuccess(result: any): void {
        // alert('Scan Result: ' + result);
        this.value = result;
        this.selectedDevice =
            this.availableDevices.find((device) => {
                return device.label.indexOf('sau') !== -1 || device.label.indexOf('rear') !== -1;
            }) || undefined;
        if (this.ingredient !== 'mulltiple') {
            this.getEquipmentInfoOne(result);
        } else {
            this.value = this.value !== '' ? this.value + ', ' + this.readQRFormat(result) : this.readQRFormat(result);
        }
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            const mimeType = file.type;
            if (mimeType.match(/image\/*/) == null) {
                // console.log('Only images are supported.');
                return;
            }

            const reader = new FileReader();
            reader.onload = async (e: any) => {
                this.avatarURL = reader.result;
                // Use ZXing.BrowserQRCodeReader to decode the image
                const { BrowserQRCodeReader } = await import('@zxing/browser');
                const codeReader = new BrowserQRCodeReader();
                codeReader
                    .decodeFromImageUrl(e.target.result)
                    .then((result: any) => {
                        if (this.ingredient !== 'mulltiple') {
                            this.getEquipmentInfoOne(result.getText());
                        } else {
                            this.value = this.value !== '' ? this.value + ', ' + this.readQRFormat(result.getText()) : this.readQRFormat(result.getText());
                        }
                    })
                    .catch((err: any) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed Image No QR Code!', life: 3000 });
                        setTimeout(() => {
                            this.clearScanner();
                        }, 1500);
                    });
            };
            this.file_open = file.name;
            reader.readAsDataURL(file);
        }
    }

    readQRFormat(string: string): string {
        const words = string.split(',');
        let Mtl_Code = '';
        if (words.length > 1) {
            let code = words[0].split(':');
            Mtl_Code = code[1].trim();
        } else {
            const md_code = string.split(':');
            Mtl_Code = md_code[1].trim();
        }
        return Mtl_Code;
    }

    getEquipmentInfoOne(param: string): void {
        const words = param.split(',');
        let body = '';
        let Mtl_Code = '';

        this.asset_no = '';
        this.material_code = '';
        this.material_name = '';
        this.model = '';
        this.corp = '';
        this.statusScannerValue = null;
        this.storageScannerValue = null;

        if (words.length > 1) {
            Mtl_Code = words[0];
            body = words[1];
            this.apiService
                .getEquipmentInfoOne(body)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(
                    (response) => {
                        // Handle response
                        if (response === null || response === undefined) {
                            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Material Code not found!', life: 3000 });
                            return;
                        }
                        this.flagScanner = true;
                        this.flagImageScanner = true;

                        this.emno_id = response.emno;
                        this.asset_no = response.as_no;
                        this.material_code = response.mt_cd;
                        this.material_name = response.mt_nm;
                        this.model = response.md_cd;
                        this.corp = response.corp_nm;
                        this.handleChangeCorp({ value: response.corp });
                        this.statusScannerValue = response.sts_cd;
                        this.storageScannerValue = response.factory;
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Load QR Success!', life: 3000 });
                    },
                    (error: any) => {
                        // console.error('Error handleChangeCorp:', error);
                        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Material Code not found!', life: 3000 });
                    }
                );
        } else {
            const md_code = param.split(':');
            Mtl_Code = md_code[1].trim();
            this.apiService
                .getEquipmentInfoOne_mdcode(Mtl_Code)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(
                    (response) => {
                        if (response === null || response === undefined) {
                            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Material Code not found!', life: 3000 });
                            return;
                        }
                        // Handle response
                        this.flagScanner = true;
                        this.flagImageScanner = true;

                        if (response.rows.length > 0) {
                            this.emno_id = response.rows[0].emno;
                            this.asset_no = response.rows[0].as_no;
                            this.material_code = response.rows[0].mt_cd;
                            this.material_name = response.rows[0].mt_nm;
                            this.model = response.rows[0].md_cd;
                            this.corp = response.rows[0].corp_nm;
                            this.handleChangeCorp({ value: response.rows[0].corp });
                            this.statusScannerValue = response.rows[0].sts_cd;
                            this.storageScannerValue = response.rows[0].factory;
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Load QR Success!', life: 3000 });
                        } else {
                            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Material Code not found!', life: 3000 });
                        }
                    },
                    (error: any) => {
                        // console.error('Error handleChangeCorp:', error);
                        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Material Code not found!', life: 3000 });
                    }
                );
        }

        this.value = Mtl_Code;
    }
}
