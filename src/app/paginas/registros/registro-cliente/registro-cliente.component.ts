import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../../servicios/cliente.service';
import { CrearClienteDTO } from '../../../dto/cliente/crear-cliente-dto';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../servicios/auth.service';
import { ClienteDTO } from '../../../dto/cliente/cliente-dto';

@Component({
  selector: 'app-registro-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.css']
})
export class RegistroClienteComponent implements OnInit {

  clienteEditar: ClienteDTO | null = null;
  registroClienteForm!: FormGroup;
  ciudades: any[] = [];
  titleForm: string = "";
  esPerfil: boolean = false;
  modoEdicion: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.crearFormulario();
    const rutaA = this.route.snapshot.url[0].path;
    this.esPerfil = rutaA === 'perfil';
    this.titleForm = this.esPerfil ? "Perfil cliente" : "Crear cuenta";
  }

  ngOnInit(): void {
    this.obtenerCiudades();
    this.crearFormulario();
   
    if (this.esPerfil) {
      this.clienteService.obtenerCliente().subscribe({
        next: (res) => {
          this.clienteEditar = res.mensaje;
          if (this.clienteEditar) {
            this.registroClienteForm.patchValue(this.clienteEditar);
            Object.keys(this.registroClienteForm.controls).forEach(control => {
              if (control !== 'password' && control !== 'confirmarPassword') {
                this.registroClienteForm.get(control)?.disable();
              }
            });
          }
        },
        error: (err) => console.error("Error en la API:", err)
      });
    }
  }

  private crearFormulario() {
    this.registroClienteForm = this.formBuilder.group({
      usuarioId: ['', [Validators.required, Validators.maxLength(100)]],
      primerNombre: ['', [Validators.required, Validators.maxLength(100)]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required, Validators.maxLength(100)]],
      segundoApellido: [''],
      fechaNacimiento: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      telefonos: ['', [Validators.required]],
      codCiudad: ['', [Validators.required]],
      historialMedico: [''],
      peso: [null],
      altura: [null],
      password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
      confirmarPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  public registrar() {
    if (this.registroClienteForm.invalid) return;

    const formData = this.registroClienteForm.value;

    const telefonos = formData.telefonos
      .split(',')
      .map((tel: string) => tel.trim())
      .filter((tel: string) => tel !== '');

    const cliente: CrearClienteDTO = {
      ...formData,
      telefonos,
    };

    this.clienteService.crearCliente(cliente).subscribe({
      next: (respuesta) => {
        alert("Registro exitoso. Ahora puedes iniciar sesión."); // ✅ Alerta
        this.registroClienteForm.reset();
        this.router.navigate(['/login']); // ✅ Redirección al login
      },
      error: (error) => {
        console.error("Error al registrar cliente", error);
        alert("Error al registrar. Por favor intenta de nuevo.");
      }
    });
  }

  public passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmarPassword = formGroup.get('confirmarPassword')?.value;
    return password === confirmarPassword ? null : { passwordsMismatch: true };
  }

  private obtenerCiudades() {
    this.clienteService.obtenerCiudades().subscribe({
      next: (data) => this.ciudades = data.mensaje,
      error: (error) => console.error("Error al obtener ciudades", error)
    });
  }

  habilitarEdicion() {
    this.modoEdicion = true;
    Object.keys(this.registroClienteForm.controls).forEach(control => {
      if (control !== 'usuarioId' && control !== 'password' && control !== 'confirmarPassword') {
        this.registroClienteForm.get(control)?.enable();
      }
    });
  }

  guardarCambios() {
    if (this.registroClienteForm.invalid) return;

    const formData = this.registroClienteForm.getRawValue(); // Para obtener datos también de campos deshabilitados

    const telefonos = formData.telefonos
      .split(',')
      .map((tel: string) => tel.trim())
      .filter((tel: string) => tel !== '');

    const clienteEditado = {
      primerNombre: formData.primerNombre,
      segundoNombre: formData.segundoNombre,
      primerApellido: formData.primerApellido,
      segundoApellido: formData.segundoApellido,
      historialMedico: formData.historialMedico,
      peso: formData.peso,
      telefonos,
    };

    this.clienteService.editarCliente(clienteEditado).subscribe({
      next: () => {
        alert("Perfil actualizado correctamente.");
        this.modoEdicion = false;
        Object.keys(this.registroClienteForm.controls).forEach(control => {
          this.registroClienteForm.get(control)?.disable();
        });
      },
      error: (err) => {
        console.error("Error al guardar cambios", err);
        alert("Error al actualizar perfil.");
      }
    });
  }
}