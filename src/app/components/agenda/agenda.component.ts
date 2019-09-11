import { Agenda } from './../../models/agenda.model';
import { AgendaService } from './../../services/agenda.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
agendas: Agenda[] = [];
  constructor(private agendasService: AgendaService) { }

  ngOnInit() {

    this.agendasService.getAgendas()
    .subscribe(agendas => {
    this.agendas = [];
    this.agendas = agendas.map(a => {
      // tslint:disable-next-line: no-unused-expression
      a.dateTime = new Date(a.dateTime['seconds'] * 1000);
      return a;
    });
    console.log(agendas);
    });
  }

  changeCheckBox(agenda: Agenda) {
    this.agendasService.updateAgenda(agenda);

  }

  removeCard(agenda: Agenda){
    this.agendasService.deleteAgenda(agenda.id);
  }

}
