import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ComidaService {
  private apiUrl = 'http://localhost:8080/api/comida';

  constructor(private http: HttpClient, private authService: AuthService) { }
  obtenerComidas(): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.get<MensajeDTO>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  crearComida(dto: any): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    console.log('DTO enviado al backend:', dto); 
    return this.http.post<MensajeDTO>(this.apiUrl, dto, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  eliminarComida(id:number): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.delete<MensajeDTO>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  editarComida(id:number, dto: any): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    console.log('DTO enviado al backend:', dto); 
    return this.http.put<MensajeDTO>(`${this.apiUrl}/${id}`, dto, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  asignarComidaAPlan(dto: any): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.post<MensajeDTO>(`${this.apiUrl}/asignarPlan`, dto, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  listarComidasPorPlan(id: number): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.get<MensajeDTO>(`${this.apiUrl}/plan/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }



}
