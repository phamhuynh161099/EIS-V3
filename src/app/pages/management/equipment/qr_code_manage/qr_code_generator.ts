import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { BarcodeComponent } from '../../../../../components/barcode.component';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { EquipmentService } from '../equipment.service';

import { NgxPrintModule, NgxPrintService, PrintOptions } from 'ngx-print';
import { take } from 'rxjs';

@Component({
    selector: 'qr-code-generator',
    imports: [CommonModule, QRCodeComponent, FormsModule, ButtonModule, Toast, NgxPrintModule, BarcodeComponent],
    providers: [MessageService],
    template: `
        <div class="text-center">
            <p-toast />
            <div class="flex justify-between mb-2 w-full">
                <div class="flex">
                    <p-button [severity]="flagBarQR ? 'success' : 'secondary'" (click)="changeBarCode()" [outlined]="true" class="self-end mr-3">{{ btnBarCode }}</p-button>
                    <p-button [severity]="flagBarQR ? 'secondary' : 'success'" (click)="changeQRCode()" [outlined]="true" class="self-end">{{ btnQRCode }}</p-button>
                </div>

                <p-button [severity]="'info'" (click)="printMe()" [outlined]="true" class="">{{ printText }}</p-button>
            </div>
            <div class="print-container">
                <div id="print-section" #tableRef ngxPrintElement class="myDivToPrint  mb-14 lg:mb-4">
                    <div class="style_print">
                        <div *ngFor="let item of dataSelectedQR" class="print-page">
                            <div class="print-item mb-16 mr-1 ml-1 p-3" pRipple style="border: 1px solid rgba(75, 175, 80, 0.3); --p-ripple-background: rgba(75, 175, 80, 0.3)">
                                <div class="text flex justify-center border-b border-black">
                                    <label>{{ item.mt_nm }}</label>
                                </div>
                                <div class="text flex justify-center border-b border-black mb-1">
                                    <label>{{ getFormattedDate() }}</label>
                                </div>
                                <!-- IMPORTANT: render as SVG so cloned content keeps QR -->
                                <!-- QRcode -->
                                <qrcode *ngIf="!flagBarQR" class="mt-0 flex justify-center" [qrdata]="changeValue(item)" [width]="130" [errorCorrectionLevel]="'M'" [elementType]="'svg'"> </qrcode>

                                <!-- Barcode -->
                                <div *ngIf="flagBarQR" class="flex justify-center my-0 max-w-full">
                                    <app-barcode [value]="item.mt_cd" [width]="2.3" [height]="60" [displayValue]="true"></app-barcode>
                                </div>
                                <div class="text flex justify-center border-b border-black mt-1">
                                    <label>{{ item.mt_cd }}</label>
                                </div>
                            </div>
                        </div>
                        <!-- If you keep a hidden sample, also render as SVG/IMG -->
                        <div class="hidden">
                            <qrcode class="flex justify-center" [qrdata]="qrdata" [width]="200" [errorCorrectionLevel]="'M'" [elementType]="'svg'"> </qrcode>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            @media print {
                @page {
                    size: A4 landscape;
                }
                /* Ensure each .style_print prints as a single page */
                .style_print {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    /* disable grid during print to allow page breaks between items */
                    display: block !important;
                }
                /* One item per page via wrapper */
                .print-page {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    break-after: page;
                    page-break-after: always;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .print-page:last-child {
                    break-after: auto;
                    page-break-after: auto;
                }
                /* Force a page break between consecutive .style_print blocks */
                .style_print + .style_print {
                    break-before: page;
                    page-break-before: always;
                }
                .style_print:not(:last-child) {
                    break-after: page;
                    page-break-after: always;
                }
                /* Avoid splitting individual items across pages and force new page per item */
                .print-item {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    /* center horizontally, size to content */
                    display: inline-block;
                    width: max-content;
                    max-width: 100%;
                    margin: 0 auto;
                    text-align: center;
                }
                /* center content via container styles; avoid forcing visibility of QR/barcode */
                .print-item label {
                    display: inline-block;
                }
            }
            .style_print {
                background: #fff;
                color: #000;
                label {
                    color: #000;
                }
            }
            .btn_print {
                position: absolute;
                margin-top: -4rem;
                display: flex;
                right: 7rem;
            }

            .qr-code-generator {
                max-width: 100%;
                min-width: 400px;
                margin: 0 auto;
                text-align: center;
            }
        `
    ]
})
export class QrCodeGeneratorComponent {
    qrdata: string = 'pro test';
    @Input() dataSelectedQR: any = [];
    @Input() printText: string = '';
    @Input() printTitle: string = 'Print Bar/QR Code';
    @Input() btnBarCode: string = '';
    @Input() btnQRCode: string = '';
    flagBarQR: boolean = true;
    // printer
    constructor(
        private messageService: MessageService,
        private sv: EquipmentService,
        private printService: NgxPrintService,
        private cdr: ChangeDetectorRef
    ) {}

    /**
     * Returns the current date formatted as yyyy.MM.dd.
     * @returns The formatted date string.
     */
    getFormattedDate(): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}.${month}.${day}`;
    }

    changeValue(value: any): string {
        // let result = `Mtl.Code:${value.mt_cd},${value.emno} `;
        let result = `${value.mt_cd}`;
        return result;
    }

    changeBarCode() {
        console.log('Constructor QR Code Generator Component', this.dataSelectedQR);
        this.flagBarQR = true;
    }

    changeQRCode() {
        this.flagBarQR = false;
    }

    printMe() {
        // Guard: avoid printing when there is no data
        const hasItems = Array.isArray(this.dataSelectedQR) && this.dataSelectedQR.length > 0;
        if (!hasItems) {
            this.messageService.add({ severity: 'warn', summary: 'No Data', detail: 'No items selected to print.', life: 3000 });
            return;
        }
        // Ensure QR SVGs are in the DOM before cloning
        this.cdr.detectChanges();

        const count = this.dataSelectedQR?.length || 0;
        const delay = Math.min(6000, 400 + count * 80); // wait a bit more for larger batches

        const customPrintOptions: PrintOptions = new PrintOptions({
            printSectionId: 'print-section',
            printTitle: this.printTitle || '',
            useExistingCss: true,
            printDelay: delay,
            previewOnly: false, // keep preview
            openNewTab: true // open in new tab to avoid about:blank header issues
        });

        this.printService.print(customPrintOptions);

        this.printService.printComplete$.pipe(take(1)).subscribe(() => {
            //   console.log('Print completed! printMe');
            this.showPrint();
        });
    }

    showPrint() {
        let param: any = {
            lstEmno: []
        };
        this.dataSelectedQR.forEach((item: any) => {
            param.lstEmno.push(item.emno);
        });

        this.sv.updateQREquipmentInfo(param).subscribe(
            (response) => {
                if (response !== null && response !== undefined) {
                }
            },
            (error) => {
                console.error('Error fetching equipment information:', error);
            }
        );
        this.messageService.add({ severity: 'success', summary: 'success', detail: 'QR code has been printed', key: 'bl', life: 4000 });
    }
}
