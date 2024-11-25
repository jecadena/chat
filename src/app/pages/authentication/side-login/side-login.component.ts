// side-login.component.ts
import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  constructor(private router: Router, private authService: AuthService) {}

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const uname = this.form.value.uname ?? '';
    const password = this.form.value.password ?? '';
    
    this.authService.login(uname, password).subscribe(
      (response) => {
        if (response.success && response.token) {
          // Almacenar el token JWT en el localStorage
          localStorage.setItem('token', response.token);

          // Almacenar los datos del usuario en el localStorage
          this.authService.setUser(response.user);

          // Mostrar alerta de éxito
          Swal.fire({
            title: '¡Bienvenido!',
            text: 'Has iniciado sesión correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            // Redirige al dashboard si el login es exitoso
            this.router.navigate(['/dashboard']);
          });
        } else {
          // Mostrar error en caso de login fallido
          Swal.fire({
            title: 'Error',
            text: response.error || 'Nombre de usuario o contraseña incorrectos',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      },
      (error) => {
        console.error('Error al autenticar:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error en el servidor.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }
}
