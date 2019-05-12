import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';


import { NgFlashMessageService } from 'ng-flash-messages';
import { NgxViacepService } from '@brunoc/ngx-viacep';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  fornecedoresCollection: AngularFirestoreCollection<Cliente>;
  fornecedorDoc: AngularFirestoreDocument<Cliente>;
  clientes: Observable<Cliente[]>;
  cliente: Observable<Cliente>;

  constructor(
    private afs: AngularFirestore,
    private ngFlashMessageService: NgFlashMessageService,
    private viacep: NgxViacepService
    ) {

    this.fornecedoresCollection = this.afs.collection('clientes',
    ref => ref.orderBy('nome', 'asc'));
   }

   getClientes(): Observable<Cliente[]> {

    this.clientes = this.fornecedoresCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Cliente;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.clientes;
   }

   newCliente(cliente: Cliente) {
     return this.fornecedoresCollection.add(cliente);
   }

   getCliente(id: string): Observable<Cliente> {

      this.fornecedorDoc = this.afs.doc<Cliente>(`clientes/${id}`);
      this.cliente =  this.fornecedorDoc.snapshotChanges().pipe(
        map(action => {
          if (action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as Cliente;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.cliente;

   }

   updateCliente(cliente: Cliente) {

    this.fornecedorDoc = this.afs.doc(`clientes/${cliente.id}`);
     return this.fornecedorDoc.update(cliente);

   }

   deleteCliente(id: string) {
    this.fornecedorDoc = this.afs.doc(`clientes/${id}`);
    return this.fornecedorDoc.delete();

   }

   searchCep(cep: string) {

    return this.viacep
      .buscarPorCep(cep);

  }


   flashMessageToNew(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Cliente ${name} adicionado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToUpdate(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Cliente ${name} atualizado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToDelete(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Cliente ${name} removido.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }
}
