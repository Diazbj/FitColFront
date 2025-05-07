import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearClienteDTO } from '../dto/crear-cliente-dto';
import { ClienteDTO } from '../dto/cliente-dto';
import { EditarClienteDTO } from '../dto/editar-cliente-dto';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { MensajeDTO } from '../dto/mensaje-dto';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient, private authService: AuthService) {}



  // Crear cliente
  crearCliente(dto: CrearClienteDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(this.apiUrl, dto);
  }

  obtenerCliente(): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.get<MensajeDTO>(`${this.apiUrl}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  
  
  
  editarCliente(dto: EditarClienteDTO): Observable<MensajeDTO> {
    const token = this.authService.getToken();
    return this.http.put<MensajeDTO>(`${this.apiUrl}`, dto, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Eliminar cliente
  eliminarCliente(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.apiUrl}/${id}`);
  }

  public obtenerCiudades(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>('http://localhost:8080/api/ciudades')
  }


}
