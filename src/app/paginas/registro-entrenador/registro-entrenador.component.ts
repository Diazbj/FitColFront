import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-entrenador',
  standalone:true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './registro-entrenador.component.html',
  styleUrls: ['./registro-entrenador.component.css']
})
export class RegistroEntrenadorComponent implements OnInit {

  registroEntrenadorForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.crearFormulario();
    // this.crearFormulario(); // Removed to avoid redundancy
  }

  ngOnInit(): void {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.registroEntrenadorForm = this.fb.group({
      usuarioId: ['', [Validators.required, Validators.maxLength(100)]],
      primerNombre: ['', [Validators.required, Validators.maxLength(100)]],
      segundoNombre: ['', [Validators.required, Validators.maxLength(100)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(100)]],
      segundoApellido: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
      confirmarPassword: ['', [Validators.required]],
      aniosExp: [null],
      telefonos: ['', [Validators.required]]
    }, { validators: this.validatePasswordsMatch });
  }

  public registrar() {
    if (this.registroEntrenadorForm.invalid) return;

    const formData = this.registroEntrenadorForm.value;

    // Convertir string de teléfonos separados por comas a arreglo
    const telefonos = formData.telefonos
      .split(',')
      .map((tel: string) => tel.trim())
      .filter((tel: string) => tel !== '');

    const payload = {
      ...formData,
      telefonos
    };

    this.http.post('http://localhost:8080/api/entrenadores', payload)
      .subscribe({
        next: (respuesta) => {
          console.log("Entrenador registrado", respuesta);
          this.registroEntrenadorForm.reset();
        },
        error: (error) => {
          console.error("Error al registrar entrenador", error);
        }
      });
  }

  private validatePasswordsMatch(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmarPassword = formGroup.get('confirmarPassword')?.value;
    return password === confirmarPassword ? null : { passwordsMismatch: true };  }
}
