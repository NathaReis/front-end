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
import { RegistroService } from "../../services/registro.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-relatorio',
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
    CheckboxModule,
  ],
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class RelatorioComponent {
  relatorioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private messageService: MessageService
  ) {
    this.relatorioForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      historico: [true],
      custos: [true],
      status: [true],
    });
  }

  onSubmit() {
    if (this.relatorioForm.valid) {
      const formData = this.relatorioForm.value;
      console.log('Form Data:', formData);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Relatório gerado com sucesso',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
    }
  }

  onCancel() {
    this.relatorioForm.reset();
  }

  downloadExcelReport() {
    this.registroService.downloadExcelReport().subscribe(
      (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'equipament_report.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Relatório Excel baixado com sucesso',
        });
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao baixar relatório Excel',
        });
      }
    );
  }

  downloadPdfReport() {
    this.registroService.downloadPdfReport().subscribe(
      (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'equipament_report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Relatório PDF baixado com sucesso',
        });
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao baixar relatório PDF',
        });
      }
    );
  }
}