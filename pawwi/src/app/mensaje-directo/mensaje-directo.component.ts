import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mensaje-directo',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './mensaje-directo.component.html',
  styleUrls: ['./mensaje-directo.component.scss']
})
export class MensajeDirectoComponent {

  celularDestinatario: string = '';
  mensaje: string = '';
  mostrarPopup: boolean = false;

  private API_URL = "https://backendpawwi-production.up.railway.app/api/msgs";

  constructor(private http: HttpClient) {}

  enviarMensaje() {
    const body = {
      to: `57${this.celularDestinatario}`,
      text: this.mensaje
    };

    this.http.post(this.API_URL, body).subscribe({
      next: (res) => {
        console.log("Mensaje enviado:", res);

        // Mostrar popup de confirmación
        this.mostrarPopup = true;
      },
      error: (err) => {
        console.error("Error enviando mensaje:", err);
        alert("❌ Error enviando el mensaje.");
      }
    });
  }

  cerrarPopup() {
    window.location.reload();
  }
}
