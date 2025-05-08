import { Component } from '@angular/core';
import { PlanEntrenamientoComponent } from '../../paginas/Entrenamientos/plan-entrenamiento/plan-entrenamiento.component';
import { AuthService } from '../../servicios/auth.service';
import { RutinasComponent } from '../../paginas/Entrenamientos/rutinas/rutinas.component';
import { EjerciciosComponent } from '../../paginas/Entrenamientos/ejercicios/ejercicios.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-plan-entrenamiento',
  standalone: true,
  imports: [PlanEntrenamientoComponent,RutinasComponent,EjerciciosComponent,CommonModule],
  templateUrl: './gestion-plan-entrenamiento.component.html',
  styleUrl: './gestion-plan-entrenamiento.component.css'
})
export class GestionPlanEntrenamientoComponent {
  selectedTab: string = 'plan-entrenamiento'; // Controla qué pestaña está activa
  rolActual:string | null = null; // Variable para almacenar el rol actual del usuario

  constructor( authService: AuthService) {
    this.rolActual = localStorage.getItem('rol'); // Obtener el rol del usuario desde el localStorage
    console.log('Rol detectado:', this.rolActual); // Imprimir el rol en la consola para depuración
  }

}
