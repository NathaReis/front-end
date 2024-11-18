import { Component } from "@angular/core";
import { TableModule } from "primeng/table";
import { MenuComponent } from "../menu/menu.component";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { EquipamentoService } from "../../services/equipamento.service";

interface Item {
  id: number;
  number: string;
  ownership: string;
  qrCode: string;
}

@Component({
  selector: "app-equipamento",
  standalone: true,
  imports: [TableModule, CardModule, MenuComponent, ButtonModule],
  templateUrl: "./equipamento.component.html",
  styleUrl: "./equipamento.component.scss",
})
export class EquipamentoComponent {
  dados: Item[] = [
    { id: 1, number: "Equipamento 1", ownership: "Origem 1", qrCode: "QR1" },
    { id: 2, number: "Equipamento 2", ownership: "Origem 2", qrCode: "QR2" },
    { id: 3, number: "Equipamento 3", ownership: "Origem 3", qrCode: "QR3" },
    { id: 4, number: "Equipamento 4", ownership: "Origem 4", qrCode: "QR4" },
    { id: 5, number: "Equipamento 5", ownership: "Origem 5", qrCode: "QR5" },
  ];

  constructor(private service: EquipamentoService) {}

  ngOnInit() {
    this.service.list().subscribe(
      (response) => {
        this.dados = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  editItem(item: Item) {
    // Lógica para editar o item
    console.log('Edit item:', item);
  }

  deleteItem(item: Item) {
    // Lógica para excluir o item
    console.log('Delete item:', item);
  }
}
