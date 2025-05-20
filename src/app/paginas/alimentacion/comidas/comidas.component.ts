import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComidaService } from '../../../servicios/comida.service';
import { IngredienteService } from '../../../servicios/ingrediente.service';
import { PlanAlimenticioService } from '../../../servicios/plan-alimenticio.service';

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './comidas.component.html',
  styleUrl: './comidas.component.css'
})
export class ComidasComponent implements OnInit {
  regisComidasForm!: FormGroup;
  mensaje: string = '';
  comidaSeleccionada: any = null;
  planes: any = null; // Adjusted to match the expected type
  comidasPorPlan: any[] = [];
  planSeleccionado: any = null;

  nuevoIngrediente: any = {
    nombre: '',
    precioPromedio: 0,
  };

  constructor(
    private formBuilder: FormBuilder,
    private comidaService: ComidaService,
    private ingredienteService: IngredienteService,
    private planAlimentacionService: PlanAlimenticioService
  ) {
  }
  comidas: any[] = [];
  ingredientes: any[] = [];
  ngOnInit(): void {
    this.cargarComidas();
    this.crearFormulario();
    this.cargarIngredientes();
    this.cargarPlanes();
  }
  private crearFormulario() {
  this.regisComidasForm = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    porcion: [null, [Validators.required, Validators.min(0)]],
    proteinas: [null, [Validators.required, Validators.min(0)]],
    carbohidratos: [null, [Validators.required, Validators.min(0)]],
    grasa: [null, [Validators.required, Validators.min(0)]],
    codPlanAlimenticio: [null, Validators.required]
  });
}

  cargarIngredientes() {
    this.ingredienteService.obtenerIngredientes().subscribe({
      next: (resp: any) => {
        console.log('Ingredientes cargados:', resp);
        this.ingredientes = resp.mensaje || [];
      },
      error: (err: any) => {
        console.error('Error cargando ingredientes:', err);
      }
    });
  }

  cargarPlanes() {
    this.planAlimentacionService.obtenerPlanesAlimenticios().subscribe({
      next: (resp: any) => {
        console.log('Planes alimenticios cargados:', resp);
        this.planes = resp.mensaje || [];
      },
      error: (err: any) => {
        console.error('Error cargando planes alimenticios:', err);
      }
    });
  }


  crearComida() {
    if (this.regisComidasForm.invalid) {
      console.log('Formulario inválido:', this.regisComidasForm.errors, this.regisComidasForm.value);
      return;
    }
    const comida = this.regisComidasForm.value;
    console.log('Datos del formulario antes de enviar:', comida); // 👈 Aquí
    console.log('Enviando comida:', comida);
    this.comidaService.crearComida(comida).subscribe({
      next: (resp: any) => {
        console.log('Comida creada:', resp);
        this.mensaje = resp.mensaje;
        this.cargarComidas();
        this.regisComidasForm.reset(); // Limpiar formulario
      },
      error: (err: any) => {
        console.error('Error creando comida:', err);
      }
    });
  }

  cargarComidas() {
    this.comidaService.obtenerComidas().subscribe({
      next: (resp: any) => {
        console.log('Comidas cargadas:', resp);
        this.comidas = resp.mensaje || [];
      },
      error: (err: any) => {
        console.error('Error cargando comidas:', err);
      }
    });
  }
  seleccionarComida(comida: any) {
    this.comidaSeleccionada = comida;
    this.regisComidasForm.patchValue({
      nombre: comida.nombre,
      porcion: comida.porcion,
      proteinas: comida.proteinas,
      carbohidratos: comida.carbohidratos,
      grasa: comida.grasa
    });
  }

  eliminarComida(codComida: number) {
    if (confirm('¿Está seguro de que desea eliminar esta comida?')) {
      this.comidaService.eliminarComida(codComida).subscribe({
        next: (resp: any) => {
          console.log('Comida eliminada:', resp);
          this.mensaje = resp.mensaje;
          this.cargarComidas();
        },
        error: (err: any) => {
          console.error('Error eliminando comida:', err);
        }
      });
    }
  }
  editarComida() {
    if (this.regisComidasForm.invalid) {
      console.log('Formulario inválido:', this.regisComidasForm.errors, this.regisComidasForm.value);
      return;
    }
    const comida = this.regisComidasForm.value;
    console.log('Datos del formulario antes de editar:', comida); // 👈 Aquí
    console.log('Editando comida:', comida);
    this.comidaService.editarComida(this.comidaSeleccionada.codComida, comida).subscribe({
      next: (resp: any) => {
        console.log('Comida editada:', resp);
        this.mensaje = resp.mensaje;
        this.cargarComidas();
        this.limpiarFormulario();
      },
      error: (err: any) => {
        console.error('Error editando comida:', err);
      }
    });
  }
  limpiarFormulario() {
    this.regisComidasForm.reset();
    this.comidaSeleccionada = null;
    this.planSeleccionado = null;
  }

  agregarIngrediente() {
    if (this.nuevoIngrediente.nombre.trim() === '') {
      alert('El nombre del ingrediente no puede estar vacío');
      return;
    }
    if (this.nuevoIngrediente.precioPromedio <= 0) {
      alert('El precio promedio debe ser mayor a 0');
      return;
    }

    this.ingredientes.push({ ...this.nuevoIngrediente });
    this.nuevoIngrediente = { nombre: '', precioPromedio: 0 };
  }


