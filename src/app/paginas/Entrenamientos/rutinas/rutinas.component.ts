import { Component, OnInit } from '@angular/core';
import { RutinaService } from '../../../servicios/rutina.service';
import { PlanEntrenamientoService } from '../../../servicios/plan-entrenamiento.service';
import { crearRutinaCompletaDTO } from '../../../dto/rutina/crear-rutina-completadto';
// Removed unused import 'ejercicioRutinaDTO'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    codEjercicio: 0,
    repeticiones: 0,
    series: 0
  };


  constructor(
    private rutinaService: RutinaService,
    private planEntrenamientoService: PlanEntrenamientoService
  ) { }

  ngOnInit(): void {
    this.cargarPlanes();
    this.cargarRutinas();

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

  agregarEjercicio() {
    this.nuevaRutina.ejercicios.push({ codEjercicio: 0, repeticiones: 0, series: 0 });
  }

  crearRutina() {
    if (!this.nuevaRutina.nombre.trim() || this.nuevaRutina.codPlanEntrenamiento <= 0) {
      alert('Debes completar todos los campos principales.');
      return;
    }

    // Validar que los ejercicios tienen datos válidos
    const ejerciciosInvalidos = this.nuevaRutina.ejercicios.some(e =>
      !e.codEjercicio || e.repeticiones <= 0 || e.series <= 0
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


  cargarRutinas() {
    this.rutinaService.listarRutinas().subscribe({
      next: (resp: any) => {
        console.log('Rutinas obtenidas:', resp.mensaje);
        this.rutinas = resp.mensaje || []; // ← Asegúrate de que 'mensaje' contiene el array de rutinas
      },
      error: err => console.error('Error cargando rutinas:', err)
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
  this.nuevoEjercicio = { codEjercicio: 0, repeticiones: 0, series: 0 };
}

agregarEjercicioARutinaSeleccionada() {
  const e = this.nuevoEjercicio;
  if (!e.codEjercicio || e.repeticiones <= 0 || e.series <= 0) {
    alert('Completa todos los datos del ejercicio');
    return;
  }

  this.rutinaSeleccionada.ejercicios.push({ ...e });
  this.nuevoEjercicio = { codEjercicio: 0, repeticiones: 0, series: 0 };
}

eliminarEjercicio(ejercicio: any) {
  this.rutinaSeleccionada.ejercicios = this.rutinaSeleccionada.ejercicios.filter((e: { codEjercicio: number; repeticiones: number; series: number }) => e !== ejercicio);
}

editarEjercicio(ejercicio: any) {
    alert('Función de edición no implementada');
  }

}
