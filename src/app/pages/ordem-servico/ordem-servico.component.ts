import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { MenuComponent } from "../menu/menu.component";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { OrdemServicoService } from "../../services/ordem-servico.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { Router } from "@angular/router";

@Component({
  selector: 'app-ordem-servico',
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
  templateUrl: './ordem-servico.component.html',
  styleUrl: './ordem-servico.component.scss'
})
export class OrdemServicoComponent implements OnInit {
  dados: any[] = [];
  ordemServicoForm: FormGroup;
  displayDialog: boolean = false;
  dialogTitle: string = '';
  hasPermission: any;

  constructor(
    private fb: FormBuilder,
    private ordemServicoService: OrdemServicoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.ordemServicoForm = this.fb.group({
      id: [null],
      number: ['', Validators.required],
      ownership: ['', Validators.required],
      qrCode: ['', Validators.required],
      status: [''],
      description: [''],
      requester: [''],
      issueDate: ['']
    });
  }

  ngOnInit() {
    const userPermissions = JSON.parse(
      localStorage.getItem('permissions') || '[]'
    );
    this.hasPermission = userPermissions.includes('workorder:read');

    if (!this.hasPermission) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Você não tem permissão para acessar esta página.',
      });
      this.router.navigate(['/inicio']);
    }
    
    this.refreshData();
  }

  refreshData() {
    this.ordemServicoService.list().subscribe(
      (data) => {
        this.dados = data;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar dados' });
      }
    );
  }

  applyFilter(event: Event, field: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dados = this.dados.filter(item => item[field].toString().toLowerCase().includes(filterValue.toLowerCase()));
  }

  openAddDialog() {
    this.dialogTitle = 'Adicionar Ordem de Serviço';
    this.ordemServicoForm.reset();
    this.displayDialog = true;
  }

  openEditDialog(item: any) {
    this.dialogTitle = 'Editar Ordem de Serviço';
    this.ordemServicoForm.patchValue(item);
    this.displayDialog = true;
  }

  onSubmit() {
    if (this.ordemServicoForm.valid) {
      if (this.ordemServicoForm.value.id) {
        this.ordemServicoService.update(this.ordemServicoForm.value).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ordem de Serviço atualizada' });
            this.refreshData();
            this.displayDialog = false;
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar Ordem de Serviço' });
          }
        );
      } else {
        this.ordemServicoService.create(this.ordemServicoForm.value).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ordem de Serviço adicionada' });
            this.refreshData();
            this.displayDialog = false;
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar Ordem de Serviço' });
          }
        );
      }
    }
  }

  confirm2(event: Event, item: any) {
    // this.confirmationService.confirm({
    //   target: event.target,
    //   message: 'Tem certeza que deseja deletar esta Ordem de Serviço?',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     // Aqui você pode adicionar a lógica para deletar a ordem de serviço quando o método estiver disponível no serviço
    //     this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Função de deletar não implementada' });
    //   }
    // });
  }
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