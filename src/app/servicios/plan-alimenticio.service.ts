import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { MensajeDTO } from '../dto/mensaje-dto';

@Injectable({
  providedIn: 'root'
})
export class PlanAlimenticioService {
  private apiUrl = 'http://localhost:8080/api/planAlimenticio';

  constructor(private http: HttpClient, private authService: AuthService) { }

  crearPlanAlimenticio(plan: any): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.post<MensajeDTO>(this.apiUrl, plan, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  obtenerPlanesAlimenticios(): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.get<MensajeDTO>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  obtenerPlanAlimenticioById(id: number): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.get<MensajeDTO>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  editarPlanAlimenticio(id: number, plan: any): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.put<MensajeDTO>(`${this.apiUrl}/${id}`, plan, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  eliminarPlanAlimenticio(id: number): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.delete<MensajeDTO>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }




}
