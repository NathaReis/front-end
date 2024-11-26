import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MenuComponent, CardModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
  providers: [MessageService],
})
export class InicioComponent {
  usuarioLogado: string;

  constructor(
    private messageService: MessageService
  ) {
    const userName = localStorage.getItem('userName');
    this.usuarioLogado = userName ? userName : 'Usuário';
  }
}
