import { Injectable } from '@angular/core';
import { Caixa } from '../models/caixa.model';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';


import { NgFlashMessageService } from 'ng-flash-messages';
import { NgxViacepService } from '@brunoc/ngx-viacep';
@Injectable({
  providedIn: 'root'
})
export class CaixaService {

  caixasCollection: AngularFirestoreCollection<Caixa>;
  comprasCollection: AngularFirestoreCollection<Caixa>;
  caixaDoc: AngularFirestoreDocument<Caixa>;
  caixas: Observable<Caixa[]>;
  compras: Observable<Caixa[]>;
  caixa: Observable<Caixa>;

 ano = 0;

  caixaDocPeriodo: AngularFirestoreDocument<Caixa>;
  caixasPeriodo: Observable<Caixa[]>;

  constructor(
    private afs: AngularFirestore,
    private ngFlashMessageService: NgFlashMessageService,
    private viacep: NgxViacepService
    ) {

    this.caixasCollection = this.afs.collection('caixas',
    ref => ref.orderBy('recibo', 'asc'));
   }

   getCaixas(): Observable<Caixa[]> {

    this.caixas = this.caixasCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Caixa;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.caixas;
   }

   newCaixa(caixa: Caixa) {
     return this.caixasCollection.add(caixa);
   }

   getCaixa(id: string): Observable<Caixa> {

      this.caixaDoc = this.afs.doc<Caixa>(`caixas/${id}`);
      this.caixa =  this.caixaDoc.snapshotChanges().pipe(
        map(action => {

          if (action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as Caixa;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.caixa;

   }

   getVendaByRecibo(recibo: string) {

    return this.afs.collection('caixas', (ref) =>
    ref.where('recibo', '==', recibo).limit(1));

   }

   getVendaByClientes(id: string) {
   return this.afs.collection<Caixa>('caixas', (ref) =>
    ref.where('clienteId', '==', id));

   }

   getCaixaByPeriodo(ano: number): Observable<Caixa[]> {

    if (this.ano != ano) {
    this.ano = ano;
    this.caixasPeriodo = null;

  }


    //   let query = this.afs.collection<Caixa>('caixas', (ref) =>
    //  ref.where('dataUltimoPag', '>=', this.primeiro).where('dataUltimoPag', '<=', this.ultimo));
   const query = this.afs.collection<Caixa>('caixas', (ref) =>
     ref.where('ano', '==', ano));

     this.caixasPeriodo = query.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Caixa;
        const id = a.payload.doc.id;

        return { id, ...data };

      }))
    );

    return this.caixasPeriodo;

      }




  updateVenda(caixa: Caixa) {

    this.caixaDoc = this.afs.doc(`caixas/${caixa.id}`);
     return this.caixaDoc.update(caixa);

   }

   deleteCaixa(id: string) {
    this.caixaDoc = this.afs.doc(`caixas/${id}`);
    return this.caixaDoc.delete();

   }

   searchCep(cep: string) {

    return this.viacep
      .buscarPorCep(cep);

  }


   flashMessageToNew(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Caixa ${name} adicionado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToUpdate(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Caixa ${name} atualizado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToDelete(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Caixa ${name} removido.`],
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
