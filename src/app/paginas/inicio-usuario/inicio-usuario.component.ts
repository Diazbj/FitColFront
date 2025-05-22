import { Component, OnInit } from '@angular/core';
import { ProgresoService } from '../../servicios/progreso.service';
import { RankingClienteDTO } from '../../dto/progreso/rankingClientedto';
import { ChartConfiguration, ChartType } from 'chart.js';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EntrenadorService } from '../../servicios/entrenador.service';
import { EntrenadoresDestacadosDTO } from '../../dto/entrenador/Entrenadores-destacadosdto';
import { PlanDeficitDTO } from '../../dto/progreso/Planes-deficitdto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PlanDificultadDTO } from '../../dto/entrenador/plan-dificultaddto';

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
  destacados:EntrenadoresDestacadosDTO[] = [];
  planDeficit:PlanDeficitDTO[] = [];
  planDificultad: PlanDificultadDTO[] = [];

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

  constructor(private progresoService: ProgresoService, private entrenadorService:EntrenadorService) {}

  ngOnInit(): void {
    this.cargarRanking();
    this.cargarEntrenadoresDestacados();
    this.obtenerPlanesDeficit();
    this.listarPlanesPorDificultad();
  }


  //---------------------------------------------------------------------------Consulta avanzada 2 ----------------------------------------------------

  cargarEntrenadoresDestacados(): void {
    this.entrenadorService.obtenerEntrenadoresDestacados().subscribe({
      next: (respuesta) => {
        this.destacados = respuesta.mensaje || [];
      },
      error: (error) => {
        console.error('Error al cargar los entrenadores destacados', error);
        this.errorMensaje = 'No se pudo cargar los entrenadores destacados.';
      }
    });
  }


 generarPDFEntrenadoresDestacados() {
  if (!this.destacados || this.destacados.length === 0) {
    console.warn("No hay entrenadores destacados para mostrar.");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Entrenadores Destacados', 14, 20);

  const tablaDatos = this.destacados.map(entrenador => [
    entrenador.usuarioId,
    `${entrenador.nombre} ${entrenador.apellido}`,
    entrenador.cantidadPlanes.toString()
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['ID Usuario', 'Nombre Completo', 'Cantidad de Planes']],
    body: tablaDatos,
    styles: { halign: 'center' }
  });

  doc.save('entrenadores_destacados.pdf');
}

    


  //---------------------------------------------------------------------------Consulta avanzada 2 ----------------------------------------------------


  //---------------------------------------------------------------------------Consulta intermedia 4 ----------------------------------------------------

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


generarPDFRankingClientes(): void {
  if (!this.ranking || this.ranking.length === 0) {
    console.warn("No hay datos de ranking para mostrar.");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Ranking de Clientes - Entrenamientos Completados', 14, 20);

  const tablaDatos = this.ranking.map(cliente => [
    cliente.clienteId,
    `${cliente.primerNombre} ${cliente.segundoApellido}`,
    cliente.totalEntCompletos.toString()
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['ID Cliente', 'Nombre Completo', 'Entrenamientos Completados']],
    body: tablaDatos,
    styles: { halign: 'center' }
  });

  doc.save('ranking_clientes.pdf');
}



  //---------------------------------------------------------------------------Consulta intermedia 4 ----------------------------------------------------

  //---------------------------------------------------------------------------Consulta Avanzada 3 ----------------------------------------------------

  

  obtenerPlanesDeficit(): void {
    this.progresoService.obtenerPlanesDeficit().subscribe({
      next: (respuesta) => {
        this.planDeficit = respuesta.mensaje || [];
      },
      error: (error) => {
        console.error('Error al cargar los planes de déficit', error);
        this.errorMensaje = 'No se pudo cargar los planes de déficit.';
      }
    });
  }


  generarPDFPlanesDeficit(): void {
  if (!this.planDeficit || this.planDeficit.length === 0) {
    console.warn("No hay planes de déficit para exportar.");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Planes Alimenticios con Déficit Calórico', 14, 20);

  const tablaDatos = this.planDeficit.map(plan => [
    plan.codPlanAlimenticio,
    plan.nombrePlan,
    plan.duracion + ' días',
    plan.objetivo,
    plan.nombreNutricionista,
    plan.aniosExp + ' años',
    plan.caloriasTotalesPlan + ' kcal'
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['Código', 'Nombre', 'Duración', 'Objetivo', 'Nutricionista', 'Experiencia', 'Calorías Totales']],
    body: tablaDatos,
    styles: { fontSize: 9, halign: 'center' }
  });

  doc.save('planes_deficit_calorico.pdf');
}

  //---------------------------------------------------------------------------Consulta Avanzada  3 ----------------------------------------------------

   //---------------------------------------------------------------------------Consulta simple 1 ----------------------------------------------------


  listarPlanesPorDificultad(): void {
    this.entrenadorService.listarPlanesPorDificultad().subscribe({
      next: (respuesta) => {
        this.planDificultad = respuesta.mensaje || [];
      },
      error: (error) => {
        console.error('Error al cargar los planes por dificultad', error);
        this.errorMensaje = 'No se pudo cargar los planes por dificultad.';
      }
    });
  }

  generarPDFPlanesDificultad(): void {
    if (!this.planDificultad || this.planDificultad.length === 0) {
      console.warn("No hay planes por dificultad para exportar.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Planes Alimenticios por Dificultad', 14, 20);

    const tablaDatos = this.planDificultad.map(plan => [
      plan.nombre,
      plan.dificultad,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['Nombre', 'Dificultad']],
      body: tablaDatos,
      styles: { fontSize: 9, halign: 'center' }
    });

    doc.save('planes_dificultad.pdf');
  }


   //---------------------------------------------------------------------------Consulta simple 1 ----------------------------------------------------

}
