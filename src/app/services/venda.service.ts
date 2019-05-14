import { Injectable } from '@angular/core';
import { Venda } from '../models/venda.model';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';


import { NgFlashMessageService } from 'ng-flash-messages';
import { NgxViacepService } from '@brunoc/ngx-viacep';
@Injectable({
  providedIn: 'root'
})
export class VendaService {

  vendasCollection: AngularFirestoreCollection<Venda>;
  comprasCollection: AngularFirestoreCollection<Venda>;
  vendaDoc: AngularFirestoreDocument<Venda>;
  vendas: Observable<Venda[]>;
  compras: Observable<Venda[]>;
  venda: Observable<Venda>;

  constructor(
    private afs: AngularFirestore,
    private ngFlashMessageService: NgFlashMessageService,
    private viacep: NgxViacepService
    ) {

    this.vendasCollection = this.afs.collection('vendas',
    ref => ref.orderBy('recibo', 'asc'));
   }

   getVendas(): Observable<Venda[]> {

    this.vendas = this.vendasCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Venda;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.vendas;
   }

   newVenda(venda: Venda) {
     return this.vendasCollection.add(venda);
   }

   getVenda(id: string): Observable<Venda> {

      this.vendaDoc = this.afs.doc<Venda>(`vendas/${id}`);
      this.venda =  this.vendaDoc.snapshotChanges().pipe(
        map(action => {
          if (action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as Venda;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.venda;

   }

   getVendaByRecibo(recibo: string) {

    return this.afs.collection('vendas', (ref) =>
    ref.where('recibo', '==', recibo).limit(1));

   }

   getVendaByClientes(id: string){
   return this.afs.collection<Venda>('vendas', (ref) =>
    ref.where('clienteId', '==', id));

   }

   getVendaByPeriodo(primeiro: Date, ultimo: Date){
    return this.afs.collection<Venda>('vendas', (ref) =>
     ref.where('dataUltimoPag', '>=', primeiro).where('dataUltimoPag', '<=', ultimo))

    }




  updateVenda(venda: Venda) {

    this.vendaDoc = this.afs.doc(`vendas/${venda.id}`);
     return this.vendaDoc.update(venda);

   }

   deleteVenda(id: string) {
    this.vendaDoc = this.afs.doc(`vendas/${id}`);
    return this.vendaDoc.delete();

   }

   searchCep(cep: string) {

    return this.viacep
      .buscarPorCep(cep);

  }


   flashMessageToNew(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Venda ${name} adicionado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToUpdate(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Venda ${name} atualizado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToDelete(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Venda ${name} removido.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToExist(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`IMPOSSÍVEL! Recibo ${name} já existe no sistema.`],
      dismissible: true,
      timeout: 2500,
      type: 'danger'
    });
   }
}
