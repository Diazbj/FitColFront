import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class RutinaService {
    private apiUrl = 'http://localhost:8080/api/rutinas'; // Replace with your backend URL

    constructor(private http: HttpClient, private authService: AuthService) { }

    crearRutina(dto: any): Observable<MensajeDTO> {
        const token = this.authService.getToken(); // Assuming you store the token in local storage
        return this.http.post<MensajeDTO>(this.apiUrl, dto, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    editarRutina(id: number, dto: any): Observable<MensajeDTO> {
        const token = this.authService.getToken(); // Assuming you store the token in local storage
        return this.http.put<MensajeDTO>(`${this.apiUrl}/${id}`, dto, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }


    eliminarRutina(id: number): Observable<MensajeDTO> {
        const token = this.authService.getToken(); // Assuming you store the token in local storage
        return this.http.delete<MensajeDTO>(`${this.apiUrl}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    listarRutinas(): Observable<MensajeDTO> {
        const token = this.authService.getToken();
        return this.http.get<MensajeDTO>(`${this.apiUrl}/entrenador`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    obtenerRutina(id: number): Observable<MensajeDTO> {
        const token = this.authService.getToken(); // Assuming you store the token in local storage
        return this.http.get<MensajeDTO>(`${this.apiUrl}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    asignarRutinaAPlan(dto: any): Observable<MensajeDTO> {
        const token = this.authService.getToken(); // Assuming you store the token in local storage
        return this.http.post<MensajeDTO>(`${this.apiUrl}/asignarPlan`, dto, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    

}