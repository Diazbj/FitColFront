import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface LoginResponse { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/login';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(this.baseUrl, { email, password })
      .pipe(
        tap(res => {
          console.log('Token recibido:', res.token); // Verificar si el token llega
          localStorage.setItem(this.tokenKey, res.token);
        })
      );
  }
  

  logout() { localStorage.removeItem(this.tokenKey); }
  getToken(): string | null { return localStorage.getItem(this.tokenKey); }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.userId || payload.sub || null;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
    
  }


}