import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';

import { ButtonModule } from 'primeng/button';
import { Subject } from 'rxjs';
import { TPMService } from './tpm.service';

import { TableModule } from 'primeng/table';
import { Car } from './car';
import { CarService } from './car.service';


interface Column {
    field: string;
    header: string;
}

@Component({
    imports: [CommonModule, ButtonModule, FormsModule, TextareaModule, TableModule],
    standalone: true,
    template: `<div class="card">
        Plan Test
    <p-table [columns]="cols" [value]="virtualCars" [scrollable]="true" scrollHeight="400px" [rows]="100" [virtualScroll]="true" [virtualScrollItemSize]="46" [lazy]="true" (onLazyLoad)="loadCarsLazy($event)">
        <ng-template #header let-columns>
            <tr>
                <th *ngFor="let col of columns" style="width: 20%;">
                    {{col.header}}
                </th>
            </tr>
        </ng-template>
        <ng-template #body let-rowData let-columns="columns">
            <tr style="height:46px">
                <td *ngFor="let col of columns">
                    {{rowData[col.field]}}
                </td>
            </tr>
        </ng-template>
        <ng-template #loadingbody let-columns="columns">
            <tr style="height:46px">
                <td *ngFor="let col of columns; let even = even">
                    <p-skeleton [ngStyle]="{'width': even ? (col.field === 'year' ? '30%' : '40%') : '60%'}" />
                </td>
            </tr>
        </ng-template>
    </p-table>
</div>`,
    styles: `
       
    `
})
export class TMPPlan implements OnInit { //, OnDestroy
    ingredient!: string;
    value!: string;
    file_open: string = 'No file selected';
    data!: any;
    private unsubscribe$ = new Subject<void>();
    private apiService = inject(TPMService);


     cars!: Car[];

    virtualCars!: Car[];

    cols!: Column[];

    constructor(private carService: CarService) {
        console.log('Qrscanner data test func resource:'); //this.dataResource
    }

    // Using Angular's resource to handle data fetching
    // Note: The resource function is a placeholder for demonstration purposes.
    // dataResource = resource({
    //     loader: async (request) => {
    //         const response: any = this.apiService.getData().toPromise();
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch data');
    //         }
    //         return await response.json();
    //     }
    // });

    ngOnInit() {
        // this.apiService
        //     .getData()
        //     .pipe(takeUntil(this.unsubscribe$))
        //     .subscribe((response) => {
        //         // Handle response
        //         console.log('subscribe:', response);
        //     });
    this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'vin', header: 'Vin' },
            { field: 'year', header: 'Year' },
            { field: 'brand', header: 'Brand' },
            { field: 'color', header: 'Color' }
        ];

        this.cars = Array.from({ length: 10000 }).map((_, i) => this.carService.generateCar(i + 1));
        this.virtualCars = Array.from({ length: 10000 });
    }

    loadCarsLazy(event: any) {
        //simulate remote connection with a timeout
        setTimeout(() => {
            //load data of required page
            let loadedCars = this.cars.slice(event.first, event.first + event.rows);

            //populate page of virtual cars
            // Array.prototype.splice.apply(this.virtualCars, [...[event.first, event.rows], ...loadedCars]);
            this.virtualCars.splice(event.first, event.rows, ...loadedCars);

            //trigger change detection
            event.forceUpdate();
        }, Math.random() * 1000 + 250);
    }

    // ngOnDestroy() {
    //     this.unsubscribe$.next();
    //     this.unsubscribe$.complete();
    // }

}
