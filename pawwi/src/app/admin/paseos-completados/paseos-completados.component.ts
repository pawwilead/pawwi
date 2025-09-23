import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../navbar/navbar.component';


@Component({
  selector: 'app-paseos-completados',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './paseos-completados.component.html',
  styleUrl: './paseos-completados.component.scss'
})
export class PaseosCompletadosComponent implements OnInit {
paseos: any[] = [];
  toggleOpen: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarPaseos();
  }

  cargarPaseos() {
    this.http.get<any[]>('https://backendpawwi-production.up.railway.app/api/completados')
      .subscribe(data => {
        this.paseos = data
          .filter(p => p.estado === 'Completado') // ✅ Solo completados
          .map(p => ({
            _id: p._id,
            celular: p.celular,
            nombre: p.nombre,
            perro: p.perro,
            direccion: p.direccion,
            tipoServicio: p.tipoServicio,
            tiempoServicio: p.tiempoServicio,
            fecha: p.fecha,
            hora: p.hora,
            horaInicio: p.horaInicio,
            horaFin: p.horaFin,
            precio: p.precio,
            metodoPago: p.metodoPago,
            pawwer: p.pawwer,
            estado: p.estado,
            gananciaPawwer: p.gananciaPawwer,
            fechaCompletado: p.fechaCompletado
          }));
      });
  }

  abrirPaseo(id: string) {
    this.toggleOpen = this.toggleOpen === id ? null : id;
  }

  trackById(index: number, item: any) {
    return item._id;
  }
}
