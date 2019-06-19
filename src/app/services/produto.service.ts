import { Injectable } from '@angular/core';
import { Produto } from '../models/produto.model';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { map, tap, take } from 'rxjs/operators';


import { NgFlashMessageService } from 'ng-flash-messages';
import { NgxViacepService } from '@brunoc/ngx-viacep';
import { Venda } from '../models/venda.model';
@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  produtosCollection: AngularFirestoreCollection<Produto>;
  produtoDoc: AngularFirestoreDocument<Produto>;
  produtos: Observable<Produto[]>;
  produto: Observable<Produto>;

  constructor(
    private afs: AngularFirestore,
    private ngFlashMessageService: NgFlashMessageService,
    private viacep: NgxViacepService
    ) {

    this.produtosCollection = this.afs.collection('produtos',
    ref => ref.orderBy('codigo', 'asc'));
   }

   getProdutos(): Observable<Produto[]> {

    this.produtos = this.produtosCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Produto;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.produtos;
   }

   newProduto(produto: Produto) {
     produto.estoque = [];
     return this.produtosCollection.add(produto);
   }

   getProduto(id: string): Observable<Produto> {

      this.produtoDoc = this.afs.doc<Produto>(`produtos/${id}`);
      this.produto =  this.produtoDoc.snapshotChanges().pipe(
        map(action => {
          if (action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as Produto;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.produto;

   }

   getProdutoByCodigo(codigo: string) {

    return this.afs.collection('produtos', (ref) =>
    ref.where('codigo', '==', codigo));

   }


   updateProduto(produto: Produto) {
if (!produto.estoque) {produto.estoque = []; }
    this.produtoDoc = this.afs.doc(`produtos/${produto.id}`);
     return this.produtoDoc.update(produto);

   }

   deleteProduto(id: string) {
    this.produtoDoc = this.afs.doc(`produtos/${id}`);
    return this.produtoDoc.delete();

   }

   searchCep(cep: string) {

    return this.viacep
      .buscarPorCep(cep);

  }

  updateEstoque(lista: Produto[], venda, data, clienteId: string = '') {

    lista.forEach(a => {
      let findidvazio = a.estoque.find(b => b.id == '');
      if(!findidvazio)findidvazio = a.estoque.find(b => b.id == venda.id);

      if (findidvazio) {
      findidvazio.id = venda.id;
      findidvazio.recibo = data.recibo;
      findidvazio.cliente = data.cliente;
      findidvazio.clienteId = clienteId;
      findidvazio.data = data.data;
      this.produtoDoc = this.afs.doc(`produtos/${a.id}`);
      this.produtoDoc.update({ estoque: a.estoque });
      }
    });

  }

  updateOneEstoque(produto: Produto){
    let produtoDoc = this.afs.doc(`produtos/${produto.id}`);
    produtoDoc.update({ estoque: produto.estoque });
  }

  deleteItemEstoque(venda: Venda) {

    venda.listaProduto.forEach(a => {

      let produtoDoc: AngularFirestoreDocument<Produto> = this.afs.doc(`produtos/${a.id}`);
       produtoDoc.valueChanges().pipe(
        take(1),
        ).subscribe(b=>{
          let indexEstoque = b.estoque.findIndex(c => c.id == venda.id);

          if(indexEstoque >= 0){
                b.estoque.splice(indexEstoque, 1)

                produtoDoc.update({ estoque: b.estoque })
                .then(result=> console.log(result))
                .catch(e=>console.log(e))
          }
        });

      })





  }


   flashMessageToNew(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Produto ${name} adicionado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToUpdate(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Produto ${name} atualizado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToDelete(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Produto ${name} já existe no sistema.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }


   flashMessageToExist(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`IMPOSSÍVEL! Produto ${name} já existe no sistema.`],
      dismissible: true,
      timeout: 2000,
      type: 'danger'
    });
   }
}
