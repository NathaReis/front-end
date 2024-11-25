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
export class UserService {
  private apiUrl = 'https://devterrasa.com/java/v1/private/user/';

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

  list(search?: string): Observable<any> {
    const url = search ? `${this.apiUrl}?search=${search}` : this.apiUrl;
    return this.http.get(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.handle401Error(() => this.list(search));
        } else {
          return this.handleError(error);
        }
      })
    );
  }

  register(registerDto: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}register`, registerDto, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.handle401Error(() => this.register(registerDto));
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  update(userDto: any): Observable<any> {
    return this.http
      .put(this.apiUrl, userDto, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.handle401Error(() => this.update(userDto));
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  delete(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}${id}`, { headers: this.getHeaders() })
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

  listRoles(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}roles`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.handle401Error(() => this.listRoles());
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  updateRole(userDto: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}role`, userDto, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.handle401Error(() => this.updateRole(userDto));
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  listMechanics(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}mechanics`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.handle401Error(() => this.listMechanics());
          } else {
            return this.handleError(error);
          }
        })
      );
  }
}
