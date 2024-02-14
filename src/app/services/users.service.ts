import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url = 'http://13.58.9.130/users/';

  constructor(private http: HttpClient) { }

  //Crear usuario
  createUser(username: string, password: string, roleName: string): Observable<any> {
    return this.http.post(this.url + 'crear', { username, password, roleName });
  }

  //Actualizar usuario
  updateUser(id: string, username: string, password: string, roleName: string): Observable<any> {
    return this.http.put(this.url + 'actualizar/' + id, { username, password, roleName });
  }

  //Eliminar usuario
  deleteUser(id: string): Observable<any> {
    return this.http.delete(this.url + 'eliminar/' + id);
  }

  //Obtener todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get(this.url + 'listar');
  }

  //Obtener un usuario
  getUser(id: string): Observable<any> {
    return this.http.get(this.url + 'buscar/' + id);
  }

  //Listar todos los usuarios con sus respectivos nombres de rol
  getUsersWithRoles(): Observable<any> {
    return this.http.get(this.url + 'listarUsuarios');
  }
}
