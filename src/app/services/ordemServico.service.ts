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
export class OrdemServicoService {
  private apiUrl = 'https://devterrasa.com/java/v1/public/notification/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
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

  getWorkOrder(id: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  list(): Observable<any> {
    return this.http
      .get(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  create(dto: any): Observable<any> {
    return this.http
      .post(this.apiUrl, dto, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  update(dto: any): Observable<any> {
    return this.http
      .put(this.apiUrl, dto, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}
