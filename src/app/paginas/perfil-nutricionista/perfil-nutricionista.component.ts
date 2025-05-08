import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-nutricionista',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './perfil-nutricionista.component.html',
  styleUrl: './perfil-nutricionista.component.css'
})
export class PerfilNutricionistaComponent {

}
