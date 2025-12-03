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
    'Completado',
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
    this.cargarPawwers()
  }

  cargarPaseos() {
    this.http.get<any[]>('https://backendpawwi-production.up.railway.app/api/paseos')
      .subscribe(data => {

        this.paseos = data.map(p => {

          // Obtener año real desde FechaCreacion
          const fechaCreacion = new Date(p.FechaCreacion);
          const yyyy = fechaCreacion.getFullYear();

          // Convertir p.Fecha a formato YYYY-MM-DD
          let fechaISO = p.Fecha;

          if (p.Fecha && p.Fecha.includes('/')) {
            const [dd, mm] = p.Fecha.split('/');
            fechaISO = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
          }

          return {
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

            // Campos editables (AJUSTADO)
            nuevaFecha: fechaISO,        // ← YA EN YYYY-MM-DD
            nuevaHora: p.Hora,
            nuevoEstado: p.Estado,
            nuevaHoraInicio: p.HoraInicio,
            nuevoPawwer: p.IdPawwer
          };
        }).reverse();;

        // inicializa vista filtrada
        this.paseosFiltrados = [...this.paseos];

      }, err => {
        console.error('Error cargando paseos:', err);
      });
  }


  actualizarPaseo(paseo: any) {
    const convertToColombiaTime = (localDateStr: string) => {
      const localDate = new Date(localDateStr); // La hora que seleccionó el usuario
      // Offset Colombia UTC-5
      const colombiaOffset = -5 * 60; // en minutos
      const utc = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
      const colombiaDate = new Date(utc + colombiaOffset * 60000);

      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${colombiaDate.getFullYear()}-${pad(colombiaDate.getMonth() + 1)}-${pad(colombiaDate.getDate())} ${pad(colombiaDate.getHours())}:${pad(colombiaDate.getMinutes())}:${pad(colombiaDate.getSeconds())}`;
    }

    const horaInicioColombia = convertToColombiaTime(paseo.nuevaHoraInicio);

    this.http.put(`https://backendpawwi-production.up.railway.app/api/paseos/${paseo._id}`, {
      Estado: paseo.nuevoEstado,
      Fecha: paseo.nuevaFecha,
      Hora: paseo.nuevaHora,
      HoraInicio: horaInicioColombia,
      IdPawwer: paseo.nuevoPawwer,
      NombrePawwer: paseo.NombrePawwer,
      CelularPawwer: paseo.CelularPawwer
    }).subscribe(res => {
      paseo.HoraInicio = horaInicioColombia;
      alert(`✅ Paseo actualizado correctamente`);
      window.location.reload();
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

  // ------------------- POPUP PAWWER -------------------
pawwers: any[] = [];
pawwersFiltrados: any[] = [];
popupPawwerVisible: boolean = false;
paseoSeleccionado: any = null;
busquedaPawwer: string = '';

abrirPopupPawwer(paseo: any) {
  this.paseoSeleccionado = paseo;
  this.popupPawwerVisible = true;
  this.cargarPawwers();
}

cerrarPopupPawwer() {
  this.popupPawwerVisible = false;
  this.busquedaPawwer = '';
  this.pawwersFiltrados = [...this.pawwers];
}

cargarPawwers() {
  this.http
    .get<any[]>('https://backendpawwi-production.up.railway.app/api/usuarios')
    .subscribe(lista => {
      // Filtra solo Pawwers
      this.pawwers = lista.filter(u => 
        u.tipoUsuario?.toLowerCase() === 'pawwer'
      );

      this.pawwersFiltrados = [...this.pawwers];
    });
}

filtrarPawwer() {
  const txt = this.busquedaPawwer.toLowerCase();
  this.pawwersFiltrados = this.pawwers.filter(p =>
    p.nombre.toLowerCase().includes(txt) ||
    p.celular.toLowerCase().includes(txt)
  );
}

seleccionarPawwer(p: any) {
  if (!this.paseoSeleccionado) return;

  // Asignar automáticamente
  this.paseoSeleccionado.nuevoPawwer = p._id;
  this.paseoSeleccionado.NombrePawwer = p.nombre;
  this.paseoSeleccionado.CelularPawwer = p.celular;

  this.cerrarPopupPawwer();
}

}
