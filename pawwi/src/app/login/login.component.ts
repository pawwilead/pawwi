import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
   numero: string = '';
  password: string = '';
  mostrarPassword: boolean = false;
  mensaje: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  verificarNumero() {
    // ✅ Llamada al backend para verificar si es un pawwer
    this.http.get<any>(`https://backendpawwi-production.up.railway.app/api/usuarios/celular/57${this.numero}`)
      .subscribe({
        next: (res) => {
          console.log(res);
          
          if (res.tipoUsuario =="pawwer") {
            this.mensaje = `✅ Pawwer aceptado: ${res.nombre}`;
            localStorage.setItem('usuarioLogueado', 'pawwer');
            this.router.navigate(['/pawwer']);
          } 
          else if (res.tipoUsuario =="soporte") {
            this.mostrarPassword = true;
            this.mensaje = '';
          }
          else {
            this.mensaje = '❌ Número no registrado como pawwer';
          }
        },
        error: () => {
          this.mensaje = '⚠️ Error al conectar con el servidor';
        }
      });
  }

  verificarPassword() {
    if (this.password === 'Diegod') {
      localStorage.setItem('usuarioLogueado', 'admin');
      this.mensaje = '✅ Login exitoso, guardado en cache';
      this.router.navigate(['/main']);
    } else {
      this.mensaje = '❌ Contraseña incorrecta';
    }
  }
}
