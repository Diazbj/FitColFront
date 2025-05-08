import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntrenadorService } from '../../../servicios/entrenador.service';
import { EntrenadorDTO } from '../../../dto/entrenador/entrenador-dto';
import { EditarEntrenadorDTO } from '../../../dto/entrenador/editar-entrenador-dto';
import { Router } from '@angular/router';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-perfil-entrenador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-entrenador.component.html',
  styleUrls: ['./perfil-entrenador.component.css']
})
export class PerfilEntrenadorComponent implements OnInit {
  usuario!: EntrenadorDTO;
  editando: boolean = false;
  usuarioEditado: EditarEntrenadorDTO = {} as EditarEntrenadorDTO;

  constructor(private router: Router, private authService: AuthService,private entrenadorService: EntrenadorService) {}

  telefonosString: string = '';

  ngOnInit(): void {
    this.entrenadorService.obtenerEntrenador().subscribe({
      next: (res) => {
        const entrenador = res.mensaje;
        this.usuario = entrenador;
        console.log('Entrenador recibido:', res.mensaje);
        this.usuarioEditado = this.mapEntrenadorToEditarDTO(entrenador);
        this.telefonosString = entrenador.telefonos?.join(', ') || ''; // Convierte array a string
      },
      error: (err) => {
        console.error('Error al obtener entrenador:', err);
      }
    });
  }

  activarEdicion() {
    this.editando = true;
  }

  cancelarEdicion() {
    this.editando = false;
    this.usuarioEditado = this.mapEntrenadorToEditarDTO(this.usuario);
  }

  actualizarEntrenador() {
    const dto: EditarEntrenadorDTO = {
      ...this.usuarioEditado,
      telefonos: this.telefonosString.split(',').map(t => t.trim()).filter(t => t !== '') // Convierte string a array
    };

    this.entrenadorService.editarEntrenador(dto).subscribe({
      next: () => {
        this.usuario = { ...this.usuario, ...dto };
        console.log('Entrenador actualizado:', this.usuario);
        this.editando = false;
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
      }
    });
  }

  eliminarEntrenador() {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmacion) {
      this.entrenadorService.eliminarEntrenador().subscribe({
        next: () => {
          console.log('Entrenador eliminado con éxito.');
          alert
          // Aquí puedes redirigir al usuario o realizar otra acción
          this.authService.logout();
          this.router.navigate(['/ruta-a-redirigir']);
        },
        error: (err) => {
          console.error('Error al eliminar entrenador:', err);
        }
      });
    }
  }
  private mapEntrenadorToEditarDTO(entrenador: EntrenadorDTO): EditarEntrenadorDTO {
    return {
      primerNombre: entrenador.primerNombre,
      segundoNombre: entrenador.segundoNombre,
      primerApellido: entrenador.primerApellido,
      segundoApellido: entrenador.segundoApellido,
      aniosExp: entrenador.aniosExp,
      telefonos: entrenador.telefonos ?? [],
    };
  }



}