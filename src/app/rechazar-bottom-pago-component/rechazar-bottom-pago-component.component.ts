import { Component } from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-rechazar-bottom-pago-component',
  template: `
    <h2>Seleccione el motivo de rechazo</h2>
    <mat-checkbox [(ngModel)]="selectedOptions['Su archivo de pago es ilegible']">Su archivo de pago es ilegible</mat-checkbox>
    <mat-checkbox [(ngModel)]="selectedOptions['Su archivo no es un comprobante de pago valido']">Su archivo no es un comprobante de pago válido</mat-checkbox>
    <mat-checkbox [(ngModel)]="selectedOptions['El monto de pago del archivo y el pendiente no coinciden']">El monto de pago del archivo y el pendiente no coinciden</mat-checkbox>
    <mat-checkbox [(ngModel)]="selectedOptions['El archivo de pago no corresponde a la fecha seleccionada']">El archivo de pago no corresponde a la fecha seleccionada</mat-checkbox>
    <mat-checkbox [(ngModel)]="selectedOptions['Hemos esperado por mas de 72hrs su transaccion']">Hemos esperado por mas de 36hrs su transacción</mat-checkbox>
    <mat-checkbox [(ngModel)]="selectedOptions['El nombre del remitente del archivo no es el mimo de nuestro sistema']">El nombre del remitente del archivo no es el mimo de nuestro sistema</mat-checkbox>

    <br>
    <mat-divider></mat-divider>
    <div style="display: flex; justify-content: flex-end;">
      <button mat-raised-button color="primary" (click)="submit()">Aceptar</button>
    </div>
  `,
})

export class RechazarBottomPagoComponentComponent {
  selectedOptions : Record<string, boolean> = {};

  constructor(private bottomSheetRef: MatBottomSheetRef<RechazarBottomPagoComponentComponent>) {}

  submit(): void {
    this.bottomSheetRef.dismiss(this.selectedOptions);
  }
}
