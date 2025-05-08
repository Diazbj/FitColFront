import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registro-nutricionista',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './registro-nutricionista.component.html',
  styleUrls: ['./registro-nutricionista.component.css']
})
export class RegistroNutricionistaComponent implements OnInit {

  registroNutricionistaForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.registroNutricionistaForm = this.fb.group({
      usuarioId: ['', [Validators.required, Validators.maxLength(100)]],
      primerNombre: ['', [Validators.required, Validators.maxLength(100)]],
      segundoNombre: ['', [Validators.required, Validators.maxLength(100)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(100)]],
      segundoApellido: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
      confirmarPassword: ['', [Validators.required]],
      aniosExp: [null],
      telefonos: ['', [Validators.required]],
    }, { validators: this.passwordsMatchValidator });
  }

  public registrar() {
    if (this.registroNutricionistaForm.invalid) return;

    const formData = this.registroNutricionistaForm.value;

    const telefonos = formData.telefonos
      .split(',')
      .map((tel: string) => tel.trim())
      .filter((tel: string) => tel !== '');

    const payload = {
      ...formData,
      telefonos
    };

    this.http.post('http://localhost:8080/api/nutricionistas', payload)
      .subscribe({
        next: (respuesta) => {
          alert("Registro exitoso. Ahora puedes iniciar sesión."); // ✅ Alerta
        this.registroNutricionistaForm.reset();
        this.router.navigate(['/login']); // ✅ Redirección al login
        },
        error: (error) => {
          console.error("Error al registrar nutricionista", error);
        }
      });
  }

  private passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmarPassword = formGroup.get('confirmarPassword')?.value;
    return password === confirmarPassword ? null : { passwordsMismatch: true };
  }
}