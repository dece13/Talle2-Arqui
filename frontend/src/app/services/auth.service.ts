import { Injectable } from '@angular/core';
import { Clerk } from '@clerk/clerk-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private clerk: Clerk;
  private signedIn$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.clerk = new Clerk('pk_test_Z2xvd2luZy1qYXliaXJkLTQ5LmNsZXJrLmFjY291bnRzLmRldiQ');

    this.initializeClerk();
  }

  /** Inicializa Clerk y escucha cambios de sesión */
  private async initializeClerk() {
    await this.clerk.load();
    this.signedIn$.next(this.clerk.isSignedIn);

    this.clerk.addListener(({ user }) => {
      this.signedIn$.next(!!user);
    });
  }

  /** Observable del estado de sesión */
  getSignedInStatus(): Observable<boolean> {
    return this.signedIn$.asObservable();
  }

  /** Registro con rol y plaza */
  async signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    return this.clerk?.client?.signUp.create({
      firstName,
      lastName,
      emailAddress: email,
      password,
    });
  }

  /** Enviar código de verificación */
  async sendVerification() {
    return this.clerk?.client?.signUp.prepareEmailAddressVerification();
  }

  /** Verificar código y activar sesión */
  async verifyEmail(code: string) {
    const signUpAttempt = await this.clerk?.client?.signUp.attemptEmailAddressVerification({
      code,
    });

    if (signUpAttempt?.status === 'complete') {
      await this.clerk.setActive({ session: signUpAttempt.createdSessionId });
      this.signedIn$.next(true);
    }

    return signUpAttempt;
  }

  async getToken(): Promise<string | null> {
    const session = await this.clerk?.session;
    const token = session?.getToken();
    return token === undefined ? null : token;
  }

  /** Inicio de sesión */
  async signIn(email: string, password: string) {
    const signInAttempt = await this.clerk?.client?.signIn.create({
      identifier: email,
      password,
    });

    if (signInAttempt?.status === 'complete') {
      await this.clerk.setActive({ session: signInAttempt.createdSessionId });
      this.signedIn$.next(true);
    }

    return signInAttempt;
  }

  /** Cerrar sesión */
  async signOut() {
    await this.clerk.signOut();
    this.signedIn$.next(false);
  }

  /** Versión síncrona */
  isSignedIn(): boolean {
    return this.clerk.isSignedIn;
  }

  /** Obtener rol actual del usuario */
  async getUserRole(): Promise<string | undefined> {
    const user = await this.clerk.user;
    return user?.unsafeMetadata?.['role'] as string | undefined;
  }

  /** Obtener instancia de Clerk (por si la necesitas) */
  getClerkInstance(): Clerk {
    return this.clerk;
  }

  async getUser(): Promise<any> {
    const token = await this.getToken();

    const response = await fetch('http://localhost:8080/api/usuario', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el usuario');
    }

    return await response.json(); // Retorna el usuario con superusuario
  }

  async isSuperUser(): Promise<boolean> {
    const user = await this.getUser();
    return user.superusuario === true;
  }


}
