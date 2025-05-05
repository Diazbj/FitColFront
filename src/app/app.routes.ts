import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroClienteComponent} from './paginas/registro-cliente/registro-cliente.component';


export const routes: Routes = [
   { path: '', component: InicioComponent },
   { path: 'login', component: LoginComponent },
   { path: 'registroCliente', component: RegistroClienteComponent },
   { path: "**", pathMatch: "full", redirectTo: "" }
];
