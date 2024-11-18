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

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // /login 
  //juliana@user.com
  //123456Aa!
  { path: 'cadastro', component: CadastroComponent },
  { path: 'equipamento', component: EquipamentoComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'ordem-servico', component: OrdemServicoComponent },
  { path: 'recuperar-login', component: RecuperarLoginComponent },
  { path: 'relatorio', component: RelatorioComponent },
  { path: 'status-ordem-servico', component: StatusOrdemServicoComponent },
  { path: 'usuario', component: UsuarioComponent },
];
