import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-barcode',
  standalone: true,
  imports: [CommonModule],
  template: `<svg #barcodeContainer></svg>`,
})
export class BarcodeComponent implements AfterViewInit, OnChanges {
  @ViewChild('barcodeContainer') barcodeElement!: ElementRef;

  @Input() value: string = '';
  @Input() format: string = 'CODE128'; // Default format, can be changed
  @Input() width: number = 2.5;
  @Input() height: number = 100;
  @Input() displayValue: boolean = true; // Whether to display the text below the barcode

  ngAfterViewInit(): void {
    this.generateBarcode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-generate the barcode if any of the inputs change
    if (changes['value'] || changes['format'] || changes['width'] || changes['height'] || changes['displayValue']) {
      this.generateBarcode();
    }
  }

  private generateBarcode(): void {
    // Wait for the view to be initialized
    if (!this.barcodeElement || !this.barcodeElement.nativeElement) {
      return;
    }

    // Ensure there is a value to encode
    if (!this.value) {
        this.barcodeElement.nativeElement.innerHTML = ''; // Clear previous barcode
        return;
    }

    try {
      JsBarcode(this.barcodeElement.nativeElement, this.value, {
        format: this.format,
        width: this.width,
        height: this.height,
        displayValue: false, // this.displayValue,
        fontOptions: "normal", //bold
        margin: 0
      });
    } catch (e) {
      console.error('Error generating barcode:', e);
      // If the value is invalid for the chosen format, clear the SVG
      this.barcodeElement.nativeElement.innerHTML = '';
    }
  }
}
