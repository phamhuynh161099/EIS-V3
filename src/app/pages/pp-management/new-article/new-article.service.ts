import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NewArticleService {
    constructor(private http: HttpClient) { }

    getNewArticles(body: any): Observable<any> {
        return this.http.post<any>('api/dsh/newArt/getNewArticles', body);
    }

    getSeasonFromArticle(body: any): Observable<any> {
        return this.http.post<any>('api/dsh/newArt/getSeasonFromArticle', body);
    }
}
