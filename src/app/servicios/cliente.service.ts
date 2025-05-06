import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearClienteDTO } from '../dto/crear-cliente-dto';
import { ClienteDTO } from '../dto/cliente-dto';
import { EditarClienteDTO } from '../dto/editar-cliente-dto';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient, private authService: AuthService) {}



  // Crear cliente
  crearCliente(dto: CrearClienteDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  obtenerCliente(): Observable<ClienteDTO> {
    const token = this.authService.getToken();
    return this.http.get<{ error: boolean; mensaje: ClienteDTO }>('http://localhost:8080/api/clientes', {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map((response: { error: boolean; mensaje: ClienteDTO }) => response.mensaje)
    );
  }
  
  
  
  editarCliente(dto: EditarClienteDTO): Observable<any> {
    const token = this.authService.getToken();
    return this.http.put(`${this.apiUrl}`, dto, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  

  // Eliminar cliente
  eliminarCliente(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


}
