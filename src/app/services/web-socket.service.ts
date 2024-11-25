import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private apiUrl = 'https://devterrasa.com/java/v1/public/notification/';
  private socket: WebSocket | undefined;
  private notificationSubject: Subject<string> = new Subject<string>();

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

  sendNotification(): Observable<string> {
    return this.http
      .get<string>(`${this.apiUrl}send-notification`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.handle401Error(() => this.sendNotification());
          } else {
            return this.handleError(error);
          }
        })
      );
  }

  connect(): void {
    this.socket = new WebSocket('wss://devterrasa.com/java/v1/public/notification/ws');
    this.socket.onmessage = (event) => {
      this.notificationSubject.next(event.data);
    };
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  getNotifications(): Observable<string> {
    return this.notificationSubject.asObservable();
  }
}