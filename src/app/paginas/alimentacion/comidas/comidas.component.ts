import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComidaService } from '../../../servicios/comida.service';
import { IngredienteService } from '../../../servicios/ingrediente.service';

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './comidas.component.html',
  styleUrl: './comidas.component.css'
})
export class ComidasComponent implements OnInit {
  regisComidasForm: any;
  mensaje: string = '';
  comidaSeleccionada: any = null;

  nuevoIngrediente: any = {
    nombre: '',
    precioPromedio: 0,
  };

  constructor(
    private formBuilder: FormBuilder,
    private comidaService: ComidaService,
    private ingredienteService: IngredienteService
  ) {
    this.crearFormulario();
  }
  comidas: any[] = [];
  ingredientes: any[] = [];
  ngOnInit(): void {
    this.cargarComidas();
    this.crearFormulario();
    this.cargarIngredientes();
  }
  private crearFormulario() {
  this.regisComidasForm = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    porcion: [null, [Validators.required, Validators.min(0)]],
    proteinas: [null, [Validators.required, Validators.min(0)]],
    carbohidratos: [null, [Validators.required, Validators.min(0)]],
    grasa: [null, [Validators.required, Validators.min(0)]],
    ingredientes: [[]] // Inicializamos con array vacío
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

  crearComida() {
    if (this.regisComidasForm.invalid) {
      console.log('Formulario inválido:', this.regisComidasForm.errors, this.regisComidasForm.value);
      return;
    }
    const comida = this.regisComidasForm.value;
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

  eliminarComida(comida: any) {
    this.comidaService.eliminarComida(comida.codComida).subscribe({
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
  editarComida() {
  if (this.regisComidasForm.invalid) {
    console.log('Formulario inválido:', this.regisComidasForm.errors, this.regisComidasForm.value);
    return;
  }

  const comidaEditada = { ...this.regisComidasForm.value };
  comidaEditada.codComida = this.comidaSeleccionada.codComida;
  // Map ingredientes to only send their names (or IDs if your backend expects IDs)
  comidaEditada.ingredientes = (comidaEditada.ingredientes || []).map((ing: any) => ing.nombre);

  this.comidaService.editarComida(comidaEditada.codComida, comidaEditada).subscribe({
    next: (resp: any) => {
      console.log('Comida editada:', resp);
      this.mensaje = resp.mensaje;
      this.cargarComidas();
      this.comidaSeleccionada = null;
      this.regisComidasForm.reset();
    },
    error: (err: any) => {
      console.error('Error editando comida:', err);
    }
  });
}
  limpiarFormulario() {
    this.regisComidasForm.reset();
    this.comidaSeleccionada = null;
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


}
