import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { MenuComponent } from "../menu/menu.component";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { UserService } from "../../services/user.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";

@Component({
  selector: 'app-usuario',
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
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class UsuarioComponent {
  dados: any[] = [];
  dadosOriginais: any[] = [];
  displayDialog: boolean = false;
  selectedItem: any = {};
  isEditMode: boolean = false;
  dialogTitle: string = "";
  usuarioForm: FormGroup;
  globalFilterFields: string[] = ['id', 'name', 'login', 'role'];
  filters: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private service: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.usuarioForm = this.fb.group({
      id: [null],
      name: ["", Validators.required],
      login: ["", Validators.required],
      role: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.service.list().subscribe(
      (response) => {
        this.dados = response;
        this.dadosOriginais = [...response];
      },
      (error) => {
        console.error(error);
      }
    );
  }

  openAddDialog() {
    this.dialogTitle = "Adicionar Usuário";
    this.selectedItem = {};
    this.isEditMode = false;
    this.displayDialog = true;
    this.usuarioForm.reset();
  }

  openEditDialog(item: any) {
    this.dialogTitle = "Editar Usuário";
    this.selectedItem = { ...item };
    this.isEditMode = true;
    this.displayDialog = true;
    this.usuarioForm.patchValue(this.selectedItem);
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      this.selectedItem = this.usuarioForm.value;
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
      this.service.update(this.selectedItem).subscribe(
        (response) => {
          const index = this.dados.findIndex(
            (d) => d.id === this.selectedItem.id
          );
          if (index !== -1) {
            this.dados[index] = response;
            this.messageService.add({
              severity: "success",
              summary: "Sucesso",
              detail: "Usuário atualizado com sucesso",
            });
          }
          this.displayDialog = false;
        },
        (error) => {
          console.error(error);
          this.messageService.add({
            severity: "error",
            summary: "Erro",
            detail: "Erro ao atualizar usuário",
          });
        }
      );
    } else {
      this.service.register(this.selectedItem).subscribe(
        (response) => {
          this.dados.push(response);
          this.dadosOriginais.push(response);
          this.messageService.add({
            severity: "success",
            summary: "Sucesso",
            detail: "Usuário adicionado com sucesso",
          });
          this.displayDialog = false;
        },
        (error) => {
          console.error(error);
          this.messageService.add({
            severity: "error",
            summary: "Erro",
            detail: "Erro ao adicionar usuário",
          });
        }
      );
    }
  }

  confirm2(event: Event, item: any) {
    this.selectedItem = item;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Você deseja deletar esse usuário?",
      header: "Confirmar exclusão",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        this.deleteItem(item);
      },
      reject: () => {
        this.messageService.add({
          severity: "error",
          summary: "Recusado",
          detail: "Usuário não deletado",
        });
      },
    });
  }

  deleteItem(item: any) {
    this.service.delete(item.id).subscribe(
      () => {
        this.dados = this.dados.filter((d) => d.id !== item.id);
        this.dadosOriginais = this.dadosOriginais.filter((d) => d.id !== item.id);
        this.messageService.add({
          severity: "info",
          summary: "Confirmado",
          detail: "Usuário deletado",
        });
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao deletar usuário",
        });
      }
    );
  }

  applyFilter(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    this.filters[field] = input.value.toLowerCase();
    this.dados = this.dadosOriginais.filter(item => {
      return Object.keys(this.filters).every(key => {
        return item[key].toString().toLowerCase().includes(this.filters[key]);
      });
    });
  }

  refreshData() {
    this.service.list().subscribe(
      (response) => {
        this.dados = response;
        this.dadosOriginais = [...response];
        this.filters = {};
        const filterInputs = document.querySelectorAll('.header-table input');
        filterInputs.forEach(input => (input as HTMLInputElement).value = '');
        this.messageService.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Página atualizada com sucesso",
        });
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao atualizar página",
        });
      }
    );
  }
}