import { Injectable } from '@angular/core';
import { Fornecedor } from '../models/fornecedor.model';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';


import { NgFlashMessageService } from 'ng-flash-messages';
import { NgxViacepService } from '@brunoc/ngx-viacep';
@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  fornecedoresCollection: AngularFirestoreCollection<Fornecedor>;
  fornecedorDoc: AngularFirestoreDocument<Fornecedor>;
  fornecedores: Observable<Fornecedor[]>;
  fornecedor: Observable<Fornecedor>;

  constructor(
    private afs: AngularFirestore,
    private ngFlashMessageService: NgFlashMessageService,
    private viacep: NgxViacepService
    ) {

    this.fornecedoresCollection = this.afs.collection('fornecedores',
    ref => ref.orderBy('nome', 'asc'));
   }

   getFornecedores(): Observable<Fornecedor[]> {

    this.fornecedores = this.fornecedoresCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Fornecedor;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.fornecedores;
   }

   newFornecedor(fornecedor: Fornecedor) {
     return this.fornecedoresCollection.add(fornecedor);
   }

   getFornecedor(id: string): Observable<Fornecedor> {

      this.fornecedorDoc = this.afs.doc<Fornecedor>(`fornecedores/${id}`);
      this.fornecedor =  this.fornecedorDoc.snapshotChanges().pipe(
        map(action => {
          if (action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as Fornecedor;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.fornecedor;

   }

   updateFornecedor(fornecedor: Fornecedor) {

    this.fornecedorDoc = this.afs.doc(`fornecedores/${fornecedor.id}`);
     return this.fornecedorDoc.update(fornecedor);

   }

   deleteFornecedor(id: string) {
    this.fornecedorDoc = this.afs.doc(`fornecedores/${id}`);
    return this.fornecedorDoc.delete();

   }

   searchCep(cep: string) {

    return this.viacep
      .buscarPorCep(cep);

  }


   flashMessageToNew(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Fornecedor ${name} adicionado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToUpdate(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Fornecedor ${name} atualizado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToDelete(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Fornecedor ${name} removido.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }
}
