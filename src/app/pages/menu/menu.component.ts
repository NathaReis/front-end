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
        icon: 'pi pi-align-justify',
        items: [
          {
            label: 'Equipamento',
            icon: 'pi pi-cog',
            route: '/equipamento',
          },
          {
            label: 'Login',
            icon: 'pi pi-sign-in',
            route: '/login',
          },
          {
            label: 'Recuperar Login',
            icon: 'pi pi-key',
            route: '/recuperar-login',
          },
          {
            label: 'Relatório',
            icon: 'pi pi-file',
            route: '/relatorio',
          },
        ],
      },
    ];
  }
}
