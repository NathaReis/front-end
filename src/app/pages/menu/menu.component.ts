import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [MenubarModule, CommonModule],
})
export class MenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Ordem de Serviço',
        icon: 'pi pi-briefcase', // Ícone de pasta de trabalho
        route: '/ordem-servico',
      },
      {
        label: 'Equipamentos',
        icon: 'pi pi-cog', // Ícone de engrenagem
        route: '/equipamento',
      },
      {
        label: 'Usuários',
        icon: 'pi pi-users', // Ícone de usuários
        route: '/usuarios',
      },
      {
        label: 'Relatórios',
        icon: 'pi pi-chart-line', // Ícone de gráfico de linha
        route: '/relatorio',
      },
      {
        label: 'Notificações',
        icon: 'pi pi-bell', // Ícone de sino
        route: '/notificacoes',
      },
      {
        label: 'Logout',
        icon: 'pi pi-user', // Ícone de usuário
        route: '/login',
      },
    ];
  }
}