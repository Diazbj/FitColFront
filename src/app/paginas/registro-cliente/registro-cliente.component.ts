import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../servicios/cliente.service';
import { CrearClienteDTO } from '../../dto/crear-cliente-dto';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registro-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.css']
})
export class RegistroClienteComponent implements OnInit {

  registroClienteForm!: FormGroup;
  ciudades: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService // ✅ Usamos el servicio ahora
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerCiudades();
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
        console.log("Cliente registrado", respuesta);
        this.registroClienteForm.reset();
      },
      error: (error) => {
        console.error("Error al registrar cliente", error);
      }
    });
  }

  public passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmarPassword = formGroup.get('confirmarPassword')?.value;
    return password === confirmarPassword ? null : { passwordsMismatch: true };
  }

  private obtenerCiudades() {
    this.clienteService['http'].get<any[]>('http://localhost:8080/api/ciudades')
      .subscribe({
        next: (data) => this.ciudades = data,
        error: (error) => console.error("Error al obtener ciudades", error)
      });
  }
}
