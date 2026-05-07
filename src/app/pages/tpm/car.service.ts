import { Injectable } from '@angular/core';
import { Car } from './car';

@Injectable({
    providedIn: 'root'
})
export class CarService {
    generateCar(id: number): Car {
        return {
            id,
            vin: `VIN${id}`,
            year: 2000 + (id % 20),
            brand: `Brand${id % 5}`,
            color: ['Red', 'Blue', 'Green', 'Black', 'White'][id % 5]
        };
    }
}