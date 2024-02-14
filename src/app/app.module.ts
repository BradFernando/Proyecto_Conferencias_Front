import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormularioPrincipalComponent } from './formulario-principal/formulario-principal.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatNativeDateModule} from "@angular/material/core";
import { TablaPrincipalComponent } from './tabla-principal/tabla-principal.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import { FormularioPagoComponent } from './formulario-pago/formulario-pago.component';
import {MatDialogModule} from "@angular/material/dialog";
import {
  RechazarBottomSheetComponent,

} from './rechazar-bottom-sheet-component/rechazar-bottom-sheet-component.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import { MatTooltipModule} from "@angular/material/tooltip";
import {MatLegacyChipsModule} from "@angular/material/legacy-chips";
import { TablaPagosComponent } from './tabla-pagos/tabla-pagos.component';
import { RechazarBottomPagoComponentComponent } from './rechazar-bottom-pago-component/rechazar-bottom-pago-component.component';
import {ImageDialogComponent} from "./image-dialog-component/image-dialog-component.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatMenuModule} from "@angular/material/menu";
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgChartsModule} from "ng2-charts";
import { LoginComponent } from './login/login.component';
import {RoleGuard} from "./guards/role.guard";

@NgModule({
  declarations: [
    AppComponent,
    FormularioPrincipalComponent,
    FormularioPagoComponent,
    TablaPrincipalComponent,
    RechazarBottomSheetComponent,
    TablaPagosComponent,
    RechazarBottomPagoComponentComponent,
    ImageDialogComponent,
    DashboardComponent,
    DashboardCardComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
    MatChipsModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatCheckboxModule,
    FormsModule,
    MatBottomSheetModule,
    MatTooltipModule,
    MatLegacyChipsModule,
    MatSidenavModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    NgChartsModule

  ],
  providers: [RoleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
