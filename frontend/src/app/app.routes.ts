import { Routes } from '@angular/router';
import { SignUpPage } from './pages/auth/sign-up-page/sign-up-page';
import { SignInPage } from './pages/auth/sign-in-page/sign-in-page';
import { ComercialLayout } from './layouts/comercial-layout/comercial-layout';
import { AuthGuard } from './services/auth.guard';

import { ProveedorDashboard } from './pages/proveedor/proveedor-dashboard/proveedor-dashboard';

import { ProveedorLayout } from './layouts/proveedor-layout/proveedor-layout';
import { OperadorLayout } from './layouts/operador-layout/operador-layout';

import { AdminVestidosComponent } from './components/vestidos/admin-vestidos.component';
import { UserVestidosComponent } from './components/vestidoUsuario/admin-vestidos.component';

export const routes: Routes = [
  { path: 'register', component: SignUpPage },
  { path: 'login', component: SignInPage },
  {path: 'vestido/crud', component:AdminVestidosComponent},
  {path: 'vestido/user', component:UserVestidosComponent},
  {
    path: 'comercial',
    component: ComercialLayout,
    //canActivate: [AuthGuard],
    //data: { superusuario: true },

  },
  {
    path: 'cliente',
    component: ProveedorLayout,
    //canActivate: [AuthGuard],
    //data: { superusuario: false },
    children: [
      {
        path: 'dashboard',
        component: ProveedorDashboard,
      },
    ],
  },
  {
    path: 'operador',
    component: OperadorLayout,
    //canActivate: [AuthGuard],
    //data: { superusuario: false },

  },
];
