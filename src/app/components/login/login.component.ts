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
console.log(this.email,this.password)
this.authService.login(this.email, this.password)
.then(res => {
  console.log(res)
  this.router.navigate(['/fornecedores']);
})
.catch(err => {
  console.log(err)
});

  }

}
