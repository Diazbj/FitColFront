import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { ClienteService } from '../../servicios/cliente.service';
import { ClienteDTO } from '../../dto/cliente-dto';
import { CommonModule } from '@angular/common';
import { EditarClienteDTO } from '../../dto/editar-cliente-dto';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario!: ClienteDTO;
  editando: boolean = false;
  usuarioEditado: EditarClienteDTO = {} as EditarClienteDTO;

  constructor(private clienteService: ClienteService) {}

  telefonosString: string = '';

ngOnInit() {
  this.clienteService.obtenerCliente().subscribe({
    next: (cliente) => {
      console.log("Cliente recibido:", cliente);
      this.usuario = cliente;
      this.usuarioEditado = this.mapClienteToEditarDTO(cliente);
      this.telefonosString = cliente.telefonos?.join(', ') || ''; // ✅ Convierte array a string
    },
    error: (err) => console.error("Error en la API:", err)
  });
}


  activarEdicion() {
    this.editando = true;
  }

  cancelarEdicion() {
    this.editando = false;
    this.usuarioEditado = this.mapClienteToEditarDTO(this.usuario);
  }

  actualizarCliente() {
    const dto: EditarClienteDTO = {
      ...this.usuarioEditado,
      telefonos: this.telefonosString.split(',').map(t => t.trim()).filter(t => t !== '') // ✅ Convierte string a array
    };
  
    this.clienteService.editarCliente(dto).subscribe({
      next: () => {
        this.usuario = { ...this.usuario, ...dto };
        this.usuario.telefonos = dto.telefonos;
        this.editando = false;
      },
      error: (err) => console.error("Error al actualizar:", err)
    });
  }
  

  // 🔽 Método de conversión incluido en la clase
  private mapClienteToEditarDTO(cliente: ClienteDTO): EditarClienteDTO {
    return {
      primerNombre: cliente.primerNombre,
      segundoNombre: cliente.segundoNombre,
      primerApellido: cliente.primerApellido,
      segundoApellido: cliente.segundoApellido,
      historialMedico: cliente.historialMedico,
      peso: cliente.peso,
      telefonos: cliente.telefonos ?? []
    };
  }
}
