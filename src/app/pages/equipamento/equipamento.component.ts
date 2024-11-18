import { Component } from "@angular/core";
import { TableModule } from "primeng/table";
import { MenuComponent } from "../menu/menu.component";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { EquipamentoService } from "../../services/equipamento.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface Item {
  id: number;
  number: string;
  ownership: string;
  qrCode: string;
}

@Component({
  selector: "app-equipamento",
  standalone: true,
  imports: [
    TableModule,
    CardModule,
    MenuComponent,
    ButtonModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService, MessageService],
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

  displayDialog: boolean = false;
  selectedItem: Item = { id: 0, number: "", ownership: "", qrCode: "" };
  isEditMode: boolean = false;
  dialogTitle: string = "";

  constructor(
    private service: EquipamentoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

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

  openAddDialog(item?: Item) {
    this.dialogTitle = "Adicionar Equipamento";
    this.selectedItem = item
      ? { ...item }
      : { id: 0, number: "", ownership: "", qrCode: "" };
    this.isEditMode = !!item;
    this.displayDialog = true;
  }

  openEditDialog(item?: Item) {
    this.dialogTitle = "Atualizar Equipamento";
    this.selectedItem = item
      ? { ...item }
      : { id: 0, number: "", ownership: "", qrCode: "" };
    this.isEditMode = !!item;
    this.displayDialog = true;
  }

  saveItem() {
    if (this.isEditMode) {
      // Lógica para atualizar o item
      this.dialogTitle = "Editar Equipamento";
      console.log("Update item:", this.selectedItem);
    } else {
      // Lógica para adicionar um novo item

      console.log("Add new item:", this.selectedItem);
    }
    this.displayDialog = false;
  }

  confirm2(event: Event) {
    console.log("confirm2");
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Você deseja deletar esse equipamento?",
      header: "Confirmar exclusão",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        this.messageService.add({
          severity: "info",
          summary: "Confirmado",
          detail: "Equipamento deletado",
        });
      },
      reject: () => {
        this.messageService.add({
          severity: "error",
          summary: "Recusado",
          detail: "Equipamento não deletado",
        });
      },
    });
  }

  deleteItem(item: any) {
    // Lógica para deletar o item
    this.dados = this.dados.filter(d => d.id !== item.id);
    this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
  }
}
