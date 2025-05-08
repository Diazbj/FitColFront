import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { RouterModule, Router } from '@angular/router'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], // ← Aquí importamos RouterModule
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  title = 'FitCol'; // ← Título personalizado para tu app
  isLoggedIn$!: Observable<boolean>;
  rolActual: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn$ = this.auth.isLoggedIn(); // Reactivo al cambio de estado
    this.rolActual = this.auth.getRroleFromToken();
    console.log('Rol detectado:', this.rolActual);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}