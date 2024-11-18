import { Routes } from '@angular/router';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { EquipamentoComponent } from './pages/equipamento/equipamento.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './pages/menu/menu.component';
import { RecuperarLoginComponent } from './pages/recuperar-login/recuperar-login.component';
import { RelatorioComponent } from './pages/relatorio/relatorio.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { OrdemServicoComponent } from './pages/ordem-servico/ordem-servico.component';
import { StatusOrdemServicoComponent } from './pages/status-ordem-servico/status-ordem-servico.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  //juliana@user.com
  //123456Aa!
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'equipamento', component: EquipamentoComponent, canActivate: [AuthGuard] },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'ordem-servico', component: OrdemServicoComponent, canActivate: [AuthGuard] },
  { path: 'recuperar-login', component: RecuperarLoginComponent },
  { path: 'relatorio', component: RelatorioComponent, canActivate: [AuthGuard] },
  { path: 'status-ordem-servico', component: StatusOrdemServicoComponent, canActivate: [AuthGuard] },
  { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];
