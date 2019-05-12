import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { InfoModalComponent } from '../shared/info-modal.component.ts/info-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
email: string;
password: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
    ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.router.navigate(['/vendas']);
      }
    });
  }

  onSubmit() {

this.authService.login(this.email, this.password)
.then(res => {

  this.router.navigate(['/vendas']);
})
.catch(err => {
  this.dialog.open(InfoModalComponent, {
    data: { title: 'Acesso negado', message: 'Credenciais inválidas' }
  });
});

  }

}
