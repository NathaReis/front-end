import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {
  private apiUrl = 'https://devterrasa.com/java/v1/private/equipament/';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('acessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
  }

  getEquipament(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}`, { headers: this.getHeaders() });
  }

  list(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  create(dto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, dto, { headers: this.getHeaders() });
  }

  update(dto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, dto, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`, { headers: this.getHeaders() });
  }

  getEquipamentByQrCode(qrCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}qr-code/${qrCode}`, { headers: this.getHeaders() });
  }
}