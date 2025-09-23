import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-paseos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './paseos.component.html',
  styleUrls: ['./paseos.component.scss']
})
export class PaseosComponent implements OnInit {
  paseos: any[] = [];
  toggleOpen: string | null = null;

  criterioBusqueda = 'nombre';
  textoBusqueda = '';
  filtroEstado = ''; // 👈 Nuevo filtro

  // Opciones posibles para el estado del paseo
  estados = ['Pendiente', 'Cambiar', 'Confirmar', 'Cancelado'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarPaseos();
  }

  cargarPaseos() {
    this.http.get<any[]>('https://backendpawwi-production.up.railway.app/api/leads')
      .subscribe(data => {
        this.paseos = data.map(p => ({
          ...p,
          nuevoEstado: p.estado,
          nuevaHora: p.hora,
          nuevaFecha: p.fecha,
          nuevoPawwer: p.pawwer
        }));
      });
  }

  get paseosFiltrados() {
    return this.paseos.filter(p => {
      // 🔎 filtro de búsqueda
      const valor = (p as any)[this.criterioBusqueda]?.toString().toLowerCase() || '';
      const coincideBusqueda = valor.includes(this.textoBusqueda.toLowerCase());

      // ✅ filtro por estado
      const coincideEstado = this.filtroEstado === '' || p.estado === this.filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }

  actualizarPaseo(paseo: any) {
    let fechaFormateada = paseo.nuevaFecha;
    if (fechaFormateada && fechaFormateada.includes('-')) {
      const [yyyy, mm, dd] = fechaFormateada.split('-');
      fechaFormateada = `${dd}/${mm}`;
    }

    this.http.put(`https://backendpawwi-production.up.railway.app/api/leads/${paseo._id}`, {
      estado: paseo.nuevoEstado,
      hora: paseo.nuevaHora,
      fecha: fechaFormateada,
      pawwer: paseo.nuevoPawwer
    }).subscribe(res => {
      paseo.estado = paseo.nuevoEstado;
      paseo.hora = paseo.nuevaHora;
      paseo.fecha = fechaFormateada;
      paseo.pawwer = paseo.nuevoPawwer;
      alert(`✅ Paseo actualizado correctamente`);
    });
  }

  abrirPaseo(id: string) {
    this.toggleOpen = this.toggleOpen === id ? null : id;
  }

  trackById(index: number, item: any) {
    return item._id;
  }
}
