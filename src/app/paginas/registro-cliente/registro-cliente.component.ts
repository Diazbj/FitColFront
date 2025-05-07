  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { CommonModule } from '@angular/common';
  import { ClienteService } from '../../servicios/cliente.service';
  import { CrearClienteDTO } from '../../dto/crear-cliente-dto';
  import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { ClienteDTO } from '../../dto/cliente-dto';

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
    titleForm:string = "";

    constructor(
      private formBuilder: FormBuilder,
      private clienteService: ClienteService,
      private route: ActivatedRoute,
      private router: Router
    ) {
      this.crearFormulario();

      const rutaA = this.route.snapshot.url[0].path;
      this.titleForm = rutaA == "perfil" ? "Perfil cliente" : "Crear cuenta";

      this.clienteService.obtenerCliente().subscribe({
        next: (res) => {
          const cliente = res.mensaje;
          this.clienteEditar = cliente;

          this.registroClienteForm.get("usuarioId")?.disable({onlySelf: true})
          this.registroClienteForm.get("primerNombre")?.setValue(this.clienteEditar?.primerNombre);
          this.registroClienteForm.get("segundoNombre")?.setValue(this.clienteEditar?.segundoNombre);
          this.registroClienteForm.get("primerApellido")?.setValue(this.clienteEditar?.primerApellido);
        },
        error: (err) => console.error("Error en la API:", err)
      });

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
  }
