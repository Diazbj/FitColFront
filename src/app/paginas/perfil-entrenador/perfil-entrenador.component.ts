import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntrenadorService } from '../../servicios/entrenador.service';
import { EntrenadorDTO } from '../../dto/entrenador/entrenador-dto';
import { EditarEntrenadorDTO } from '../../dto/entrenador/editar-entrenador-dto';

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

  constructor(private entrenadorService: EntrenadorService) {}

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
      telefonos: this.usuarioEditado.telefonos
    };

    this.entrenadorService.editarEntrenador(dto).subscribe({
      next: () => {
        this.usuario = { ...this.usuario, ...dto };
        this.editando = false;
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
      }
    });
  }

  eliminarEntrenador() {
    this.entrenadorService.eliminarEntrenador().subscribe({
      next: () => {
        console.log('Entrenador eliminado con éxito');
        // Aquí puedes redirigir al usuario a otra página o mostrar un mensaje de éxito
      },
      error: (err) => {
        console.error('Error al eliminar el entrenador:', err);
      }
    });
  }

  private mapEntrenadorToEditarDTO(entrenador: EntrenadorDTO): EditarEntrenadorDTO {
    return {
      primerNombre: entrenador.primerNombre,
      segundoNombre: entrenador.segundoNombre,
      primerApellido: entrenador.primerApellido,
      segundoApellido: entrenador.segundoApellido,
      telefonos: entrenador.telefonos ?? [],
      aniosExp: entrenador.aniosExp
    };
  }



}