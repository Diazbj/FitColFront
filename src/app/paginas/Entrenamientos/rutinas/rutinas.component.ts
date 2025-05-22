import { Component, OnInit } from '@angular/core';
import { RutinaService } from '../../../servicios/rutina.service';
import { PlanEntrenamientoService } from '../../../servicios/plan-entrenamiento.service';
import { crearRutinaCompletaDTO } from '../../../dto/rutina/crear-rutina-completadto';
// Removed unused import 'ejercicioRutinaDTO'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EjercicioService } from '../../../servicios/ejercicio.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-rutinas',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule], // Added FormsModule to resolve 'ngModel' binding errors
  templateUrl: './rutinas.component.html',
  styleUrls: ['./rutinas.component.css']
})
export class RutinasComponent implements OnInit {

  planes: any = null; // Adjusted to match the expected type
  nuevaRutina: crearRutinaCompletaDTO = {
    nombre: '',
    codPlanEntrenamiento: null as any,
    ejercicios: []
  };
  rutinas: any[] = [];

  planSeleccionado: number = 0;
  rutinasFiltradas: any[] = [];
  rutinaSeleccionada: any = null;

  nuevoEjercicio: any = {
  codEjercicio: null,
  numeroRepeticiones: 0,
  numeroSeries: 0
};


  constructor(
    private rutinaService: RutinaService,
    private planEntrenamientoService: PlanEntrenamientoService,
    private ejercicioService: EjercicioService
    
  ) { }
  ejerciciosDisponibles: any[] = [];
  ngOnInit(): void {
    this.cargarPlanes();
    this.cargarRutinas();
    this.cargarEjercicios();
  }

  cargarPlanes() {
    this.planEntrenamientoService.obtenerPlanesEntrenamiento().subscribe({
      next: (resp: any) => {
        console.log('Planes obtenidos:', resp.mensaje); // ← Agrega esto
        this.planes = resp.mensaje || [];
      },
      error: err => console.error('Error cargando planes de entrenamiento:', err)
    });
  }

  cargarEjercicios() {
    this.ejercicioService.obtenerEjercicios().subscribe({
      next: (resp: any) => {
        console.log('Ejercicios obtenidos:', resp.mensaje); // ← Agrega esto
        this.ejerciciosDisponibles = resp.mensaje || [];
      },
      error: err => console.error('Error cargando ejercicios:', err)
    });
  }

  agregarEjercicio() {
    this.nuevaRutina.ejercicios.push({ numeroRepeticiones: 0, numeroSeries: 0 , codEjercicio: 0 });
  }

  crearRutina() {
    if (!this.nuevaRutina.nombre.trim() || this.nuevaRutina.codPlanEntrenamiento <= 0) {
      alert('Debes completar todos los campos principales.');
      return;
    }

    // Validar que los ejercicios tienen datos válidos
    const ejerciciosInvalidos = this.nuevaRutina.ejercicios.some(e =>
      !e.codEjercicio || e.numeroRepeticiones <= 0 || e.numeroSeries <= 0
    );

    if (ejerciciosInvalidos) {
      alert('Revisa los ejercicios: no pueden estar vacíos ni en cero.');
      return;
    }

    console.log('Enviando rutina:', this.nuevaRutina);

    this.rutinaService.crearRutina(this.nuevaRutina).subscribe({
      next: resp => {
        alert('Rutina creada correctamente');
        this.nuevaRutina = { nombre: '', codPlanEntrenamiento: 0, ejercicios: [] };
        this.cargarRutinas();
      },
      error: err => console.error('Error creando rutina:', err)
    });
  }

  crearEjercicio() {
    console.log('Intentando crear ejercicio:', this.nuevoEjercicio);

    if (!this.nuevoEjercicio.nombre.trim() || this.nuevoEjercicio.numeroRepeticiones <= 0 || this.nuevoEjercicio.numeroSeries <= 0) {
      alert('Completa todos los datos del ejercicio');
      console.warn('Datos incompletos:', this.nuevoEjercicio);
      return;
    }

    this.ejercicioService.crearEjercicio(this.nuevoEjercicio).subscribe({
      next: resp => {
        console.log('Respuesta del backend al crear ejercicio:', resp);
        alert('Ejercicio creado correctamente');
        this.nuevoEjercicio = { nombre: '', numeroRepeticiones: 0, numeroSeries: 0 };
        this.cargarEjercicios();
      },
      error: err => {
        console.error('Error creando ejercicio:', err);
        alert('Error al crear ejercicio');
      }
    });
  }


  

  editarRutina(rutina: any) {
    rutina.backup = { ...rutina }; // copia de seguridad
    rutina.editando = true;
  }

  cancelarEdicion(rutina: any) {
    Object.assign(rutina, rutina.backup);
    rutina.editando = false;
  }

  guardarEdicion(rutina: any) {
    // Aquí deberías llamar a un servicio para actualizar en backend si aplica
    rutina.editando = false;
    alert('Rutina actualizada localmente (pendiente backend)');
  }

  eliminarRutina(rutina: any) {
    const confirmado = confirm(`¿Estás seguro de eliminar la rutina "${rutina.nombre}"?`);
    if (!confirmado) return;

    this.rutinaService.eliminarRutina(rutina.codRutina).subscribe({
      next: () => {
        alert('Rutina eliminada correctamente');
        this.cargarRutinas();
      },
      error: err => {
        console.error('Error eliminando rutina:', err);
        alert('Error al eliminar rutina');
      }
    });
  }

