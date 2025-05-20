import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { PerfilComponent } from './componentes/perfil/perfil.component'; // Única ruta de registro
import { GestionPlanEntrenamientoComponent } from './componentes/gestion-plan-entrenamiento/gestion-plan-entrenamiento.component';
import { PlanEntrenamientoComponent } from './paginas/Entrenamientos/plan-entrenamiento/plan-entrenamiento.component';
import { GestionPlanAlimenticioComponent } from './componentes/gestion-plan-alimenticio/gestion-plan-alimenticio.component';
import { InicioUsuarioComponent } from './paginas/inicio-usuario/inicio-usuario.component';
import { AuthGuard } from './servicios/authGuard'; 
import { NoAuthGuard } from './servicios/noAuthGuard'; 

export const routes: Routes = [
   { path: '', component: InicioComponent,canActivate: [NoAuthGuard] },
   { path: 'login', component: LoginComponent,canActivate: [NoAuthGuard] },
   { path: 'registro', component: RegistroComponent,canActivate: [NoAuthGuard] },
   {path: 'perfil',component:PerfilComponent,canActivate: [AuthGuard]},
   {path: 'gestion-plan-entrenamiento', component: GestionPlanEntrenamientoComponent,canActivate: [AuthGuard]},
   {path: 'gestion-plan-alimenticio', component: GestionPlanAlimenticioComponent,canActivate: [AuthGuard]},
   {path: 'inicio-usuario', component: InicioUsuarioComponent,canActivate: [AuthGuard]},
   { path: "**", pathMatch: "full", redirectTo: "" }
];
