import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-senha',
  templateUrl: './senha.component.html',
  styleUrls: ['./senha.component.scss']
})
export class SenhaComponent implements OnInit {
  password: string;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
if (this.password) {
this.authService.updatePassword(this.password).then(a => {
  this.password = '';
});
}
  }

}
