import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { AuthService } from './auth.service';
import { RankingClienteDTO } from '../dto/progreso/rankingClientedto';

@Injectable({
    providedIn: 'root'
})
export class ProgresoService {
    private apiUrl = 'http://localhost:8080/api/progreso'; // Replace with your backend URL

    constructor(private http: HttpClient, private authService: AuthService) { }

    obtenerRanking(): Observable<MensajeDTO> {
        const token = this.authService.getToken(); // Assuming you store the token in local storage
        return this.http.get<MensajeDTO>(`${this.apiUrl}/ranking`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    obtenerPlanesDeficit(): Observable<MensajeDTO> {
        const token = this.authService.getToken(); // Assuming you store the token in local storage
        return this.http.get<MensajeDTO>(`${this.apiUrl}/planes-deficit`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

}