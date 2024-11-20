import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";

@Component({
  selector: 'app-ordem-servico',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './ordem-servico.component.html',
  styleUrl: './ordem-servico.component.scss'
})
export class OrdemServicoComponent {

}

// class WorkOrder {
//   id: number;
//   equipament: Equipament; // Referência ao objeto Equipament
//   orderStatus: string;
//   maintenanceLocation: string;
//   hourMeter: number;
//   closing: Closure; // Referência ao objeto Closure
//   outputData: OutputData[]; // Lista de objetos OutputData
//   inputData: InputData[]; // Lista de objetos InputData
//   issueDate: Date;
//   lastModificationDate: Date;
//   requestedServicesDescription: string;
//   completedServicesDescription: string;
//   pendingServicesDescription: string;
//   responsibleMechanics: User[]; // Lista de objetos User
//   requester: User; // Referência ao objeto User
// }