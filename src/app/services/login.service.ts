import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://devterrasa.com/java/v1/public/auth/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    console.log("🚀 ~ file: login.service.ts:14 ~ LoginService ~ login ~ password:", password);
    console.log("🚀 ~ file: login.service.ts:14 ~ LoginService ~ login ~ email:", email);
    return this.http.post(this.apiUrl, { login: email, password: password });
  }
}