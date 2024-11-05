import { Routes } from '@angular/router';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { EquipamentoComponent } from './pages/equipamento/equipamento.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './pages/menu/menu.component';
import { RecuperarLoginComponent } from './pages/recuperar-login/recuperar-login.component';
import { RelatorioComponent } from './pages/relatorio/relatorio.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'equipamento', component: EquipamentoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'recuperar-login', component: RecuperarLoginComponent },
  { path: 'relatorio', component: RelatorioComponent }
];