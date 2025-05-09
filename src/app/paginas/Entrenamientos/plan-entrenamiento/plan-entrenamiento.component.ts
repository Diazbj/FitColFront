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
  idEditando: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private planEntrenamientoService: PlanEntrenamientoService
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.crearFormulario();
    this.obtenerPlanesEntrenamiento();
    this.obtenerTiposEntrenamiento();
  }

  private crearFormulario() {
    this.registroPlanEntrenamientoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      duracion: [null, [Validators.required, Validators.min(1)]],
      dificultad: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      codTipoEntrenamiento: [null, Validators.required]
    });
  }


  // Removed duplicate submitFormulario function

  crearPlanEntrenamiento() {
    if (this.registroPlanEntrenamientoForm.valid) {
      const plan = this.registroPlanEntrenamientoForm.value;

      if (!plan.codTipoEntrenamiento) {
        console.error('Error: codTipoEntrenamiento is undefined or null.');
        return;
      }

      this.planEntrenamientoService.crearPlanEntrenamiento(plan).subscribe({
        next: (response: MensajeDTO) => {
          this.mensaje = response.mensaje;
          this.obtenerPlanesEntrenamiento();
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

  

  cargarFormulario(plan: any) {
  this.idEditando = plan.codPlanEntrenamiento; // ✅ aquí asignas el ID correcto del plan
  this.registroPlanEntrenamientoForm.patchValue({
    nombre: plan.nombre,
    duracion: plan.duracion,
    dificultad: plan.dificultad,
    descripcion: plan.descripcion,
    codTipoEntrenamiento: plan.tipoEntrenamientoId // ✅ asegúrate de usar el ID del tipo
  });
  console.log('Plan seleccionado para editar:', plan);
  console.log('ID asignado para editar:', this.idEditando);
}

  submitFormulario() {
    if (this.idEditando !== null) {
      this.editarPlanEntrenamiento(this.idEditando);
    } else {
      this.crearPlanEntrenamiento();
    }
  }

  editarPlanEntrenamiento(id: number) {
    if (this.registroPlanEntrenamientoForm.valid) {
      const plan = this.registroPlanEntrenamientoForm.value;
      this.planEntrenamientoService.editarPlanEntrenamiento(id, plan).subscribe({
        next: (response: MensajeDTO) => {
          this.mensaje = response.mensaje;
          this.obtenerPlanesEntrenamiento();
          this.registroPlanEntrenamientoForm.reset();
          this.idEditando = null;
        },
        error: (err) => {
          console.error('Error al editar el plan:', err);
        }
      });
    }
  }

  obtenerTiposEntrenamiento() {
    this.planEntrenamientoService.obtenerTiposEntrenamiento().subscribe({
      next: (data) => {
        this.tipoEntrenamiento = data.mensaje;
      },
      error: (error) => console.error('Error al obtener los tipos de entrenamiento', error)
    });
  }

  getTipoEntrenamientoNombre(codTipoEntrenamiento: number): string {
    const tipo = this.tipoEntrenamiento.find(t => t.id == codTipoEntrenamiento);
    return tipo ? tipo.nombre : 'Desconocido';
  }

  cancelarEdicion() {
    this.registroPlanEntrenamientoForm.reset();
    this.idEditando = null;
  }

  eliminarPlanEntrenamiento(id: number | null) {
    console.log('ID recibido para eliminar:', id);
    if (id === null || id === undefined) {
      console.error('Error: ID is null or undefined.');
      return;
    }
    this.planEntrenamientoService.eliminarPlanEntrenamiento(id).subscribe({
      next: (response: MensajeDTO) => {
        this.mensaje = response.mensaje;
        this.obtenerPlanesEntrenamiento();
      },
      error: (err) => {
        console.error('Error al eliminar el plan:', err);
      }
    });
  }
}
