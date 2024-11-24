import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrdemServicoService {
  private apiUrl = 'https://devterrasa.com/java/v1/private/work-order/';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
  }

  getWorkOrder(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}`, {
      headers: this.getHeaders(),
    });
  }

  list(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, {
      headers: this.getHeaders(),
    });
  }

  create(dto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, dto, {
      headers: this.getHeaders(),
    });
  }

  update(dto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, dto, {
      headers: this.getHeaders(),
    });
  }
}
