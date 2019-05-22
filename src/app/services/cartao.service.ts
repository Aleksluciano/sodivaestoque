import { Injectable } from '@angular/core';
import { Cartao } from '../models/cartao.model';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';


import { NgFlashMessageService } from 'ng-flash-messages';
@Injectable({
  providedIn: 'root'
})
export class CartaoService {

  cartoesCollection: AngularFirestoreCollection<Cartao>;
  cartaoDoc: AngularFirestoreDocument<Cartao>;
  cartoes: Observable<Cartao[]>;
  cartao: Observable<Cartao>;

  constructor(
    private afs: AngularFirestore,
    private ngFlashMessageService: NgFlashMessageService,
    ) {

    this.cartoesCollection = this.afs.collection('cartoes',
    ref => ref.orderBy('data', 'asc'));
   }

   getCartoes(): Observable<Cartao[]> {

    this.cartoes = this.cartoesCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Cartao;
        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.cartoes;
   }

   newCartao(cartao: Cartao) {
     return this.cartoesCollection.add(cartao);
   }

   getCartao(id: string): Observable<Cartao> {

      this.cartaoDoc = this.afs.doc<Cartao>(`cartoes/${id}`);
      this.cartao =  this.cartaoDoc.snapshotChanges().pipe(
        map(action => {
          if (action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as Cartao;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.cartao;

   }

   updateCartao(cartao: Cartao) {

    this.cartaoDoc = this.afs.doc(`cartoes/${cartao.id}`);
     return this.cartaoDoc.update(cartao);

   }

   deleteCartao(id: string) {
    this.cartaoDoc = this.afs.doc(`cartoes/${id}`);
    return this.cartaoDoc.delete();

   }




   flashMessageToNew(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Cartao ${name} adicionado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToUpdate(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Cartao ${name} atualizado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToDelete(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Cartao ${name} removido.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }
}
