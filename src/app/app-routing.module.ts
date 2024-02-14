import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RoleGuard } from './guards/role.guard';
import { FormularioPrincipalComponent } from './formulario-principal/formulario-principal.component';
import { TablaPrincipalComponent } from './tabla-principal/tabla-principal.component';
import { FormularioPagoComponent } from './formulario-pago/formulario-pago.component';
import { TablaPagosComponent } from './tabla-pagos/tabla-pagos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: '', redirectTo: 'dashboard-card', pathMatch: 'full' },
      { path: 'dashboard-card', component: DashboardCardComponent },
      { path: 'tablaPrincipal', component: TablaPrincipalComponent, canActivate: [RoleGuard], data: { expectedRole: 'Recursos Humanos' } },
      { path: 'tablaPago', component: TablaPagosComponent, canActivate: [RoleGuard], data: { expectedRole: 'Financiero' } },
    ]
  },
  { path: 'formularioPrincipal', component: FormularioPrincipalComponent, pathMatch: 'full' },
  { path: 'formularioPago/:id', component: FormularioPagoComponent, pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } // Ruta "catch-all"
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
