import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import {environment} from '../../../../environments/environments';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
})
export class SignUp {
  signUpForm: FormGroup;
  submitted = false;
  step: 'register' | 'verify' = 'register';
  code = '';
  signedIn: any;
  usuario: any;

  constructor(private fb: FormBuilder, private clerkService: AuthService, private router: Router) {
    this.signUpForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.signedIn = this.clerkService.isSignedIn();
    this.usuario = this.clerkService.getClerkInstance()?.user;
  }

  get f() {
    return this.signUpForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value);

      this.onRegister();
    }
  }

  async onRegister() {
    try {
      await this.clerkService.signUp(
        this.signUpForm.value.nombre,
        this.signUpForm.value.apellido,
        this.signUpForm.value.correo,
        this.signUpForm.value.contrasena
      );
      await this.clerkService.sendVerification();
      this.step = 'verify';
    } catch (err) {
      console.error('Error en registro:', err);
    }
  }

  canResend = true;
  async resendCode() {
    if (!this.canResend) return;
    this.canResend = false;

    try {
      await this.clerkService.sendVerification();
      alert('Se ha reenviado el código de verificación.');
    } catch (err) {
      console.error('Error al reenviar el código:', err);
      alert('No se pudo reenviar el código. Intenta más tarde.');
    } finally {
      setTimeout(() => (this.canResend = true), 15000); // 15 segundos
    }
  }

  async onVerify() {
    try {
      const result = await this.clerkService.verifyEmail(this.code);
      if (result?.status === 'complete') {
      await this.clerkService.getClerkInstance()?.setActive({
        session: result.createdSessionId,
      });

      const clerkUser = await this.clerkService.getClerkInstance().user;
      if (clerkUser) {
        const usuarioBackend = {
          id: clerkUser.id,
          nombre: clerkUser.firstName,
          apellido: clerkUser.lastName,
          usuario: clerkUser.emailAddresses?.[0]?.emailAddress,
          esSuperusuario: false, // o true si lo asignas manualmente
        };

        // Guardar en tu backend
        await fetch(`${environment.apiBaseUrl}/usuarios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuarioBackend),
        });

        // ✅ Luego consultamos si es superusuario
        const response = await fetch(`${environment.apiBaseUrl}/usuarios/${clerkUser.id}`);
        const userFromBackend = await response.json();

        // ✅ Navegamos según el valor
        if (userFromBackend.esSuperusuario) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/cliente/dashboard']);
        }
      }
    }
      console.log("HI: " + result?.status)
    } catch (err) {
      console.error('Error en verificación:', err);
    }
  }
}
