import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-agendar-pawwer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agendar-pawwer.component.html',
  styleUrl: './agendar-pawwer.component.scss'
})
export class AgendarPawwerComponent implements OnInit {
  paseos: any[] = [];
  criterioBusqueda = 'nombre';
  textoBusqueda = '';
  toggleOpen: string | null = null;
  paseoIdUrl: string | null = null;

  cargando = false; 
  mensajeCarga = 'Verificando disponibilidad del paseo...';
  linkIncorrecto = false; // bandera para link incorrecto

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const usuario = localStorage.getItem('usuarioLogueado');
    if (usuario !== 'admin') {
      this.router.navigate(['/login']);
      return;
    }

    // Leer parámetro de la URL (ej: ?paseoId=12345)
    this.route.queryParams.subscribe(params => {
      this.paseoIdUrl = params['paseoId'] || null;

      if (!this.paseoIdUrl) {
        // Si no hay parámetro -> mostrar mensaje de link incorrecto
        this.linkIncorrecto = true;
      } else {
        this.linkIncorrecto = false;
        this.textoBusqueda = this.paseoIdUrl;
        this.criterioBusqueda = '_id';
        this.cargarPaseos();
      }
    });
  }

  cargarPaseos() {
    this.http
      .get<any[]>('https://backendpawwi-production.up.railway.app/api/leads')
      .subscribe(data => {
        this.paseos = data.map(p => ({
          ...p,
          nuevoEstado: p.estado,
          nuevaHora: p.hora,
          nuevaFecha: p.fecha,
          nuevoPawwer: p.pawwer,
          nuevoPrecio: p.precio,
          nuevoMetodoPago: p.metodoPago
        }));
      });
  }

  get paseosFiltrados() {
    if (this.linkIncorrecto) return [];

    return this.paseos.filter(p => {
      const valor =
        (p as any)[this.criterioBusqueda]?.toString().toLowerCase() || '';
      const coincideBusqueda = valor.includes(this.textoBusqueda.toLowerCase());
      const coincideEstado = p.estado === 'Pendiente';
      return coincideBusqueda && coincideEstado;
    });
  }

  async agendarPaseo(paseo: any, celularPawwer: string) {
    if (!celularPawwer) {
      alert('❌ Debes ingresar un número telefónico.');
      return;
    }

    this.cargando = true;
    celularPawwer = '57' + celularPawwer.replace(/\D/g, ''); // Asegurar formato internacional

    try {
      // Verificar que el número pertenece a un pawwer
      const usuarios = (await this.http
        .get<any[]>('https://backendpawwi-production.up.railway.app/api/usuarios')
        .toPromise()) || [];

      const pawwer = usuarios.find(u => u.celular === celularPawwer && u.tipoUsuario === 'pawwer');

      if (!pawwer) {
        alert('❌ El número ingresado no pertenece a un Pawwer.');
        this.cargando = false;
        return;
      }

      // Verificar el estado actual del paseo
      const paseoActual = await this.http
        .get<any>(`https://backendpawwi-production.up.railway.app/api/leads/${paseo._id}`)
        .toPromise();

      if (!paseoActual || paseoActual.estado !== 'Pendiente') {
        alert('❌ El paseo ya fue tomado por otro Pawwer.');
        this.cargando = false;
        return;
      }

      // Generar código de bloqueo temporal
      const codigoBloqueo = 'LOCK-' + Math.floor(10000 + Math.random() * 90000);

      // Bloquear temporalmente
      await this.http
        .put(`https://backendpawwi-production.up.railway.app/api/leads/${paseo._id}`, { estado: codigoBloqueo })
        .toPromise();

      let sigueBloqueado = true;

      // Verificar 4 veces más (total 5 verificaciones) cada 200 ms
      for (let i = 1; i <= 4; i++) {
        this.mensajeCarga = `Verificando disponibilidad (${i + 1}/5)...`;
        await new Promise(resolve => setTimeout(resolve, 200));

        const verificacion: any = await this.http
          .get(`https://backendpawwi-production.up.railway.app/api/leads/${paseo._id}`)
          .toPromise();

        if (!verificacion || verificacion.estado !== codigoBloqueo) {
          sigueBloqueado = false;
          break;
        }
      }

      // Confirmar o restaurar
      if (sigueBloqueado) {
        const payload = {
          estado: 'confirmar',
          pawwer: pawwer.celular,
        };

        await this.http.put(`https://backendpawwi-production.up.railway.app/api/leads/${paseo._id}`, payload).toPromise();
        alert('✅ Paseo agendado correctamente. En breves momentos te llegará un mensaje al WhatsApp.');
      } else {
        await this.http.put(`https://backendpawwi-production.up.railway.app/api/leads/${paseo._id}`, { estado: 'Pendiente' }).toPromise();
        alert('❌ El paseo ya fue tomado por otro Pawwer.');
      }

      this.cargarPaseos();
    } catch (error) {
      console.error('Error al agendar paseo:', error);
      alert('❌ Ocurrió un error al agendar el paseo.');
    } finally {
      this.cargando = false;
    }
  }

  trackById(index: number, item: any) {
    return item._id;
  }
}
