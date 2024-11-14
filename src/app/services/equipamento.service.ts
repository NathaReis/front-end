import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {
  private apiUrl = 'https://devterrasa.com/java/v1/public/equipament/';

  constructor(private http: HttpClient) {}

  getEquipament(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}`);
  }

  list(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  create(dto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, dto);
  }

  update(dto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

  getEquipamentByQrCode(qrCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}qr-code/${qrCode}`);
  }
}
