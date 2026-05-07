import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EspService {
    constructor(private http: HttpClient) { }

    // Example GET request
    getData(): Observable<any> {
        return this.http.get<any>('tmp');
    }


    getListESPLine(): Observable<any> {
        const body = { func_Id: 'serach_fn' };
        return this.http.post<any>(`esp/getListESPLine`, body);
    }


    getListESPDevice(): Observable<any> {
        const body = { func_Id: 'serach_fn' };
        return this.http.post<any>(`esp/getListESPDevice`, body);
    }

    getListLine(): Observable<any> {
        const body = { func_Id: 'serach_fn' };
        return this.http.post<any>(`esp/getListLine`, body);
    }

    getLineConnectESP(): Observable<any> {
        const body = { func_Id: 'serach_fn' };
        return this.http.post<any>(`esp/getLineConnectESP`, body);
    }

    saveLineConnectESP(body: any): Observable<any> {
        return this.http.post<any>(`esp/saveLineConnectESP`, body);
    }

    removeLineConnectESP(body: any): Observable<any> {
        return this.http.post<any>(`esp/removeLineConnectESP`, body);
    }


    // Engineer of ESP
    getEngineerConnectESP(): Observable<any> {
        const body = { func_Id: 'serach_fn' };
        return this.http.post<any>(`esp/getEngineerConnectESP`, body);
    }

    getLisrtESPDeviceOfEngineer(): Observable<any> {
        const body = { func_Id: 'serach_fn' };
        return this.http.post<any>(`esp/getListESPDeviceOfEngineer`, body);
    }

    saveEngineerConnectESP(body: any): Observable<any> {
        return this.http.post<any>(`esp/saveEngineerConnectESP`, body);
    }

    getListEngineer(): Observable<any> {
        const body = { func_Id: 'serach_fn' };
        return this.http.post<any>(`esp/getListEngineer`, body);
    }

    removeEngineerConnectESP(body: any): Observable<any> {
        return this.http.post<any>(`esp/removeEngineerConnectESP`, body);
    }

    // =========
    getEngineerConnectLine(): Observable<any> {
        const body = { func_Id: 'serach_fn' };
        return this.http.post<any>(`esp/getEngineerConnectLine`, body);
    }

    saveEngineerConnectLine(body: any): Observable<any> {
        return this.http.post<any>(`esp/saveEngineerConnectLine`, body);
    }

    removeEngineerConnectLine(body: any): Observable<any> {
        return this.http.post<any>(`esp/removeEngineerConnectLine`, body);
    }

    //====== Ticket History Dashboard
    getListTicket(body: any): Observable<any> {
        return this.http.post<any>(`esp/getListTicket`, body);
    }

    //====== Tracking Dashboard
    getListLineStatus(body: any): Observable<any> {
        return this.http.post<any>(`esp/getListLineStatus`, body);
    }

    //====== Line Management
    saveLine(body: any): Observable<any> {
        return this.http.post<any>(`esp/saveLine`, body);
    }

    //====== Engineer Management
    saveEngineer(body: any): Observable<any> {
        return this.http.post<any>(`esp/saveEngineer`, body);
    }
}