  obtenerNombrePlan(cod: number): string {
    const plan = this.planes?.find((p: any) => p.codPlanEntrenamiento === cod);
    return plan ? plan.nombre : 'Desconocido';
  }

  filtrarRutinasPorPlan() {
  this.rutinasFiltradas = this.rutinas.filter(r => r.codPlanEntrenamiento === +this.planSeleccionado);
  this.rutinaSeleccionada = null;
}

mostrarEjercicios() {
  this.nuevoEjercicio = { codEjercicio: 0, numeroRepeticiones: 0, numeroSeries: 0 };
}

agregarEjercicioARutinaSeleccionada() {
  const e = this.nuevoEjercicio;

  if (!e.codEjercicio || e.numeroRepeticiones <= 0 || e.numeroSeries <= 0) {
    alert('Completa todos los datos del ejercicio');
    return;
  }

  if (!this.rutinaSeleccionada || !this.rutinaSeleccionada.codRutina) {
    alert('No hay una rutina seleccionada');
    return;
  }

  const dto = {
    codRutina: this.rutinaSeleccionada.codRutina,
    codEjercicio: e.codEjercicio,
    numeroRepeticiones: e.numeroRepeticiones,
    numeroSeries: e.numeroSeries
  };

  this.ejercicioService.asignarEjercicioARutina(dto).subscribe({
    next: (resp: any) => {
      const ejercicioSeleccionado = this.ejerciciosDisponibles.find(ej => ej.codEjercicio === e.codEjercicio);

      if (!this.rutinaSeleccionada.ejercicios) {
        this.rutinaSeleccionada.ejercicios = [];
      }

      this.rutinaSeleccionada.ejercicios.push({
        codEjercicio: e.codEjercicio,
        nombreEjercicio: ejercicioSeleccionado?.nombre || 'Desconocido',
        numeroRepeticiones: e.numeroRepeticiones,
        numeroSeries: e.numeroSeries
      });

      alert('Ejercicio asignado correctamente a la rutina');
      this.nuevoEjercicio = { codEjercicio: null, numeroRepeticiones: 0, numeroSeries: 0 };
    },
    error: err => {
      console.error('Error asignando ejercicio a rutina:', err);
      alert('Hubo un error al asignar el ejercicio');
    }
  });
}

eliminarAsignacion(ejercicio: any, rutina: any) {
  const confirmado = confirm(`¿Estás seguro de eliminar el ejercicio "${ejercicio.nombre}" de la rutina "${rutina.nombre}"?`);
  if (!confirmado) return;

  this.ejercicioService.eliminarAsignacionEjercicioARutina(ejercicio.codEjercicio, rutina.codRutina).subscribe({
    next: resp => {
      alert('Asignación eliminada correctamente');
      this.cargarRutinas(); // Recarga las rutinas para reflejar el cambio
      this.mostrarEjercicios(); // Resetea el formulario de ejercicio
    },
    error: err => {
      console.error('Error al eliminar asignación:', err);
      alert('Error eliminando asignación');
    }
  });
}

editarEjercicio(ejercicio: any) {
    alert('Función de edición no implementada');
  }

  //---------------------------------------------------------------------------Consulta Simple 3 ----------------------------------------------------


  cargarRutinas() {
  this.rutinaService.listarRutinasEntrenador().subscribe({
    next: (resp: any) => {
      console.log('Rutinas obtenidas:', resp.mensaje);
      this.rutinas = resp.mensaje || [];

      // Asegura que rutinaSeleccionada también se actualiza
      if (this.rutinaSeleccionada && this.rutinaSeleccionada.codRutina) {
        const actualizada = this.rutinas.find(r => r.codRutina === this.rutinaSeleccionada.codRutina);
        if (actualizada) {
          this.rutinaSeleccionada = actualizada;
        }
      }
    },
    error: err => console.error('Error cargando rutinas:', err)
  });
}

generarPDFRutinasEntrenador(): void {
  if (!this.rutinas || this.rutinas.length === 0) {
    console.warn("No hay rutinas disponibles para exportar.");
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Rutinas del Entrenador', 14, 20);

  let y = 30;

  this.rutinas.forEach((rutina, index) => {
    doc.setFontSize(12);
    doc.text(`Rutina ${index + 1}: ${rutina.nombre}`, 14, y);
    y += 6;
    doc.setFontSize(10);
    doc.text(`Código Rutina: ${rutina.codRutina}`, 14, y);
    y += 6;
    doc.text(`Código Plan Entrenamiento: ${rutina.codPlanEntrenamiento}`, 14, y);
    y += 8;

    if (rutina.ejercicios && rutina.ejercicios.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Nombre', 'Series', 'Repeticiones', 'Duración (min)', 'Descanso (seg)']],
        body: rutina.ejercicios.map((e: any) => [
          e.nombre,
          e.series,
          e.repeticiones,
          e.duracion,
          e.tiempoDescanso
        ]),
        styles: { fontSize: 8 },
        margin: { left: 14, right: 14 }
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.text('No hay ejercicios asociados.', 14, y);
      y += 10;
    }

    // Salto de página si se pasa del límite
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save('rutinas_entrenador.pdf');
}


//---------------------------------------------------------------------------Consulta Simple 3 ----------------------------------------------------


}
