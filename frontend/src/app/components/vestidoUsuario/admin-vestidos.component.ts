import { Component, OnInit } from '@angular/core';
import {Vestido, VestidoService} from '../../services/vestido.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-admin-vestidos',
  templateUrl: './admin-vestidos.component.html',
  imports: [
    FormsModule,CommonModule
  ],
  styleUrls: ['./admin-vestidos.component.css']
})
export class UserVestidosComponent implements OnInit {
  vestidos: Vestido[] = [];
  selectedVestido: Vestido | null = null;
  nuevoVestido: Vestido = { tipo: '', cantidad: 0, colores: '', tamano: '' };
  modoEdicion: boolean = false;

  constructor(private vestidoService: VestidoService) {}

  ngOnInit() {
    this.cargarVestidos();
  }

  cargarVestidos() {
    this.vestidoService.getVestidos().subscribe(data => this.vestidos = data);
  }

  seleccionarVestido(vestido: Vestido) {
    this.selectedVestido = { ...vestido }; // copia para editar
    this.modoEdicion = true;
  }

  limpiarSeleccion() {
    this.selectedVestido = null;
    this.modoEdicion = false;
    this.nuevoVestido = { tipo: '', cantidad: 0, colores: '', tamano: '' };
  }

  guardarVestido() {
    if (this.selectedVestido && this.selectedVestido.id) {
      // Actualizar
      this.vestidoService.updateVestido(this.selectedVestido.id, this.selectedVestido).subscribe(() => {
        this.cargarVestidos();
        this.limpiarSeleccion();
      });
    } else {
      // Crear
      this.vestidoService.createVestido(this.nuevoVestido).subscribe(() => {
        this.cargarVestidos();
        this.limpiarSeleccion();
      });
    }
  }

  eliminarVestido(id?: number) {
    if (typeof id !== 'number') return;
    this.vestidoService.deleteVestido(id).subscribe(() => {
      this.cargarVestidos();
      this.limpiarSeleccion();
    });
  }
}
