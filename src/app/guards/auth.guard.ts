import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth
  ){}

  canActivate(): Observable<boolean>{
return this.afAuth.authState.pipe(
  map(auth =>{
  if(!auth){
    this.router.navigate(['/']);
    return false;
  }else{
    return true;

  }
})
)
}


}
