import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, MaterialModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  // Atributos para almacenar los datos del usuario
  userId: string | null = '';
  role: string | null = '';
  nombres: string | null = '';
  apellidos: string | null = '';

  constructor(private authService: AuthService, private router: Router) {
    this.loadUserData(); // Cargar los datos del usuario al inicializar el componente
  }

  // Método para cargar los datos del usuario
  loadUserData(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userId = user.id;
      this.role = user.role;
      this.nombres = user.de_nombres;
      this.apellidos = user.de_apellidos;
    }
  }

  // Método de logout
  logout() {
    this.authService.logout(); // Llama al método logout en AuthService
    this.router.navigate(['/authentication/login']); // Redirige al login después de salir
  }
}
