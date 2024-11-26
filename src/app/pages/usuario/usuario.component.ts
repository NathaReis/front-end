import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { TableModule } from "primeng/table";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from "primeng/toast";

import { MenuComponent } from "../menu/menu.component";
import { UserService } from "../../services/user.service";
import {
  RegisterDto,
  UserDto,
  UserRoleUpdateDto,
} from './usuario.model';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    TableModule,
    CardModule,
    CommonModule,
    MenuComponent,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule,
    PasswordModule
  ],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class UsuarioComponent {
  dados: UserDto[] = [];
  dadosOriginais: UserDto[] = [];
  displayDialog: boolean = false;
  selectedItem: UserDto = {} as UserDto;
  isEditMode: boolean = false;
  dialogTitle: string = "";
  usuarioForm: FormGroup;
  globalFilterFields: string[] = ['id', 'name', 'login', 'role'];
  filters: { [key: string]: string } = {};
  roles: string[] = [];
  hasPermission: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.usuarioForm = this.fb.group({
      id: [null],
      name: ["", Validators.required],
      login: ["", Validators.required],
      role: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  ngOnInit() {
    const userPermissions = JSON.parse(
      localStorage.getItem('permissions') || '[]'
    );
    this.hasPermission = userPermissions.includes('user:read');

    if (!this.hasPermission) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Você não tem permissão para acessar esta página.',
      });
      this.router.navigate(['/inicio']);
    }
    
    this.usuarioService.getAllUsuarios().subscribe({
      next: (response) => {
        this.dados = response;
        this.dadosOriginais = [...response];
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.usuarioService.getAllFuncoes().subscribe({
      next: (response) => {
        this.roles = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  openAddDialog() {
    this.dialogTitle = "Adicionar Usuário";
    this.selectedItem = {} as UserDto;
    this.isEditMode = false;
    this.displayDialog = true;
    this.usuarioForm.reset();
  }

  openEditDialog(item: UserDto) {
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
      this.usuarioService.updateUsuario(this.selectedItem).subscribe({
        next: (response) => {
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
        error: (error) => {
          console.error(error);
          this.messageService.add({
            severity: "error",
            summary: "Erro",
            detail: "Erro ao atualizar usuário",
          });
        }
      });
    } else {
      const registerDto: RegisterDto = {
        name: this.selectedItem.name,
        login: this.selectedItem.login,
        password: this.selectedItem.password!,
        role: this.selectedItem.role,
      };
      this.usuarioService.createUsuario(registerDto).subscribe(
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

  confirm2(event: Event, item: UserDto) {
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

  deleteItem(item: UserDto) {
    this.usuarioService.deleteUsuario(item.id).subscribe({
      next: () => {
        this.dados = this.dados.filter((d) => d.id !== item.id);
        this.dadosOriginais = this.dadosOriginais.filter((d) => d.id !== item.id);
        this.messageService.add({
          severity: "info",
          summary: "Confirmado",
          detail: "Usuário deletado",
        });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao deletar usuário",
        });
      }
    });
  }

  applyFilter(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    this.filters[field] = input.value.toLowerCase();
    this.dados = this.dadosOriginais.filter((item: any) => {
      return Object.keys(this.filters).every(key => {
        return item[key].toString().toLowerCase().includes(this.filters[key]);
      });
    });
  }

  refreshData() {
    this.usuarioService.getAllUsuarios().subscribe({
      next: (response) => {
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
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao atualizar página",
        });
      }
    });
  }
}