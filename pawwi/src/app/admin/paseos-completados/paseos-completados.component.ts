import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paseos-completados',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule, FormsModule],
  templateUrl: './paseos-completados.component.html',
  styleUrl: './paseos-completados.component.scss'
})
export class PaseosCompletadosComponent implements OnInit {
  filtroTexto = '';
  filtroFecha = '';
  filtroPago = '';
  tipoCampo = '';
  tipoEntidad = '';
  private timeoutBusqueda: any;

  paseos: any[] = [];
  paseosFiltrados: any[] = [];
  toggleOpen: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const usuario = localStorage.getItem('usuarioLogueado');
    if (usuario != 'admin') {
      this.router.navigate(['/login']);
    }
    this.cargarPaseos();
  }

  onBuscarTexto() {
    clearTimeout(this.timeoutBusqueda);
    this.timeoutBusqueda = setTimeout(() => this.aplicarFiltros(), 20);
  }

  cargarPaseos() {
    this.http.get<any[]>('https://backendpawwi-production.up.railway.app/api/completados')
      .subscribe(async data => {
        const paseosFiltrados = data.filter(p => p.estado === 'Completado');

        this.paseos = await Promise.all(
          paseosFiltrados.map(async p => {
            let pawwerNombre = 'Desconocido';
            let pawwerCelular = 'N/A';

            if (p.pawwer) {
              try {
                const usuario: any = await this.http
                  .get(`https://backendpawwi-production.up.railway.app/api/usuarios/${p.pawwer}`)
                  .toPromise();
                pawwerNombre = usuario?.nombre || 'Sin nombre';
                pawwerCelular = usuario?.celular || 'Sin celular';
              } catch (error) {
                console.warn('No se pudo obtener Pawwer', p.pawwer, error);
              }
            }

            return {
              ...p,
              pawwerNombre,
              pawwerCelular,
              pagadoPawwer: p.pagadoPawwer || false,
              pagadoEmpresa: p.pagadoEmpresa || false,
              editando: false
            };
          })
        );
        this.paseos = this.paseos.reverse(); 
        this.paseosFiltrados = [...this.paseos];
      });
  }

  aplicarFiltros() {
    const texto = (this.filtroTexto || '').toString().toLowerCase().trim();

    this.paseosFiltrados = this.paseos.filter(p => {
      const nombreCliente = (p.nombre || '').toString().toLowerCase();
      const celularCliente = (p.celular || '').toString().toLowerCase();
      const pawwerNombre = (p.pawwerNombre || '').toString().toLowerCase();
      const pawwerCelular = (p.pawwerCelular || '').toString().toLowerCase();
      const fechaPaseo = (p.fecha || '').toString();

      // 🔍 Búsqueda por texto
      let coincideTexto = true;

      if (texto) {
        const buscarPorNombre =
          this.tipoCampo === '' || this.tipoCampo === 'nombre';
        const buscarPorCelular =
          this.tipoCampo === '' || this.tipoCampo === 'celular';

        const enCliente =
          this.tipoEntidad === '' ||
          this.tipoEntidad === 'cliente' ||
          this.tipoEntidad === 'ambos';
        const enPawwer =
          this.tipoEntidad === '' ||
          this.tipoEntidad === 'pawwer' ||
          this.tipoEntidad === 'ambos';

        let coincidencias: boolean[] = [];

        if (buscarPorNombre && enCliente)
          coincidencias.push(nombreCliente.includes(texto));
        if (buscarPorNombre && enPawwer)
          coincidencias.push(pawwerNombre.includes(texto));
        if (buscarPorCelular && enCliente)
          coincidencias.push(celularCliente.includes(texto));
        if (buscarPorCelular && enPawwer)
          coincidencias.push(pawwerCelular.includes(texto));

        coincideTexto = coincidencias.some(c => c === true);
      }

      // 📅 Filtro por fecha
      let coincideFecha = true;
      if (this.filtroFecha) {
        const fechaFiltro = new Date(this.filtroFecha);
        const partes = fechaPaseo.split(/[\/\-]/);
        const fechaComparar =
          partes.length === 2
            ? new Date(new Date().getFullYear(), +partes[1] - 1, +partes[0])
            : new Date(+partes[0], +partes[1] - 1, +partes[2]);
        coincideFecha =
          !isNaN(fechaFiltro.getTime()) &&
          !isNaN(fechaComparar.getTime()) &&
          fechaFiltro.toDateString() === fechaComparar.toDateString();
      }

      // 💰 Filtro por pago
      const coincidePago =
        !this.filtroPago ||
        (this.filtroPago === 'pawwer' && p.pagadoPawwer) ||
        (this.filtroPago === 'empresa' && p.pagadoEmpresa) ||
        (this.filtroPago === 'nopago' && !p.pagadoPawwer && !p.pagadoEmpresa);

      return coincideTexto && coincideFecha && coincidePago;
    });
  }

  limpiarFiltros() {
    this.filtroTexto = '';
    this.filtroFecha = '';
    this.filtroPago = '';
    this.paseosFiltrados = [...this.paseos];
  }

  abrirPaseo(id: any) {
  const idStr = String(id);
  this.toggleOpen = this.toggleOpen === idStr ? null : idStr;
}


  cancelarEdicion(paseo: any) {
    paseo.editando = false;
  }

  guardarCambios(paseo: any) {
    const body = {
      celular: paseo.celular,
      nombre: paseo.nombre,
      perro: paseo.perro,
      direccion: paseo.direccion,
      tipoServicio: paseo.tipoServicio,
      tiempoServicio: paseo.tiempoServicio,
      fecha: paseo.fecha,
      hora: paseo.hora,
      precio: paseo.precio,
      pawwer: paseo.pawwer,
      pagadoPawwer: paseo.pagadoPawwer,
      pagadoEmpresa: paseo.pagadoEmpresa
    };

    this.http.put(`https://backendpawwi-production.up.railway.app/api/completados/${paseo._id}`, body)
      .subscribe({
        next: () => {
          alert('✅ Paseo actualizado con éxito');
          paseo.editando = false;
          this.cargarPaseos();
        },
        error: (err) => {
          console.error('Error al actualizar paseo:', err);
          alert('❌ Error al guardar los cambios');
        }
      });
  }

  trackById(index: number, item: any) {
    return item._id;
  }
}
