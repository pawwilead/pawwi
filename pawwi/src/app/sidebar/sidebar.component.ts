import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems = [
    { label: 'Usuarios', icon: '👤', route: '/' },
    { label: 'Perros', icon: '🐶', route: '/perros' },
    { label: 'Agendamientos', icon: '📅', route: '/agendamientos' },
    { label: 'Ajustes', icon: '⚙️', route: '/ajustes' }
  ];
}
