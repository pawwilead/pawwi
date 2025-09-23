import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  usuarios: any[] = [];
  filtroTipo = 'cliente';
  criterioBusqueda = 'nombre';
  textoBusqueda = '';

  toggleUsuarioOpen: string | null = null;
  togglePerrosOpen: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get<any[]>('https://backendpawwi-production.up.railway.app/api/usuarios')
      .subscribe(data => {
        this.usuarios = data.map(u => ({
          ...u,
          nuevoTipo: u.tipoUsuario // 👈 se inicializa para el select
        }));
      });
  }

  actualizarTipo(usuario: any) {
    this.http.put(`https://backendpawwi-production.up.railway.app/api/usuarios/${usuario._id}`, {
      tipoUsuario: usuario.nuevoTipo
    }).subscribe(res => {
      usuario.tipoUsuario = usuario.nuevoTipo;
      alert(`✅ Usuario ${usuario.nombre} ahora es ${usuario.tipoUsuario}`);
    });
  }

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
}
