import { Routes } from '@angular/router';
import { ROL_ADMIN, ROL_PACIENTE } from './core/api.config';
import { autenticacionGuard } from './core/guards/autenticacion.guard';
import { rolGuard } from './core/guards/rol.guard';
import { AccesoDenegadoPage } from './pages/acceso-denegado/acceso-denegado.page';
import { CitasPage } from './pages/citas/citas.page';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';
import { MedicosPage } from './pages/medicos/medicos.page';
import { MisCitasPage } from './pages/mis-citas/mis-citas.page';
import { PacientesPage } from './pages/pacientes/pacientes.page';

export const routes: Routes = [
  // Publicas
  { path: '', component: HomePage, title: 'Inicio | Clínica Piedra Azul' },
  { path: 'login', component: LoginPage, title: 'Iniciar sesión | Clínica Piedra Azul' },
  { path: 'acceso-denegado', component: AccesoDenegadoPage, title: 'Acceso denegado | Clínica Piedra Azul' },

  // Administrador
  {
    path: 'admin/medicos',
    component: MedicosPage,
    canActivate: [autenticacionGuard, rolGuard],
    data: { roles: [ROL_ADMIN] },
    title: 'Médicos | Clínica Piedra Azul',
  },
  {
    path: 'admin/pacientes',
    component: PacientesPage,
    canActivate: [autenticacionGuard, rolGuard],
    data: { roles: [ROL_ADMIN] },
    title: 'Pacientes | Clínica Piedra Azul',
  },
  {
    path: 'admin/citas',
    component: CitasPage,
    canActivate: [autenticacionGuard, rolGuard],
    data: { roles: [ROL_ADMIN] },
    title: 'Citas | Clínica Piedra Azul',
  },

  // Paciente
  {
    path: 'paciente/mis-citas',
    component: MisCitasPage,
    canActivate: [autenticacionGuard, rolGuard],
    data: { roles: [ROL_PACIENTE] },
    title: 'Mis citas | Clínica Piedra Azul',
  },

  { path: '**', redirectTo: '' },
];
