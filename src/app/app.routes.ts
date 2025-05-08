import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { PerfilComponent } from './componentes/perfil/perfil.component'; // Única ruta de registro
import { GestionPlanEntrenamientoComponent } from './componentes/gestion-plan-entrenamiento/gestion-plan-entrenamiento.component';
import { PlanEntrenamientoComponent } from './paginas/Entrenamientos/plan-entrenamiento/plan-entrenamiento.component';

export const routes: Routes = [
   { path: '', component: InicioComponent },
   { path: 'login', component: LoginComponent },
   { path: 'registro', component: RegistroComponent },
   {path: 'perfil',component:PerfilComponent},
   {path: 'gestion-plan-entrenamiento', component: GestionPlanEntrenamientoComponent},
   { path: "**", pathMatch: "full", redirectTo: "" }
];
