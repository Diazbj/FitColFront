import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EjercicioService } from '../../../servicios/ejercicio.service';
import { MensajeDTO } from '../../../dto/mensaje-dto';

@Component({
  selector: 'app-ejercicios',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './ejercicios.component.html',
  styleUrl: './ejercicios.component.css'
})
export class EjerciciosComponent implements OnInit {
  registroEjercicioForm!: FormGroup;
  mensaje: string = '';
  idEditando: number | null = null;
  ejercicioSeleccionado: any = null;
  constructor(
    private formBuilder: FormBuilder,
    private ejercicioService: EjercicioService
  ) {
    this.crearFormulario();
  }

  ejercicios: any[] = [];
  ngOnInit(): void {
    this.cargarEjercicios();
    this.crearFormulario();
  }

  private crearFormulario() {
    this.registroEjercicioForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }
  onSubmit() {
  if (this.registroEjercicioForm.invalid) {
    return;
  }

  const ejercicio = this.registroEjercicioForm.value;

  if (this.idEditando !== null) {
    // Editar ejercicio existente
    this.ejercicioService.editarEjercicio(this.ejercicioSeleccionado.codEjercicio, ejercicio).subscribe({
      next: (resp: MensajeDTO) => {
        console.log('Ejercicio actualizado:', resp);
        this.mensaje = resp.mensaje;
        this.cargarEjercicios();
        this.cancelarEdicion();
      },
      error: err => console.error('Error actualizando ejercicio:', err)
    });
  } else {
    // Crear nuevo ejercicio
    this.ejercicioService.crearEjercicio(ejercicio).subscribe({
      next: (resp: MensajeDTO) => {
        console.log('Ejercicio creado:', resp);
        this.mensaje = resp.mensaje;
        this.cargarEjercicios();
        this.registroEjercicioForm.reset();
      },
      error: err => console.error('Error creando ejercicio:', err)
    });
  }
}

creaejercicio() {
  if (this.registroEjercicioForm.valid) {
    const ejercicio = this.registroEjercicioForm.value;
    console.log('Enviando ejercicio a crear:', ejercicio);
    this.ejercicioService.crearEjercicio(ejercicio).subscribe({
      next: (resp: MensajeDTO) => {
        console.log('Respuesta del backend al crear ejercicio:', resp);
        this.mensaje = resp.mensaje;
        this.cargarEjercicios();
        this.registroEjercicioForm.reset();
      },
      error: err => console.error('Error creando ejercicio:', err)
    });
  } else {
    console.error('Formulario inválido:', this.registroEjercicioForm.errors);
  }
}

  cargarEjercicios() {
    this.ejercicioService.obtenerEjercicios().subscribe({
      next: (resp: any) => {
        console.log('Ejercicios obtenidos:', resp.mensaje); // ← Agrega esto
        this.ejercicios = resp.mensaje || [];
      }
      , error: err => console.error('Error cargando ejercicios:', err)
    });
  }

  editarEjercicio(ejercicio: any) {
    this.idEditando = ejercicio.id;
    this.registroEjercicioForm.patchValue({
      nombre: ejercicio.nombre,
      descripcion: ejercicio.descripcion
    });
  }

seleccionarEjercicio(ejercicio: any) {
  this.idEditando = this.ejercicios.indexOf(ejercicio);
  this.ejercicioSeleccionado = ejercicio;
  this.registroEjercicioForm.setValue({
    nombre: ejercicio.nombre,
    descripcion: ejercicio.descripcion
  });
}

  cancelarEdicion() {
    this.idEditando = null;
    this.ejercicioSeleccionado = null; // ← importante
    this.registroEjercicioForm.reset();
  }

  eliminarEjercicio(id: number) {
    if (!confirm('¿Está seguro de que desea eliminar este ejercicio?')) {
      return;
    }
    this.ejercicioService.eliminarEjercicio(id).subscribe({
      next: (resp: any) => {
        this.mensaje = resp.mensaje;
        // Elimina el ejercicio localmente para reflejar el cambio inmediato
        this.ejercicios = this.ejercicios.filter(e => e.id !== id);
        this.cargarEjercicios();
      },
      error: err => console.error('Error eliminando ejercicio:', err)
    });
  }

}
