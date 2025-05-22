import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { CrearNutricionistaDTO } from '../dto/nutricionista/crear-nutricionista-dto';
import { EditarNutricionistaDTO } from '../dto/nutricionista/editar-nutricionista-dto';

@Injectable({
  providedIn: 'root'
})
export class NutricionistaService {

  private apiUrl = 'http://localhost:8080/api/nutricionistas';

  constructor( private http: HttpClient, private authService: AuthService) { }


    // Crear nutricionista
  crearNutricionista(dto: CrearNutricionistaDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(this.apiUrl, dto);
  } 

  // Obtener nutricionista
  obtenerNutricionista(): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.get<MensajeDTO>(`${this.apiUrl}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Editar nutricionista
  editarNutricionista(dto: EditarNutricionistaDTO): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.put<MensajeDTO>(`${this.apiUrl}`, dto, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  eliminarNutricionista(): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.delete<MensajeDTO>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  obtenerSuscritos(): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.get<MensajeDTO>(`${this.apiUrl}/suscritos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }


}
