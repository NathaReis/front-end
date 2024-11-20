import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { TableModule } from "primeng/table";
import { MenuComponent } from "../menu/menu.component";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
    CommonModule,
    MenuComponent,
    ButtonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: "./equipamento.component.html",
  styleUrl: "./equipamento.component.scss",
})
export class EquipamentoComponent{
  dados: any[] = [];
  displayDialog: boolean = false;
  selectedItem: any = {};
  isEditMode: boolean = false;
  dialogTitle: string = "";
  equipamentoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: EquipamentoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.equipamentoForm = this.fb.group({
      id: [null],
      number: ['', Validators.required],
      ownership: ['', Validators.required],
      qrCode: ['', Validators.required]
    });
  }

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

  openAddDialog() {
    this.dialogTitle = "Adicionar Equipamento";
    this.selectedItem = {};
    this.isEditMode = true;
    this.displayDialog = true;
    this.equipamentoForm.reset();
  }

  openEditDialog(item: any) {
    this.dialogTitle = "Editar Equipamento";
    this.selectedItem = { ...item };
    this.isEditMode = false;
    this.displayDialog = true;
    this.equipamentoForm.patchValue(this.selectedItem);
  }

  onSubmit() {
    if (this.equipamentoForm.valid) {
      this.selectedItem = this.equipamentoForm.value;
      this.saveItem();
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Erro",
        detail: "Por favor, preencha todos os campos obrigatórios.",
      });
    }
  }

  saveItem() {
    if (this.isEditMode) {
      this.service.create(this.selectedItem).subscribe(
        (response) => {
          this.dados.push(response);
          this.messageService.add({
            severity: "success",
            summary: "Sucesso",
            detail: "Equipamento adicionado com sucesso",
          });
          this.displayDialog = false;
        },
        (error) => {
          console.error(error);
          this.messageService.add({
            severity: "error",
            summary: "Erro",
            detail: "Erro ao adicionar equipamento",
          });
        }
      );
    } else {
      this.service.update(this.selectedItem).subscribe(
        (response) => {
          const index = this.dados.findIndex((d) => d.id === this.selectedItem.id);
          if (index !== -1) {
            this.dados[index] = response;
            this.messageService.add({
              severity: "success",
              summary: "Sucesso",
              detail: "Equipamento atualizado com sucesso",
            });
          }
          this.displayDialog = false;
        },
        (error) => {
          console.error(error);
          this.messageService.add({
            severity: "error",
            summary: "Erro",
            detail: "Erro ao atualizar equipamento",
          });
        }
      );
    }
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
    this.service.delete(item.id).subscribe(
      () => {
        this.dados = this.dados.filter((d) => d.id !== item.id);
        this.messageService.add({
          severity: "info",
          summary: "Confirmado",
          detail: "Equipamento deletado",
        });
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao deletar equipamento",
        });
      }
    );
  }
}