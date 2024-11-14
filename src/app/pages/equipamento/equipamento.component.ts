import { Component } from "@angular/core";
import { TableModule } from "primeng/table";
import { MenuComponent } from "../menu/menu.component";
import { CardModule } from "primeng/card";
import { ButtonModule } from 'primeng/button';
import { EquipamentoService } from '../../services/equipamento.service';

interface Item {
  id: number;
  number: string;
  ownership: string;
  qrCode: string;
}

@Component({
  selector: "app-equipamento",
  standalone: true,
  imports: [TableModule, CardModule, MenuComponent,ButtonModule],
  templateUrl: "./equipamento.component.html",
  styleUrl: "./equipamento.component.scss",
})
export class EquipamentoComponent {
  dados: Item[] = [];

  constructor(
    private service: EquipamentoService
  ) {}

  ngOnInit() {
    console.log("teste")
    this.service.list().subscribe(
      (response) => {
        this.dados = response;
        console.log("🚀 ~ file: equipamento.component.ts:33 ~ EquipamentoComponent ~ OnInit ~ response:", response);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
