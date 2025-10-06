import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // 👈 Importar OnInit
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn implements OnInit { // 👈 Implementar OnInit
  signInForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private clerkService: AuthService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  ngOnInit(): void {
    // Si Clerk indica que el usuario ya inició sesión, redirige inmediatamente.
    if (this.clerkService.isSignedIn()) {
      console.log("Usuario ya tiene sesión activa. Redirigiendo a dashboard...");
      this.redirectToDashboard(); 
    }
  }

  // Lógica de redirección centralizada (para OnInit y onSignIn)
  private async redirectToDashboard() {
    try {
      const clerkUser = this.clerkService.getClerkInstance()?.user;

      if (clerkUser) {
        // Consultar el backend para obtener el rol/permiso
        const response = await fetch(
          `${environment.apiBaseUrl}/usuarios/${clerkUser.id}`
        );

        if (response.ok) {
          const userFromBackend = await response.json();

          // Navegación condicional basada en el rol
          if (userFromBackend.esSuperusuario) {
            this.router.navigate(['/vestido/crud']);
          } else {
            this.router.navigate(['/vestido/user']);
          }
        } else {
          console.warn(
            'Usuario no encontrado en el backend. Redirigiendo por defecto.'
          );
          // Si por alguna razón el usuario está en Clerk pero no en el backend, se asume el rol de usuario estándar.
          this.router.navigate(['/vestido/user']);
        }
      }
    } catch (error) {
      console.error('Error al intentar redirigir/consultar backend:', error);
      // Opcional: Mostrar un error genérico o forzar el cierre de sesión si hay problemas.
    }
  }

  get f() {
    return this.signInForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.signInForm.valid) {
      console.log(this.signInForm.value);
      this.onSignIn();
    }
  }

  async onSignIn() {
    try {
      const result = await this.clerkService.signIn(
        this.signInForm.value.correo,
        this.signInForm.value.contrasena
      );

      console.log('Resultado de inicio de sesion:', result);

      if (result?.status === 'complete') {
        // 1. Activar la sesión de Clerk
        await this.clerkService.getClerkInstance()?.setActive({
          session: result.createdSessionId,
        });

        // 2. Redirigir usando la función centralizada
        this.redirectToDashboard();

      } else if (result?.status === 'needs_second_factor') {
        // Lógica de 2FA si aplica
        console.log('Inicio de sesión requiere 2FA.');
      }
    } catch (err) {
      const error = err as any;

      // Manejo de error: Credenciales inválidas
      if (error.status === 401) {
        alert('Correo o contraseña inválidos.');
      } 
      // Manejo de error: "Ya has iniciado sesión" (el error que recibiste)
      else if (error.message && error.message.includes("already signed in")) {
         console.warn("Error: Ya se ha iniciado sesión, redirigiendo...");
         this.redirectToDashboard();
      }
      // Manejo de errores genéricos
      else {
        console.error('Error en inicio de sesión:', err);
        alert('Ocurrió un error al iniciar sesión. Intenta más tarde.');
      }
    }
  }
}