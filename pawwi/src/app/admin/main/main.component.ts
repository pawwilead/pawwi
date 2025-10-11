import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';

interface Perro {
  _id?: string;
  nombre: string;
  raza: string;
  tamano: string;
  edad: string;
  vacunas: boolean;
  observaciones: string;
}

interface Usuario {
  _id?: string;
  nombre: string;
  celular: string;
  tipoUsuario: string;
  direccion: string;
  perros?: Perro[];
  agendamientos?: any[];
  creadoEn?: Date;
  RegistroWeb?: string;
  nuevoTipo?: string; // solo para edición en frontend
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  usuarios: Usuario[] = [];
  filtroTipo = 'cliente';
  criterioBusqueda = 'nombre';
  textoBusqueda = '';

  toggleUsuarioOpen: string | null = null;
  togglePerrosOpen: string | null = null;

  // Nuevo usuario
  popupUsuarioNuevo = false;
  usuarioNuevo: Partial<Usuario> = { nombre: '', celular: '', direccion: '', tipoUsuario: 'cliente' };


  private baseUrl = 'https://backendpawwi-production.up.railway.app/api/usuarios';
  //private baseUrl = 'http://localhost:3000/api/usuarios';

  // Estado para CRUD perros
  perroNuevo: Perro = { nombre: '', raza: '', tamano: '', edad: '', vacunas: false, observaciones: '' };

  // Popup
  popupPerro: Perro | null = null;
  popupUsuarioId: string | null = null;
  popupPerroIndex: number | null = null; // <-- índice del perro en la lista

  // Dentro de tu componente
  nuevoPerroOpen: { [usuarioId: string]: boolean } = {};


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const usuario = localStorage.getItem('usuarioLogueado');

    if (usuario !="admin") {
      console.log('Usuario en cache:', usuario);
      this.router.navigate(['/login']);
    } 
    this.cargarUsuarios();
  }

  
  toggleNuevoPerro(usuarioId: string) {
    this.nuevoPerroOpen[usuarioId] = !this.nuevoPerroOpen[usuarioId];
  }


  // ------------------ Usuarios ------------------ //
  cargarUsuarios() {
    this.http.get<Usuario[]>(this.baseUrl)
      .subscribe(data => this.usuarios = data.map(u => ({ ...u })));
  }

  actualizarTipo(usuario: Usuario) {
    const nuevoTipo = usuario.nuevoTipo || usuario.tipoUsuario;

    this.http.put(`${this.baseUrl}/${usuario._id}`, { tipoUsuario: nuevoTipo })
      .subscribe({
        next: () => {
          usuario.tipoUsuario = nuevoTipo;
          alert(`✅ Usuario ${usuario.nombre} ahora es ${nuevoTipo}`);
          window.location.reload();
        },
        error: (err) => {
          console.error('❌ Error al actualizar tipo de usuario:', err);
          alert('Error al actualizar tipo de usuario');
        }
      });
  }


  // ------------------ CRUD PERROS ------------------ //
  agregarPerro(usuarioId: string) {
    this.http.patch(`${this.baseUrl}/${usuarioId}/perros`, this.perroNuevo)
      .subscribe(() => {
        alert('🐶 Perro agregado correctamente');
        this.perroNuevo = { nombre: '', raza: '', tamano: '', edad: '', vacunas: false, observaciones: '' };
        this.cargarUsuarios();
      });
  }

  eliminarPerro(usuarioId: string, index: number) {
    if (!confirm('¿Seguro que deseas eliminar este perro?')) return;

    this.http.delete(`${this.baseUrl}/${usuarioId}/perros/index/${index}`)
      .subscribe(() => {
        alert('❌ Perro eliminado');
        this.cargarUsuarios();
      });
  }


  abrirPopupEditarPerro(usuarioId: string, perro: Perro, index: number) {
    this.popupUsuarioId = usuarioId;
    this.popupPerro = { ...perro }; // clonamos para no afectar el array original
    this.popupPerroIndex = index;
    console.log(`📝 Abriendo popup del perro en la posición ${index} del usuario ${usuarioId}`);
  }

  cerrarPopup() {
    this.popupPerro = null;
    this.popupUsuarioId = null;
    this.popupPerroIndex = null;
  }

  guardarEdicionPerro() {
    if (!this.popupUsuarioId || !this.popupPerro || this.popupPerroIndex === null) return;

    this.http.put(`${this.baseUrl}/${this.popupUsuarioId}/perros/index/${this.popupPerroIndex}`, this.popupPerro)
      .subscribe(() => {
        alert("✅ Perro actualizado");
        this.cerrarPopup();
        this.cargarUsuarios();
      });
  }

  // ------------------ Helpers ------------------ //
  get usuariosFiltrados() {
    return this.usuarios.filter(u => {
      const coincideTipo = this.filtroTipo === 'todos' || u.tipoUsuario === this.filtroTipo;
      const valor = (u as any)[this.criterioBusqueda]?.toString().toLowerCase() || '';
      const coincideBusqueda = valor.includes(this.textoBusqueda.toLowerCase());
      return coincideTipo && coincideBusqueda;
    });
  }

  abrirUsuario(id: string) {
    this.toggleUsuarioOpen = this.toggleUsuarioOpen === id ? null : id;
  }

  abrirPerros(id: string) {
    this.togglePerrosOpen = this.togglePerrosOpen === id ? null : id;
  }

  trackById(index: number, item: any) {
    return item._id;
  }

  abrirPopupNuevoUsuario() {
  this.popupUsuarioNuevo = true;
}

cerrarPopupNuevoUsuario() {
  this.popupUsuarioNuevo = false;
  this.usuarioNuevo = { nombre: '', celular: '', direccion: '', tipoUsuario: 'cliente' };
}

agregarUsuario() {
  if (!this.usuarioNuevo.nombre || !this.usuarioNuevo.celular) {
    alert('❌ Nombre y celular son obligatorios');
    return;
  }

  this.http.post<Usuario>(this.baseUrl, this.usuarioNuevo)
    .subscribe({
      next: () => {
        alert('✅ Usuario agregado correctamente');
        this.cerrarPopupNuevoUsuario();
        this.cargarUsuarios();
        window.location.reload();
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al agregar usuario');
      }
    });
}
}
