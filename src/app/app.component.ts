import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isLoggedIn: boolean;

  title = 'sodivaestoque';

  constructor(
    private authService: AuthService,
    private router: Router){
  }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });


  }

  onLogoutClick() {
    this.isLoggedIn = false;
    this.authService.logout();
    this.router.navigate(["/"]);
  }

}
