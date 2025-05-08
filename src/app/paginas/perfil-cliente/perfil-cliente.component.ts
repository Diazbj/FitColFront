import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { ClienteService } from '../../servicios/cliente.service';
import { ClienteDTO } from '../../dto/cliente/cliente-dto';
import { CommonModule } from '@angular/common';
import { EditarClienteDTO } from '../../dto/cliente/editar-cliente-dto';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-perfil-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-cliente.component.html',
  styleUrls: ['./perfil-cliente.component.css']
})
export class PerfilClienteComponent implements OnInit {
  usuario!: ClienteDTO;
  editando: boolean = false;
  usuarioEditado: EditarClienteDTO = {} as EditarClienteDTO;

  constructor(private router: Router, private authService: AuthService,private clienteService: ClienteService) {}

  telefonosString: string = '';

ngOnInit() {
  this.clienteService.obtenerCliente().subscribe({
    next: (res) => {
      const cliente = res.mensaje;
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

  eliminarCliente() {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmacion) {
      this.clienteService.eliminarCliente().subscribe({
        next: () => {
          console.log("Cliente eliminado");
          alert("Cliente eliminado con éxito");
          this.authService.logout(); // Cierra sesión del usuario después de eliminar la cuenta
          this.router.navigate(['/ruta-a-redirigir']);
          // Aquí puedes redirigir al usuario a otra página o mostrar un mensaje de éxito
        },
        error: (err) => console.error("Error al eliminar cliente:", err)
      });
    }
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
