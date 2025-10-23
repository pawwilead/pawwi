import { Routes } from '@angular/router';
import { MainComponent } from './admin/main/main.component';
import { PaseosComponent } from './admin/paseos/paseos.component';
import { PaseosAgendadosComponent } from './admin/paseos-agendados/paseos-agendados.component';
import { PaseosCompletadosComponent } from './admin/paseos-completados/paseos-completados.component';
import { LoginComponent } from './login/login.component';
import { AgendarPawwerComponent } from './agendar-pawwer/agendar-pawwer.component';

export const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: 'leads', component: PaseosComponent },
  { path: 'paseos', component: PaseosAgendadosComponent },
  { path: 'completados', component: PaseosCompletadosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'schedule', component: AgendarPawwerComponent },
  { path: '', redirectTo: 'schedule', pathMatch: 'full' }
];
