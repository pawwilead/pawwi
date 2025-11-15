import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';

interface Cliente {
  _id: string;
  nombre: string;
  celular: string;
  direccion: string;
  perros: Perro[];
}

interface Perro {
  nombre: string;
  raza: string;
  tamano: string;
  edad: string;
  observaciones?: string;
  vacunas: boolean;
}

interface Paseo {
  _id?: string;
  celular: string;
  nombre: string;
  perro: string;
  anotaciones: string;
  direccion: string;
  tipoServicio: string;
  tiempoServicio: string;
  fecha: string;
  hora: string;
  precio: number;
  estado: string;
  pawwer: string;
  metodoPago: string;
}

@Component({
  selector: 'app-paseos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterModule],
  templateUrl: './paseos.component.html',
  styleUrls: ['./paseos.component.scss']
})
export class PaseosComponent implements OnInit {
  paseos: any[] = [];
  clientes: any[] = []; // Lista de clientes
  perrosCliente: any[] = []; // Perros del cliente seleccionado
  toggleOpen: string | null = null;
  pawwers: any[] = []; // Lista de pawwers disponibles


  abrirFormulario: boolean = false;

  // Para agregar paseo
  nuevoPaseo: any = {
    clienteId: '',
    perro: '',
    tipoServicio: 'Paseo',
    tiempoServicio: '30 minutos',
    fecha: '',
    hora: '',
    precio: 0,
    metodoPago: 'Nequi',
    anotaciones: ''
  };

  tiemposServicio = ['15 minutos', '30 minutos', '60 minutos'];
  metodosPago = ['Nequi', 'Bre-B', 'Efectivo'];

  criterioBusqueda = 'nombre';
  textoBusqueda = '';
  filtroEstado = ''; // 👈 Nuevo filtro

  // Popup pawwer
  popupPawwerVisible: boolean = false;
  busquedaPawwer: string = "";
  paseoEditando: any = null; // almacena el paseo que está siendo editado


  // Opciones posibles para el estado del paseo
  estados = ['Pendiente', 'Cambiar', 'confirmar', 'Cancelado'];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const usuario = localStorage.getItem('usuarioLogueado');

