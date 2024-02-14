import {Component, OnInit} from '@angular/core';
import {ParticipantesService} from "../services/participantes.service";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from 'sweetalert2';
import { MailServiceService } from '../services/mail-service.service';
import {RechazarBottomSheetComponent} from "../rechazar-bottom-sheet-component/rechazar-bottom-sheet-component.component";
import {MatBottomSheet} from "@angular/material/bottom-sheet";

interface Participante {
  codigo_participante: string;
  nombres : string;
  apellidos : string;
  cedula : number;
  email : string;
  telefono : number;
  doi : string;
  area : string;
  tema : string;
  participacion : string;
  descuento : string;
  totalAPagar : number;
  fecha_registro : string;
  estado: boolean;
  estadoVisual: 'aceptado' | 'rechazado' | 'pendiente';
  superposicion: boolean;
}

@Component({
  selector: 'app-tabla-principal',
  templateUrl: './tabla-principal.component.html',
  styleUrls: ['./tabla-principal.component.css']
})
export class TablaPrincipalComponent implements OnInit{
  dataSource: Participante[] = [];
  displayedColumns: string[] = ['ordinal', 'nombresCompletos', 'area', 'tema', 'participacion', 'fecha_registro', 'actions'];

  constructor(
    private participantesService: ParticipantesService,
    private router:Router,
    private route:ActivatedRoute,
    private mailService: MailServiceService,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
  this.participantesService.listarParticipantes().subscribe((data: any) => {
    this.dataSource = data.map((item: any) => ({
      ...item,
      estadoVisual: localStorage.getItem(item.codigo_participante) || 'pendiente'
    })) as Participante[];
  });
}

  rechazar(participante: Participante) {
    const bottomSheetRef = this.bottomSheet.open(RechazarBottomSheetComponent);
    bottomSheetRef.afterDismissed().subscribe((selectedOptions) => {
      if (selectedOptions) {
        const motivo = Object.keys(selectedOptions).filter((key) => selectedOptions[key]);
        this.enviarCorreoRechazo(participante, motivo.join(', '));
        participante.estadoVisual = 'rechazado';
        participante.superposicion = true; // activar la superposición
        localStorage.setItem(participante.codigo_participante, 'rechazado');
      }
    });
  }



  enviarCorreoRechazo(participante: Participante, motivo: string) {
  let urlFormularioPrincipal = 'http://localhost:4200/formularioPrincipal';
  let mensaje = `Estimado ${participante.nombres} ${participante.apellidos} con CI ${participante.cedula}, lamentamos informarle que su candidatura ha sido rechazada debido a: ${motivo}.`;

  let mailData = {
    to: participante.email,
    subject: 'Candidatura Rechazada',
    message: `
    <div style="background-color: #9370DB; padding: 20px; color: white; font-family: 'Times New Roman', serif; text-align: justify;">
      <header>
        <h1 style="color: white; text-shadow: 2px 2px 4px #000000;">Candidatura Rechazada</h1>
        <p style="color: white; text-shadow: 2px 2px 4px #000000;">${mensaje}</p>
         <br>
          <p style="color: white; text-shadow: 2px 2px 4px #000000;">Puede intentarlo nuevamente dirijase al: <a href="${urlFormularioPrincipal}">Regresar al Formulario de registro</a></p>
      </header>
                <main>
          <div style="text-align: center;">
            <img src="https://res.cloudinary.com/ddafrj6z7/image/upload/v1707705870/Art_Cientificos_Correo_Rechazo_Inicial_-_PA_ivutps.png" alt="Imagen de presentación" style="width: 100%;">
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


  aceptar(participante: Participante) {
    Swal.fire({
      title: "¿Esta de acuerdo con esta candidatura?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Enviar",
      denyButtonText: `No Enviar`
    }).then((result) => {
      if (result.isConfirmed) {
        this.enviarCorreo(participante);
        this.participantesService.cambiarEstadoParticipante(participante.codigo_participante, true).subscribe(
          (response) => {
            participante.estadoVisual = 'aceptado';
            participante.superposicion = true; // activar la superposición
            localStorage.setItem(participante.codigo_participante, 'aceptado');
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }

  enviarCorreo(participante: Participante) {
    let mensaje = '';
    let urlFormularioPago = `http://localhost:4200/formularioPago/${participante.codigo_participante}`;
    let fechaFormateada = new Date(participante.fecha_registro).toISOString().split('T')[0];
    if (participante.participacion === 'Expositor') {
      mensaje = `Enhorabuena, ${participante.participacion} ${participante.nombres} ${participante.apellidos}, su candidatura ha pasado por la primera revisión quiere decir que su fecha de exposición ${fechaFormateada} cumple con el tiempo disponible en nuestro auditorio, y sobre todo el tema que mencionó: "${participante.tema}" es de nuestro interés y queremos que sea expuesto, por consiguiente procedemos a enviar un link al formulario que tiene que llenar para que envie su comprobante de pago, el numero de cuenta es: "((AHORROS: 123456789: Nombre: Auditorios LopezITIN))" una vez verificado espere una confirmación mas y le asignaremos un ticket con el cual podrá acercarse`;
    } else if (participante.participacion === 'Asistente') {
      mensaje = `Enhorabuena ${participante.participacion}, ${participante.nombres} ${participante.apellidos}, hemos confirmado que este tema ya esta registrado en nuestro sistema, por consiguiente como asistente debera proporcionar el valor a pagar correspondiente,  por consiguiente procedemos a enviar un link al formulario que tiene que llenar para que envie su comprobante de pago, el numero de cuenta es: "((AHORROS: 123456789: Nombre: Auditorios LopezITIN))" una vez verificado espere una confirmación mas y le asignaremos un ticket con el cual podrá acercarse el dia indicado!`;
    } else if (participante.participacion === 'Invitado') {
      mensaje = `Enhorabuena ${participante.participacion}, ${participante.nombres} ${participante.apellidos}, estamos encantados de tenerle como invitado en nuestro evento y además hemos confirmado que este tema ya esta registrado en nuestro sistema, unicamente proceda con el valor a cancelar por su asistencia como un bono de ayuda para mejorar nuestro sistema e instalaciones, por consiguiente procedemos a enviar un link al formulario que tiene que llenar para que envie su comprobante de pago, el numero de cuenta es: "((AHORROS: 123456789: Nombre: Auditorios LopezITIN))" una vez verificado espere una confirmación mas y le asignaremos un ticket con el cual podrá acercarse el dia indicado!!`;
    }

    let mailData = {
      to: participante.email,
      subject: 'Bienvenido al sistema de gestión de artículos científicos',
      message: `
      <div style="background-color: #9370DB; padding: 20px; color: white; font-family: 'Times New Roman', serif; text-align: justify;">
        <header>
          <h1 style="color: white; text-shadow: 2px 2px 4px #000000;">Candidatura Aceptada</h1>
          <p style="color: white; text-shadow: 2px 2px 4px #000000;">${mensaje}</p>
          <br>
          <p style="color: white; text-shadow: 2px 2px 4px #000000;">Dirijase al siguiente link para proceder con el pago: <a href="${urlFormularioPago}">Ir al formulario de pago</a></p>
          <main>
          <div style="text-align: center;">
            <img src="https://res.cloudinary.com/ddafrj6z7/image/upload/v1707634937/Art_Cientificos_Aceptado_-_PA_qvffbr.png" alt="Imagen de presentación" style="width: 100%;">
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
       Swal.fire('Correo de aceptación enviado', '', 'success');
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
