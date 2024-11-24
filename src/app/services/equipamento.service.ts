import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EquipamentoService {
  private apiUrl = 'https://devterrasa.com/java/v1/private/equipament/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Erro ${error.status}: ${error.message}`;
    }
    console.error('An error occurred:', errorMessage);
    return throwError(errorMessage);
  }

  private handle401Error(request: () => Observable<any>): Observable<any> {
    return this.authService.refreshToken().pipe(
      switchMap((tokens: any) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        return request();
      }),
      catchError(this.handleError)
    );
  }

  getEquipament(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.handle401Error(() => this.getEquipament(id));
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  list(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.handle401Error(() => this.list());
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  create(dto: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}`, dto, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.handle401Error(() => this.create(dto));
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  update(dto: any): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}`, dto, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.handle401Error(() => this.update(dto));
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.handle401Error(() => this.delete(id));
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  getEquipamentByQrCode(qrCode: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}qr-code/${qrCode}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.handle401Error(() =>
              this.getEquipamentByQrCode(qrCode)
            );
          } else {
            return this.handleError(error);
          }
        })
      );
  }
}