    if (usuario !="admin") {
      console.log('Usuario en cache:', usuario);
      this.router.navigate(['/login']);
    } 
    this.cargarPaseos();
    this.cargarClientes();
    this.cargarPawwers();
  }

  cargarPawwers() {
    this.http.get<any[]>('https://backendpawwi-production.up.railway.app/api/usuarios')
      .subscribe(data => {
        // Filtramos solo los que son pawwers
        this.pawwers = data
          .filter(u => u.tipoUsuario === 'pawwer')
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
      });
  }

   cargarClientes() {
    this.http.get<any[]>('https://backendpawwi-production.up.railway.app/api/usuarios')
      .subscribe(data => {
      // Filtramos solo clientes y ordenamos por número de celular ascendente
      this.clientes = data
        .filter(u => u.tipoUsuario === 'cliente')
        .sort((a, b) => a.celular.localeCompare(b.celular));
    });
  }

  seleccionarCliente(clienteId: string) {
  this.nuevoPaseo.clienteId = clienteId;
  const cliente = this.clientes.find(c => c._id === clienteId);
  this.perrosCliente = cliente?.perros || [];

  if (cliente) {
    // Autocompletar datos desde el cliente
    this.nuevoPaseo.direccion = cliente.direccion;
    this.nuevoPaseo.celular = cliente.celular;
    this.nuevoPaseo.nombre = cliente.nombre;
  }

  this.nuevoPaseo.perro = '';
  this.nuevoPaseo.anotaciones = '';
}


  seleccionarPerro(perroNombre: string) {
    this.nuevoPaseo.perro = perroNombre;
    const perro = this.perrosCliente.find(p => p.nombre === perroNombre);
    if (perro) {
      this.nuevoPaseo.anotaciones = `Raza: ${perro.raza}, Edad: ${perro.edad}, Consideraciones: ${perro.observaciones || 'N/A'}, Vacunas: ${perro.vacunas ? 'Sí' : 'No'}`;
    } else {
      this.nuevoPaseo.anotaciones = '';
    }
  }


  agregarPaseo(): void {
  // Buscar cliente
  const cliente: Cliente | undefined = this.clientes.find(c => c._id === this.nuevoPaseo.clienteId);

  if (!cliente) {
    alert('❌ Debe seleccionar un cliente válido');
    return;
  }

  // Buscar perro seleccionado
  const perroSeleccionado: Perro | undefined = cliente.perros.find(p => p.nombre === this.nuevoPaseo.perro);

  // Crear anotaciones automáticas si hay información del perro
  const anotaciones: string = perroSeleccionado
    ? `Raza: ${perroSeleccionado.raza}, Edad: ${perroSeleccionado.edad}, Consideraciones: ${perroSeleccionado.observaciones || 'N/A'}, Vacunas: ${perroSeleccionado.vacunas ? 'Sí' : 'No'}`
    : this.nuevoPaseo.anotaciones;

  // Formatear fecha DD/MM
  let fechaFormateada = this.nuevoPaseo.fecha;
  if (fechaFormateada && fechaFormateada.includes('-')) {
    const [yyyy, mm, dd] = fechaFormateada.split('-');
    fechaFormateada = `${dd}/${mm}`;
  }

  const payload: Paseo = {
    celular: cliente.celular,
    nombre: cliente.nombre,
    perro: this.nuevoPaseo.perro,
    anotaciones,
    direccion: this.nuevoPaseo.direccion,
    tipoServicio: this.nuevoPaseo.tipoServicio || 'Paseo',
    tiempoServicio: this.nuevoPaseo.tiempoServicio || '30 minutos',
    fecha: fechaFormateada || '',
    hora: this.nuevoPaseo.hora,
    precio: this.nuevoPaseo.precio,
    estado: this.nuevoPaseo.estado || 'Pendiente desde OMS',
    pawwer: this.nuevoPaseo.pawwer || '',
    metodoPago: this.nuevoPaseo.metodoPago || 'Nequi'
  };

  this.http.post<Paseo>('https://backendpawwi-production.up.railway.app/api/leads', payload)
    .subscribe((p: Paseo) => {
      this.paseos.push({
        ...p,
        nuevoEstado: p.estado,
        nuevaHora: p.hora,
        nuevaFecha: p.fecha,
        nuevoPawwer: p.pawwer
      });

      alert('✅ Paseo agregado correctamente');

      window.location.reload();

      // Reset formulario
      this.nuevoPaseo = {
        clienteId: '',
        perro: '',
        tipoServicio: 'Paseo',
        tiempoServicio: '30 minutos',
        fecha: '',
        hora: '',
        precio: 0,
        metodoPago: 'Nequi',
        anotaciones: '',
        pawwer: '',
        estado: 'Pendiente'
      };
      this.perrosCliente = [];
      this.abrirFormulario = false;
    });
}



  cargarPaseos() {
  this.http.get<any[]>('https://backendpawwi-production.up.railway.app/api/leads')
    .subscribe(data => {
      this.paseos = data.map(p => {

        // Año tomado desde fechaCreacion
        const fechaCreacion = new Date(p.fechaCreacion);
        const yyyy = fechaCreacion.getFullYear();

        // Convertir fecha a ISO usando DD/MM o YYYY-MM-DD
        let fechaISO = p.fecha;

        // Si viene como DD/MM
        if (p.fecha && p.fecha.includes('/')) {
          const [dd, mm] = p.fecha.split('/');
          fechaISO = `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`;
        }

        return {
          ...p,
          nuevoEstado: p.estado,
          nuevaHora: p.hora,
          nuevaFecha: fechaISO,   // ← YA EN FORMATO YYYY-MM-DD CON EL AÑO REAL
          nuevoPawwer: p.pawwer,
          nuevoPrecio: p.precio,
          nuevoMetodoPago: p.metodoPago
        };
      });
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

    const payload = {
      estado: paseo.nuevoEstado,
      hora: paseo.nuevaHora,
      fecha: fechaFormateada,
      pawwer: paseo.pawwerCelular,
      pawwerCelular: paseo.pawwerCelular,
      precio: paseo.nuevoPrecio,
      metodoPago: paseo.nuevoMetodoPago
    };

    this.http.put(`https://backendpawwi-production.up.railway.app/api/leads/${paseo._id}`, payload)
      .subscribe(res => {
        paseo.estado = paseo.nuevoEstado;
        paseo.hora = paseo.nuevaHora;
        paseo.fecha = fechaFormateada;
        paseo.pawwer = paseo.pawwerCelular;
        paseo.precio = paseo.nuevoPrecio;
        paseo.metodoPago = paseo.nuevoMetodoPago;
        alert('✅ Paseo actualizado correctamente');
        window.location.reload();
      });
  }

  abrirPaseo(id: string) {
    this.toggleOpen = this.toggleOpen === id ? null : id;
  }

  trackById(index: number, item: any) {
    return item._id;
  }

copiarMensaje(paseo: any) {
  this.toggleOpen = this.toggleOpen === paseo._id ? null : paseo._id;

  let anotacionesFormateadas = 'Sin anotaciones';
  if (paseo.anotaciones && typeof paseo.anotaciones === 'string') {
    anotacionesFormateadas = paseo.anotaciones
      .split(',')
      .map((a: string) => a.trim())
      .map((a: string) => `• ${a}`)
      .join('\n');
  }

  const mensaje = 
`Nuevo paseo:

*Nombre cliente:* ${paseo.nombre}
*Perros:* ${paseo.perro}
*Anotaciones:*
${anotacionesFormateadas}

*Dirección:* ${paseo.direccion || 'No registrada'}
*Tiempo de servicio:* ${paseo.tiempoServicio || 'N/A'}
*Fecha:* ${paseo.fecha || 'Sin fecha'}
*Hora:* ${paseo.hora || 'Sin hora'}
*Precio:* $${paseo.precio || 'N/A'}

Reacciona al mensaje si quieres tomar el paseo 🐶`;

  navigator.clipboard.writeText(mensaje)
    .then(() => alert('✅ Mensaje copiado al portapapeles'))
    .catch((err: any) => {
      console.error('Error al copiar:', err);
      alert('❌ No se pudo copiar el mensaje');
    });
}

pawwersFiltrados() {
  const t = this.busquedaPawwer.toLowerCase();
  return this.pawwers.filter(p =>
    p.nombre.toLowerCase().includes(t) ||
    p.celular.toLowerCase().includes(t)
  );
}


abrirPopupPawwer(paseo: any) {
  this.paseoEditando = paseo;
  this.popupPawwerVisible = true;
  this.busquedaPawwer = "";
}

seleccionarPawwer(p: any) {
  if (this.paseoEditando) {
    this.paseoEditando.nuevoPawwer = p.nombre;  // Guardamos el nombre
    this.paseoEditando.pawwerCelular = p.celular; // Guardamos el número
  }
  this.popupPawwerVisible = false;
}


}
