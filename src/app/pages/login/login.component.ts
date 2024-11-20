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
      try {
        const response = await this.loginService.login(this.email, this.password).toPromise();
        const { accessToken, refreshToken } = response;
  
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
  
        this.messageService.add({severity:'success', summary:'Sucesso', detail:'Login realizado com sucesso!'});
        this.router.navigate(['/inicio']);
      } catch (error) {
        this.messageService.add({severity:'error', summary:'Erro', detail:'Login falhou. Verifique suas credenciais.'});
        console.error(error);
      }
    } else {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Por favor, preencha o formulário corretamente.'});
    }
  }
}