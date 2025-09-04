import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  // main.component.ts
  toggleUsuarioOpen: string | null = null;
  togglePerrosOpen: string | null = null;

  abrirUsuario(id: string) {
    this.toggleUsuarioOpen = this.toggleUsuarioOpen === id ? null : id;
  }

  abrirPerros(id: string) {
    this.togglePerrosOpen = this.togglePerrosOpen === id ? null : id;
  }

  usuarios = [
    {
      _id: '6879af4275d4542d0598b305',
      celular: '573023835142',
      nombre: 'Juan Diego Echeverry',
      tipoUsuario: 'cliente',
      direccion: 'Calle 160 #14b - 42',
      perros: ['Max', 'Luna', 'Rocky'],
      agendamientos: 0,
      creadoEn: new Date('2025-07-18T02:19:46.840Z')
    },
    {
      _id: '6879b0224314c9a071a3c08d',
      celular: '573332885462',
      nombre: 'Pawwer de soporte',
      tipoUsuario: 'pawwer',
      direccion: 'Carrera 45 #100 - 21',
      perros: [],
      agendamientos: 0,
      creadoEn: new Date('2025-08-01T10:12:00.000Z')
    }
  ];

  filtroTipo: string = 'todos';
  criterioBusqueda: string = 'nombre';
  textoBusqueda: string = '';

  get usuariosFiltrados() {
    return this.usuarios.filter(u => {
      const coincideTipo = this.filtroTipo === 'todos' || u.tipoUsuario === this.filtroTipo;
      const valor = (u as any)[this.criterioBusqueda]?.toString().toLowerCase() || '';
      const coincideBusqueda = valor.includes(this.textoBusqueda.toLowerCase());
      return coincideTipo && coincideBusqueda;
    });
  }
}
