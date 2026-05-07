import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';
import { TextareaModule } from 'primeng/textarea';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EquipmentService } from '../equipment.service';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { Image } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { SelectItem, SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { Toast, ToastModule } from 'primeng/toast';

import { LanguageType, Name_Token } from '../../../../../constants/constants.auth';
import { GlobalsService } from '../../../../../globals.service';
import { BarcodeFormat } from '@zxing/library';
import { NgxBarcodeScannerModule, NgxBarcodeScannerService } from '@eisberg-labs/ngx-barcode-scanner';
import { Dialog } from 'primeng/dialog';
import { DialogCreateInformationComponent } from '../information/dialog_create_information';
import { OrderList } from 'primeng/orderlist';

type TMultipleScanResult = {
    emno: number;
    mt_cd: string;
    factory_nm: string;
    sts_nm: string;
};

@Component({
    imports: [
        CommonModule,
        ButtonModule,
        ToastModule,
        Toast,
        Image,
        InputTextModule,
        RadioButton,
        FormsModule,
        TextareaModule,
        ZXingScannerModule,
        FloatLabel,
        TagModule,
        SelectModule,
        NgxBarcodeScannerModule,
        Dialog,
        DialogCreateInformationComponent,
        OrderList
    ],
    standalone: true,
    providers: [EquipmentService, MessageService],
    templateUrl: `./qrscanner.component.html`,
    styles: `
        // .scanner {
        //     position: relative;
        // }

        // .scanner ::after {
        //     position: absolute;
        //     left: 0;
        //     top: 0;
        //     content: ' ';
        //     width: 100%;
        //     height: 100%;
        //     background-image: url('/assets/image/qr-focus-box.svg');
        //     background-size: cover;
        //     background-repeat: no-repeat;
        //     background-position: center center;
        // }

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

            .p-orderlist-controls {
                display: none !important;
            }

            .p-orderlist-list-container {
                width: 100%;
            }

            .camera-scanner {
                select {
                    width: 72px;
                    border-radius: 10px;
                    color: var(--input-text) !important;
                    text-align: center;
                }
            }

            .p-select-list-container {
                max-height: 250px !important;
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

            #scanResultTexInputHidden:focus {
                border-color: var(--p-green-500) !important;
            }

            #scanResultTexInputHidden:not(focus) {
                border-color: var(--p-red-500) !important;
            }

            .p-dialog-close-button {
                display: none !important;
            }
        }
    `
})
export class Qrscanner implements OnDestroy, AfterViewInit {
    @ViewChild('scanResultTextarea') scanResultTextarea!: ElementRef<HTMLTextAreaElement>;
    @ViewChild('scanResultTexInputHidden') scanResultTexInputHidden!: ElementRef<HTMLInputElement>;
    @ViewChild('scanner') scanner!: ZXingScannerComponent;
    ingredient: string = 'single';
    readonly multiple: string = 'multiple';
    file_open: string = 'No file selected';
    value: string = '';
    valueBarcode: string = '';
    valueBarcodeHidden: string = '';
    oldValueCamera: string = '';
    isShowScanOneInfo: boolean = false;
    flagImageScanner: boolean = false;
    flagCameraQR_Bar: boolean = true; // true QR , false Barcode
    flagBarcode: boolean = true;
    isTextareaDisabled: boolean = false;
    isError: boolean = false;
    flagScannerReset: boolean = false;
    isTextareaCameraDisabled: boolean = false;
    informationCreateDialog: boolean = false;
    loading_full: boolean = true;
    data!: any;
    private unsubscribe$ = new Subject<void>();
    private apiService = inject(EquipmentService);
    emno_id: string = '';
    corpFac!: any[];
    arrayMaterial!: SelectItem[];
    corpFilterValue: string | null = 'H100';
    status!: SelectItem[];
    statusFilterValue: string | null = null;
    storage!: SelectItem[];
    storageFilterValue: string | null = null;
    asset_no: string = '';
    material_code: string = '';
    material_name: string = '';
    model: string = '';
    corp: string = '';
    statusScannerValue: string | null = null;
    storageScannerValue: string | null = null;

    availableDevices: MediaDeviceInfo[] = [];
    selectedDevice?: MediaDeviceInfo;
    selectedCamera: string | null = '';
    avatarURL: any = null;
    valLanguage: any;
    optionLanguage: LanguageType = 'LANG_EN';
    valueBar_Code: string = '';
    token = localStorage.getItem(Name_Token);
    dataFull: any[] = [];
    event: any;
    mt_cd_not_existed: string = '';
    dataDoubleScanner: string = '';

    private activeSelectAnchor: HTMLElement | null = null;
    private vvCleanup: (() => void) | null = null;

    // Thêm thuộc tính này
    allowedBarcodeFormats: BarcodeFormat[] = [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.EAN_13, BarcodeFormat.CODE_39];

    constructor(
        public global_sv: GlobalsService,
        private messageService: MessageService,
        private sv: EquipmentService,
        private serviceBarCode: NgxBarcodeScannerService,
        private cdr: ChangeDetectorRef
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

    ngAfterViewInit() {
        this.barcodeScanner();
        // Mobile keyboard changes the visual viewport; re-scroll active select anchor.
        const vv = window.visualViewport;
        if (vv) {
            const handler = () => {
                if (this.activeSelectAnchor) {
                }
            };
            vv.addEventListener('resize', handler);
            vv.addEventListener('scroll', handler);
            this.vvCleanup = () => {
                vv.removeEventListener('resize', handler);
                vv.removeEventListener('scroll', handler);
            };
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.vvCleanup?.();
        this.vvCleanup = null;
    }

    onSelectPanelShow(anchor: HTMLElement) {
        this.activeSelectAnchor = anchor;
        // alert('onSelectPanelShow');
        window.scrollBy({ top: 0, behavior: 'smooth' });
    }

    onSelectPanelHide() {
        this.activeSelectAnchor = null;
    }

    // When filter input gets focus, keyboard is open: re-scroll active anchor.
    @HostListener('document:focusin', ['$event'])
    onDocumentFocusIn(event: FocusEvent) {
        if (!this.activeSelectAnchor) return;

        const target = event.target as HTMLElement | null;
        if (!target) return;

        // PrimeNG filter input lives inside the select overlay.
        if (target.tagName === 'INPUT' && (target.classList.contains('p-select-filter') || !!target.closest('.p-select-panel'))) {
            window.scrollBy({ top: 200, behavior: 'smooth' });
        }
    }

    onError(error: any) {
        console.error(error);
        this.isError = true;
    }

    onStartButtonPress() {
        this.serviceBarCode
            .start(this.serviceBarCode.defaultConfig(), 0.1)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (result: string) => {
                    this.isError = false;
                    if (this.dataDoubleScanner === result) {
                        return;
                    }
                    this.onBarcodeScanned(result);
                    this.dataDoubleScanner = result;
                },
                error: (err: any) => {
                    console.error('Error starting barcode scanner:', err);
                    this.isError = true;
                }
            });
    }

    /**
     * Bar Code Scanner
     * This method is called when ngx-barcode-scanner successfully scans a code.
     * @param newValue The scanned barcode value.
     */
    onBarcodeScanned(newValue: string) {
        if (!newValue) {
            return;
        }
        this.serviceBarCode.stop();
        this.messageService.add({ severity: 'Success', summary: 'Success', detail: 'QR Scan success:' + newValue, life: 3000 });
        if (this.ingredient !== this.multiple) {
            this.isTextareaCameraDisabled = true;
            this.getEquipmentInfoOne(newValue);
        } else {
            this.checkBarcodeExist(newValue);
        }
    }

    // *** zxing-scanner config Scanner QR ***
    onCamerasFound(devices: MediaDeviceInfo[]): void {
        this.availableDevices = devices;
        this.selectedCamera = devices[0].deviceId;
        //Optional: Set a default camera
    }

    onScanSuccess(result: any): void {
        this.selectedDevice =
            this.availableDevices.find((device) => {
                return device.label.indexOf('sau') !== -1 || device.label.indexOf('rear') !== -1;
            }) || undefined;

        if (this.oldValueCamera === result && this.ingredient != 'multiple') {
            this.messageService.add({ severity: 'info', summary: 'Success', detail: 'QR:' + result + ' || The QR code has already been scanned.', life: 3000 });
            return;
        } else this.oldValueCamera = result;
        if (this.ingredient !== this.multiple) {
            this.isTextareaCameraDisabled = true;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'QR: ' + result, life: 3000 });
            this.getEquipmentInfoOne(result);
        } else {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'QR: ' + result, life: 3000 });
            this.checkBarcodeExist(result);
        }
    }

    onDeviceChange(event: any): void {
        // Set selectedDevice based on the selected option in the dropdown
        const deviceId = event.target.value;
        this.selectedDevice = this.availableDevices.find((device) => device.deviceId === deviceId) || undefined;
    }

    refresh() {
        this.clearFile();
        this.clearScanner();
    }

    scannerCamera() {
        this.clearFile();
        this.isShowScanOneInfo = false;

        this.flagBarcode = false;
        this.flagImageScanner = false;
        if (this.ingredient === this.multiple && !this.flagBarcode && !this.flagCameraQR_Bar) {
            this.flagScannerReset = true;
        }
        this.onStartButtonPress();
    }

    barcodeScanner() {
        this.clearFile();
        this.isShowScanOneInfo = false;
        this.flagImageScanner = true;
        this.isTextareaDisabled = false;
        this.isTextareaCameraDisabled = false;
        this.flagScannerReset = false;
        this.flagBarcode = true;
        this.valueBarcode = '';
        this.serviceBarCode.stop();
        // Use setTimeout to wait for the view to update
        setTimeout(() => {
            if (this.scanResultTexInputHidden) {
                this.scanResultTexInputHidden.nativeElement.focus();
            }
        }, 0);
    }

    scannerCameraQR() {
        this.flagCameraQR_Bar = true;
        this.flagScannerReset = false;
        this.clearScanner();
    }

    scannerCameraBar() {
        this.flagCameraQR_Bar = false;
        this.flagScannerReset = true;
        this.clearScanner();
    }

    processScannedValue(scannedValue: string): void {
        if (!scannedValue) return;

        this.messageService.add({
            severity: 'success', summary: 'Success',
            detail: 'QR Scan success: ' + scannedValue, life: 3000
        });

        if (this.ingredient !== this.multiple) {
            this.isTextareaDisabled = true;
            this.valueBarcode = scannedValue;
            this.getEquipmentInfoOne(scannedValue, true);
        } else {
            this.checkBarcodeExist(scannedValue);
        }
        this.cdr.detectChanges();
    }

    onTextareaValueChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        const scannedValue = target.value.replace(/\n/g, '').trim();

        if (!scannedValue) return;

        this.processScannedValue(scannedValue);

        // Clear
        this.valueBarcodeHidden = '';
        target.value = '';

        if (this.scanResultTexInputHidden) {
            this.scanResultTexInputHidden.nativeElement.focus();
        }
        this.cdr.detectChanges();
    }

    clearFile() {
        this.corpFilterValue = 'H100';
        this.statusFilterValue = null;
        this.storageFilterValue = null;
        this.avatarURL = null;
        this.flagImageScanner = false;
        this.file_open = 'No file selected';
        this.resetFileInput();
    }

    clearScanner() {
        this.isShowScanOneInfo = false;
        this.flagImageScanner = false;
        this.avatarURL = null;
        this.file_open = 'No file selected';
        this.oldValueCamera = '';
        this.resetFileInput();
        this.multipleScanResults = [];
        if (this.flagBarcode) {
            this.barcodeScanner();
        }
    }

    changeRadioMullti(selectedValue: string) {
        if (selectedValue === this.multiple && !this.flagBarcode && !this.flagCameraQR_Bar) {
            this.flagScannerReset = true;
        } else {
            this.flagScannerReset = false;
        }
        this.clearScanner();
    }

    saveScanner() {
        let param = {
            emno: this.emno_id,
            sts_cd: this.statusScannerValue,
            factory: this.storageScannerValue
        };
        if (!this.statusScannerValue && !this.storageScannerValue) {
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please select Status or Storage', life: 3000 });
            return;
        }

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

    /**
     * Extracts the material code from a QR string.
     * For example, from "Mtl.Code:abc,12345" it will return "abc".
     * @param qrString The full string scanned from the QR code.
     * @returns The extracted material code, or null if the format is incorrect.
     */
    extractMaterialCode(qrString: string): string | null {
        if (!qrString) {
            return null;
        }

        // Find the part of the string after "Mtl.Code:"
        const parts = qrString.split(':');
        if (parts.length < 2) {
            return null; // The ":" separator was not found
        }

        // The value is the part after ":"
        let valueAfterColon = parts[1];

        // Find the part before the comma ","
        const commaIndex = valueAfterColon.indexOf(',');
        if (commaIndex !== -1) {
            // If a comma exists, take the substring before it
            return valueAfterColon.substring(0, commaIndex).trim();
        }

        // If no comma, the whole part is the code
        return valueAfterColon.trim();
    }

    saveMultiple() {
        const tokenPayload: any = this.token !== null ? JSON.parse(this.token) : {};

        let flagSave = false;
        let param = {
            ds_data: <any>[],
            factory: '',
            lstMtcd: <any>[],
            reg_id: tokenPayload.name || '',
            chg_id: tokenPayload.name || ''
        };

        if (this.statusFilterValue || this.storageFilterValue) {
            flagSave = true;
        }

        let words: any = null;
        // if (this.flagBarcode) {
        //     words = this.valueBarcode.split('\n').filter((word) => word.trim() !== '');
        // } else {
        words = this.multipleScanResults.map((s) => s.mt_cd);
        // }
        if (words.length > 0) {
            param.factory = this.storageFilterValue ?? '';
            words.forEach((ele: any) => {
                param.ds_data.push({
                    factory: this.storageFilterValue ?? '',
                    sts_cd: this.statusFilterValue,
                    mt_cd: ele.trim(),
                    reg_id: tokenPayload.name || '',
                    chg_id: tokenPayload.name || ''
                });
                param.lstMtcd.push(ele.trim());
            });
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please scan QR Code', life: 3000 });
            return;
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

    handleChangeCorp(event: any) {
        const observable = this.global_sv.getStorage(event.value).pipe(takeUntil(this.unsubscribe$));

        observable.subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.storage = response.filter((item: any) => item.comm_nm !== '').map((item: any) => ({ label: item.comm_nm, value: item.comm_cd }));
                }
            },
            (error) => {
                console.error('Error handleChangeCorp:', error);
            }
        );

        return observable;
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
                const { BrowserMultiFormatReader } = await import('@zxing/browser');
                const codeReader = new BrowserMultiFormatReader();
                codeReader
                    .decodeFromImageUrl(e.target.result)
                    .then((result: any) => {
                        if (this.ingredient !== this.multiple) {
                            this.getEquipmentInfoOne(result.getText());
                        } else {
                            this.value = this.value !== '' ? this.value + '\n' + result : result;
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'QR Scan success:' + result.getText(), life: 3000 });
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

    isOpenDialog = false;
    listMtCd: string[] = [];
    onOpenDialog() {
        this.isOpenDialog = true;
    }

    onCloseDialog() {
        if (this.ingredient !== this.multiple) {
            this.refresh();
        }
        if (this.flagBarcode && this.scanResultTexInputHidden) {
            this.scanResultTexInputHidden.nativeElement.focus();
        }
        this.isOpenDialog = false;
    }

    onOpenCreateDialog() {
        this.informationCreateDialog = true;
    }

    multipleScanResults: TMultipleScanResult[] = [];
    getEquipmentInfoOne(param: string, createFlag: boolean = false): void {
        this.asset_no = '';
        this.material_code = '';
        this.material_name = '';
        this.model = '';
        this.corp = '';
        this.statusScannerValue = null;
        this.storageScannerValue = null;

        if (param.length > 1) {
            if (this.value !== '' && this.value === param && !createFlag) {
                this.value = param;
                this.messageService.add({ severity: 'error', summary: 'Warn', detail: param, life: 3000 });
                return;
            }
            this.apiService
                .getEquipmentInfoOne_mdcode(param)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(
                    (response) => {
                        if (response === null || response === undefined) {
                            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Server Error!', life: 3000 });
                            return;
                        }
                        // Handle response
                        this.isShowScanOneInfo = true;
                        // this.flagImageScanner = true;

                        if (response.rows.length > 0) {
                            this.emno_id = response.rows[0].emno;
                            this.asset_no = response.rows[0].as_no;
                            this.material_code = response.rows[0].mt_cd;
                            this.material_name = response.rows[0].mt_nm;
                            this.model = response.rows[0].md_cd;
                            this.corp = response.rows[0].corp_nm;
                            this.statusScannerValue = response.rows[0].sts_cd;
                            this.storageScannerValue = response.rows[0].factory;
                            console.log({
                                emno: response.rows[0].emno,
                                mt_cd: response.rows[0].mt_cd,
                                factory_nm: response.rows[0].factory_nm,
                                sts_nm: response.rows[0].sts_nm
                            });

                            // ****** corp đang bị error nên tạm thời comment *******
                            // this.handleChangeCorp({ value: response.rows[0].corp }).subscribe(() => {
                            //     this.storageScannerValue = response.rows[0].factory;
                            // });
                        } else {
                            this.isShowScanOneInfo = false;
                            this.flagImageScanner = false;

                            this.mt_cd_not_existed = param;
                            this.onOpenDialog();
                            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Material Code not found!', life: 3000 });
                        }
                    },
                    (error: any) => {
                        // console.error('Error handleChangeCorp:', error);
                        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Server Error!', life: 3000 });
                    }
                );

            this.value = param;
        }
    }

    fetchData() {
        this.loading_full = true;
        // this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Calling data from back end, lots of data, please wait a few seconds.', life: 3000 });
        this.sv.selectEquipmentInfo([]).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                    this.dataFull = response.rows;
                    this.listMtCd = response.rows.map((t: any) => t.mt_cd);
                    this.loading_full = false;
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
    }

    changeHideDialog(isDialog: boolean) {
        if (this.flagBarcode && this.scanResultTexInputHidden) {
            this.scanResultTexInputHidden.nativeElement.focus();
        }
        this.informationCreateDialog = isDialog;
    }

    onCreateDone() {
        this.isOpenDialog = false;
        this.getEquipmentInfoOne(this.value, true);
        if (this.flagBarcode && this.scanResultTexInputHidden) {
            this.scanResultTexInputHidden.nativeElement.focus();
        }
    }

    checkBarcodeExist(mt_cd: string): void {
        this.apiService
            .getEquipmentInfoOne_mdcode(mt_cd)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (response) => {
                    if (response === null || response === undefined) {
                        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Server Error!', life: 3000 });
                        return;
                    }

                    if (response.rows.length == 0) {
                        this.mt_cd_not_existed = mt_cd;
                        this.onOpenDialog();
                        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Material Code not found!', life: 3000 });
                        return;
                    }
                    if (!this.multipleScanResults.find((e) => e.emno == response.rows[0].emno)) {
                        this.multipleScanResults = [
                            ...this.multipleScanResults,
                            {
                                emno: response.rows[0].emno,
                                mt_cd: response.rows[0].mt_cd,
                                factory_nm: response.rows[0].factory_nm,
                                sts_nm: response.rows[0].sts_nm
                            }
                        ];
                    }
                },
                (error: any) => {
                    // console.error('Error handleChangeCorp:', error);
                    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Server Error!', life: 3000 });
                }
            );
        if (!this.flagBarcode) this.value = this.value !== '' ? this.value + '\n' + mt_cd : mt_cd;
    }
    handleRemoveSelected(emno: number) {
        this.multipleScanResults = this.multipleScanResults.filter((r) => r.emno != emno);
    }
}
