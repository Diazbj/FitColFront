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
  imports: [ ReactiveFormsModule, CommonModule, FormsModule], // Added FormsModule to resolve 'ngModel' binding errors
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


  constructor(
    private rutinaService: RutinaService,
    private planEntrenamientoService: PlanEntrenamientoService
  ) {}

  ngOnInit(): void {
    this.cargarPlanes();
    
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
        },
        error: err => console.error('Error creando rutina:', err)
    });
}


}
