import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-rechazar-bottom-sheet',
  template: `
    <h2>Seleccione el motivo de rechazo</h2>
    <mat-checkbox [(ngModel)]="selectedOptions['Tema Irrelevante']">Tema Irrelevante</mat-checkbox>
    <mat-checkbox [(ngModel)]="selectedOptions['No existe rango de fecha para exponer su tema']">No existe rango de fecha para exponer su tema</mat-checkbox>
    <mat-checkbox [(ngModel)]="selectedOptions['No contamos con plazas disponibles intente en otro momento']">No contamos con plazas disponibles intente en otro momento</mat-checkbox>
    <mat-checkbox [(ngModel)]="selectedOptions['Usted tiene un tema pendiente a exponer, una vez finalizado vuelva a escoger otro rango para su nuevo tema']">Usted tiene un tema pendiente a exponer, una vez finalizado vuelva a escoger otro rango para su nuevo tema</mat-checkbox>
    <mat-checkbox [(ngModel)]="selectedOptions['El tema al cual usted menciona ser Asistente aun no se encuentra registrado en el sistema']">El tema al cual usted menciona ser "Asistente" aún no se encuentra registrado en el sistema</mat-checkbox>
    <mat-checkbox [(ngModel)]="selectedOptions['El tema al cual usted desea asistir como invitado aun no se encuentra registrado en el sistema']">El tema al cual usted desea asistir como "Invitado" aún no se encuentra registrado en el sistema</mat-checkbox>
    <br>
    <mat-divider></mat-divider>
    <div style="display: flex; justify-content: flex-end;">
      <button mat-raised-button color="primary" (click)="submit()">Aceptar</button>
    </div>
  `,
})
export class RechazarBottomSheetComponent {
  selectedOptions : Record<string, boolean> = {};

  constructor(private bottomSheetRef: MatBottomSheetRef<RechazarBottomSheetComponent>) {}

  submit(): void {
    this.bottomSheetRef.dismiss(this.selectedOptions);
  }
}
