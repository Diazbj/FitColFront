import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngredienteService {
  private apiUrl = 'http://localhost:8080/api/ingrediente';

  constructor(private http: HttpClient, private authService: AuthService) { }

  obtenerIngredientes(): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.get<MensajeDTO>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
    crearIngrediente(dto: any): Observable<MensajeDTO> {
        const token = this.authService.getToken();
        return this.http.post<MensajeDTO>(this.apiUrl, dto, {
        headers: { Authorization: `Bearer ${token}` }
        });
    }
    eliminarIngrediente(nombre: string): Observable<MensajeDTO> {
        const token = this.authService.getToken();
        return this.http.delete<MensajeDTO>(`${this.apiUrl}/${nombre}`, {
        headers: { Authorization: `Bearer ${token}` }
        });
    }
    asignarIngredienteAComida(dto: any): Observable<MensajeDTO> {
        const token = this.authService.getToken();
        return this.http.post<MensajeDTO>(`${this.apiUrl}/asignarIngrdiente`, dto, {
        headers: { Authorization: `Bearer ${token}` }
        });
    }

    obtenerIngredientesPorComida(id: number): Observable<MensajeDTO> {
        const token = this.authService.getToken();
        return this.http.get<MensajeDTO>(`${this.apiUrl}/comida/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
        });
    }
}
