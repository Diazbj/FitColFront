import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MensajeDTO } from '../../../dto/mensaje-dto';
import { CommonModule } from '@angular/common';
import { PlanAlimenticioService } from '../../../servicios/plan-alimenticio.service';

@Component({
  selector: 'app-plan-alimenticio',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './plan-alimenticio.component.html',
  styleUrl: './plan-alimenticio.component.css'
})
export class PlanAlimenticioComponent implements OnInit {
  registroPlanAlimenticioForm!: FormGroup;
  planesAlimenticios: any[] = [];
  mensaje: string = '';
  idEditando: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private planAlimenticioService: PlanAlimenticioService
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.crearFormulario();
    this.obtenerPlanesAlimenticios();
  }

  private crearFormulario() {
    this.registroPlanAlimenticioForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      duracion: [null, [Validators.required, Validators.min(1)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      objetivo: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  crearPlanAlimenticio() {
    if (this.registroPlanAlimenticioForm.valid) {
      const plan = this.registroPlanAlimenticioForm.value;

      this.planAlimenticioService.crearPlanAlimenticio(plan).subscribe({
        next: (response: MensajeDTO) => {
          this.mensaje = response.mensaje;
          this.obtenerPlanesAlimenticios();
          this.registroPlanAlimenticioForm.reset();
        },
        error: (error) => {
          console.error('Error creando el plan de alimentación:', error);
        }
      });
    } else {
      console.error('Formulario inválido');
    }
  }

  obtenerPlanesAlimenticios() {
    this.planAlimenticioService.obtenerPlanesAlimenticios().subscribe({
      next: (response: MensajeDTO) => {
        this.planesAlimenticios = response.mensaje || [];
      },
      error: (error) => {
        console.error('Error obteniendo los planes de alimentación:', error);
      }
    });
  }

  editarPlan(id: number) {
    const plan = this.planesAlimenticios.find((p) => p.id === id);
    if (plan) {
      this.idEditando = plan.codPlanAlimenticio;
      this.registroPlanAlimenticioForm.patchValue(plan);
    }
  }

  actualizarPlan() {
    if (this.registroPlanAlimenticioForm.valid && this.idEditando !== null) {
      const plan = this.registroPlanAlimenticioForm.value;

      this.planAlimenticioService.editarPlanAlimenticio(this.idEditando, plan).subscribe({
        next: (response: MensajeDTO) => {
          this.mensaje = response.mensaje;
          this.obtenerPlanesAlimenticios();
          this.registroPlanAlimenticioForm.reset();
          this.idEditando = null;
        },
        error: (error) => {
          console.error('Error actualizando el plan de alimentación:', error);
        }
      });
    } else {
      console.error('Formulario inválido o ID no definido');
    }
  }

  eliminarPlan(id: number) {
    this.planAlimenticioService.eliminarPlanAlimenticio(id).subscribe({
      next: (response: MensajeDTO) => {
        this.mensaje = response.mensaje;
        this.obtenerPlanesAlimenticios();
      },
      error: (error) => {
        console.error('Error eliminando el plan de alimentación:', error);
      }
    });
  }

  cargarFormulario(plan: any) {
    this.idEditando = plan.codPlanAlimenticio; // Asegúrate de usar el ID correcto del plan
    this.registroPlanAlimenticioForm.patchValue({
      nombre: plan.nombre,
      duracion: plan.duracion,
      descripcion: plan.descripcion
    });
  }

}
