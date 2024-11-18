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
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";

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
  dados: any[] = [
    { id: 1, number: "Equipamento 1", ownership: "Origem 1", qrCode: "QR1" },
    { id: 2, number: "Equipamento 2", ownership: "Origem 2", qrCode: "QR2" },
    { id: 3, number: "Equipamento 3", ownership: "Origem 3", qrCode: "QR3" },
    { id: 4, number: "Equipamento 4", ownership: "Origem 4", qrCode: "QR4" },
    { id: 5, number: "Equipamento 5", ownership: "Origem 5", qrCode: "QR5" },
  ];

  displayDialog: boolean = false;
  selectedItem: any = {};
  isEditMode: boolean = false;
  dialogTitle: string = "";

  constructor(
    private service: EquipamentoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // this.service.list().subscribe(
    //   (response) => {
    //     this.dados = response;
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
  }

  openAddDialog() {
    this.dialogTitle = "Adicionar Equipamento";
    this.selectedItem = {};
    this.isEditMode = true;
    this.displayDialog = true;
  }

  openEditDialog(item: any) {
    this.dialogTitle = "Editar Equipamento";
    this.selectedItem = { ...item };
    this.isEditMode = false;
    this.displayDialog = true;
  }

  saveItem() {
    if (this.isEditMode) {
      this.selectedItem.id = this.dados.length + 1;
      this.dados.push(this.selectedItem);
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: "Item added successfully",
      });
    } else {
      const index = this.dados.findIndex((d) => d.id === this.selectedItem.id);
      if (index !== -1) {
        this.dados[index] = this.selectedItem;
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Item updated successfully",
        });
      }
    }
    this.displayDialog = false;
  }

  confirm2(event: Event, item: any) {
    this.selectedItem = item;
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
        this.deleteItem(item); // Chama a função deleteItem para remover o item
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
    this.dados = this.dados.filter((d) => d.id !== item.id);
    this.messageService.add({
      severity: "info",
      summary: "Confirmed",
      detail: "Record deleted",
    });
  }
}
