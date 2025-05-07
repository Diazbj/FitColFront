import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearEntrenadorDTO } from '../dto/entrenador/crear-entrenador-dto';
import { EntrenadorDTO } from '../dto/entrenador/entrenador-dto';
import { EditarEntrenadorDTO } from '../dto/entrenador/editar-entrenador-dto';
import { AuthService } from './auth.service';
import { MensajeDTO } from '../dto/mensaje-dto';

@Injectable({
  providedIn: 'root'
})
export class EntrenadorService {
  private apiUrl = 'http://localhost:8080/api/entrenadores';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Crear entrenador
  crearEntrenador(dto: CrearEntrenadorDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(this.apiUrl, dto);
  }

  // Obtener entrenador
  obtenerEntrenador(): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.get<MensajeDTO>(`${this.apiUrl}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Editar entrenador
  editarEntrenador(dto: EditarEntrenadorDTO): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.put<MensajeDTO>(`${this.apiUrl}`, dto, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Eliminar entrenador
  eliminarEntrenador(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.apiUrl}/${id}`);
  }

  // Obtener ciudades
  obtenerCiudades(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>('http://localhost:8080/api/ciudades');
  }
}
