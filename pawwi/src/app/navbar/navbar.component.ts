import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  profileName: string = 'Admin';
  menuOpen: boolean = false; // 👈 controla el menú hamburguesa

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
