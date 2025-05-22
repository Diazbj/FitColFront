import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EditarNutricionistaDTO } from '../../../dto/nutricionista/editar-nutricionista-dto';
import { NutricionistaDTO } from '../../../dto/nutricionista/nutricionista-dto';
import { NutricionistaService } from '../../../servicios/nutricionista.service';
import { AuthService } from '../../../servicios/auth.service';
import { ClienteSuscritoDTO } from '../../../dto/nutricionista/cliente-suscritodto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-perfil-nutricionista',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './perfil-nutricionista.component.html',
  styleUrl: './perfil-nutricionista.component.css'
})
export class PerfilNutricionistaComponent implements OnInit {
  usuario!: NutricionistaDTO;
  editando: boolean = false;
  usuarioEditado: EditarNutricionistaDTO = {} as EditarNutricionistaDTO;
  clienteSuscrito:ClienteSuscritoDTO[] = [];
  constructor(private router: Router, private authService: AuthService, private nutricionistaService: NutricionistaService) { }

  telefonosString: string = '';

  ngOnInit(): void {
    this.obtenerSuscritos();
    this.nutricionistaService.obtenerNutricionista().subscribe({
      next: (res) => {
        const nutricionista = res.mensaje;
        this.usuario = nutricionista;
        console.log('Nutricionista recibido:', res.mensaje);
        this.usuarioEditado = this.mapNutricionistaToEditarDTO(nutricionista);
        this.telefonosString = nutricionista.telefonos?.join(', ') || ''; // Convierte array a string
      },
      error: (err) => {
        console.error('Error al obtener nutricionista:', err);
      }
    });
  }

  activarEdicion() {
    this.editando = true;
  }

  cancelarEdicion() {
    this.editando = false;
    this.usuarioEditado = this.mapNutricionistaToEditarDTO(this.usuario);
  }

  actualizarNutricionista() {
    const dto: EditarNutricionistaDTO = {
      ...this.usuarioEditado,
      telefonos: this.usuarioEditado.telefonos
    };

    this.nutricionistaService.editarNutricionista(dto).subscribe({
      next: () => {
        this.usuario = { ...this.usuario, ...dto };
        this.editando = false;
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
      }
    });
  }

  
  eliminarNutricionista() {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
  
    if (confirmacion) {
      this.nutricionistaService.eliminarNutricionista().subscribe({
        next: () => {
          console.log('Nutricionista eliminado con éxito');
          alert('Nutricionista eliminado con éxito');
          // Puedes redirigir al usuario aquí si es necesario
          this.authService.logout();
          this.router.navigate(['/ruta-a-redirigir']);
        },
        error: (err) => {
          console.error('Error al eliminar el nutricionista:', err);
        }
      });
    } else {
      console.log('Eliminación cancelada por el usuario');
    }
  }
  private mapNutricionistaToEditarDTO(nutricionista: NutricionistaDTO): EditarNutricionistaDTO {
    return {
      primerNombre: nutricionista.primerNombre,
      segundoNombre: nutricionista.segundoNombre,
      primerApellido: nutricionista.primerApellido,
      segundoApellido: nutricionista.segundoApellido,
      telefonos: nutricionista.telefonos ?? [],
      aniosExp: nutricionista.aniosExp
    };
  }

  //--------------------------------------------------------------------------- Consulta Intermedia 3----------------------------------------------------

  obtenerSuscritos() {
    this.nutricionistaService.obtenerSuscritos().subscribe({
      next: (res) => {
        this.clienteSuscrito = res.mensaje;
        console.log('Clientes suscritos:', this.clienteSuscrito);
      },
      error: (err) => {
        console.error('Error al obtener clientes suscritos:', err);
      }
    });
  }

  generarPDFClientesSuscritos(): void {
  if (!this.clienteSuscrito || this.clienteSuscrito.length === 0) {
    console.warn("No hay clientes suscritos para exportar.");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Clientes Suscritos a Planes Alimenticios', 14, 20);

  const tablaDatos = this.clienteSuscrito.map(cliente => [
    cliente.usuarioId,
    cliente.primerNombre + ' ' + cliente.primerApellido,
    cliente.planAlimenticio,
    cliente.nombreSuscripcion,
    `$${cliente.precio.toFixed(2)}`,
    `${cliente.duracion} días`
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['ID Usuario', 'Nombre', 'Plan Alimenticio', 'Suscripción', 'Precio', 'Duración']],
    body: tablaDatos,
    styles: { fontSize: 9, halign: 'center' }
  });

  doc.save('clientes_suscritos.pdf');
}

  //--------------------------------------------------------------------------- Consulta Intermedia 3 ----------------------------------------------------
}
