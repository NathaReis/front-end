import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { WebSocketService } from '../../services/web-socket.service';
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
    private webSocketService: WebSocketService,
    private messageService: MessageService
  ) {
    const userName = localStorage.getItem('userName');
    this.usuarioLogado = userName ? userName : 'Usuário';

    this.webSocketService.connect();
    this.webSocketService.getNotifications().subscribe((notification) => {
      this.messageService.add({
        severity: 'info',
        summary: 'Nova Notificação',
        detail: notification,
      });
    });
  }
}
