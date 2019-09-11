import { Injectable } from '@angular/core';
import { Agenda } from '../models/agenda.model';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';


import { NgFlashMessageService } from 'ng-flash-messages';
import { NgxViacepService } from '@brunoc/ngx-viacep';
@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  agendasCollection: AngularFirestoreCollection<Agenda>;
  agendaDoc: AngularFirestoreDocument<Agenda>;
  agendas: Observable<Agenda[]>;
  agenda: Observable<Agenda>;

  constructor(
    private afs: AngularFirestore,
    private ngFlashMessageService: NgFlashMessageService,
    private viacep: NgxViacepService
    ) {

    this.agendasCollection = this.afs.collection('agenda',
    ref => ref.orderBy('dateTime', 'asc'));
   }

   getAgendas(): Observable<Agenda[]> {

    this.agendas = this.agendasCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Agenda;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.agendas;
   }

   newAgenda(agenda: Agenda) {
     return this.agendasCollection.add(agenda);
   }

   getAgenda(id: string): Observable<Agenda> {

      this.agendaDoc = this.afs.doc<Agenda>(`agenda/${id}`);
      this.agenda =  this.agendaDoc.snapshotChanges().pipe(
        map(action => {
          if (action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as Agenda;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.agenda;

   }

   updateAgenda(agenda: Agenda) {
    const newAgenda = {
     isDone: !agenda.isDone,
     person: agenda.person,
     dateTime: agenda.dateTime,
     name: agenda.name
    }
    this.agendaDoc = this.afs.doc(`agenda/${agenda.id}`);
    this.agendaDoc.update(newAgenda);

   }

   deleteAgenda(id: string) {
    this.agendaDoc = this.afs.doc(`agenda/${id}`);
    return this.agendaDoc.delete();

   }

   searchCep(cep: string) {

    return this.viacep
      .buscarPorCep(cep);

  }


   flashMessageToNew(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Agenda ${name} adicionado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToUpdate(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Agenda ${name} atualizado.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }

   flashMessageToDelete(name: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [`SUCESSO! Agenda ${name} removido.`],
      dismissible: true,
      timeout: 2000,
      type: 'success'
    });
   }
}
