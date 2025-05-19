import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IngredientesComponent } from '../../paginas/alimentacion/ingredientes/ingredientes.component';
import { PlanAlimenticioComponent } from '../../paginas/alimentacion/plan-alimenticio/plan-alimenticio.component';
import { ComidasComponent } from '../../paginas/alimentacion/comidas/comidas.component';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-gestion-plan-alimenticio',
  standalone: true,
  imports: [CommonModule,IngredientesComponent,PlanAlimenticioComponent,ComidasComponent],
  templateUrl: './gestion-plan-alimenticio.component.html',
  styleUrl: './gestion-plan-alimenticio.component.css'
})
export class GestionPlanAlimenticioComponent {
  selectedTab: string = 'plan-alimenticio'; // Controla qué pestaña está activa
  rolActual:string | null = null; // Variable para almacenar el rol actual del usuario

  constructor(authService: AuthService) {
    this.rolActual = localStorage.getItem('rol'); // Obtener el rol del usuario desde el localStorage
    console.log('Rol detectado:', this.rolActual); // Imprimir el rol en la consola para depuración
  }

}
