import { Injectable } from '@angular/core';
import { Venda } from '../models/venda.model';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';


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

 ano: number = 0;
 anoanterior: number = 0;

  vendaDocPeriodo: AngularFirestoreDocument<Venda>;
  vendasPeriodo: Observable<Venda[]>;

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

      let vendaDoc = this.afs.doc<Venda>(`vendas/${id}`);
      this.venda =  vendaDoc.snapshotChanges().pipe(
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

   getVendaByPeriodo(ano: number): Observable<Venda[]> {

    if(this.ano != ano){
    this.ano = ano;
    this.anoanterior =  ano - 1;
    this.vendasPeriodo = null;

  }


    //   let query = this.afs.collection<Venda>('vendas', (ref) =>
    //  ref.where('dataUltimoPag', '>=', this.primeiro).where('dataUltimoPag', '<=', this.ultimo));
   let query = this.afs.collection<Venda>('vendas', (ref) =>
     ref.where('ano', '<=', this.ano).where('ano', '>=', this.anoanterior))

     this.vendasPeriodo = query.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Venda;
        const id = a.payload.doc.id;

        return { id, ...data };

      }))
    )

    return this.vendasPeriodo;

      }

   updateFatura(fatura: Venda) {

      const faturaDoc = this.afs.doc(`vendas/${fatura.id}`);
       return faturaDoc.update({ status: fatura.status, forma: fatura.forma, valorpago: fatura.valorpago});

     }

     updateFaturaParcial(fatura: Venda) {

      const faturaDoc = this.afs.doc(`vendas/${fatura.id}`);
       return faturaDoc.update({
         divisaoPagamento: fatura.divisaoPagamento,
        valorhistorico: fatura.valorhistorico,
        reciboshistorico: fatura.reciboshistorico
      });

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
