import { Component, OnInit } from '@angular/core';
import { MailServiceService } from '../services/mail-service.service';
import { ParticipantesService } from '../services/participantes.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors, ValidatorFn,
  Validators
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';


/** Error cuando un control no válido se ensucia, se toca o se envía.*/
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-formulario-principal',
  templateUrl: './formulario-principal.component.html',
  styleUrls: ['./formulario-principal.component.css'],
})
export class FormularioPrincipalComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  codigo_participante: string = '';
  participacion: string[] = ['Expositor', 'Asistente', 'Invitado'];

  constructor(
    private formBuilder: FormBuilder,
    private mailService: MailServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private participantesService: ParticipantesService
  ) {}


  areas = [
    { value: '1', label: 'Ciencias de la Computación' },
    { value: '2', label: 'Ciencias Exactas' },
    { value: '3', label: 'Ciencias de la Vida' },
    { value: '4', label: 'Ciencias de la Tierra' },
    { value: '5', label: 'Ciencias de la Salud' },
    { value: '6', label: 'Ciencias de la Ingeniería' },
    { value: '7', label: 'Ciencias de la Educación' },
  ];

  validarCedulaEcuatoriana(control: AbstractControl): ValidationErrors | null {
  let cedula = control.value;
  // Convertir a cadena si es necesario
  if (typeof cedula === 'number') {
    cedula = cedula.toString();
  }
  if (!/^\d{10}$/.test(cedula)) {
    return { 'invalidID': true };
  }

  const digitoVerificador = parseInt(cedula.substring(9, 10));
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let mult = (i % 2 === 0) ? 2 : 1;
    let total = parseInt(cedula.charAt(i)) * mult;
    suma += (total >= 10) ? total - 9 : total;
  }

  let decenaSuperior = Math.ceil(suma / 10) * 10;
  let digitoCalculado = decenaSuperior - suma;

  if (digitoCalculado !== digitoVerificador) {
    return { 'invalidID': true };
  }

  return null;
}


  validarDOI(control: AbstractControl) {
    const doi = control.value;
    const doiRegex = /^(https:\/\/doi\.org\/)?10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;

    if (!doiRegex.test(doi)) {
      return { 'invalidDOI': true };
    }

    return null;
  }

    validarEmail(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const email = control.value;
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;

      if (!emailRegex.test(email)) {
        return { 'invalidEmail': true };
      }

      return null;
    };
  }


  validarFecha(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const fechaIngresada = new Date(control.value);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Establecer la hora, minutos y segundos a 0
    const fechaMaxima = new Date();
    fechaMaxima.setMonth(fechaMaxima.getMonth() + 1);

    if (fechaIngresada < fechaActual || fechaIngresada > fechaMaxima) {
      return { 'fechaInvalida': true };
    }

    return null;
  };
}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombres: ['', [Validators.required, Validators.pattern(/^[a-zA-ZñÑ ]*$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZñÑ ]*$/)]],
      cedula: ['', [Validators.required, this.validarCedulaEcuatoriana]],
      email: ['', [Validators.required, this.validarEmail()]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(10), Validators.maxLength(10)]],
      doi: ['', [Validators.required, this.validarDOI]],
      area: ['', Validators.required],
      tema: ['', Validators.required],
      fecha: ['', [Validators.required, this.validarFecha()]],
      participacion: ['', Validators.required],
      descuento: [''],
      totalAPagar: [''],
    });

    // Suscríbete a los cambios de valor de 'participacion'
    this.form.get('participacion')?.valueChanges.subscribe((value) => {
      let message = '';
      let descuento = 0;
      let totalAPagar = 0;
      if (!value) {
        message = 'Recuerda que estas opciones son obligatorias';
      } else if (value === 'Expositor') {
        let pagoInicial = 25;
        descuento = 20; // 20% de descuento
        totalAPagar = pagoInicial - (pagoInicial * descuento / 100);
        message = `Enhorabuena si eres expositor accedes a un ${descuento}% de descuento si es tu primera vez registrándote en nuestro sistema, tu pago será de ${totalAPagar}$`;
      } else if (value === 'Asistente') {
        let pagoInicial = 15;
        descuento = 10; // 10% de descuento
        totalAPagar = pagoInicial - (pagoInicial * descuento / 100);
        message = `Enhorabuena eres un asistente cuentas con un ${descuento}% de este Art.Cientifico tu pago será el mínimo ${totalAPagar}$ como contribución a nuestro equipo`;
      } else if (value === 'Invitado') {
        let pagoInicial = 5;
        descuento = 5; // 5% de descuento
        totalAPagar = pagoInicial - (pagoInicial * descuento / 100);
        message = `Enhorabuena querido invitado te invitamos a este grandioso tema de exposición, recuerda si es primera vez que asistes a ver una de nuestras exposiciones tienes un ${descuento}% de descuento al pago total que son ${totalAPagar}$`;
      }
      this.form.get('descuento')?.setValue(descuento);
      this.form.get('totalAPagar')?.setValue(totalAPagar);
      this.openSnackBar(message);
    });
  }

  matcher = new MyErrorStateMatcher();

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 10000, // Duración de 10 segundos
    });
  }

  onSubmit(): void {
  if (this.form.valid) {
    Swal.fire({
      title: "Los datos insertados son correctos?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Enviar",
      denyButtonText: `No Enviar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.participantesService.crearParticipante(this.form.value).subscribe(
          (response) => {
            console.log(response);
            Swal.fire("Candidatura Enviada con Éxito!", "", "success");

            // Crear el objeto con los datos del correo electrónico
              let mailData = {
                to: this.form.get('email')?.value,
                subject: 'Bienvenido al sistema de gestión de artículos científicos',
                message: `
                  <div style="background-color: #9370DB; padding: 20px; color: white; font-family: 'Times New Roman', serif; text-align: justify;">
                    <header>
                      <h1 style="color: white; text-shadow: 2px 2px 4px #000000;">Estimado ${this.form.get('nombres')?.value} ${this.form.get('apellidos')?.value} con CI ${this.form.get('cedula')?.value}</h1>
                      <p>Bienvenido al sistema de gestión de artículos científicos.</p>
                      <p>Analizaremos su candidatura y verificaremos que todo sea correcto. Si todo está bien en pocos minutos te enviaremos un formulario con el pago para que puedas completar el proceso.</p>
                      <p>Recuerde que marcó la opción "${this.form.get('participacion')?.value}" y tiene un descuento de ${this.form.get('descuento')?.value}%. El monto total a pagar después del descuento es ${this.form.get('totalAPagar')?.value}$. Ten Lista tu cartera de pago</p>
                      <p>Gracias por preferirnos.</p>
                    <main>
                      <div style="text-align: center;">
                        <img src="https://res.cloudinary.com/ddafrj6z7/image/upload/v1707618622/Presentaci%C3%B3n_de_Art_Cientificos_-_PA_az5nag.png" alt="Imagen de presentación" style="width: 100%;">
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
            // Enviar el correo electrónico
            this.mailService.sendMail(mailData).subscribe(
              (response) => {
                console.log(response);
              },
              (error) => {
                console.log(error);
              }
            );
          },
          (error) => {
            console.log(error);
            // Aquí puedes manejar los errores
          }
        );
      } else if (result.isDenied) {
        Swal.fire("El formulario no fue enviado", "", "info");
      }
    });
  } else {
    if (!this.form.get('participacion')?.value) {
      this.openSnackBar('Debes seleccionar una opción de participación');
    }
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control) {
        const controlErrors: ValidationErrors | null = control.errors;
        if (controlErrors) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      }
    });
  }
}
}
