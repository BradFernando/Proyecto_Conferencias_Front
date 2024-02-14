import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantesService {

  url = 'http://13.58.9.130/participantes/';

  constructor(public http: HttpClient) { }

  crearParticipante(participante: any): Observable<any> {
    participante.telefono = parseInt(participante.telefono, 10);
    return this.http.post(`${this.url}crear`, participante);
  }

  actualizarParticipante(id: string, participante: any): Observable<any> {
    return this.http.put(`${this.url}actualizar/${id}`, participante);
  }

  eliminarParticipante(id: string): Observable<any> {
    return this.http.delete(`${this.url}eliminar/${id}`);
  }

  listarParticipantes(): Observable<any> {
    return this.http.get(`${this.url}listar`);
  }

  buscarParticipante(id: string): Observable<any> {
    return this.http.get(`${this.url}buscar/${id}`);
  }

  cambiarEstadoParticipante(id: string, estado: boolean): Observable<any> {
    return this.http.put(`${this.url}cambiarEstado/${id}`, { estado });
  }

  listarParticipantesActivos(): Observable<any> {
    return this.http.get(`${this.url}activos`);
  }

}
