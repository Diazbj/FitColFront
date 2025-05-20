import { Component, OnInit } from '@angular/core';
import { ProgresoService } from '../../servicios/progreso.service';
import { RankingClienteDTO } from '../../dto/progreso/rankingClientedto';
import { ChartConfiguration, ChartType } from 'chart.js';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './inicio-usuario.component.html',
  styleUrls: ['./inicio-usuario.component.css']
})
export class InicioUsuarioComponent implements OnInit {
  ranking: RankingClienteDTO[] = [];
  errorMensaje: string | null = null;

  // Chart.js config
  public barChartType: ChartType = 'bar';
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Entrenamientos completados',
        backgroundColor: '#198754',
        hoverBackgroundColor: '#0f5132'
      }
    ]
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      }
    }
  };

  constructor(private progresoService: ProgresoService) {}

  ngOnInit(): void {
    this.cargarRanking();
  }

  cargarRanking(): void {
    this.progresoService.obtenerRanking().subscribe({
      next: (respuesta) => {
        this.ranking = respuesta.mensaje|| [];

        // Actualizar gráfico
        this.barChartData.labels = this.ranking.map(
          c => `${c.primerNombre} ${c.segundoApellido}`
        );
        this.barChartData.datasets[0].data = this.ranking.map(c => c.totalEntCompletos);
      },
      error: (error) => {
        console.error('Error al cargar el ranking', error);
        this.errorMensaje = 'No se pudo cargar el ranking.';
      }
    });
  }
}
