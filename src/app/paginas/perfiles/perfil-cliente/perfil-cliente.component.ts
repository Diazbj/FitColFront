import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../servicios/auth.service';
import { ClienteService } from '../../../servicios/cliente.service';
import { ClienteDTO } from '../../../dto/cliente/cliente-dto';
import { CommonModule } from '@angular/common';
import { EditarClienteDTO } from '../../../dto/cliente/editar-cliente-dto';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecomendacionEntrenamientoDTO } from '../../../dto/cliente/recomendacion-entrenamientodto';
import { ProgresoSemanalDTO } from '../../../dto/cliente/progreso-semanaldto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  progresoSemanal: ProgresoSemanalDTO[] = [];

  constructor(private router: Router, private authService: AuthService,private clienteService: ClienteService) {}

  telefonosString: string = '';

ngOnInit() {
  this.obtenerRecomendacionEntrenamiento();
  this.obtenerProgresoSemanal();
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

  recomendacion: RecomendacionEntrenamientoDTO | null = null;


//---------------------------------------------------------------------------Consulta avanzada 1 ----------------------------------------------------
obtenerRecomendacionEntrenamiento() {
  console.log("Llamando al servicio de recomendación...");

  this.clienteService.obtenerRecomendacionEntrenamiento().subscribe({
    next: (res: { mensaje: RecomendacionEntrenamientoDTO }) => {
      console.log("Respuesta completa de la API:", res);

      if (res && res.mensaje) {
        this.recomendacion = res.mensaje;
        console.log("DTO recibido:", this.recomendacion);
        console.log("Usuario ID:", this.recomendacion.usuarioId);
        console.log("Nombre Completo:", this.recomendacion.nombreCompleto);
        console.log("Edad:", this.recomendacion.edad);
        console.log("Planes Recomendados (raw):", this.recomendacion.planesRecomendados);
        console.log("Planes Recomendados (list):", this.recomendacion.planesRecomendados.split(', '));
      } else {
        console.warn("La respuesta no contiene la propiedad 'mensaje'");
      }
    },
    error: (err) => {
      console.error("Error al obtener la recomendación de entrenamiento:", err);
    }
  });
}

generarPDFRecomendacion() {
  if (!this.recomendacion) {
    console.warn("No hay recomendación para generar PDF.");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Recomendación de Entrenamiento', 14, 20);

  const body = [
    ['Nombre Completo', this.recomendacion.nombreCompleto],
    ['Edad', `${this.recomendacion.edad} años`],
    ['Planes Recomendados', this.recomendacion.planesRecomendados.split(', ').join('\n')],
  ];

  autoTable(doc, {
    startY: 30,
    head: [['Campo', 'Valor']],
    body,
    styles: { cellPadding: 2 },
  });

  doc.save('recomendacion_entrenamiento.pdf');
}


//---------------------------------------------------------------------------Consulta avanzada 1 ----------------------------------------------------

//---------------------------------------------------------------------------Consulta intermedia 1 ----------------------------------------------------

obtenerProgresoSemanal(): void {
  this.clienteService.obtenerProgresoSemanal().subscribe({
    next: (res: { mensaje: ProgresoSemanalDTO[] }) => {
      console.log("Progreso semanal recibido:", res.mensaje);
      this.progresoSemanal = res.mensaje;  // <-- Asigna los datos recibidos
    },
    error: (err) => {
      console.error("Error al obtener el progreso semanal:", err);
    }
  });
}

generarPDFProgresoSemanal() {
  if (!this.progresoSemanal || this.progresoSemanal.length === 0) {
    console.warn("No hay datos de progreso semanal para generar PDF.");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Progreso Semanal', 14, 20);

  const tableData = this.progresoSemanal.map((item) => [
    new Date(item.semana).toLocaleDateString(), // Formatea fecha
    `${item.pesoSemana} kg`,
    item.imcSemana.toFixed(2),
    item.entCompletosSemana
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['Semana', 'Peso', 'IMC', 'Entrenamientos Completos']],
    body: tableData,
    styles: { halign: 'center' }
  });

  doc.save('progreso_semanal.pdf');
}





//---------------------------------------------------------------------------Consulta intermedia 1 ----------------------------------------------------


}
