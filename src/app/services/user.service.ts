import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  UserDto,
  UserRoleUpdateDto,
} from './../pages/usuario/usuario.model';

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

  list(search?: string): Observable<UserDto[]> {
    const url = search ? `${this.apiUrl}?search=${search}` : this.apiUrl;
    return this.http.get<UserDto[]>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.handle401Error(() => this.list(search));
        } else {
          return this.handleError(error);
        }
      })
    );
  }

  register(registerDto: RegisterDto): Observable<UserDto> {
    return this.http
      .post<UserDto>(`${this.apiUrl}register`, registerDto, {
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

  update(userDto: UserDto): Observable<UserDto> {
    return this.http
      .put<UserDto>(this.apiUrl, userDto, { headers: this.getHeaders() })
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

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}${id}`, { headers: this.getHeaders() })
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

  listRoles(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.apiUrl}roles`, { headers: this.getHeaders() })
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

  updateRole(updateDto: UserRoleUpdateDto): Observable<UserDto> {
    return this.http
      .put<UserDto>(`${this.apiUrl}role`, updateDto, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.handle401Error(() => this.updateRole(updateDto));
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  listMechanics(): Observable<UserDto[]> {
    return this.http
      .get<UserDto[]>(`${this.apiUrl}mechanics`, { headers: this.getHeaders() })
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
