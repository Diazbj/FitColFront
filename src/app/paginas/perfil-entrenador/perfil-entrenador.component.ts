import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntrenadorService } from '../../servicios/entrenador.service';
import { EntrenadorDTO } from '../../dto/entrenador/entrenador-dto';

@Component({
  selector: 'app-perfil-entrenador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-entrenador.component.html',
  styleUrls: ['./perfil-entrenador.component.css']
})
export class PerfilEntrenadorComponent implements OnInit {
  usuario!: EntrenadorDTO;
  editando: boolean = false;
  entrenador!: EntrenadorDTO;

  constructor(private entrenadorService: EntrenadorService) {}

  ngOnInit(): void {
    this.entrenadorService.obtenerEntrenador().subscribe({
      next: (res) => {
        const entrenador = res.mensaje;
        this.usuario = entrenador;
        console.log("Entrenador recibido:", entrenador);
        console.log('Entrenador recibido:', res.mensaje);
        this.entrenador = res.mensaje;
      },
      error: (err) => {
        console.error('Error al obtener entrenador:', err);
      }
    });
  }
}