import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.pro';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiDniService {
  private dniUrl = 'https://apiperu.dev/api/dni';
  private token = environment.dniTokem

  constructor(private http:HttpClient) { }

  buscarPorDni(dni: string): Observable<any> {
    const url = `${this.dniUrl}/${dni}`;  // Construye la URL con el DNI
  
    // Añadir encabezados si es necesario, por ejemplo, para la clave API
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  
    return this.http.get(url, { headers });
  }
}
