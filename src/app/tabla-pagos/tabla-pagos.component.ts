import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MailServiceService} from "../services/mail-service.service";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {ParticipantePagoService} from "../services/participante-pago.service";
import {
  RechazarBottomPagoComponentComponent
} from "../rechazar-bottom-pago-component/rechazar-bottom-pago-component.component";
import Swal from "sweetalert2";
import {MatDialog} from "@angular/material/dialog";
import {ImageDialogComponent} from "../image-dialog-component/image-dialog-component.component";

interface ParticipantePagos {
  codigo_pago: string;
  codigo_participante: string;
  nombres : string;
  apellidos : string;
  cedula : number;
  email : string;
  fecha_pago : string;
  direccion_pago : string;
  postal_pago : number;
  comprobante_pago : string;
  estado_pago: boolean;
  totalAPagar: number;
  estadoVisual: 'aceptado' | 'rechazado' | 'pendiente';
  superposicion: boolean;

}

@Component({
  selector: 'app-tabla-pagos',
  templateUrl: './tabla-pagos.component.html',
  styleUrls: ['./tabla-pagos.component.css']
})
export class TablaPagosComponent implements OnInit{

  dataSource: ParticipantePagos[] = [];
displayedColumns: string[] = ['ordinal', 'nombresCompletos', 'fecha_pago', 'direccion_pago', 'postal_pago','totalAPagar', 'comprobante_pago', 'actions'];
  constructor(
    private participantePagoService: ParticipantePagoService,
    private router:Router,
    private route:ActivatedRoute,
    private mailService: MailServiceService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) {}

    openImageDialog(imageSrc: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageSrc },
    });
  }

