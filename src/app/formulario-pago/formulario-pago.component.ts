import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm, ValidatorFn,
  Validators
} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ParticipantePagoService} from "../services/participante-pago.service";
import {ParticipantesService} from "../services/participantes.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import Swal from "sweetalert2";

/** Error cuando un control no válido se ensucia, se toca o se envía.*/
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-formulario-pago',
  templateUrl: './formulario-pago.component.html',
  styleUrls: ['./formulario-pago.component.css']
})
export class FormularioPagoComponent implements OnInit{
  formPay: FormGroup = this.formBuilder.group({});
  matcher = new MyErrorStateMatcher();
  participante: any;
  submitted = false;
  codigo_participante: string = '';
  selectedFile: File | null = null; // Nueva propiedad para almacenar el archivo seleccionado

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private participantePagoService: ParticipantePagoService,
    private participantesService: ParticipantesService,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id !== null) {
    this.participantesService.buscarParticipante(id).subscribe(data => {
      this.participante = data;
      this.codigo_participante = data.codigo_participante; // Almacena el codigo_participante
      this.initForm();
      this.formPay.get('monto_pago')?.setValue(this.participante.totalAPagar);
    });
  }
}


validarFechaPago(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const fechaIngresada = new Date(control.value);
    fechaIngresada.setHours(0, 0, 0, 0); // Establecer la hora, minutos y segundos a 0
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Establecer la hora, minutos y segundos a 0
    const fechaMaxima = new Date();
    fechaMaxima.setDate(fechaMaxima.getDate() + 7);

    if (fechaIngresada < fechaActual || fechaIngresada > fechaMaxima) {
      return { 'fechaPagoInvalida': true };
    }

    return null;
  };
}

initForm(): void {
  this.formPay = this.formBuilder.group({
    fecha_pago: ['', [Validators.required, this.validarFechaPago()]],
    direccion_pago: ['', Validators.required],
    postal_pago: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    comprobante_pago: [null, Validators.required]
  });
}
invalidFileType = false;

onFileSelect(event: any) {
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];
    const fileType = file["type"];
    const validImageTypes = ["image/jpg", "image/jpeg", "image/png"];

    // Comprueba el tamaño del archivo
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      Swal.fire("Archivo demasiado grande", "La imagen que intenta enviar es demasiado pesada, pruebe con otra", "error");
      event.target.value = '';
      this.formPay.get('comprobante_pago')?.setValue(null); // Establecer el valor en null cuando se elimina un archivo
      return;
    }

    if (!validImageTypes.includes(fileType)) {
      this.snackBar.open('Formato de archivo no válido. Por favor, sube un archivo .jpg, .jpeg, .png o .pdf', 'Cerrar', {
        duration: 5000,
      });
      event.target.value = '';
      this.formPay.get('comprobante_pago')?.setValue(null); // Establecer el valor en null cuando se elimina un archivo
      return;
    }

    this.selectedFile = file; // Almacena el archivo seleccionado

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageBase64 = e.target.result;
      this.formPay.get('comprobante_pago')?.setValue(imageBase64);
    };
    reader.readAsDataURL(file);
  } else {
    this.formPay.get('comprobante_pago')?.setValue(null); // Establecer el valor en null cuando no se selecciona ningún archivo
    this.selectedFile = null; // Establecer selectedFile en null cuando no se selecciona ningún archivo
  }
}

onSubmit(event: Event): void {
  if (this.selectedFile) {
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (this.selectedFile.size > maxSize) {
      Swal.fire("Archivo demasiado grande", "La imagen que intenta enviar es demasiado pesada, pruebe con otra", "error");
      event.preventDefault(); // Detiene el evento de envío del formulario
      return;
    }
  }

  if (this.formPay.valid) {
    const participantePago = {
      codigo_participante: this.codigo_participante,
      fecha_pago: this.formPay.get('fecha_pago')?.value,
      monto_pago: this.participante.totalAPagar,
      direccion_pago: this.formPay.get('direccion_pago')?.value,
      postal_pago: parseInt(this.formPay.get('postal_pago')?.value),
      comprobante_pago: this.formPay.get('comprobante_pago')?.value,
      estado_pago: false
    };

    this.participantePagoService.buscarParticipantePago(this.codigo_participante).subscribe((response) => {
      if (response) {
        this.participantePagoService.actualizarParticipantePago(this.codigo_participante, participantePago).subscribe((response) => {
          console.log(response);
          Swal.fire("Pago Actualizado con Éxito!", "", "success");
          // Cuando se actualiza un pago, cambia su estado a 'pendiente' y desactiva la superposición
          // Usa codigo_pago en lugar de codigo_participante
          localStorage.setItem(response.codigo_pago, 'pendiente');
          localStorage.setItem(response.codigo_pago + '_superposicion', 'false');
        }, (error) => {
          console.log(error);
        });
      } else {
        this.participantePagoService.crearParticipantePago(participantePago).subscribe((response) => {
          console.log(response);
          Swal.fire("Pago Confirmado con Éxito!", "", "success");
          // Cuando se crea un pago, cambia su estado a 'pendiente' y desactiva la superposición
          // Usa codigo_pago en lugar de codigo_participante
          localStorage.setItem(response.codigo_pago, 'pendiente');
          localStorage.setItem(response.codigo_pago + '_superposicion', 'false');
        }, (error) => {
          console.log(error);
        });
      }
    }, (error) => {
      console.log(error);
    });
  } else {
    Swal.fire("Formulario Inválido", "Por favor, rellene los campos correctamente", "error");
  }
}
}
