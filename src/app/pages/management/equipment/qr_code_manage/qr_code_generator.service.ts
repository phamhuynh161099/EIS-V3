import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class QrCodeGeneratorService {
    constructor(private http: HttpClient) { }

    // Example GET request
    getData(body: any): Observable<any> {
        return this.http.post<any>('api/dsh/newArt/getNewArticles', body);
    }

}
