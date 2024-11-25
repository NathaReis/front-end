import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

}
