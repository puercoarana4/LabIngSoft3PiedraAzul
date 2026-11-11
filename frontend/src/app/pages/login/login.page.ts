import { Component } from '@angular/core';
import { LoginFormComponent } from '../../shared/organisms/login-form/login-form.component';
import { MainLayoutTemplate } from '../../templates/main-layout/main-layout.template';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [MainLayoutTemplate, LoginFormComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {}
