import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantePagoService {

  url = 'http://13.58.9.130/participantePago/';

  constructor(public http: HttpClient) { }

  crearParticipantePago(participantePago: any): Observable<any> {
    return this.http.post(`${this.url}crear`, participantePago);
  }

  listarParticipantePagos(): Observable<any> {
    return this.http.get(`${this.url}listar`);
  }

  buscarParticipantePago(id: string): Observable<any> {
    return this.http.get(`${this.url}buscar/${id}`);
  }

// En tu servicio ParticipantePagoService
  actualizarParticipantePago(id: string, participantePago: any): Observable<any> {
    return this.http.put(`${this.url}actualizar/${id}`, participantePago).pipe(
      tap(() => {
        // Cuando se actualiza un pago, cambia su estado a 'pendiente' y elimina la superposición
        localStorage.setItem(id, 'pendiente');
      })
    );
  }

  eliminarParticipantePago(id: string): Observable<any> {
    return this.http.delete(`${this.url}eliminar/${id}`);
  }

  cambiarEstadoParticipantePago(id: string, estado_pago: boolean): Observable<any> {
    return this.http.put(`${this.url}cambiarEstado/${id}`, { estado_pago });
  }

  // Obtener todos los ParticipantePago con su respectivo participante
  listarParticipantePagosConParticipante(): Observable<any> {
    return this.http.get(`${this.url}listarConParticipante`);
  }

}
