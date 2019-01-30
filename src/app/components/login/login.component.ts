import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'
import { Component, OnInit } from '@angular/core';

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
    private router: Router
    ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      if(auth){
        this.router.navigate(['/fornecedores']);
      }
    })
  }

  onSubmit(){

this.authService.login(this.email, this.password)
.then(res => {

  this.router.navigate(['/fornecedores']);
})
.catch(err => {
 
});

  }

}
