import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilClienteComponent } from '../../paginas/perfil-cliente/perfil-cliente.component';
import { PerfilEntrenadorComponent } from '../../paginas/perfil-entrenador/perfil-entrenador.component';
import { PerfilNutricionistaComponent } from '../../paginas/perfil-nutricionista/perfil-nutricionista.component';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    PerfilClienteComponent,
    PerfilEntrenadorComponent,
    PerfilNutricionistaComponent
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  rolActual: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.rolActual = this.authService.getRroleFromToken();
    console.log('Rol detectado:', this.rolActual);
  }
}
