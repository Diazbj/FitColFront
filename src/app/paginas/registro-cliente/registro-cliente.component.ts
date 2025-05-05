import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-registro-cliente',
  standalone:true,
  imports: [ReactiveFormsModule,HttpClientModule,CommonModule],
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.css']
})
export class RegistroClienteComponent implements OnInit{

  registroClienteForm!: FormGroup;
  ciudades: any[] = [];


  constructor(private formBuilder: FormBuilder, private http: HttpClient){
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
      segundoNombre: ['', [Validators.required, Validators.maxLength(100)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(100)]],
      segundoApellido: ['', [Validators.required, Validators.maxLength(100)]],
      fechaNacimiento: ['', [Validators.required, Validators.maxLength(100)]],
      sexo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      telefonos: ['', [Validators.required]],
      codCiudad: ['', [Validators.required]],
      historialMedico: [''],
      peso: [null],
      altura: [null],
      password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
      confirmarPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator }); // Corrección aquí
  }

   
  public registrar() {
    if (this.registroClienteForm.invalid) return;
  
    const formData = this.registroClienteForm.value;
  
    // Transformar string a array
    const telefonos = formData.telefonos
      .split(',')
      .map((tel: string) => tel.trim())
      .filter((tel: string) => tel !== '');
  
    const payload = {
      ...formData,
      telefonos,
    };
  
    this.http.post('http://localhost:8080/api/clientes', payload)
      .subscribe({
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
   
   
    // Si las contraseñas no coinciden, devuelve un error, de lo contrario, null
    return password == confirmarPassword ? null : { passwordsMismatch: true };
   }

   private obtenerCiudades() {
    this.http.get<any[]>('http://localhost:8080/api/ciudades') // Ajusta la URL
      .subscribe(data => {
        this.ciudades = data;
      }, error => {
        console.error("Error al obtener ciudades", error);
      });
  }

   
   
}
