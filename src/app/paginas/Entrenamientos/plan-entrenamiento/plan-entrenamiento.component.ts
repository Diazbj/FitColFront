import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanEntrenamientoService } from '../../../servicios/plan-entrenamiento.service';
import { MensajeDTO } from '../../../dto/mensaje-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-entrenamiento',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './plan-entrenamiento.component.html',
  styleUrls: ['./plan-entrenamiento.component.css']
})
export class PlanEntrenamientoComponent implements OnInit {
  registroPlanEntrenamientoForm!: FormGroup;
  planesEntrenamiento: any[] = [];
  mensaje: string = '';


  constructor(
    private formBuilder: FormBuilder,
    private planEntrenamientoService: PlanEntrenamientoService
  ) {}

  ngOnInit() {
    this.crearFormulario();
    this.obtenerPlanesEntrenamiento();
  }

  private crearFormulario() {
    this.registroPlanEntrenamientoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      duracion: [null],
      dificultad: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      codTipoEntrenamiento: [null]
    });
  }

  crearPlanEntrenamiento() {
    if (this.registroPlanEntrenamientoForm.valid) {
      const plan = this.registroPlanEntrenamientoForm.value;
      this.planEntrenamientoService.crearPlanEntrenamiento(plan).subscribe({
        next: (response: MensajeDTO) => {
          this.mensaje = response.mensaje;
          this.obtenerPlanesEntrenamiento(); // Actualizar la lista
          this.registroPlanEntrenamientoForm.reset();
        },
        error: (err) => {
          console.error('Error al crear el plan:', err);
        }
      });
    }
  }

  obtenerPlanesEntrenamiento() {
    this.planEntrenamientoService.obtenerPlanesEntrenamiento().subscribe({
      next: (response: MensajeDTO) => {
        this.planesEntrenamiento = response.mensaje || [];
      },
      error: (err) => {
        console.error('Error al obtener los planes:', err);
      }
    });
  }

  eliminarPlanEntrenamiento(id: number) {
    this.planEntrenamientoService.eliminarPlanEntrenamiento(id).subscribe({
      next: (response: MensajeDTO) => {
        this.mensaje = response.mensaje;
        this.obtenerPlanesEntrenamiento(); // Actualizar la lista
      },
      error: (err) => {
        console.error('Error al eliminar el plan:', err);
      }
    });
  }

  editarPlanEntrenamiento(id: number) {
    if (this.registroPlanEntrenamientoForm.valid) {
      const plan = this.registroPlanEntrenamientoForm.value;
      this.planEntrenamientoService.editarPlanEntrenamiento(id, plan).subscribe({
        next: (response: MensajeDTO) => {
          this.mensaje = response.mensaje;
          this.obtenerPlanesEntrenamiento(); // Actualizar la lista
        },
        error: (err) => {
          console.error('Error al editar el plan:', err);
        }
      });
    }
  }
}
