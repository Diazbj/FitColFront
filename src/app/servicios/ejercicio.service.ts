import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { AuthService } from './auth.service';



@Injectable({
    providedIn: 'root'
})
export class EjercicioService {
    private apiUrl = 'http://localhost:8080/api/ejercicio';

    constructor(private http: HttpClient, private authService: AuthService ) {}

    obtenerEjercicios(): Observable<MensajeDTO> {
        const token = this.authService.getToken(); // Assuming you store the token in local storage
        return this.http.get<MensajeDTO>(`${this.apiUrl}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    crearEjercicio(dto: any): Observable<MensajeDTO> {
        const token = this.authService.getToken(); // Assuming you store the token in local storage
        return this.http.post<MensajeDTO>(this.apiUrl, dto, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    editarEjercicio(id: number, dto: any): Observable<MensajeDTO> {
        const token = this.authService.getToken(); // Assuming you store the token in local storage
        return this.http.put<MensajeDTO>(`${this.apiUrl}/${id}`, dto, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    eliminarEjercicio(id: number): Observable<MensajeDTO> {
        const token = this.authService.getToken(); // Assuming you store the token in local storage
        return this.http.delete<MensajeDTO>(`${this.apiUrl}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
    
    asignarEjercicioARutina(dto: any): Observable<MensajeDTO> {
        const token = this.authService.getToken(); // Assuming you store the token in local storage
        return this.http.post<MensajeDTO>(`${this.apiUrl}/asignarEjercicio`, dto, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    eliminarAsignacionEjercicioARutina(idEjercicio: number, idRutina: number): Observable<MensajeDTO> {
  const token = this.authService.getToken();
  return this.http.delete<MensajeDTO>(
    `${this.apiUrl}/eliminarAsignacion?idEjercicio=${idEjercicio}&idRutina=${idRutina}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}

}