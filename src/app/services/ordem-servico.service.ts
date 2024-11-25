import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { WorkOrderDto, ClosureDto, InputDataDto, OutputDto, WorkOrderCreateDto } from './../pages/ordem-servico/ordem-servico.model'

@Injectable({
  providedIn: 'root',
})
export class OrdemServicoService {
  private apiUrl = 'https://devterrasa.com/java/v1/private/work-order/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Erro ${error.status}: ${error.message}`;
    }
    console.error('An error occurred:', errorMessage);
    return throwError(errorMessage);
  }

  handle401Error(request: () => Observable<any>): Observable<any> {
    return this.authService.refreshToken().pipe(
      switchMap((tokens: any) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        return request();
      }),
      catchError(this.handleError)
    );
  }

  getWorkOrder(id: number): Observable<WorkOrderDto> {
    return this.http.get<WorkOrderDto>(`${this.apiUrl}${id}`, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(() => this.getWorkOrder(id));
        } else {
          return this.handleError(error);
        }
      })
    );
  }

  list(): Observable<WorkOrderDto[]> {
    return this.http.get<WorkOrderDto[]>(`${this.apiUrl}`, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(() => this.list());
        } else {
          return this.handleError(error);
        }
      })
    );
  }

  create(dto: WorkOrderCreateDto): Observable<WorkOrderCreateDto> {
    return this.http.post<WorkOrderCreateDto>(`${this.apiUrl}`, dto, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(() => this.create(dto));
        } else {
          return this.handleError(error);
        }
      })
    );
  }

  update(dto: WorkOrderDto): Observable<WorkOrderDto> {
    return this.http.put<WorkOrderDto>(`${this.apiUrl}`, dto, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(() => this.update(dto));
        } else {
          return this.handleError(error);
        }
      })
    );
  }
}