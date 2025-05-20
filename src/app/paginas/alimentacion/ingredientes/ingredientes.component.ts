import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IngredienteService } from '../../../servicios/ingrediente.service';
import { MensajeDTO } from '../../../dto/mensaje-dto';
import { ComidaService } from '../../../servicios/comida.service';

@Component({
  selector: 'app-ingredientes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './ingredientes.component.html',
  styleUrl: './ingredientes.component.css'
})
export class IngredientesComponent implements OnInit {
  regisIngredientesForm!: FormGroup;
  mensaje: string = '';
  ingredienteSeleccionado: any = null;
  comidaSeleccionada: any = null;
  comidas: any[] = [];
  seleccionado: any;
  ingredientesFiltrados: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private ingredienteService: IngredienteService,
    private comidaService: ComidaService
  ) {
    this.crearFormulario();
  }

  ingredientes: any[] = [];
  ngOnInit(): void {
    this.cargarIngredientes();
    this.crearFormulario();
    this.cargarComidas();
  }
  private cargarComidas() {
    this.comidaService.obtenerComidas().subscribe({
      next: (resp: any) => {
        console.log('Comidas cargadas:', resp);
        this.comidas = resp.mensaje || [];
      },
      error: err => console.error('Error cargando comidas:', err)
    });
  }

  private crearFormulario() {
    this.regisIngredientesForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      precioPromedio: [null, [Validators.required, Validators.min(0)]],
    });
  }
  crearIngrediente() {
    if (this.regisIngredientesForm.invalid) {
      console.log('Formulario inválido:', this.regisIngredientesForm.errors, this.regisIngredientesForm.value);
      return;
    }
    const ingrediente = this.regisIngredientesForm.value;
    console.log('Enviando ingrediente:', ingrediente);
    this.ingredienteService.crearIngrediente(ingrediente).subscribe({
      next: (resp: MensajeDTO) => {
        console.log('Ingrediente creado:', resp);
        this.mensaje = resp.mensaje;
        this.cargarIngredientes();
        this.regisIngredientesForm.reset(); // Limpiar formulario
      },
      error: err => {
        console.error('Error creando ingrediente:', err);
      }
    });
  }

  cargarIngredientes() {
    this.ingredienteService.obtenerIngredientes().subscribe({
      next: (resp: any) => {
        console.log('Ingredientes cargados:', resp);
        this.ingredientes = resp.mensaje || [];
      },
      error: err => console.error('Error cargando ingredientes:', err)
    });
  }
  seleccionarIngrediente(ingrediente: any) {
    this.seleccionado = ingrediente;
    this.regisIngredientesForm.patchValue({
      nombre: ingrediente.nombre,
      precioPromedio: ingrediente.precioPromedio
    });
  }
  eliminarIngrediente(ingrediente: any) {
    this.ingredienteService.eliminarIngrediente(ingrediente.nombre).subscribe({
      next: (resp: any) => {
        console.log('Ingrediente eliminado:', resp);
        this.mensaje = resp.mensaje;
        this.cargarIngredientes();
      },
      error: err => console.error('Error eliminando ingrediente:', err)
    });
  }

  obtenerIngredientesPorComida(id: number) {
    this.ingredienteService.obtenerIngredientesPorComida(id).subscribe({
      next: (resp: any) => {
        console.log('Ingredientes por comida:', resp);
        this.ingredientes = resp.mensaje || [];
      },
      error: err => console.error('Error obteniendo ingredientes por comida:', err)
    });
  }

  asignarIngredienteAComida() {
    if (!this.ingredienteSeleccionado || !this.comidaSeleccionada) {
      console.log('Debe seleccionar una comida y un ingrediente');
      return;
    }

    const dto = {
      ingrediente: this.ingredienteSeleccionado.nombre,
      codComida: this.comidaSeleccionada.codComida
    };

    console.log('Enviando asignación de ingrediente a comida:', dto);
    this.ingredienteService.asignarIngredienteAComida(dto).subscribe({
      next: (resp: MensajeDTO) => {
        console.log('Ingrediente asignado a comida:', resp);
        this.mensaje = resp.mensaje;
        this.cargarIngredientes();
        this.ingredienteSeleccionado = null;
        this.comidaSeleccionada = null;
      },
      error: err => {
        console.error('Error asignando ingrediente a comida:', err);
      }
    });
  }

  filtrarIngredientesPorComida() {
  if (this.comidaSeleccionada) {
    this.ingredienteService.obtenerIngredientesPorComida(this.comidaSeleccionada.codComida).subscribe({
      next: (resp:MensajeDTO) => {
        this.ingredientesFiltrados = resp.mensaje || [];
        console.log('Ingredientes filtrados por comida:', this.ingredientesFiltrados);
      },
      error: (err) => {
        console.error('Error filtrando ingredientes:', err);
        // opcional: mostrar todos si hay error
        this.ingredientesFiltrados = this.ingredientes;
      }
    });
  } else {
    this.ingredientesFiltrados = this.ingredientes;
  }
}



}
