import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-paseos-agendados',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterModule],
  templateUrl: './paseos-agendados.component.html',
  styleUrls: ['./paseos-agendados.component.scss']
})
export class PaseosAgendadosComponent implements OnInit  {
  paseos: any[] = [];
  paseosFiltrados: any[] = [];
  toggleOpen: string | null = null;
  filtroEstado: string = ''; // '' = Todos

  estados = [
    'Por realizarse',
    'Falta 1 hora',
    'Esperando Pawwer',
    'Esperando perro',
    'Esperando Strava',
    'Esperando finalizacion',
    'Esperando finalizacion Pawwer',
    'Completado (15 minutos recordatorio de pago)',
    'Cancelado'
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const usuario = localStorage.getItem('usuarioLogueado');

    if (usuario !="admin") {
      console.log('Usuario en cache:', usuario);
      this.router.navigate(['/login']);
    } 
    this.cargarPaseos();
  }

  cargarPaseos() {
    this.http.get<any[]>('https://backendpawwi-production.up.railway.app/api/paseos')
      .subscribe(data => {
        this.paseos = data.map(p => ({
          _id: p._id,
          FechaCreacion: p.FechaCreacion,
          Celular: p.Celular,
          CelularPawwer: p.CelularPawwer,
          Nombre: p.Nombre,
          NombrePawwer: p.NombrePawwer,
          Perro: p.Perro,
          Anotaciones: p.Anotaciones,
          Direccion: p.Direccion,
          TipoServicio: p.TipoServicio,
          TiempoServicio: p.TiempoServicio,
          Fecha: p.Fecha,
          Hora: p.Hora,
          HoraInicio: p.HoraInicio,
          Precio: p.Precio,
          Estado: p.Estado,
          Strava: p.Strava,
          MetodoPago: p.MetodoPago,
          IdPawwer: p.IdPawwer,

          // Campos editables
          nuevaFecha: p.Fecha,
          nuevaHora: p.Hora,
          nuevoEstado: p.Estado,
          nuevaHoraInicio: p.HoraInicio,
          nuevoPawwer: p.IdPawwer
        }));

        // inicializa la vista filtrada
        this.paseosFiltrados = [...this.paseos];
      }, err => {
        console.error('Error cargando paseos:', err);
      });
  }

  actualizarPaseo(paseo: any) {
    this.http.put(`https://backendpawwi-production.up.railway.app/api/paseos/${paseo._id}`, {
      Estado: paseo.nuevoEstado,
      Fecha: paseo.nuevaFecha,
      Hora: paseo.nuevaHora,
      HoraInicio: paseo.nuevaHoraInicio,
      IdPawwer: paseo.nuevoPawwer
    }).subscribe(res => {
      paseo.Estado = paseo.nuevoEstado;
      paseo.Fecha = paseo.nuevaFecha;
      paseo.Hora = paseo.nuevaHora;
      paseo.HoraInicio = paseo.nuevaHoraInicio;
      paseo.IdPawwer = paseo.nuevoPawwer;
      alert(`✅ Paseo actualizado correctamente`);
    }, err => {
      console.error('Error actualizando paseo:', err);
      alert('❌ Error al actualizar. Revisa la consola.');
    });
  }

  abrirPaseo(id: string) {
    this.toggleOpen = this.toggleOpen === id ? null : id;
  }

  filtrarPorEstado(estado: string) {
    this.filtroEstado = estado;
    this.paseosFiltrados = this.paseos.filter(p => p.Estado === estado);
  }

  limpiarFiltro() {
    this.filtroEstado = '';
    this.paseosFiltrados = [...this.paseos];
  }

  trackById(index: number, item: any) {
    return item._id;
  }
}
