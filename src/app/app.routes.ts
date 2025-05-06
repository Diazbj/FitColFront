import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroClienteComponent} from './paginas/registro-cliente/registro-cliente.component';
import { RegistroEntrenadorComponent } from './paginas/registro-entrenador/registro-entrenador.component';


export const routes: Routes = [
   { path: '', component: InicioComponent },
   { path: 'login', component: LoginComponent },
   { path: 'registroCliente', component: RegistroClienteComponent },
   {path:'registroEntrenador',component:RegistroEntrenadorComponent},
   { path: "**", pathMatch: "full", redirectTo: "" }
];
