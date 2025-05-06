import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroClienteComponent } from '../../paginas/registro-cliente/registro-cliente.component';
import { RegistroEntrenadorComponent } from '../../paginas/registro-entrenador/registro-entrenador.component';
import { RegistroNutricionistaComponent } from '../../paginas/registro-nutricionista/registro-nutricionista.component';

@Component({
  selector: 'app-registro',
  standalone: true, // 💡 Si es un componente independiente
  imports: [CommonModule, RegistroClienteComponent, RegistroEntrenadorComponent, RegistroNutricionistaComponent], // Importa los componentes usados en el HTML
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  selectedTab: string = 'cliente'; // Controla qué pestaña está activa
}
