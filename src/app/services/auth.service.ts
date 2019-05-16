
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { map } from 'rxjs/operators';
import { InfoModalComponent } from '../components/shared/info-modal.component.ts/info-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { NgFlashMessageService } from 'ng-flash-messages';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private dialog: MatDialog,
              private afAuth: AngularFireAuth,
              private ngFlashMessageService: NgFlashMessageService) { }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(userData => {
       
        resolve(userData);
      },
      err => reject(err));
    });
  }

  getAuth() {
    return this.afAuth.authState.pipe(
      map(auth => auth));
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  register(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(userData => resolve(userData),
      err => reject(err));
    });
  }

  updatePassword(pass) {
     return this.afAuth.auth.currentUser.updatePassword(pass).then(_ => {
      this.flashMessageToUpdate('');
    }).catch(e => {
      if (e.code === 'auth/requires-recent-login') {
        const dialogConfig = new MatDialogConfig();

  dialogConfig.data = {
    title: `Faça o login novamente`,
    message: `Muito tempo se passou desde o último login. Para mudar a senha é necessário fazer o login novamente!`
  };

  this.dialog.open(InfoModalComponent, dialogConfig);
      }
    });
  }


  flashMessageToUpdate(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Senha atualizada.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }
}
