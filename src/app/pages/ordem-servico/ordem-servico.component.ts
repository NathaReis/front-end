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
import { EquipamentoService } from '../../services/equipamento.service';
import { DropdownModule } from 'primeng/dropdown';
import { UserService } from "../../services/user.service";
import { CalendarModule } from 'primeng/calendar';
import { WebSocketService } from '../../services/web-socket.service';


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
    DropdownModule,
    CalendarModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './ordem-servico.component.html',
  styleUrl: './ordem-servico.component.scss'
})
export class OrdemServicoComponent implements OnInit {
  dados: any[] = [];
  ordemServicoForm: FormGroup;
  workOrderForm: FormGroup;
  closingForm: FormGroup;
  displayDialog: boolean = false;
  dialogTitle: string = '';
  hasPermission: any;
  equipamento: any;
  equipamentoSelecionado: any;
  user: any;
  userSelecionado: any;

  constructor(
    private fb: FormBuilder,
    private ordemServicoService: OrdemServicoService,
    private equipamentService: EquipamentoService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService,
    private webSocketService: WebSocketService
  ) {
    this.ordemServicoForm = this.fb.group({
      id: [null],
      equipament: ['', Validators.required],
      orderStatus: ['', Validators.required],
      requestedServicesDescription: ['', Validators.required],
      requesterName: ['', Validators.required],
      issueDate: ['', Validators.required],
      equipamentId: [null],
      hourMeter: ['', Validators.required],
    });

    this.workOrderForm = this.fb.group({
      equipamentNumber: [{ value: '', disabled: true }, Validators.required],
      orderStatus: ['', Validators.required],
      maintenanceLocation: [''],
      hourMeter: [''],
      requestedServicesDescription: ['', Validators.required],
      completedServicesDescription: [''],
      pendingServicesDescription: [''],
      responsibleMechanics: ['', Validators.required],
      requester: [{ value: '', disabled: true }, Validators.required],
      issueDate: [{ value: '', disabled: true }, Validators.required]
    });

    this.closingForm = this.fb.group({
      quantity15w40: [0.00, Validators.min(0)],
      quantityAw68: [0.00, Validators.min(0)],
      quantity428: [0.00, Validators.min(0)],
      quantity80W: [0.00, Validators.min(0)],
      quantity85w90: [0.00, Validators.min(0)],
      closingLaborValue: [0.00, Validators.min(0)],
      closingTransportation: [0.00, Validators.min(0)],
      closingThirdParties: [0.00, Validators.min(0)],
      closingOils: [0.00, Validators.min(0)],
      closingTotal: [{ value: 0.00, disabled: true }, Validators.min(0)]
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
    this.getEquipament();
    this.getUser();
  }
  
  onEquipamentChange(event: any) {
    this.equipamentoSelecionado = this.equipamento.find((e: { id: any; }) => e.id === event.value);
    console.log("🚀 ~ file: ordem-servico.component.ts:118 ~ OrdemServicoComponent ~ onEquipamentChange ~ this.equipamentoSelecionado:", this.equipamentoSelecionado);
  }

  onRequesterChange(event: any) {
    this.userSelecionado = event.value;
    console.log("🚀 ~ file: ordem-servico.component.ts:127 ~ OrdemServicoComponent ~ onRequesterChange ~ this.userSelecionado:", this.userSelecionado);
  }

  refreshData() {
    this.ordemServicoService.list().subscribe(
      (data) => {
        this.dados = data;
        console.log("🚀 ~ file: ordem-servico.component.ts:85 ~ OrdemServicoComponent ~ refreshData ~ this.dados:", this.dados);
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar dados' });
      }
    );
  }

  getEquipament() {
    this.equipamentService.list().subscribe(
      (response) => {
        this.equipamento = response;
        console.log("🚀 ~ file: ordem-servico.component.ts:129 ~ OrdemServicoComponent ~ getEquipament ~ this.equipamento:", this.equipamento);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getUser() {
    this.userService.list().subscribe(
      (response) => {
        this.user = response;      },
      (error) => {
        console.error(error);
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
    this.ordemServicoForm.patchValue({
      id: item.id,
      equipamentNumber: item.equipament.number,
      orderStatus: item.orderStatus,
      requestedServicesDescription: item.requestedServicesDescription,
      requesterName: item.requester.name,
      issueDate: item.issueDate
    });
    this.displayDialog = true;
  }

  onSubmit() {
    if (this.ordemServicoForm.valid) {
      const formValue = this.ordemServicoForm.value;
      console.log("🚀 ~ file: ordem-servico.component.ts:148 ~ OrdemServicoComponent ~ onSubmit ~ formValue:", formValue);
      const ordemServico = {
        id: formValue.id,
        equipament: this.equipamentoSelecionado,
        orderStatus: formValue.orderStatus,
        requestedServicesDescription: formValue.requestedServicesDescription,
        requester: { name: formValue.requesterName },
        hourMeter: formValue.hourMeter,
        equipamentId: this.equipamentoSelecionado.id,
        //requester: this.user,
      };

      if (ordemServico.id) {
        this.ordemServicoService.update(ordemServico).subscribe(
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
        this.ordemServicoService.create(ordemServico).subscribe(
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