eliminarIngrediente(index: number) {
  const ingredientesActuales = this.regisComidasForm.value.ingredientes || [];
  ingredientesActuales.splice(index, 1);
  this.regisComidasForm.patchValue({ ingredientes: ingredientesActuales });
}

  cancelarEdicion() {
    this.comidaSeleccionada = null;
    this.regisComidasForm.reset();
  }

  asignarComidaAPlan() {
    if (!this.comidaSeleccionada) {
      alert('Seleccione una comida para asignar');
      return;
    }
    if (!this.planes || this.planes.length === 0) {
      alert('No hay planes alimenticios disponibles');
      return;
    }

    const planSeleccionado = this.planSeleccionado; // Aquí puedes implementar la lógica para seleccionar un plan específico
    const dto = {
      idComida: this.comidaSeleccionada.codComida,
      idPlanAlimenticio: planSeleccionado.codPlanAlimenticio,
      caloriasDiarias: this.comidaSeleccionada.proteinas*4 + this.comidaSeleccionada.carbohidratos*4 + this.comidaSeleccionada.grasa*9
    };

    this.comidaService.asignarComidaAPlan(dto).subscribe({
      next: (resp: any) => {
        console.log('Comida asignada a plan:', resp);
        this.mensaje = resp.mensaje;
        this.cargarComidas();
      },
      error: (err: any) => {
        console.error('Error asignando comida a plan:', err);
      }
    });
  }

  listarComidasPorPlan() {
  const codPlan = this.regisComidasForm.get('codPlanAlimenticio')?.value;
  if (!codPlan) return;

  this.comidaService.listarComidasPorPlan(codPlan).subscribe({
    next: (resp: any) => {
      this.comidasPorPlan = resp.mensaje || [];
    },
    error: (err: any) => {
      console.error('Error cargando comidas del plan:', err);
    }
  });
}

  cargarComidaEnFormulario(comida: any) {
    this.comidaSeleccionada = comida;
    this.regisComidasForm.patchValue({
      nombre: comida.nombre,
      porcion: comida.porcion,
      proteinas: comida.proteinas,
      carbohidratos: comida.carbohidratos,
      grasa: comida.grasa,
      codPlanAlimenticio: comida.codPlanAlimenticio
    });
  }

  cargarComidasPorPlan(planId: number) {
    this.comidaService.listarComidasPorPlan(planId).subscribe({
      next: (resp: any) => {
        console.log('Comidas por plan:', resp);
        this.comidasPorPlan = resp.mensaje || [];
      },
      error: (err: any) => {
        console.error('Error obteniendo comidas por plan:', err);
      }
    });
  }

 seleccionarPlan(codPlan: string) {
  const plan = this.planes.find((p: any) => p.codPlanAlimenticio === codPlan);
  if (plan) {
    this.planSeleccionado = plan;
    this.cargarComidasPorPlan(plan.codPlanAlimenticio);
  }
}


}
