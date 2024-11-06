import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private loginService: LoginService
  ) {}

  async onSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      console.log("🚀 ~ file: login.component.ts:43 ~ LoginComponent ~ onSubmit ~ this.password:", this.password);
      console.log("🚀 ~ file: login.component.ts:43 ~ LoginComponent ~ onSubmit ~ this.email:", this.email);
      const response = await this.loginService
        .login(this.email, this.password)
        .toPromise();
      console.log(response);
    } else {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Por favor, preencha o formulário corretamente.'});
    }
  }
}