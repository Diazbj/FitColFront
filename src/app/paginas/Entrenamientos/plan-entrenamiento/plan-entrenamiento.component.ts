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
  tipoEntrenamiento: any[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private planEntrenamientoService: PlanEntrenamientoService
  ) {}

  ngOnInit() {
    this.crearFormulario();
    this.obtenerPlanesEntrenamiento();
    this.obtenerTiposEntrenamiento();
  }

  private crearFormulario() {
    this.registroPlanEntrenamientoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      duracion: [null],
      dificultad: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      codTipoEntrenamiento: [null, Validators.required]
    });

    // Ensure codTipoEntrenamiento is properly initialized
    this.registroPlanEntrenamientoForm.get('codTipoEntrenamiento')?.valueChanges.subscribe(value => {
      console.log('codTipoEntrenamiento changed:', value);
    });
  }

  crearPlanEntrenamiento() {
    if (this.registroPlanEntrenamientoForm.valid) {
      const plan = this.registroPlanEntrenamientoForm.value;
    
      // Ensure codTipoEntrenamiento is not undefined
      if (!plan.codTipoEntrenamiento) {
        console.error('Error: codTipoEntrenamiento is undefined or null.');
        return;
      }
    
      console.log('Tipo de entrenamiento enviado:', typeof plan.codTipoEntrenamiento, plan.codTipoEntrenamiento);
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

  obtenerTiposEntrenamiento() {
    this.planEntrenamientoService.obtenerTiposEntrenamiento().subscribe({
      next: (data) => {this.tipoEntrenamiento = data.mensaje,console.log('Tipos de entrenamiento recibidos:', data.mensaje)},
      error: (error) => console.error('Error al obtener los tipos de entrenamiento', error)
    });
    
  }
}
