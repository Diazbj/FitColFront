import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IngredienteService } from '../../../servicios/ingrediente.service';
import { MensajeDTO } from '../../../dto/mensaje-dto';

@Component({
  selector: 'app-ingredientes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,FormsModule],
  templateUrl: './ingredientes.component.html',
  styleUrl: './ingredientes.component.css'
})
export class IngredientesComponent implements OnInit {
  regisIngredientesForm!: FormGroup;
  mensaje: string = '';
  seleccionado: any;
  constructor(
    private formBuilder: FormBuilder,
    private ingredienteService: IngredienteService
  ) {
    this.crearFormulario();
  } 

  ingredientes: any[] = [];
  ngOnInit(): void {
    this.cargarIngredientes();
    this.crearFormulario();
  }
  private crearFormulario() {
    this.regisIngredientesForm = this.formBuilder.group({
      nombre: ['',[Validators.required, Validators.maxLength(100)]],
      precioPromedio:[null,[Validators.required, Validators.min(0)]],
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
        this.ingredientes = resp;
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


}
