import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoginResponse { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/login';
  private tokenKey = 'auth_token';
  private loggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem(this.tokenKey));

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
  

  logout() { 
    localStorage.removeItem(this.tokenKey);
    this.loggedIn$.next(false);
  }


  getToken(): string | null { return localStorage.getItem(this.tokenKey); }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

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

  getRroleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Payload del token:', payload); // Verificar el contenido del payload
    return payload.rol || null;
  }

  isAdmin(): boolean {
    const rol = this.getRroleFromToken();
    return rol === 'ROLE_ADMIN';
  }
  isEntrenador(): boolean {
    const rol = this.getRroleFromToken();
    return rol === 'ROLE_ENTRENADOR';
  }
  isCliente(): boolean {
    const rol = this.getRroleFromToken();
    return rol === 'ROLE_CLIENTE';
  }
  isNutricionista(): boolean {
    const rol = this.getRroleFromToken();
    return rol === 'ROLE_NUTRICIONISTA';
  }
}