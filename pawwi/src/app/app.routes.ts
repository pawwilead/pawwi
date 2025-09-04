import { Routes } from '@angular/router';
import { MainComponent } from './admin/main/main.component';

export const routes: Routes = [
  { path: '', component: MainComponent },   // 👈 Ruta raíz
  { path: '**', redirectTo: '' }            // 👈 Cualquier otra ruta redirige a raíz
];
