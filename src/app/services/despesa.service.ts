import { Injectable } from '@angular/core';
import { Despesa } from '../models/despesa.model';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';


import { NgFlashMessageService } from 'ng-flash-messages';
import { NgxViacepService } from '@brunoc/ngx-viacep';
@Injectable({
  providedIn: 'root'
})
export class DespesaService {

  despesasCollection: AngularFirestoreCollection<Despesa>;
  comprasCollection: AngularFirestoreCollection<Despesa>;
  despesaDoc: AngularFirestoreDocument<Despesa>;
  despesas: Observable<Despesa[]>;
  compras: Observable<Despesa[]>;
  despesa: Observable<Despesa>;

 ano: number = 0;

  despesaDocPeriodo: AngularFirestoreDocument<Despesa>;
  despesasPeriodo: Observable<Despesa[]>;

  constructor(
    private afs: AngularFirestore,
    private ngFlashMessageService: NgFlashMessageService,
    private viacep: NgxViacepService
    ) {

    this.despesasCollection = this.afs.collection('despesas',
    ref => ref.orderBy('recibo', 'asc'));
   }

   getDespesas(): Observable<Despesa[]> {

    this.despesas = this.despesasCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Despesa;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.despesas;
   }

   newDespesa(despesa: Despesa) {
     return this.despesasCollection.add(despesa);
   }

   getDespesa(id: string): Observable<Despesa> {

      this.despesaDoc = this.afs.doc<Despesa>(`despesas/${id}`);
      this.despesa =  this.despesaDoc.snapshotChanges().pipe(
        map(action => {

          if (action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as Despesa;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.despesa;

   }

   getVendaByRecibo(recibo: string) {

    return this.afs.collection('despesas', (ref) =>
    ref.where('recibo', '==', recibo).limit(1));

   }

   getVendaByClientes(id: string){
   return this.afs.collection<Despesa>('despesas', (ref) =>
    ref.where('clienteId', '==', id));

   }

   getDespesaByPeriodo(ano: number): Observable<Despesa[]> {

    if(this.ano != ano){
    this.ano = ano;
    this.despesasPeriodo = null;
    console.log('tavanull')
  }

  console.log('Observable',this.despesasPeriodo)
    //   let query = this.afs.collection<Despesa>('despesas', (ref) =>
    //  ref.where('dataUltimoPag', '>=', this.primeiro).where('dataUltimoPag', '<=', this.ultimo));
   let query = this.afs.collection<Despesa>('despesas', (ref) =>
     ref.where('ano', '==', ano));

     this.despesasPeriodo = query.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Despesa;
        const id = a.payload.doc.id;
        console.log('lidenovo')
        return { id, ...data };

      }))
    )

    return this.despesasPeriodo;

      }




  updateVenda(despesa: Despesa) {

    this.despesaDoc = this.afs.doc(`despesas/${despesa.id}`);
     return this.despesaDoc.update(despesa);

   }

   deleteDespesa(id: string) {
    this.despesaDoc = this.afs.doc(`despesas/${id}`);
    return this.despesaDoc.delete();

   }

   searchCep(cep: string) {

    return this.viacep
      .buscarPorCep(cep);

  }


   flashMessageToNew(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Despesa ${name} adicionado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToUpdate(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Despesa ${name} atualizado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToDelete(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Despesa ${name} removido.`],
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
