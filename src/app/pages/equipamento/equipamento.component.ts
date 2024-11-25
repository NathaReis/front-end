import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MenuComponent } from '../menu/menu.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { EquipamentoService } from '../../services/equipamento.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-equipamento',
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
  templateUrl: './equipamento.component.html',
  styleUrl: './equipamento.component.scss',
})
export class EquipamentoComponent {
  dados: any[] = [];
  dadosOriginais: any[] = [];
  displayDialog: boolean = false;
  selectedItem: any = {};
  isEditMode: boolean = false;
  dialogTitle: string = '';
  equipamentoForm: FormGroup;
  globalFilterFields: string[] = ['id', 'number', 'ownership', 'qrCode'];
  filters: { [key: string]: string } = {};

  hasPermission: any;

  constructor(
    private fb: FormBuilder,
    private service: EquipamentoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private webSocketService: WebSocketService
  ) {
    this.equipamentoForm = this.fb.group({
      id: [null],
      number: ['', Validators.required],
      ownership: ['', Validators.required],
      qrCode: ['', Validators.required],
    });
  }

  ngOnInit() {
    const userPermissions = JSON.parse(
      localStorage.getItem('permissions') || '[]'
    );
    this.hasPermission = userPermissions.includes('equipment:read');

    if (!this.hasPermission) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Você não tem permissão para acessar esta página.',
      });
      this.router.navigate(['/inicio']);
    }

   this.getEquipamento();
   this.WebSocket();
  }

  getEquipamento() {
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

  WebSocket() {
    this.webSocketService.connect();
    this.webSocketService.getNotifications().subscribe((notification) => {
      this.messageService.add({
        severity: 'info',
        summary: 'Nova Notificação',
        detail: notification,
      });
    });
  }

  openAddDialog() {
    this.dialogTitle = 'Adicionar Equipamento';
    this.selectedItem = {};
    this.isEditMode = false;
    this.displayDialog = true;
    this.equipamentoForm.reset();
  }

  openEditDialog(item: any) {
    this.dialogTitle = 'Editar Equipamento';
    this.selectedItem = { ...item };
    this.isEditMode = true;
    this.displayDialog = true;
    this.equipamentoForm.patchValue(this.selectedItem);
  }

  onSubmit() {
    if (this.equipamentoForm.valid) {
      this.selectedItem = this.equipamentoForm.value;
      this.saveItem();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
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
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Equipamento atualizado com sucesso',
            });
          }
          this.displayDialog = false;
        },
        (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar equipamento',
          });
        }
      );
    } else {
      this.service.create(this.selectedItem).subscribe(
        (response) => {
          this.dados.push(response);
          this.dadosOriginais.push(response);
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Equipamento adicionado com sucesso',
          });
          this.displayDialog = false;
        },
        (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao adicionar equipamento',
          });
        }
      );
    }
  }

  confirm2(event: Event, item: any) {
    this.selectedItem = item;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Você deseja deletar esse equipamento?',
      header: 'Confirmar exclusão',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.deleteItem(item);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Recusado',
          detail: 'Equipamento não deletado',
        });
      },
    });
  }

  deleteItem(item: any) {
    this.service.delete(item.id).subscribe(
      () => {
        this.dados = this.dados.filter((d) => d.id !== item.id);
        this.dadosOriginais = this.dadosOriginais.filter(
          (d) => d.id !== item.id
        );
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmado',
          detail: 'Equipamento deletado',
        });
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao deletar equipamento',
        });
      }
    );
  }

  applyFilter(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    this.filters[field] = input.value.toLowerCase();
    this.dados = this.dadosOriginais.filter((item) => {
      return Object.keys(this.filters).every((key) => {
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
        filterInputs.forEach(
          (input) => ((input as HTMLInputElement).value = '')
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Página atualizada com sucesso',
        });
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar página',
        });
      }
    );
  }
}
