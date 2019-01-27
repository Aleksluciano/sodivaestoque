import { Injectable } from '@angular/core';
import { Produto } from '../models/produto.model';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { map } from "rxjs/operators";


import { NgFlashMessageService } from 'ng-flash-messages';
import { NgxViacepService } from "@brunoc/ngx-viacep";
@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  produtosCollection: AngularFirestoreCollection<Produto>;
  produtoDoc: AngularFirestoreDocument<Produto>;
  produtos: Observable<Produto[]>
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

   newProduto(produto: Produto){

     return this.produtosCollection.add(produto)
   }

   getProduto(id: string): Observable<Produto>{

      this.produtoDoc = this.afs.doc<Produto>(`produtos/${id}`);
      this.produto =  this.produtoDoc.snapshotChanges().pipe(
        map(action => {
          if(action.payload.exists === false){
            return null;
          }else{
            const data = action.payload.data() as Produto;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.produto;

   }

   getProdutoByCodigo(codigo: string){

    return this.afs.collection('produtos', (ref) =>
    ref.where('codigo', '==', codigo).limit(1))

   }


   updateProduto(produto: Produto){

    this.produtoDoc = this.afs.doc(`produtos/${produto.id}`);
     return this.produtoDoc.update(produto);

   }

   deleteProduto(id: string){
    this.produtoDoc = this.afs.doc(`produtos/${id}`);
    return this.produtoDoc.delete();

   }

   searchCep(cep: string) {

    return this.viacep
      .buscarPorCep(cep)

  }


   flashMessageToNew(name: string){
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Produto ${name} adicionado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToUpdate(name: string){
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Produto ${name} atualizado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToDelete(name: string){
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Produto ${name} já existe no sistema.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }


   flashMessageToExist(name: string){
    this.ngFlashMessageService.showFlashMessage({
      messages: [`IMPOSSÍVEL! Produto ${name} já existe no sistema.`],
      dismissible: true,
      timeout: 2000,
      type: 'danger'
    });
   }
}
