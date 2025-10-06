import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environments';

export interface Vestido {
  id?: number;
  tipo: string;
  cantidad: number;
  colores: string;
  tamano: string;
}

@Injectable({ providedIn: 'root' })
export class VestidoService {
  private apiUrl = `${environment.apiBaseUrl}/vestidos`

  constructor(private http: HttpClient) {}

  getVestidos(): Observable<Vestido[]> {
    return this.http.get<Vestido[]>(this.apiUrl);
  }

  getVestido(id: number): Observable<Vestido> {
    return this.http.get<Vestido>(`${this.apiUrl}/${id}`);
  }

  createVestido(vestido: Vestido): Observable<Vestido> {
    return this.http.post<Vestido>(this.apiUrl, vestido);
  }

  updateVestido(id: number, vestido: Vestido): Observable<Vestido> {
    return this.http.put<Vestido>(`${this.apiUrl}/${id}`, vestido);
  }

  deleteVestido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
