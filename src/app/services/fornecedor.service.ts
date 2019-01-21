import { Injectable } from '@angular/core';
import { Fornecedor } from '../models/fornecedor.model';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  fornecedoresCollection: AngularFirestoreCollection<Fornecedor>;
  fornecedorDoc: AngularFirestoreDocument<Fornecedor>;
  fornecedores: Observable<Fornecedor[]>
  fornecedor: Observable<Fornecedor>;

  constructor(private afs: AngularFirestore) {

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

   newFornecedor(fornecedor: Fornecedor){
     this.fornecedoresCollection.add(fornecedor);
   }

   getFornecedor(id: string): Observable<Fornecedor>{

      this.fornecedorDoc = this.afs.doc<Fornecedor>(`fornecedores/${id}`);
      this.fornecedor =  this.fornecedorDoc.snapshotChanges().pipe(
        map(action => {
          if(action.payload.exists === false){
            return null;
          }else{
            const data = action.payload.data() as Fornecedor;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.fornecedor;

   }

   updateFornecedor(fornecedor: Fornecedor){
    this.fornecedorDoc = this.afs.doc(`fornecedores/${fornecedor.id}`);
    this.fornecedorDoc.update(fornecedor);

   }

   deleteFornecedor(fornecedor: Fornecedor){
    this.fornecedorDoc = this.afs.doc(`fornecedores/${fornecedor.id}`);
    this.fornecedorDoc.delete();

   }


}
