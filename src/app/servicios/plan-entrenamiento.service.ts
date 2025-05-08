import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { MensajeDTO } from '../dto/mensaje-dto';

@Injectable({
  providedIn: 'root'
})
export class PlanEntrenamientoService {
  private apiUrl = 'http://localhost:8080/api/planEntrenamiento';

  constructor(private http: HttpClient, private authService: AuthService) { }

   // Crear un nuevo plan de entrenamiento
   crearPlanEntrenamiento(plan: any): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.post<MensajeDTO>(this.apiUrl, plan, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Obtener todos los planes de entrenamiento
  obtenerPlanesEntrenamiento(): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.get<MensajeDTO>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Obtener un plan de entrenamiento por ID
  obtenerPlanEntrenamientoById(id: number): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.get<MensajeDTO>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

 

  // Actualizar un plan de entrenamiento
  editarPlanEntrenamiento(id: number, plan: any): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.put<MensajeDTO>(`${this.apiUrl}/${id}`, plan, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Eliminar un plan de entrenamiento
  eliminarPlanEntrenamiento(id: number): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.delete<MensajeDTO>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Obtener tipos de entrenamiento
  obtenerTiposEntrenamiento(): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.get<MensajeDTO>('http://localhost:8080/api/tipo-entrenamiento', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
  }

}