// En tu componente TablaPagosComponent
ngOnInit(): void {
  this.participantePagoService.listarParticipantePagosConParticipante().subscribe((data: any) => {
    console.log(data);
    this.dataSource = data.map((item: any) => ({
      ...item,
      nombresCompletos: (item.participante.nombres || '') + ' ' + (item.participante.apellidos || ''), // combina nombres y apellidos
      codigo_participante: item.participante.codigo_participante,
      nombres: item.participante.nombres,
      apellidos: item.participante.apellidos,
      cedula: item.participante.cedula,
      totalAPagar: item.participante.totalAPagar,
      email: item.participante.email,
      estadoVisual: localStorage.getItem(item.codigo_pago) || 'pendiente',
      superposicion: localStorage.getItem(item.codigo_pago + '_superposicion') === 'true' // la superposición solo se activa si el estado es 'true'
    })) as ParticipantePagos[];
  });
}

  rechazar(participante: ParticipantePagos) {
    const bottomSheetRefPagos = this.bottomSheet.open(RechazarBottomPagoComponentComponent);
    bottomSheetRefPagos.afterDismissed().subscribe((selectedOptionsPagos) => {
      if (selectedOptionsPagos) {
        const motivo = Object.keys(selectedOptionsPagos).filter((key) => selectedOptionsPagos[key]);
        this.enviarCorreoRechazo(participante, motivo.join(', '));
        participante.estadoVisual = 'rechazado';
        participante.superposicion = true; // activar la superposición
        localStorage.setItem(participante.codigo_pago, 'rechazado');
      }
    });
  }

  enviarCorreoRechazo(participante: ParticipantePagos, motivo: string) {
    let urlFormularioPago = `http://localhost:4200/formularioPago/${participante.codigo_participante}`;
    let mensaje = `Estimado ${participante.nombres} ${participante.apellidos} con CI ${participante.cedula}, lamentamos informarle que su pago fue rechazado por lo siguiente: ${motivo}.`;

    let mailData = {
      to: participante.email,
      subject: 'Pago Rechazado',
      message: `
    <div style="background-color: #9370DB; padding: 20px; color: white; font-family: 'Times New Roman', serif; text-align: justify;">
      <header>
        <h1 style="color: white; text-shadow: 2px 2px 4px #000000;">Candidatura Rechazada</h1>
        <p style="color: white; text-shadow: 2px 2px 4px #000000;">${mensaje}</p>
         <br>
          <p style="color: white; text-shadow: 2px 2px 4px #000000;">Puede intentarlo nuevamente dirijase al: <a href="${urlFormularioPago}">Regresar al Formulario de Pago</a></p>
      </header>
                <main>
          <div style="text-align: center;">
            <img src="https://res.cloudinary.com/ddafrj6z7/image/upload/v1707725931/Art_Cientificos_pago_rechazado_-_PA_oulj8q.png" alt="Imagen de presentación" style="width: 100%;">
          </div>
          <p>PA - Congreso de Conferencias de Art. Científicos System</p>
          <div style="text-align: center;">
            <img src="https://res.cloudinary.com/ddafrj6z7/image/upload/v1707617078/CienciaGrupoAvanzadaLogo_mtrct4.png" alt="Descripción de la imagen" style="height: 240px; width: 240px">
          </div>
        </main>
      <footer style="border-top: 1px solid black; padding-top: 10px;">
        <p>Todos los derechos reservados proyecto grupal de avanzada, Autor Principal - Bradley Corro</p>
      </footer>
    </div>
  `
    };

    this.mailService.sendMail(mailData).subscribe(
      (response) => {
        Swal.fire('Correo de rechazo enviado', '', 'success');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  aceptar(participante: ParticipantePagos) {
    Swal.fire({
      title: "¿Son correctos los datos del pago?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si, Enviar",
      denyButtonText: `No, Desaprobar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.enviarCorreoAceptacion(participante);
        this.participantePagoService.cambiarEstadoParticipantePago(participante.codigo_pago, true).subscribe(
          (response) => {
            participante.estadoVisual = 'aceptado';
            participante.superposicion = true; // activar la superposición
            localStorage.setItem(participante.codigo_pago, 'aceptado');
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }

  enviarCorreoAceptacion(participante: ParticipantePagos) {
    let mensaje = `Estimado ${participante.nombres} ${participante.apellidos} con CI ${participante.cedula}, agradecemos su paciencia en este proceso, hemos verificado con éxito todos sus datos.`;


    let mailData = {
      to: participante.email,
      subject: 'Pago Aceptado',
      message: `
    <div style="background-color: #9370DB; padding: 20px; color: white; font-family: 'Times New Roman', serif; text-align: justify;">
      <header>
        <h1 style="color: white; text-shadow: 2px 2px 4px #000000;">Candidatura Aceptada</h1>
        <p style="color: white; text-shadow: 2px 2px 4px #000000;">${mensaje}</p>
        <p style="color: white; text-shadow: 2px 2px 4px #000000;">La fecha asignada será confirmada en los próximos días, haremos espacio en nuestro auditorio</p>
      </header>
                <main>
          <div style="text-align: center;">
            <img src="https://res.cloudinary.com/ddafrj6z7/image/upload/v1707726314/Art_Cientificos_pago_completado_-_PA_escqu7.png" alt="Imagen de presentación" style="width: 100%;">
          </div>
          <p>PA - Congreso de Conferencias de Artículos Científicos System</p>
          <div style="text-align: center;">
            <img src="https://res.cloudinary.com/ddafrj6z7/image/upload/v1707617078/CienciaGrupoAvanzadaLogo_mtrct4.png" alt="Descripción de la imagen" style="height: 240px; width: 240px">
          </div>
        </main>
      <footer style="border-top: 1px solid black; padding-top: 10px;">
        <p>Todos los derechos reservados proyecto grupal de avanzada,
        Autor Principal - Bradley Corro</p>
      </footer>
    </div>
  `
    };

    this.mailService.sendMail(mailData).subscribe(
      (response) => {
        Swal.fire('Correo de aceptación enviado', '', 'success');
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
